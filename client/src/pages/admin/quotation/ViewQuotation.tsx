import { Helmet } from "react-helmet-async"
import { useOutletContext, useParams } from "react-router-dom"
import type { OutletContext, Quotation, User, MutationResult } from "../../../types"
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import HeaderGroup from "../../../components/HeaderGroup"
import InputGroup from "../../../components/accounting/InputGroup"
import { useForm } from "react-hook-form"
import { useFetchQuotationQuery, useSetQuotationStatusMutation } from "../../../features/api/quotation"
import { format } from "date-fns"
import { toast } from "react-toastify"
import { useCreateNotificationMutation } from "../../../features/api/notification.api"
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"
import { selectUser } from "../../../features/auth/auth"
import { useCreateActivityMutation } from "../../../features/api/activity.log"

interface FieldValues {
    status: string
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

    const [createActivityMutation] = useCreateActivityMutation();

    const [createNotificationMutation] = useCreateNotificationMutation()

    const { offset } = useOutletContext() as OutletContext

    const { id: qId } = useParams() as { id: string }

    const { isLoading, isError, data: quotation } = useFetchQuotationQuery({ id: qId });

    const [currentQuotation, setCurrentQuotation] = useState<typeof quotation>();

    const [status, setStatus] = useState("");

    const [totalCost, setTotalCost] = useState<{ total: number, subtotal: number, vat: number }>({ total: 0, subtotal: 0, vat: 0 });

    const { register, watch, getValues, handleSubmit, formState: { errors } } = useForm<FieldValues>({})

    const [setQuotationStatusMutation] = useSetQuotationStatusMutation();

