import { faArrowLeftLong, faUpload, faXmark, faCheckCircle, faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useForm, SubmitHandler } from "react-hook-form"
import { useFetchClientProjectQuery, useFetchMilestonesQuery, } from "../../../features/api/project"
import { usePaymentUploadsMutation, useCreatePaymentMutation } from "../../../features/api/payment"
import { User, MutationResult, ReduxState, UploadedFile, Payment } from "../../../types";
import { useEffect, useState } from "react";
import InputGroup from '../../../components/accounting/InputGroup'
import SelectGroup from '../../../components/accounting/SelectGroup'
import { toast } from "react-toastify"
import DateGroup from '../../../components/accounting/DateGroup'
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"

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

const PAYMENT_STATUS = {
  NOT_AVAILABLE: {
    text: "N/A",
  },
  WAITING_PAYMENT: {
    text: "Waiting Payment",
  },
  WAITING_DOWNPAYMENT: {
    text: "Waiting Down Payment",
  },
  WAITING_APPROVAL: {
    text: "Waiting Approval",
  },
  PAID_BILLING: {
    text: "Paid",
  },
  PROGRESS_BILLING: {
    text: "Progress Billing"
  },
  FULLY_PAID: {
    text: "Fully Paid"
  }
}


function AddPayment() {
  const app = useSelector(selectApp)

  const navigate = useNavigate()

  const user: User = useSelector((state: ReduxState) => state.auth.user)

  const { id: projectId } = useParams() as { id: string }

  const location = useLocation().state as {
    userId: string | ""
  }
  const { data: currentClientProject } = useFetchClientProjectQuery({ id: projectId, userId: user ? user.id : location.userId })

  const { register, handleSubmit, watch, resetField, setValue, setError, clearErrors, getValues, formState: { errors } } = useForm<FieldValues>({
    mode: "onChange"
  })

  const [proofs, setProofs] = useState<File[]>([])
  const [milestoneOptions, setMilestoneOptions] = useState<string[]>([""])
  const [milestoneValues, setMilestoneValues] = useState<string[]>([""])

  const [category] = watch(["category", "milestoneNo", "referenceNo", "date", "amount"]);

  const [paymentUploadsMutation] = usePaymentUploadsMutation();
  const [createPaymentMutation] = useCreatePaymentMutation();

  const { data: selectedProjectMilestones } = useFetchMilestonesQuery({ projectId: projectId })

  useEffect(() => {
    if (selectedProjectMilestones) {
      const unpaidMilestones = selectedProjectMilestones.filter((m) => m.billingStatus !== 'PAID' && m.milestoneStatus === "DONE");
      console.log(unpaidMilestones);
      // const options = [...Array(selectedProjectMilestones.length)].map((x, i) => `Progress Billing ${i + 1}`);
      const options = unpaidMilestones.map((m) => `Progress Billing ${m.milestoneNo}`);
      const values = unpaidMilestones.map((m) => `${m.milestoneNo}`);
      // const values = [...Array(selectedProjectMilestones.length)].map((x, i) => `${i + 1}`);
      setMilestoneOptions(["----", ...options]);
      setMilestoneValues(["0", ...values]);
    }
  }, [selectedProjectMilestones])

  const getPaymentStatus = (project: string): string => {
    if (project === "NOT_AVAILABLE") return PAYMENT_STATUS.NOT_AVAILABLE.text;
    if (project === "WAITING_APPROVAL") return PAYMENT_STATUS.WAITING_APPROVAL.text;
    if (project === "WAITING_PAYMENT") return PAYMENT_STATUS.WAITING_PAYMENT.text;
    if (project === "WAITING_DOWNPAYMENT") return PAYMENT_STATUS.WAITING_DOWNPAYMENT.text;
    if (project === "PROGRESS_BILLING") return PAYMENT_STATUS.PROGRESS_BILLING.text;
    if (project === "FULLY_PAID") return PAYMENT_STATUS.FULLY_PAID.text;
    return PAYMENT_STATUS.NOT_AVAILABLE.text;
  }

  const validation = {
    category: {
      required: { value: category == null || category === "", message: "Must choose a reason for payment." },
      onChange: (() => { clearErrors("milestoneNo"); setValue("milestoneNo", ""); })
    },
    milestoneNo: {
      required: { value: category === "MILESTONE" && (true), message: "Must choose Project Progress Billing." }
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

  const handleAddPayment: SubmitHandler<FieldValues> = async (values) => {
    let { category, milestoneNo, referenceNo, date, amount } = values;
    let isFileUploaded = false;
    let imageFileName = "";
    console.log("Milestone", milestoneNo)
    if (watch("proof").length === 0) {
      // if (true) {
      setError('proof', { type: 'custom', message: "Proof of Payment must be uploaded." });
    } else {
      let formData = new FormData();
      formData.append('file', watch("proof")[0]);

      const paymentUploads: MutationResult<UploadedFile> = await paymentUploadsMutation(formData);

      if (paymentUploads?.data!?.fileName) {
        isFileUploaded = true;
        imageFileName = paymentUploads?.data!.fileName;
      } else {
        toast(
          <div className="flex justify-center items-center gap-x-3">
            <FontAwesomeIcon className="text-white" icon={faXmarkCircle} size="lg" fixedWidth />
            <h1 className="text-white font-grandview-bold">Failed to upload proof of payment!2</h1>
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
        milestoneNo: (milestoneNo !== null) ? parseInt(milestoneNo) : 0,
        referenceNo: referenceNo,
        dateOfPayment: new Date(date),
        amount: amount,
        imageFileName: imageFileName,
        userId: user.id
      });

      if (createPayment?.data!?.id) {
        toast(
          <div className="flex justify-center items-center gap-x-3">
            <FontAwesomeIcon className="text-white" icon={faCheckCircle} size="lg" fixedWidth />
            <h1 className="text-white font-grandview-bold">Proof of Payment Uploaded3!</h1>
          </div>,
          {
            toastId: "register-succeded-toast",
            theme: "colored",
            className: "!bg-primary !rounded",
            progressClassName: "!bg-white"
          }
        )

        window.scrollTo(0, 0)

        navigate(`/my-projects/view/id=${projectId}`, {
          replace: true
        })
      }

      if (createPayment?.data!?.message || createPayment?.error) {

        console.log(createPayment?.data!?.message)
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

  return (
    <>
      <Helmet>
        <title>{ `${ app?.appName || "Veltech Inc." } | Add Payment` }</title>
      </Helmet>

      <div className="w-100 px-5 lg:px-52 py-10 lg:py-20">
        <form encType='multipart/form-data' className="flex gap-y-5 flex-col" onSubmit={handleSubmit(handleAddPayment)}>
          <button onClick={() => navigate(`/my-projects/view/id=${projectId}`)} className="flex gap-x-2 items-center hover:text-primary">
            <FontAwesomeIcon icon={faArrowLeftLong} />
            <span>Back</span>
          </button>
          <h1 className="text-4xl font-grandview-bold text-[#133061]">Add Payment</h1>

          <p className='text-sm text-gray-700 rounded bg-gray-100 w-full px-3.5 py-1.5'>Project Information</p>

          <div className='flex flex-row gap-x-5 lg:w-1/2'>
            <InputGroup label='Project Number' disabled id='project-number' defaultValue={currentClientProject ? currentClientProject?.id : ""} />
            <InputGroup label='Payment Status' disabled id='payment-status' defaultValue={currentClientProject ? getPaymentStatus(currentClientProject?.paymentStatus) : ""} />
          </div>

          <label className='text-sm text-[#133061] font-grandview-bold'>Reason for Payment</label>
          <div className="flex gap-x-3 justify-start">
            {currentClientProject && currentClientProject.paymentStatus === 'Waiting Downpayment'}
            <div className="form-check form-check-inline">
              <input
                className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-white checked:border-[#0B2653] checked:border-4 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                {...register("category", validation.category)}
                type="radio"
                id="inlineRadio1"
                value="MILESTONE"
                disabled={currentClientProject?.paymentStatus !== 'WAITING_PAYMENT' && currentClientProject?.paymentStatus !== 'PROGRESS_BILLING' }
                 />
              <label className="form-check-label inline-block text-gray-800" htmlFor='inlineRadio1'>Pay a Project Progress Billing</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-white checked:border-[#0B2653] checked:border-4 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                {...register("category", validation.category)}
                type="radio"
                id="inlineRadio2"
                value="DOWNPAYMENT" 
                disabled={ currentClientProject && currentClientProject.paymentStatus !== 'WAITING_DOWNPAYMENT' }
                />
              <label className="form-check-label inline-block text-gray-800" htmlFor="inlineRadio2">Downpayment</label>
            </div>
          </div>
          {errors?.category && <span className="text-red-700">{errors.category.message}</span>}

          <div className='flex flex-col gap-y-3 lg:w-1/2'>
            {(() => {
              if (getValues("category") === 'MILESTONE') {
                return <>
                  <SelectGroup
                    label=''
                    id='milestones'
                    options={milestoneOptions}
                    values={milestoneValues}
                    {...register("milestoneNo", validation.milestoneNo)} />
                  {errors?.milestoneNo && <span className="text-red-700">{errors.milestoneNo.message}</span>}
                </>
              }
            })()}
            <InputGroup label='Reference Number' {...register("referenceNo", validation.referenceNo)} id='reference-number' />
            {errors?.referenceNo && <span className="text-red-700">{errors.referenceNo.message}</span>}
            <InputGroup label='Amount in Numbers' {...register("amount", validation.amount)} id='amount' />
            {errors?.amount && <span className="text-red-700">{errors.amount.message}</span>}
            <DateGroup
              {...register("date", validation.date)}
              label="Date of Payment (Please refer to the official receipt)"
              id="date-of-payment"
              maxDate={new Date().toISOString().split("T")[0]}
            />
            {errors?.date && <span className="text-red-700">{errors.date.message}</span>}
            <div className='flex flex-col'>
              <label className='text-sm text-[#133061] font-grandview-bold'>Upload Proof of Payment</label>
              <span className="text-sm">Accepted file type: *.jpeg, *.jpg, *.png, *.pdf</span>
            </div>
            <label className="hover:cursor-pointer" htmlFor="proofPayment">
              <input className="hidden" type="file" accept=".jpeg, .png, .pdf, .jpg" {...register("proof", validation.proof)} id="proofPayment" />

              <div className="flex justify-center items-center gap-x-5 rounded border-2 border-[#B1C2DE] border-dashed w-full py-5">
                <FontAwesomeIcon className="text-[#B1C2DE]" icon={faUpload} size="lg" fixedWidth />

                <span className="text-lg text-[#B1C2DE]">Click here to upload file</span>
              </div>
            </label>
            {
              (watch("proof")?.length > 0 && watch("proof")[0]) &&
              <div className="flex flex-row justify-start items-center gap-x-3 w-full">
                <div className="grow transition-all ease-in-out duration-300 flex justify-between items-center text-accent rounded border-2 border-[#B1C2DE] w-full lg:w-3/5 px-2 py-1.5 hover:text-white hover:bg-[#B1C2DE]">
                  <span className="whitespace-nowrap text-ellipsis overflow-hidden max-w-[50ch] ">
                    {watch("proof")[0].name}
                  </span>

                  <button type="button" className="hover:text-red-600" onClick={() => resetField("proof")}>
                    <FontAwesomeIcon icon={faXmark} size="sm" fixedWidth />
                  </button>
                </div>
              </div>
            }
            <div className="mt-2">
              {errors.proof && <span className="text-red-700 ">{errors.proof.message}</span>}
            </div>
          </div>
          <button type='submit' className="lg:w-fit transition-all ease-in-out duration-300 text-white tracking-wide rounded bg-[#0B2653] px-3 py-1 hover:scale-105">Submit</button>
        </form>
      </div>
    </>
  )
}

export default AddPayment