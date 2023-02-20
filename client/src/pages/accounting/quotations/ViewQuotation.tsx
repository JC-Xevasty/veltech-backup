import { Helmet } from "react-helmet-async"
import { useNavigate, useParams } from "react-router-dom"
import { useForm, SubmitHandler } from "react-hook-form"

import HeaderGroup from "../../../components/HeaderGroup"
import InputGroup from "../../../components/accounting/InputGroup"
import SelectGroup from "../../../components/accounting/SelectGroup"
import CheckGroup from "../../../components/CheckGroup"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUpload, faXmark, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import { useFetchQuotationQuery, useSetProjectCostMutation, useQuotationUploadsMutation } from "../../../features/api/quotation"
import { useEffect, useState } from "react"
import { User, Quotation, MutationResult, UploadedFile } from "../../../types"
import LoadingScreen from "../../misc/LoadingScreen"
import { format } from "date-fns"
import _ from "lodash"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"
import { selectUser } from "../../../features/auth/auth"
import { useCreateActivityMutation } from "../../../features/api/activity.log"

interface FieldValues {
  materialsCost: string
  laborCost: string
  requirementsCost: string
  subtotal: string
  vat: string
  total: string
  quotationFile: FileList
}

const STATUS = {
  FOR_REVIEW: "For Review",
  WAITING_OCULAR: "Waiting Ocular",
  DRAFTING: "Drafting Quotation",
  FOR_APPROVAL: "For Approval",
  FOR_REVISION: "For Revision",
  CLIENT_APPROVAL: "For Client Approval",
  APPROVED: "Approved",
  CANCELLED: "Cancelled",
  REJECTED: "Rejected",
  REJECTED_QUOTATION: "Rejected Quotation",
  REJECTED_OCULAR: "Rejected Ocular",
}

