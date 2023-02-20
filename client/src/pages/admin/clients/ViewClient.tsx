import { useEffect, useState, Fragment } from "react"
import { Helmet } from "react-helmet-async"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import { faEye } from "@fortawesome/free-solid-svg-icons"
import { startCase, camelCase } from "lodash"
import { format, parseISO } from "date-fns"
import { useFetchClientQuery, useFetchClientQuotationsQuery, useFetchClientProjectsQuery } from "../../../features/api/client"
import HeaderGroup from "../../../components/HeaderGroup"
import LoadingScreen from "../../../pages/misc/LoadingScreen"
import PaginatedTable from "../../../components/PaginatedTable"
import StatusGroup from "../../../components/StatusGroup"
import TableAction from "../../../components/TableAction"
import PageError from "../../../pages/misc/PageError"
import type { OutletContext } from "../../../types"
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"

interface Status {
  [key: string]: {
    text: string
    color: string
  }
}

const QUOTATION_STATUS: Status = {
  NOT_AVAILABLE: {
    text: "Not Available",
    color: "bg-[#000000]"
  },
  FOR_REVIEW: {
    text: "For Review",
    color: "bg-[#3073E2]"
  },
  WAITING_OCULAR: {
    text: "For Review",
    color: "bg-[#FF9900]"
  },
  DRAFTING: {
    text: "Drafting Quotation",
    color: "bg-[#FF9900]"
  },
  CLIENT_REVIEW: {
    text: "Client Review",
    color: "bg-[#3073E2]"
  },
  FOR_APPROVAL: {
    text: "For Approval",
    color: "bg-[#00BDB3]"
  },
  FOR_REVISION: {
    text: "For Revision",
    color: "bg-[#B84545]"
  },
  APPROVED: {
    text: "Approved",
    color: "bg-[#53B45A]"
  },
  CANCELED: {
    text: "Canceled",
    color: "bg-[#FF9900]"
  },
  REJECTED_QUOTATION: {
    text: "Rejected",
    color: "bg-[#DE2B2B]"
  }
}

const PROJECT_STATUS: Status = {
  NOT_AVAILABLE: {
    text: "Not Available",
    color: "bg-[#000000]"
  },
  WAITING_CONTRACT: {
    text: "Waiting for Contract",
    color: "bg-[#3073E2]"
  },
  WAITING_SIGNATURE: {
    text: "Waiting for Signature",
    color: "bg-[#E26630]"
  },
  WAITING_PAYMENT: {
    text: "Waiting for Payment",
    color: "bg-[#FFC700]"
  },
  WAITING_APPROVAL: {
    text: "Not Available",
    color: "bg-[#00BDB3]"
  },
  SET_MILESTONE: {
    text: "Set Project Milestone",
    color: "bg-[#B1C2DE]"
  },
  ONGOING: {
    text: "Ongoing",
    color: "bg-[#335A9A]"
  },
  COMPLETED: {
    text: "Completed",
    color: "bg-[#53B45A]"
  },
  ON_HOLD: {
    text: "On Hold",
    color: "bg-[#FF9900]"
  },
  TERMINATED: {
    text: "Terminated",
    color: "bg-[#D12B2E]"
  }
}

