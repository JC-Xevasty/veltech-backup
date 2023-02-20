import { faCheckCircle, faUpload, faWarning, faXmark, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import _ from "lodash"
import { useEffect, useState } from "react"
import { Fragment } from "react"
import { Helmet } from "react-helmet-async"
import { useForm, SubmitHandler } from "react-hook-form"
import { useNavigate, useOutletContext } from "react-router-dom"
import DateGroup from "../../../components/accounting/DateGroup"
import InputGroup from "../../../components/accounting/InputGroup"
import SelectGroup from "../../../components/accounting/SelectGroup"
import HeaderGroup from "../../../components/HeaderGroup"
import { api } from "../../../config/axios"
import { useCreatePaymentMutation, usePaymentUploadsMutation } from "../../../features/api/payment"
import { FieldTypes, MutationResult, Payment, ProjectMilestone, ReduxState, UploadedFile, User } from "../../../types"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"
import { useCreateActivityMutation } from "../../../features/api/activity.log"

interface FieldValues {
  projectId: string
  projectStatus: string
  userId: string
  category: string
  milestoneNo: string
  referenceNo: string
  date: string
  amount: string
  proof: FileList
}
function CreatePayment() {
  const app = useSelector(selectApp)

  const user: User = useSelector((state: ReduxState) => state.auth.user)

  const navigate = useNavigate()

  const { register, handleSubmit, reset, watch, trigger, resetField, setValue, setError, clearErrors, getValues, formState: { errors } } = useForm<FieldValues>({
    mode: "onChange"
  })

  const [proof] = watch(["proof"])
  const [proofs, setProofs] = useState<File[]>([])
  const [milestoneOptions, setMilestoneOptions] = useState<string[]>([""])
  const [milestoneValues, setMilestoneValues] = useState<string[]>([""])
  const [paymentStatus, setPaymentStatus] = useState("");

  const [paymentUploadsMutation] = usePaymentUploadsMutation();
  const [createPaymentMutation] = useCreatePaymentMutation();
  const [createActivityMutation] = useCreateActivityMutation();
  
  const [projectId, projectStatus, userId, category, milestoneNo, referenceNo, date, amount] = watch(["projectId", "projectStatus", "userId", "category", "milestoneNo", "referenceNo", "date", "amount"]);

  const validation = {
    projectId: {
      required: { value: true, message: "Project ID is required." },
      pattern: { value: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/, message: "Project ID is invalid." },
      validate: async (projectId: string) => {
        const res = await api.post("/payments/exists/project", { id: projectId })
        if (res.data.exists) {
          if (res.data.fullyPaid) {
            return "Project is already fully paid"
          }
          const unpaidMilestones = res.data.milestones.filter((m: ProjectMilestone) => m.billingStatus !== 'PAID');
          const options = unpaidMilestones.map((m: ProjectMilestone) => `Progress Billing ${m.milestoneNo}`);
          const values = unpaidMilestones.map((m: ProjectMilestone) => `${m.milestoneNo}`);
          setMilestoneOptions(["", ...options]);
          setMilestoneValues(["", ...values]);
        }
        setValue("projectStatus", res.data.exists ? res.data.projectStatus : "");
        setPaymentStatus(res.data.exists ? res.data.paymentStatus : "");

        return res.data.exists || "There is no project with the provided ID."
      },
      onChange: (() => {
        setValue("projectStatus", ""); setValue("category", ""); setValue("milestoneNo", "")
        setPaymentStatus("");
        setMilestoneOptions([""]); setMilestoneValues([""])
        clearErrors(["category", "milestoneNo"])
      })
    },
    category: {
      required: { value: category == null || category == "", message: "Must choose a reason for payment." },
      onChange: (() => { clearErrors("milestoneNo"); setValue("milestoneNo", ""); })
    },
    milestoneNo: {
      required: { value: category == "MILESTONE" && (milestoneNo == "" || milestoneNo == null), message: "Must choose Project Progress Billing." }
    },
    referenceNo: {
      required: { value: true, message: "Reference Number is required." },
      pattern: { value: /^[\d]+$/, message: "Reference Number is invalid." }
    },
    date: {
      required: { value: true, message: "Date of Payment is required." },
      validate: (date: string) => new Date(date) < new Date(Date.now()) || "Date of Payment is Invalid"
    },
    amount: {
      required: { value: true, message: "Payment Amount is required." },
      pattern: { value: /^(?=\.*[0-9])[\d]*\.?[\d]{0,2}$/gm, message: "Payment Amount is invalid. (e.g. 123, 12.34, 0.12)" },
      validate: {
        greaterThanZero: (amount: string) => parseFloat(amount) > 0 || "Payment Amount must be greater than 0.",
      }
    },
    proof: {
      required: { value: (proofs.length === 0), message: "Proof of Payment must be uploaded" },
      validate: {
        lessThan10MB: (proof: FileList) => proof[0]?.size < 10000000 || "Maximum size allowed is 10MB.",
        acceptedFormats: (proof: FileList) => {
          return ['application/pdf', 'image/jpg', 'image/png', 'image/jpeg'].includes(proof[0]?.type) || 'Only PNG, JPEG, JPG, PDF files are allowed.';
        },
      }
    }

  }

  const handleCreate: SubmitHandler<FieldValues> = async (fields) => {
    let { projectId, category, milestoneNo, referenceNo, date, amount } = fields;
    let isFileUploaded = false;
    let imageFileName = "";

    if (proofs.length === 0) {
      setError('proof', { type: 'custom', message: "Proof of Payment must be uploaded." });
    } else {
      let formData = new FormData();
      formData.append('file', proof[0]);

      const paymentUploads: MutationResult<UploadedFile> = await paymentUploadsMutation(formData);

      if (paymentUploads?.data!?.fileName) {
        isFileUploaded = true;
        imageFileName = paymentUploads?.data!.fileName;
      } else {
        toast(
          <div className="flex justify-center items-center gap-x-3">
            <FontAwesomeIcon className="text-white" icon={faXmarkCircle} size="lg" fixedWidth />
            <h1 className="text-white font-grandview-bold">Failed to upload proof of payment!</h1>
          </div>,
          {
            toastId: "register-failed-toast",
            theme: "colored",
            className: "!bg-red-700 !rounded",
            progressClassName: "!bg-white"
          }
        )
      }
    }

    if (isFileUploaded) {
      const createPayment: MutationResult<Payment> = await createPaymentMutation({
        projectId: projectId,
        category: category,
        milestoneNo: (milestoneNo !== null || milestoneNo !== "") ? parseInt(milestoneNo) : 0,
        referenceNo: referenceNo,
        dateOfPayment: new Date(date),
        amount: amount,
        imageFileName: imageFileName,
        userId: user.id
      });

      await createActivityMutation({
        userRole: user.type,
        entry: `${ user.username }-upload-payment-proof`,
        module: "CREATE-PAYMENT",
        category: "CREATE",
        status: (createPayment?.data!?.id ? "SUCCEEDED" : "FAILED")
      })

      if (createPayment?.data!?.id) {
        toast(
          <div className="flex justify-center items-center gap-x-3">
            <FontAwesomeIcon className="text-white" icon={faCheckCircle} size="lg" fixedWidth />
            <h1 className="text-white font-grandview-bold">Proof of Payment Uploaded!</h1>
          </div>,
          {
            toastId: "register-succeded-toast",
            theme: "colored",
            className: "!bg-primary !rounded",
            progressClassName: "!bg-white"
          }
        )

        window.scrollTo(0, 0)

        navigate("/accounting/payments", {
          replace: true
        })
      }

      if (createPayment?.data!?.message || createPayment?.error) {
        toast(
          <div className="flex justify-center items-center gap-x-3">
            <FontAwesomeIcon className="text-white" icon={faXmarkCircle} size="lg" fixedWidth />
            <h1 className="text-white font-grandview-bold">Failed to upload proof of payment!</h1>
          </div>,
          {
            toastId: "register-failed-toast",
            theme: "colored",
            className: "!bg-red-700 !rounded",
            progressClassName: "!bg-white"
          }
        )
      }
    }
  }

  useEffect(() => {
    setProofs((proofs) => _.filter(proof, (p) => !_.map(proofs, (proof) => proof.name).includes(p.name)))
  }, [proof])

  return (
    <Fragment>
      <Helmet>
        <title>{`${app?.appName || "Veltech Inc."} | Create Payment`}</title>
      </Helmet>

      <div className="grow flex flex-col justify-start items-start w-full h-full px-20 py-10">
        <div className="flex items-center w-full justify-between">
          <HeaderGroup text="Add Payment" link="/accounting/payments" />
        </div>

        <form className="flex flex-col gap-y-5 w-full mt-5" onSubmit={handleSubmit(handleCreate)}>
          <p className="text-sm text-gray-700 rounded bg-gray-100 w-full px-3.5 py-1.5">Payment Information</p>
          <div className="grid grid-cols-3 gap-x-10">
            <InputGroup
              {...register("projectId", validation.projectId)}
              error={errors.projectId}
              label="Enter Project Number"
              id="project-number"
            />

            <InputGroup
              {...register("projectStatus")}
              error={errors.projectStatus}
              label="Payment Status"
              id="project-status"
              readOnly
            />
          </div>

          <div className="grid grid-cols-2 gap-x-10">
            <div className="flex flex-col justify-start items-start gap-y-5">
              <span className={`text-sm text-[#133061] font-grandview-bold`}>Reason for Payment</span>

              <div className="flex flex-row justify-start items-center gap-x-5">
                <input
                  type="radio"
                  id="category-1"
                  {...register("category", validation.category)}
                  value="MILESTONE"
                  disabled={(milestoneOptions.length <= 1) || paymentStatus === 'WAITING_DOWNPAYMENT'}
                />
                <label className="text-sm text-[#133061]" htmlFor="category-1">Pay a Project Progress Billing</label>

                <div className="flex flex-row justify-start items-center gap-x-3">
                  <input
                    type="radio"
                    id="category-2"
                    {...register("category", validation.category)}
                    value="DOWNPAYMENT"
                    disabled={getValues("category") !== "MILESTONE" || paymentStatus === 'WAITING_PAYMENT'}
                  />

                  <label className="text-sm text-[#133061]" htmlFor="category-2">Downpayment</label>
                </div>

                <div className="flex flex-row justify-start items-center gap-x-3">
                  <input type="radio" id="category-3" {...register("category", validation.category)} value="OTHERS" />

                  <label className="text-sm text-[#133061]" htmlFor="category-3">Others</label>
                </div>
              </div>
              {errors.category && (
                <div className="flex flex-row justify-start items-center gap-x-3">
                  <FontAwesomeIcon className="text-xs text-[#DE2B2B]" icon={faWarning} fixedWidth />

                  <span className="text-xs text-[#DE2B2B]">{errors.category?.message}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-x-10">
            <SelectGroup
              id="milestone"
              options={milestoneOptions}
              values={milestoneValues}
              label="Choose a Project Progress Billing"
              disabled={getValues("category") !== "MILESTONE" || paymentStatus === 'WAITING_DOWNPAYMENT'}
              {...register("milestoneNo", validation.milestoneNo)}
              error={errors.milestoneNo}
            />
          </div>

          <div className="grid grid-cols-3 gap-x-10 pt-5">
            <InputGroup
              {...register("referenceNo", validation.referenceNo)}
              error={errors.referenceNo}
              label="Reference Number"
              id="ref-number"
            />
          </div>


          <div className="grid grid-cols-3 gap-x-10 pt-5">
            <DateGroup
              {...register("date", validation.date)}
              error={errors.date}
              label="Date of Payment (Please refer to the official receipt)"
              id="date-of-payment"
              maxDate={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="grid grid-cols-3 gap-x-10">
            <InputGroup
              {...register("amount", validation.amount)}
              error={errors.amount}
              label="Amount in Numbers"
              id="total-amount"
            />
          </div>

          <div className="grid grid-cols-3 gap-x-10">
            <div className="flex flex-col justify-start items-start gap-y-1.5 w-full">
              <span className="text-accent text-sm font-grandview-bold">Proof of Payment</span>

              <span className="text-xs leading-5">Upload Proof of Payment.<br />Accepted file type: *.jpeg, *.jpg, *.png, *.pdf</span>

              <label className="hover:cursor-pointer w-full pt-2" htmlFor="proofOfPayment">
                <input className="hidden" type="file" accept=".jpeg, .jpg, .png, .pdf" multiple {...register("proof", validation.proof)} id="proofOfPayment" />

                <div className="flex justify-center items-center gap-x-5 rounded border-2 border-[#B1C2DE] border-dashed py-5">
                  <FontAwesomeIcon className="text-[#B1C2DE]" icon={faUpload} size="lg" fixedWidth />

                  <span className="text-lg text-[#B1C2DE]">Click here to upload file</span>
                </div>
              </label>
              {errors?.proof && <span className="text-sm text-red-700">{errors.proof.message}</span>}
              <div className="flex flex-col gap-y-2.5">
                {
                  proofs.map((proof, index) => (
                    <div className="transition-all ease-in-out duration-300 flex justify-between items-center text-accent rounded border-2 border-[#B1C2DE] w-full px-2 py-1.5 hover:text-white hover:bg-[#B1C2DE]" key={`proof-${index + 1}`}>
                      <span className="line-clamp-1 max-w-[50ch]">{proof.name}</span>

                      <button type="button" onClick={() => { resetField("proof") }}>
                        <FontAwesomeIcon icon={faXmark} fixedWidth />
                      </button>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>

          <div className="flex gap-x-5 pt-4">
            <button className=" w-fit transition-all ease-in-out duration-300 text-white tracking-wide rounded-sm bg-[#00BDB3] px-3 py-1.5 hover:scale-105" type="submit">Submit</button>

            <button onClick={() => { reset(); navigate("/accounting/payments") }} className=" w-fit transition-all ease-in-out duration-300 text-black tracking-wide rounded-sm bg-[#EBEBEB] px-3 py-1.5 hover:scale-105" type="button" >Cancel</button>
          </div>
        </form>
      </div>
    </Fragment>
  )
}

export default CreatePayment