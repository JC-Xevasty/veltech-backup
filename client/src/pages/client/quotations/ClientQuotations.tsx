import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom"
import ProfileSidebar from "../../../components/client/ProfileSidebar";
import { format } from "date-fns"
import { ReduxState, User, Quotation } from "../../../types";
import { useFetchClientQuotationsQuery } from "../../../features/api/quotation";
import { useEffect, useState } from "react";
import PaginatedTable from "../../../components/PaginatedTable";
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"

const STATUS = {
  FOR_REVIEW: {
    value: "Requested quotation is now for review.",
  },
  WAITING_OCULAR: {
    value: "Quotation is now advised for ocular visit. A company representative will contact you to discuss the visitation.",
  },
  DRAFTING: {
    value: "Quotation is now on the drafting process. Kindly anticipate the official document for your approval.",
  },
  CLIENT_APPROVAL: {
    value: "Quotation is waiting for your approval. Please read the clauses stated on the quotation document.",
  },
  APPROVED: {
    value: "You approved the quotation. The quotation is now recognized as a project.",
  },
  CANCELLED: {
    value: "You cancelled the quotation. Thank you for showing interest at Veltech Industrial Suppression.",
  },
  REJECTED_QUOTATION: {
    value: "Quotation was rejected. Kindly contact us for more information.",
  },
  REJECTED_OCULAR: {
    value: "Quotation was rejected. Problems were identified during the ocular visit.",
  }
}

function ClientQuotations() {
  const app = useSelector(selectApp)

  const navigate = useNavigate();

  const user: User = useSelector((state: ReduxState) => state.auth.user);

  const { isLoading, isError, data } = useFetchClientQuotationsQuery({ id: user ? user.id : " " });

  const [clientQuotations, setClientQuotations] = useState<Quotation[]>([]);

  useEffect(() => {
    setClientQuotations(data!);
  }, [data])

  const getStatus = (val: Quotation) => {
    if (val.quotationStatus === "NOT_AVAILABLE") return null;
    if (val.quotationStatus === "FOR_REVIEW") return STATUS.FOR_REVIEW.value;
    if (val.quotationStatus === "WAITING_OCULAR") return STATUS.WAITING_OCULAR.value;
    if (val.quotationStatus === "DRAFTING") return STATUS.DRAFTING.value;
    if (val.quotationStatus === "FOR_APPROVAL") return STATUS.DRAFTING.value;
    if (val.quotationStatus === "FOR_REVISION") return STATUS.DRAFTING.value;
    if (val.quotationStatus === "CLIENT_APPROVAL") return STATUS.CLIENT_APPROVAL.value;
    if (val.quotationStatus === "APPROVED") return STATUS.APPROVED.value;
    if (val.quotationStatus === "CANCELED") return STATUS.CANCELLED.value;
    if (val.quotationStatus === "REJECTED_QUOTATION") return STATUS.REJECTED_QUOTATION.value;
    if (val.quotationStatus === "REJECTED_OCULAR") return STATUS.REJECTED_OCULAR.value;
    return null;
  }

  const handleClick = (qid: string) => {
    window.scrollTo(0, 0);
    navigate(`/my-quotations/view/id=${qid}`, {
      state: {
        userId: user.id
      }
    })
  }

  return (

    <>
      <Helmet>
        <title>{ `${ app?.appName || "Veltech Inc." } | My Quotations` }</title>
      </Helmet>

      <div className="w-100 px-5 lg:px-10 py-10 lg:py-20">
        <div className="lg:grid grid-cols-10 bg-white items-start">
          <div className="lg:col-span-3 col-span-10 px-lg-10 px-5 flex justify-start items-start">
            <div className="items-center gap-x-4 gap-y-10">
              <ProfileSidebar />
            </div>
          </div>
          <div className="lg:col-span-6 col-span-10 mt-10 lg:mt-0 px-lg-10 px-5 flex flex-col">
            <div className="flex justify-between border-b-2 border-b-[#B1C2DE] pb-3">
              <span className="font-normal text-md">My Quotations</span>
            </div>
            <div className="flex flex-col gap-y-4 py-4">
              {
                isLoading ? <p>Loading...</p> :
                  isError ? <p>Error</p> :
                    (!clientQuotations || clientQuotations.length === 0) ? <p>No Quotations</p> :
                      <PaginatedTable
                        columns={[]}
                        rowData={data}
                        rowsPerPage={10}
                        current={{ set: setClientQuotations }}
                      >
                        {clientQuotations.map((quotation, index) => (
                          <div className="flex flex-col lg:flex-row lg:justify-between gap-y-2 lg:items-center w-full" key={quotation.id}>
                            <div className="flex lg:w-3/4 flex-col" key={quotation.id}>
                              <p className="text-2xl font-grandview-bold text-[#0B2653]">Quotation #{(quotation.id.split("-")[0])}</p>
                              <p className="lg:pr-10"><span className="font-grandview-bold">Status: </span>{getStatus(quotation)}</p>
                              <p className="text-xs">
                                {format(new Date(quotation.createdAt), "MM-dd-yyyy | hh:mm a")}
                              </p>
                            </div>
                            <button onClick={() => handleClick(quotation.id)} className="lg:w-[200px] transition-all ease-in-out duration-300 py-1 h-fit px-3 border rounded border-[#B1C2DE] text-[#B1C2DE] hover:bg-primary hover:text-white hover:border-primary">View Details</button>
                          </div>
                        ))}
                      </PaginatedTable>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ClientQuotations