function ViewQuotation() {
  const app = useSelector(selectApp)

  const auth = useSelector(selectUser)

  const navigate = useNavigate()

  const { id: qId } = useParams() as { id: string }

  const { isLoading, isError, data: quotation } = useFetchQuotationQuery({ id: qId });

  const [currentQuotation, setCurrentQuotation] = useState<typeof quotation>();

  const [status, setStatus] = useState("");

  const { register, watch, handleSubmit, reset, resetField, getValues, setValue, setError, formState: { errors } } = useForm<FieldValues>({
    mode: "onChange"
  })

  const [materialsCost, laborCost, requirementsCost, subtotal, vat, total, quotationFile] = watch(["materialsCost", "laborCost", "requirementsCost", "subtotal", "vat", "total", "quotationFile"]);

  const [quotationFiles, setQuotationFiles] = useState<File[]>([])

  const [setProjectCostMutation] = useSetProjectCostMutation();

  const [quotationUploadsMutation] = useQuotationUploadsMutation();

  const [createActivityMutation] = useCreateActivityMutation();

  const validation = {
    materialsCost: {
      required: { value: true, message: "Materials Cost is required" },
      pattern: { value: /^(?=\.*[0-9])[\d]*\.?[\d]{0,2}$/gm, message: "Materials Cost is invalid. (e.g. 123, 12.34, 0.12)" },
      onChange: (() => { computeTotal() })
    },
    laborCost: {
      required: { value: true, message: "Labor Cost is required" },
      pattern: { value: /^(?=\.*[0-9])[\d]*\.?[\d]{0,2}$/gm, message: "Labor Cost is invalid. (e.g. 123, 12.34, 0.12)" },
      onChange: (() => { computeTotal() })
    },
    requirementsCost: {
      required: { value: true, message: "Requirements Cost is required" },
      pattern: { value: /^(?=\.*[0-9])[\d]*\.?[\d]{0,2}$/gm, message: "Requirements Cost is invalid. (e.g. 123, 12.34, 0.12)" },
      onChange: (() => { computeTotal() })
    },
    quotationFile: {
      required: { value: (quotationFiles.length === 0), message: "Quotation file must be uploaded" },
      validate: {
        lessThan30MB: (quotationFile: FileList) => quotationFile[0]?.size < 30000000 || "Maximum size allowed is 30MB",
        // acceptedFormats: (floorPlan: ,FileList) => ['application/pdf'].includes(floorPlan[0]?.type) || 'Only PNG, JPEG e GIF',
      },
      onChange: (() => {
        const quotationFile = getValues("quotationFile");
        setQuotationFiles((quotationFiles) => _.filter(quotationFile, (file) => !_.map(quotationFiles, (quotationFile) => quotationFile.name).includes(file.name)))
      })

    }
  }

  const handleUpdate: SubmitHandler<FieldValues> = async (values) => {
    let { materialsCost, laborCost, requirementsCost, quotationFile } = values;
    let isFileUploaded = false;
    let quotationFilename = "";

    if (quotationFiles.length === 0) {
      setError('quotationFile', { type: 'custom', message: "Quotation file must be uploaded" });
    } else {
      let formData = new FormData();
      let prevQuotation = currentQuotation ? currentQuotation?.quotation : "";
      formData.append('prevQuotationFile', prevQuotation);
      formData.append('file', quotationFile[0]);

      const quotationUploads: MutationResult<UploadedFile> = await quotationUploadsMutation(formData);

      await createActivityMutation({
        userRole: auth.type,
        entry: `${ auth.username }-upload-floor-plan`,
        module: "VIEW-QUOTATION",
        category: "OTHERS",
        status: (quotationUploads?.data!?.fileName ? "SUCCEEDED" : "FAILED")
      });

      if (quotationUploads?.data!?.fileName) {
        isFileUploaded = true;
        quotationFilename = quotationUploads?.data!.fileName;
      } else {
        toast(
          <div className="flex justify-center items-center gap-x-3">
            <FontAwesomeIcon className="text-white" icon={faXmarkCircle} size="lg" fixedWidth />
            <h1 className="text-white font-grandview-bold">Failed to upload floor plan!</h1>
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
      const setProjectCost: MutationResult<Quotation> = await setProjectCostMutation({
        id: currentQuotation?.id,
        materialsCost: parseFloat(materialsCost),
        laborCost: parseFloat(laborCost),
        requirementsCost: parseFloat(requirementsCost),
        quotation: quotationFilename,
        quotationStatus: "FOR_APPROVAL"
      });

      await createActivityMutation({
        userRole: auth.type,
        entry: `${ auth.username }-set-project-cost`,
        module: "VIEW-QUOTATION",
        category: "UPDATE",
        status: (setProjectCost?.data!?.id ? "SUCCEEDED" : "FAILED")
      });

      if (setProjectCost?.data!?.id) {
        console.log("Project Cost updated.");
      }

      if (setProjectCost?.data!?.message || setProjectCost?.error) {
        toast(
          <div className="flex justify-center items-center gap-x-3">
            <FontAwesomeIcon className="text-white" icon={faXmarkCircle} size="lg" fixedWidth />
            <h1 className="text-white font-grandview-bold">Failed to set Project Cost!</h1>
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
    setCurrentQuotation(quotation!)
    if (quotation) {
      setStatus(quotation.quotationStatus);
      if (['FOR_APPROVAL', 'FOR_REVISION', 'CLIENT_APPROVAL', 'APPROVED', 'CANCELED'].includes(quotation.quotationStatus)) {
        const m = quotation.materialsCost ? parseFloat(quotation.materialsCost.toString()) : 0;
        const l = quotation.laborCost ? parseFloat(quotation.laborCost.toString()) : 0;
        const r = quotation.requirementsCost ? parseFloat(quotation.requirementsCost.toString()) : 0;
        reset({ materialsCost: m.toFixed(2), laborCost: l.toFixed(2), requirementsCost: r.toFixed(2) })
        computeTotal();
        if (['FOR_APPROVAL', 'CLIENT_APPROVAL', 'APPROVED', 'CANCELED'].includes(quotation.quotationStatus)) {
          setValue('materialsCost', `PHP ${m.toFixed(2)}`)
          setValue('laborCost', `PHP ${l.toFixed(2)}`)
          setValue('requirementsCost', `PHP ${r.toFixed(2)}`)
          setValue('subtotal', `PHP ${getValues('subtotal')}`)
          setValue('vat', `PHP ${getValues('vat')}`)
          setValue('total', `PHP ${getValues('total')}`)
        }
      }
    }
  }, [quotation])

  const getStatus = (s: string): string => {
    if (s === 'FOR_REVIEW') return STATUS.FOR_REVIEW;
    if (s === 'WAITING_OCULAR') return STATUS.WAITING_OCULAR;
    if (s === 'DRAFTING') return STATUS.DRAFTING;
    if (s === 'FOR_APPROVAL') return STATUS.FOR_APPROVAL;
    if (s === 'FOR_REVISION') return STATUS.FOR_REVISION;
    if (s === 'CLIENT_APPROVAL') return STATUS.CLIENT_APPROVAL;
    if (s === 'APPROVED') return STATUS.APPROVED;
    if (s === 'CANCELED') return STATUS.CANCELLED;
    if (s === 'REJECTED') return STATUS.REJECTED;
    if (s === 'REJECTED_QUOTATION') return STATUS.REJECTED_QUOTATION;
    if (s === 'REJECTED_OCULAR') return STATUS.REJECTED_OCULAR;
    return "Not Available"
  }

  const getProjectFeature = (feature: string) => {
    switch (feature) {
      case "AUFSS": return "Automatic Fire Sprinkler System"
      case "WDFHS": return "Wet and Dry Fire Hydrant System"
      case "KHFSS": return "Kitchen Hood Fire Suppression System"
      case "CDFSS": return "Carbon Dioxide Fire Suppression System"
      case "FS": return "Flooding System"
      case "FDAS": return "Fire Detection and Alarm System"
      case "FM2S": return "FM200 System (Include Hydraulic and Flow Calculation)"
      case "ARFSS": return "Aragonite Fire Suppression System"
      case "KHFPS": return "Kitchen Hood Fire Protection System"
      case "DS": return "Deluge System"
      case "WMS": return "Water Mist System"
      case "DCES": return "Dry Chemical Extinguishing System"
      case "PS": return "Plumbing System"
      default: return ""
    }
  }

  const getProjectFeatures = (q: Quotation): string => {
    if (!q) return " ";

    return q.projectFeatures?.length ? getProjectFeature(q.projectFeatures[0]) : " "
  }

  const getClientName = (u: User): string => {
    if (u) {
      let clientName = u.firstName
      clientName = clientName + ((u.middleName) ? ` ${u.middleName} ` : " ")
      clientName = clientName + u.lastName
      clientName = clientName + ((u.suffix) ? ` ${u.suffix}` : "")
      return clientName
    }
    return "-"
  }

  const computeTotal = () => {
    const m = parseFloat(getValues("materialsCost")) || 0;
    const l = parseFloat(getValues("laborCost")) || 0;
    const r = parseFloat(getValues("requirementsCost")) || 0;
    const total = m + l + r;
    const vat = total * 0.12;
    const subtotal = total - vat;
    setValue("subtotal", subtotal.toFixed(2));
    setValue("vat", vat.toFixed(2));
    setValue("total", total.toFixed(2));
  }

  return (
    <>
      <Helmet>
        <title>{`${app?.appName || "Veltech Inc."} | View Quotation ${ currentQuotation?.id.split("-")[0] }`}</title>
      </Helmet>
      {
        isLoading ? <LoadingScreen /> :
          isError ? <p>Error.</p> :

            <main className="grow flex flex-col justify-start items-start gap-y-5 w-full h-full px-20 py-10">
              <HeaderGroup
                text={`View Quotation #${currentQuotation ? currentQuotation.id.split("-")[0] : ""}`}
                link="/accounting/quotations" />

              <p className='text-sm text-gray-700 rounded bg-gray-100 w-full px-3.5 py-1.5'>Quotation Information</p>

              <form className="flex flex-col gap-y-3 w-full" onSubmit={handleSubmit(handleUpdate)}>
                <div className="grid grid-cols-4 justify-start items-end gap-x-20 w-full">

                  <InputGroup
                    id="quotation-status"
                    label="Status:"
                    defaultValue={currentQuotation ? getStatus(status) : ""}
                    disabled
                  />
                  {(currentQuotation && (status === 'DRAFTING' || status === 'FOR_REVISION')) &&
                    <button className="transition-all ease-in-out w-1/2 duration-300 text-white tracking-wide rounded-sm bg-[#00BDB3] px-3 py-1.5 hover:scale-105" type="submit">Submit for Approval</button>
                  }
                </div>

                <p className="text-[#737373] text-md">Created at:{currentQuotation && format(new Date(currentQuotation.createdAt), "MMMM dd, yyyy | hh:mm a")}</p>

                <div className="grid grid-cols-4 justify-start items-start gap-x-20 w-full">
                  <div className="flex flex-col w-full gap-y-3">
                    <p className="text-xl text-primary font-grandview-bold underline underline-offset-4">Service Information</p>

                    <InputGroup
                      id="building-type"
                      label="Building Type:"
                      defaultValue={currentQuotation ? currentQuotation.buildingType : ""}
                      disabled
                    />

                    <InputGroup
                      id="establishment-size-width"
                      label="Enter Establishment Size in Square Meters:"
                      defaultValue={currentQuotation ? `${currentQuotation.establishmentSizeWidth} sqm.` : ""}
                      disabled
                    />

                    <InputGroup
                      id="establishment-size-height"
                      label="Enter Establishment Size in Square Meters:"
                      defaultValue={currentQuotation ? `${currentQuotation.establishmentSizeHeight} sqm.` : ""}
                      disabled
                    />

                    <InputGroup
                      id="features-added"
                      label="Features to be added:"
                      defaultValue={currentQuotation ? getProjectFeatures(currentQuotation) : ""}
                      disabled
                    />

                    <p className="text-xl text-primary font-grandview-bold underline underline-offset-4">Contact Information</p>

                    <InputGroup
                      id="client-name"
                      label="Name:"
                      defaultValue={currentQuotation ? getClientName(currentQuotation.user) : ""}
                      disabled
                    />

                    <InputGroup
                      id="company-name"
                      label="Company Name:"
                      defaultValue={currentQuotation ? currentQuotation.user.companyName : ""}
                      disabled
                    />

                    <InputGroup
                      id="contact"
                      label="Contact Number:"
                      defaultValue={currentQuotation ? currentQuotation.user.contactNumber : ""}
                      disabled
                    />

                    <InputGroup
                      id="email"
                      label="Email Address:"
                      defaultValue={currentQuotation ? currentQuotation.user.emailAddress : ""}
                      disabled
                    />

                  </div>
                  <div className="flex flex-col w-full gap-y-3">

                    <p className="text-xl text-primary font-grandview-bold underline underline-offset-4">Service Cost</p>

                    <InputGroup
                      id="materials-cost"
                      label="Material Cost:"
                      disabled={currentQuotation && (status === 'DRAFTING' || status === 'FOR_REVISION') ? false : true}
                      {...register("materialsCost", validation.materialsCost)}
                      error={errors?.materialsCost}
                    />

                    <InputGroup
                      id="labor-cost"
                      label="Labor Cost:"
                      disabled={currentQuotation && (status === 'DRAFTING' || status === 'FOR_REVISION') ? false : true}
                      {...register("laborCost", validation.laborCost)}
                      error={errors?.laborCost}
                    />

                    <InputGroup
                      id="requirements-cost"
                      label="General Requirements Cost:"
                      disabled={currentQuotation && (status === 'DRAFTING' || status === 'FOR_REVISION') ? false : true}
                      {...register("requirementsCost", validation.requirementsCost)}
                      error={errors?.requirementsCost}
                    />

                    <InputGroup
                      id="subtotal-cost"
                      label="Project Subtotal Cost:"
                      {...register("subtotal")}
                      disabled
                    />

                    <InputGroup
                      id="vat"
                      label="12% VAT:"
                      {...register("vat")}
                      disabled
                    />

                    <InputGroup
                      id="project-cost"
                      label="Project Cost:"
                      {...register("total")}
                      disabled
                    />

                  </div>

                  <div className="flex flex-col w-full gap-y-3">
                    <p className="text-xl text-primary font-grandview-bold underline underline-offset-4">Attachments</p>

                    <a
                      className="bg-[#E6E8EB] w-full py-1.5 rounded text-start px-3 text-[#858585] text-sm"
                      href={currentQuotation ? `${process.env.REACT_APP_API_URL}/uploads/${currentQuotation.floorPlan}` : ''}
                      target="_blank"
                      rel="noreferrer noopener"
                    >{currentQuotation ? currentQuotation.floorPlan : "-"}</a>

                    <p className="text-xl text-primary font-grandview-bold underline underline-offset-4">Quotation</p>
                    {(currentQuotation && ['FOR_APPROVAL', 'CLIENT_APPROVAL', 'APPROVED', 'CANCELED'].includes(status)) &&
                      <>
                        <a
                          className="bg-[#E6E8EB] w-full py-1.5 rounded text-start px-3 text-[#858585] text-sm"
                          href={currentQuotation && currentQuotation.quotation != null ? `${process.env.REACT_APP_API_URL}/uploads/${currentQuotation.quotation}` : ''}
                          target={currentQuotation && currentQuotation.quotation != null ? '_blank' : ''}
                          rel="noreferrer noopener"
                          style={currentQuotation && currentQuotation.quotation != null ? {} : { pointerEvents: 'none' }}
                        >{currentQuotation ? currentQuotation.quotation : "-"}</a>
                      </>
                    }
                    {(currentQuotation && ['DRAFTING', 'FOR_REVISION'].includes(status)) &&
                      <>
                        <span className="text-sm">Upload quotation file.</span>
                        <span className="text-sm">Accepted file type: *.doc, *.docx, *.pdf</span>
                        <label className="hover:cursor-pointer" htmlFor="quotationFile">
                          <input className="hidden" type="file" accept=".doc, .docx, .pdf" {...register("quotationFile", validation.quotationFile)} id="quotationFile" />

                          <div className="flex justify-center items-center gap-x-5 rounded border-2 border-[#B1C2DE] border-dashed w-full py-5">
                            <FontAwesomeIcon className="text-[#B1C2DE]" icon={faUpload} size="lg" fixedWidth />

                            <span className="text-lg text-[#B1C2DE]">Click here to upload file</span>
                          </div>
                        </label>
                        {errors?.quotationFile && <span className="text-sm text-red-700">{errors.quotationFile.message}</span>}

                        <div className="flex gap-y-2.5">
                          {
                            quotationFiles.map((floorPlan, index) => (
                              <a className="transition-all ease-in-out duration-300 flex justify-between items-center text-accent rounded border-2 border-[#B1C2DE] w-full  px-2 py-1.5 hover:text-white hover:bg-[#B1C2DE]" key={`floor-plan-${index + 1}`} href={URL.createObjectURL(floorPlan)} target="_blank" rel="noreferrer">
                                <span className="line-clamp-1 max-w-[50ch]">{floorPlan.name}</span>

                                <button type="button" onClick={() => { setQuotationFiles([]); resetField("quotationFile") }}>
                                  <FontAwesomeIcon icon={faXmark} fixedWidth />
                                </button>
                              </a>
                            ))
                          }
                        </div>
                      </>
                    }
                  </div>
                </div>
              </form>
            </main>
      }
    </>
  )
}

export default ViewQuotation