    useEffect(() => {
        setCurrentQuotation(quotation!)
        if (quotation) {
            setStatus(quotation.quotationStatus);
            if (['FOR_APPROVAL', 'CLIENT_APPROVAL', 'APPROVED', 'CANCELED'].includes(quotation.quotationStatus)) computeTotal(quotation);
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

    const stringToPrice = (val: number): string => {
        if (!val) return "PHP -"
        return `PHP ${parseFloat(val.toString()).toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
    }

    const computeTotal = (q: Quotation) => {
        const m = q?.materialsCost ? parseFloat(q.materialsCost.toString()) : 0;
        const l = q?.laborCost ? parseFloat(q.laborCost.toString()) : 0;
        const r = q?.requirementsCost ? parseFloat(q.requirementsCost.toString()) : 0;
        const total = m + l + r;
        const vat = total * 0.12;
        const subtotal = total - vat;
        setTotalCost({ total, subtotal, vat });
    }

    const handleSetStatus = async (status: string) => {
        const currentStatus: string = currentQuotation!.quotationStatus

        const setQuotationStatus: MutationResult<Quotation> = await setQuotationStatusMutation({
            id: currentQuotation?.id,
            quotationStatus: status
        })

        await createActivityMutation({
            userRole: auth.type,
            entry: `${ auth.username }-set-quotation-status-${ status }`,
            module: "VIEW- QUOTATION",
            category: "UDATE",
            status: (setQuotationStatus?.data!?.id ? "SUCCEEDED" : "FAILED")
          });

        if (setQuotationStatus?.data!?.id) {
            console.log("Quotation Status updated.");
            switch (status) {
                case "WAITING_OCULAR": {
                    await createNotificationMutation({
                        title: "Waiting Ocular",
                        body: "Requested quotation is now advised for ocular visit.\nA company representative will be in contact with you to discuss the visitation.",
                        quotationId: setQuotationStatus.data.id,
                        origin: "QUOTATION",
                        userId: setQuotationStatus.data.userId
                    })

                    break
                }

                case "REJECTED_QUOTATION": {
                    await createNotificationMutation({
                        title: "Rejected (Rejected By Admin - For Review)",
                        body: "Quotation was rejected.\nKindly contact us for more information.",
                        quotationId: setQuotationStatus.data.id,
                        origin: "QUOTATION",
                        userId: setQuotationStatus.data.userId
                    })

                    break
                }

                case "DRAFTING": {
                    await createNotificationMutation({
                        title: "Drafting Quotation",
                        body: "Quotation is now on the drafting process.\nKindly anticipate the official document for your approval.",
                        quotationId: setQuotationStatus.data.id,
                        origin: "QUOTATION",
                        userId: setQuotationStatus.data.userId
                    })

                    break
                }

                case "REJECTED_OCULAR": {
                    await createNotificationMutation({
                        title: "Rejected (Rejected By Admin - Waiting Ocular)",
                        body: "Quotation was rejected.\nProblems were identified during the ocular visit.",
                        quotationId: setQuotationStatus.data.id,
                        origin: "QUOTATION",
                        userId: setQuotationStatus.data.userId
                    })

                    break
                }
                
                case "CLIENT_APPROVAL": {
                    await createNotificationMutation({
                        title: "Approval",
                        body: "The quotation is waiting for your approval.\nPlease read the terms and conditions stated on the quotation document.",
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

    return (
        <>
            <Helmet>
                <title>{ `${ app?.appName || "Veltech Inc." } | View Quotation ${ quotation?.id.split("-")[0] }` }</title>
            </Helmet>

            {
                isLoading ? <p>Loading... </p> :
                    isError ? <p>Error.</p> :
                        <main className={`${offset}`}>
                            <div className='flex justify-between px-5 items-center'>
                                <div className='flex items-center  gap-x-2.5'>
                                    <HeaderGroup
                                        text={`View Quotation #${currentQuotation ? currentQuotation.id.split("-")[0] : ""}`}
                                        link="/admin/quotation" />
                                </div>
                            </div>
                            <main className="flex flex-col gap-y-5 p-5">

                                <p className='text-sm text-gray-700 rounded bg-gray-100 w-full px-3.5 py-1.5'>Quotation Information</p>

                                <form action="" onSubmit={(e) => e.preventDefault()}>
                                    <div className="grid grid-cols-4 justify-start items-end gap-x-20 w-full">

                                        <InputGroup
                                            id="quotation-status"
                                            label="Status:"
                                            defaultValue={currentQuotation ? getStatus(status) : ""}
                                            disabled
                                        />

                                        <div className="flex gap-x-2 col-span-2">
                                            {(() => {
                                                switch (status) {
                                                    case "FOR_REVIEW": {
                                                        return <>
                                                            <button
                                                                className="transition-all ease-in-out duration-300 text-white tracking-wide rounded-sm bg-[#00BDB3] px-3 py-1.5 hover:scale-105"
                                                                type="submit"
                                                                onClick={() => handleSetStatus('WAITING_OCULAR')}
                                                            >Proceed to Ocular</button>
                                                            <button
                                                                className="transition-all ease-in-out duration-300 text-white tracking-wide rounded-sm bg-[#DE2B2B] px-3 py-1.5 hover:scale-105"
                                                                type="submit"
                                                                onClick={() => handleSetStatus('REJECTED_QUOTATION')}
                                                            >Reject</button>
                                                        </>
                                                    }
                                                    case "WAITING_OCULAR": {
                                                        return <>
                                                            <button
                                                                className="transition-all ease-in-out duration-300 text-white tracking-wide rounded-sm bg-[#00BDB3] px-3 py-1.5 hover:scale-105"
                                                                type="submit"
                                                                onClick={() => handleSetStatus('DRAFTING')}
                                                            >Proceed to Drafting Quotation</button>
                                                            <button
                                                                className="transition-all ease-in-out duration-300 text-white tracking-wide rounded-sm bg-[#DE2B2B] px-3 py-1.5 hover:scale-105"
                                                                type="submit"
                                                                onClick={() => handleSetStatus('REJECTED_OCULAR')}
                                                            >Reject</button>
                                                        </>
                                                    }
                                                    case "FOR_APPROVAL": {
                                                        return <>
                                                            <button
                                                                className="transition-all ease-in-out duration-300 text-white tracking-wide rounded-sm bg-[#00BDB3] px-3 py-1.5 hover:scale-105"
                                                                type="submit"
                                                                onClick={() => handleSetStatus('CLIENT_APPROVAL')}
                                                            >Proceed to Client Review</button>
                                                            <button
                                                                className="transition-all ease-in-out duration-300 text-white tracking-wide rounded-sm bg-[#DE2B2B] px-3 py-1.5 hover:scale-105"
                                                                type="submit"
                                                                onClick={() => handleSetStatus('FOR_REVISION')}
                                                            >For Revision</button>
                                                        </>
                                                    }
                                                    default: {
                                                        return <></>
                                                    }
                                                }
                                            })()}
                                        </div>
                                    </div>
                                </form>

                                <p className="text-[#737373] text-md">Created at: {currentQuotation && format(new Date(currentQuotation.createdAt), "MMMM dd, yyyy | hh:mm a")}</p>

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
                                            defaultValue={currentQuotation && ['FOR_APPROVAL', 'CLIENT_APPROVAL', 'APPROVED', 'CANCELED'].includes(status) ? stringToPrice(currentQuotation.materialsCost) : ""}
                                            disabled
                                        />

                                        <InputGroup
                                            id="labor-cost"
                                            label="Labor Cost:"
                                            defaultValue={currentQuotation && ['FOR_APPROVAL', 'CLIENT_APPROVAL', 'APPROVED', 'CANCELED'].includes(status) ? stringToPrice(currentQuotation.laborCost) : ""}
                                            disabled
                                        />

                                        <InputGroup
                                            id="requirements-cost"
                                            label="General Requirements Cost:"
                                            defaultValue={currentQuotation && ['FOR_APPROVAL', 'CLIENT_APPROVAL', 'APPROVED', 'CANCELED'].includes(status) ? stringToPrice(currentQuotation.requirementsCost) : ""}
                                            disabled
                                        />

                                        <InputGroup
                                            id="subtotal-cost"
                                            label="Project Subtotal Cost:"
                                            defaultValue={currentQuotation && ['FOR_APPROVAL', 'CLIENT_APPROVAL', 'APPROVED', 'CANCELED'].includes(status) ? stringToPrice(totalCost.subtotal) : ""}
                                            disabled
                                        />

                                        <InputGroup
                                            id="vat"
                                            label="12% VAT:"
                                            defaultValue={currentQuotation && ['FOR_APPROVAL', 'CLIENT_APPROVAL', 'APPROVED', 'CANCELED'].includes(status) ? stringToPrice(totalCost.vat) : ""}
                                            disabled
                                        />

                                        <InputGroup
                                            id="project-cost"
                                            label="Project Cost:"
                                            defaultValue={currentQuotation && ['FOR_APPROVAL', 'CLIENT_APPROVAL', 'APPROVED', 'CANCELED'].includes(status) ? stringToPrice(totalCost.total) : ""}
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

                                        <a
                                            className="bg-[#E6E8EB] w-full py-1.5 rounded text-start px-3 text-[#858585] text-sm"
                                            href={currentQuotation && currentQuotation.quotation != null ? `${process.env.REACT_APP_API_URL}/uploads/${currentQuotation.quotation}` : ''}
                                            target={currentQuotation && currentQuotation.quotation != null ? '_blank' : ''}
                                            rel="noreferrer noopener"
                                            style={currentQuotation && currentQuotation.quotation != null ? {} : { pointerEvents: 'none' }}
                                        >{currentQuotation && ['FOR_APPROVAL', 'CLIENT_APPROVAL', 'APPROVED', 'CANCELED'].includes(status) ? currentQuotation.quotation : "-"}</a>
                                    </div>
                                </div>
                            </main>
                        </main>
            }
        </>
    )
}

export default ViewQuotation