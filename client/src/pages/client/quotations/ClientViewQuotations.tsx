import { Helmet } from "react-helmet-async"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { NavLink } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons"
import { format } from "date-fns"
import InfoGroup from "../../../components/InfoGroup"
import { MutationResult, Quotation, ReduxState, User, Project as ProjectType } from "../../../types"
import { useEffect, useState } from "react"
import { useFetchClientQuotationQuery, useSetQuotationStatusMutation } from "../../../features/api/quotation"
import { useCreateClientProjectMutation } from "../../../features/api/project"
import printJS from 'print-js'
import { toast } from "react-toastify"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { faCheckCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import { useCreateNotificationMutation } from "../../../features/api/notification.api"
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"
import { camelCase, startCase } from "lodash"

function ClientViewQuotation() {
  const app = useSelector(selectApp)

  const [createNotificationMutation] = useCreateNotificationMutation()

  const navigate = useNavigate()

  const user: User = useSelector((state: ReduxState) => state.auth.user)

  const { id: qId } = useParams() as { id: string }

  const location = useLocation().state as {
    userId: string | ""
  }

  const { data } = useFetchClientQuotationQuery({ userId: user ? user.id : location.userId, id: qId })
  const [clientQuotation, setClientQuotation] = useState<Quotation>()

  const [status, setStatus] = useState("");

  const [totalCost, setTotalCost] = useState<{ total: number, subtotal: number, vat: number }>({ total: 0, subtotal: 0, vat: 0 });

  const [setQuotationStatusMutation] = useSetQuotationStatusMutation();

  const [createClientProject] = useCreateClientProjectMutation();

  const { handleSubmit } = useForm();

  const qid = data?.id

  useEffect(() => {
    setClientQuotation(data!);
    if (data) {
      setStatus(data.quotationStatus);
      if (['CLIENT_APPROVAL', 'APPROVED'].includes(data.quotationStatus)) computeTotal(data);
    }
  }, [data])

  const computeTotal = (q: Quotation) => {
    const m = q?.materialsCost ? parseFloat(q.materialsCost.toString()) : 0;
    const l = q?.laborCost ? parseFloat(q.laborCost.toString()) : 0;
    const r = q?.requirementsCost ? parseFloat(q.requirementsCost.toString()) : 0;
    const total = m + l + r;
    const vat = total * 0.12;
    const subtotal = total - vat;
    setTotalCost({ total, subtotal, vat });
  }

  const getProjectFeatures = (q: Quotation): string => {
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

  const stringToPrice = (val: number): string => {
    if (!val) return "PHP -"
    return `PHP ${parseFloat(val.toString()).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
  }

  const handleSetStatus = async (status: string) => {
    const setQuotationStatus: MutationResult<Quotation> = await setQuotationStatusMutation({
      id: clientQuotation?.id,
      quotationStatus: status
    })

    if (setQuotationStatus?.data!?.id) {
      console.log("Quotation status updated.");
      switch (status) {
        case "APPROVED": {
            await createNotificationMutation({
                title: "Approved",
                body: "You approved the quotation.\nThe quotation is now recognized as a project.",
                quotationId: setQuotationStatus.data.id,
                origin: "QUOTATION",
                userId: setQuotationStatus.data.userId
            })
  
            break
        }

        // Note: I changed FOR_REVISION to REJECTED... p.s please check if this affects the flow of your work
        case "FOR_REVISION": {
          await createNotificationMutation({
            title: "Rejected (Rejected By Client)",
            body: "You rejected the quotation.\nThe quotation will be drafted for a new version.",
            quotationId: setQuotationStatus.data.id,
            origin: "QUOTATION",
            userId: setQuotationStatus.data.userId
          })

          break
        }

        case "CANCELED": {
          await createNotificationMutation({
            title: "Cancelled",
            body: "You cancelled the quotation.\nThank you for showing interest at Veltech Industrial Suppression.",
            quotationId: setQuotationStatus.data.id,
            origin: "QUOTATION",
            userId: setQuotationStatus.data.userId
          })

          break
        }

        default: break
      }
    }

    if (setQuotationStatus?.data!?.message || setQuotationStatus?.error) {
      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={faXmarkCircle} size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Failed to update Quotation status!</h1>
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

  const handleCreateProject: SubmitHandler<FieldValues> = async (data) => {
    const createProject: MutationResult<ProjectType> = await createClientProject({
      userId: user.id,
      quotationId: qid,
      contractFileName: "-",
      signedContractFileName: "-",
      remainingBalance: totalCost.total
    })

    if (createProject?.data?.id) {
      await createNotificationMutation({
        title: "Drafting Contract",
        body: "The contract for the project is now on its drafting process.",
        projectId: createProject.data.id,
        origin: "PROJECT",
        userId: createProject.data.userId
      })

      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={faCheckCircle} size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Quotation added to Projects!</h1>
        </div>,
        {
          toastId: "update-user-succeded-toast",
          theme: "colored",
          className: "!bg-primary !rounded",
          progressClassName: "!bg-white"
        }
      )

      window.scrollTo(0, 0)
      navigate("/my-projects", {
        replace: true
      })
    } else {
      console.log("Not Created")
    }
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

  return (

    <>
      <Helmet>
        <title>{ `${ app?.appName || "Veltech Inc." } | View Quotation #${ clientQuotation?.id.split("-")[0] }` }</title>
      </Helmet>

      <div className="w-100 px-5 lg:px-52 py-10 lg:py-20">
        <div className="flex flex-col">
          <NavLink to="/my-quotations" className="flex gap-x-2 items-center hover:text-primary">
            <FontAwesomeIcon icon={faArrowLeftLong} />
            <span>Back</span>
          </NavLink>
          <h1 className="text-4xl font-grandview-bold text-[#133061]">Quotation #{clientQuotation && clientQuotation.id.split("-")[0]}</h1>
          <div className="flex flex-col lg:flex-row lg:justify-between gap-y-2 w-full lg:items-end border-b border-b-[#B1C2DE] pb-3">
            Created At: {clientQuotation && format(new Date(clientQuotation.createdAt), "MM-dd-yyyy | hh:mm a")}
            <div className="flex flex-col lg:flex-row gap-x-2 gap-y-3">
              {(() => {
                switch (status) {
                  case "CLIENT_APPROVAL":
                    return <>
                      <form onSubmit={handleSubmit(handleCreateProject)}>
                        <button
                          className="lg:w-fit transition-all ease-in-out duration-300 text-white tracking-wide rounded bg-[#00BDB3] px-3 py-1 hover:scale-105"
                          type="submit"
                          onClick={() => handleSetStatus('APPROVED')}
                        >Approve Quotation</button>
                      </form>
                      <button
                        className="lg:w-fit transition-all ease-in-out duration-300 text-white tracking-wide rounded bg-primary px-3 py-1 hover:scale-105"
                        type="submit"
                        onClick={() => handleSetStatus('FOR_REVISION')}
                      >
                        Reject Quotation
                      </button>
                    </>
                  default:
                    return <></>
                }
              })()}
              {(clientQuotation && !['CANCELED', 'REJECTED_QUOTATION', 'REJECTED_OCULAR', 'APPROVED'].includes(status)) &&
                <button
                  className="lg:w-fit transition-all ease-in-out duration-300 text-white tracking-wide rounded bg-[#FF9900] px-3 py-1 hover:scale-105"
                  type="submit"
                  onClick={() => handleSetStatus('CANCELED')}
                >Cancel Quotation</button>
              }
              {(status === 'APPROVED' || status === 'CLIENT_APPROVAL') &&
                <button
                  className="lg:w-fit transition-all ease-in-out duration-300 py-1 h-fit px-3 border rounded border-[#B1C2DE] text-[#B1C2DE] hover:bg-primary hover:text-white hover:scale-105 hover:border-primary"
                  onClick={async () => { (clientQuotation && clientQuotation.quotation !== '') && printJS(`http://localhost:5000/api/quotations/file/${clientQuotation?.quotation}/fetch`) }}
                >Print Quotation</button>
              }
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-x-24 h-fit mt-5">
            <div className="flex flex-col gap-y-3">
              <p className="text-xl text-primary font-grandview-bold underline underline-offset-4">Quotation Status</p>
              <InfoGroup
                label=""
                value={(clientQuotation) ? startCase(camelCase(clientQuotation.quotationStatus)) : "-"}
              />
              <p className="text-xl text-primary font-grandview-bold underline underline-offset-4">Service Information</p>
              <InfoGroup
                label="Building Type:"
                value={(clientQuotation) ? clientQuotation.buildingType : "-"}
              />
              <InfoGroup
                label="Establishment Size (Width):"
                value={(clientQuotation) ? clientQuotation.establishmentSizeWidth + "m" : "-"}
              />

              <InfoGroup
                label="Establishment Size (Height):"
                value={(clientQuotation) ? clientQuotation.establishmentSizeHeight + "m" : "-"}
              />
              <InfoGroup
                label="Features to be Added:"
                value={(clientQuotation) ? getProjectFeatures(clientQuotation) : "-"}
              />

              <p className="text-xl text-primary font-grandview-bold underline underline-offset-4">Contact Information</p>

              <InfoGroup
                label="Name:"
                value={(clientQuotation) ? getClientName(clientQuotation.user) : "-"}
              />
              <InfoGroup
                label="Company Name:"
                value={(clientQuotation) ? clientQuotation.user.companyName : "-"}
              />
              <InfoGroup
                label="Contact Number"
                value={(clientQuotation) ? clientQuotation.user.contactNumber : "-"}
              />
              <InfoGroup
                label="Email:"
                value={(clientQuotation) ? clientQuotation.user.emailAddress : "-"}
              />
            </div>
            {/* TODO: Section below will only show once quotation has been sent to client */}
            <div className="flex flex-col gap-y-3">
              {(() => {
                switch (status) {
                  case "CLIENT_APPROVAL":
                  case "APPROVED":
                    return <>
                      <div className="flex flex-col gap-y-1.5">
                        <label className="text-xl text-[#133061] mb-2 font-grandview-bold">Attached File:</label>
                        <a
                          className="bg-[#E6E8EB] w-full py-1.5 rounded text-start px-3 text-[#858585] text-sm"
                          href={clientQuotation ? `${process.env.REACT_APP_API_URL}/uploads/${clientQuotation.floorPlan}` : ''}
                          target="_blank"
                          rel="noreferrer noopener"
                        >{clientQuotation && clientQuotation.floorPlan}</a>
                      </div>
                      <p className="text-xl text-primary font-grandview-bold underline underline-offset-4">Service Cost</p>
                      <InfoGroup
                        label="Materials Cost"
                        value={(clientQuotation) ? stringToPrice(clientQuotation.materialsCost) : "PHP 0.00"}
                      />
                      <InfoGroup
                        label="Labor Cost"
                        value={(clientQuotation) ? stringToPrice(clientQuotation.laborCost) : "PHP 0.00"}
                      />
                      <InfoGroup
                        label="General Requirements Cost"
                        value={(clientQuotation) ? stringToPrice(clientQuotation.requirementsCost) : "PHP 0.00"}
                      />
                      <InfoGroup
                        label="Project Subtotal Cost"
                        value={(clientQuotation) ? stringToPrice(totalCost.subtotal) : "PHP 0.00"}
                      />
                      <InfoGroup
                        label="12% VAT"
                        value={(clientQuotation) ? stringToPrice(totalCost.vat) : "PHP 0.00"}
                      />
                      <InfoGroup
                        label="Project Cost"
                        value={(clientQuotation) ? stringToPrice(totalCost.total) : "PHP 0.00"}
                      />
                    </>
                  default:
                    return <>
                      <div className="flex flex-col gap-y-1.5">
                        <label className="text-xl text-[#133061] mb-2 font-grandview-bold">Attached File:</label>
                        <a
                          className="bg-[#E6E8EB] w-full py-1.5 rounded text-start px-3 text-[#858585] text-sm"
                          href={clientQuotation ? `${process.env.REACT_APP_API_URL}/uploads/${clientQuotation.floorPlan}` : ''}
                          target="_blank"
                          rel="noreferrer noopener"
                        >{clientQuotation && clientQuotation.floorPlan}</a>
                      </div>
                    </>
                }
              })()}
            </div>
            {(() => {
              switch (status) {
                case "CLIENT_APPROVAL":
                case "APPROVED":
                  return <>
                    <div className="flex flex-col h-fit gap-y-3">
                      <p className="text-xl text-primary font-grandview-bold underline underline-offset-4">Quotation</p>
                      <a
                        className="bg-[#E6E8EB] w-full py-1.5 rounded text-start px-3 text-[#858585] text-sm"
                        href={clientQuotation ? `${process.env.REACT_APP_API_URL}/uploads/${clientQuotation.quotation}` : ''}
                        target="_blank"
                        rel="noreferrer noopener"
                      >{clientQuotation && clientQuotation.quotation}</a>
                    </div>
                  </>
                default:
                  return <></>
              }
            })()}
          </div>
        </div>
      </div>
    </>
  )
}

export default ClientViewQuotation