function ViewClient() {
  const app = useSelector(selectApp)

  const navigate = useNavigate()

  const { offset } = useOutletContext() as OutletContext

  const { id } = useParams() as { id: string }

  const { isLoading: clientLoading, isError: clientError, data: client } = useFetchClientQuery({ id })

  const { isLoading: quotationsLoading, isError: quotationsError, data: quotations } = useFetchClientQuotationsQuery({ id })
  const [currentQuotations, setCurrentQuotations] = useState<typeof quotations>([])

  useEffect(() => {
    console.log(quotations)
  }, [quotations])

  const { isLoading: projectsLoading, isError: projectsError, data: projects } = useFetchClientProjectsQuery({ id })
  const [currentProjects, setCurrentProjects] = useState<typeof projects>([])

  return (
    clientLoading || quotationsLoading || projectsLoading ? <LoadingScreen /> :
    clientError || quotationsError || projectsError ? <PageError /> :
    <Fragment>
        <Helmet>
          <title>{`${app?.appName || "Veltech Inc."} | View Client ${ startCase(camelCase(client?.firstName)) } ${ startCase(camelCase(client?.lastName)) }`}</title>
        </Helmet>

        <div className={ `${ offset }` }>
          <main className={ `grow flex flex-col justify-start items-start gap-y-5 w-full h-full px-5` }>
            <HeaderGroup text="View Client" link="/admin/clients" />

            <div className="rounded-sm bg-[#F3F1F1] w-full py-1.5 px-3">
              Client Information
            </div>

            <div className="grid grid-cols-7 gap-x-5 w-full my-3">
              <div className="col-span-1">
                <InfoGroup label="Client Name" value={ `${ startCase(camelCase(client?.firstName)) } ${ startCase(camelCase(client?.lastName)) }` } />
              </div>

              <div className="col-span-1">
                <InfoGroup label="Company Name" value={ client?.companyName } />
              </div>

              <div className="col-span-1">
                <InfoGroup label="Contact Number" value={ `+63${ client?.contactNumber.substring(1) }` } />
              </div>

              <div className="col-span-1">
                <InfoGroup label="E-mail Address" value={ client?.emailAddress } />
              </div>
            </div>

            <div className="rounded-sm bg-[#F3F1F1] w-full py-1.5 px-3">
              Quotation History
            </div>

            <div className="w-full my-5">
              <PaginatedTable
                columns={[
                  "ID",
                  "Created at",
                  "Status",
                  "Action"
                ]}
                rowData={ quotations }
                rowsPerPage={ 5 }
                current={{ set: setCurrentQuotations }}
              >
                {
                  currentQuotations?.map((quotation: any) => (
                    <tr key={ quotation.id }>
                      <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                          { quotation.id }
                      </td>

                      <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                          { format(parseISO(quotation.createdAt), "MM-dd-yyyy") }
                      </td>

                      <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                          { <StatusGroup text={ QUOTATION_STATUS[quotation.quotationStatus]?.text } color={ QUOTATION_STATUS[`${ quotation.quotationStatus }`]?.color } /> }
                      </td>

                      <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                        <div className="flex flex-row">
                          <TableAction text="View" icon={ faEye } textHoverColor="hover:text-white" backgroundHoverColor="hover:bg-[#00BDB3]" onClick={ () => navigate(`/admin/quotation/${quotation.id}`) } />
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </PaginatedTable>
            </div>

            <div className="rounded-sm bg-[#F3F1F1] w-full py-1.5 px-3">
              Project History
            </div>

            <div className="w-full my-5">
              <PaginatedTable
                columns={[
                  "ID",
                  "Project Price",
                  "Status",
                  "Action"
                ]}
                rowData={ projects }
                rowsPerPage={ 5 }
                current={{ set: setCurrentProjects }}
              >
                {
                  currentProjects?.map((project: any) => (
                    <tr key={ project.id }>
                      <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                          { project.id }
                      </td>

                      <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                          { "Total Price here" }
                      </td>

                      <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                          { <StatusGroup text={ PROJECT_STATUS[project.projectStatus].text } color={ PROJECT_STATUS[`${ project.projectStatus }`].color } /> }
                      </td>

                      <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                        <div className="flex flex-row">
                          <TableAction text="View" icon={ faEye } textHoverColor="hover:text-white" backgroundHoverColor="hover:bg-[#00BDB3]" onClick={ () => navigate(`/admin/quotation/${project.id}`) } />
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </PaginatedTable>
            </div>
          </main>
        </div>
    </Fragment>
  )
}

const InfoGroup = ({ label, value }: { label: string, value: string }) => {
  return (
    <div className="flex flex-col justify-start items-start gap-y-3">
      <span className="text-sm text-accent font-grandview-bold">{ label }</span>

      <span className="text-sm">{ value }</span>
    </div>
  )
}

 export default ViewClient