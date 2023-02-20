import { Helmet } from "react-helmet-async"
import { useNavigate, useOutletContext } from "react-router-dom"
import { useForm, SubmitHandler, FieldValues } from "react-hook-form"
import type { OutletContext, Quotation as QuotationType } from "../../../types"
import { useState } from 'react'
import { faEye } from "@fortawesome/free-solid-svg-icons"
import { debounce } from "lodash"

import SearchInput from "../../../components/SearchInput"
import StatusIndicator from "../../../components/StatusIndicator"
import PaginatedTable from "../../../components/PaginatedTable"
import TableAction from "../../../components/TableAction"
import { useFetchQuotationsByQueryQuery } from "../../../features/api/quotation"
import LoadingScreen from "../../misc/LoadingScreen"
import PageError from "../../misc/PageError"
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"

const STATUS = {
  NOT_AVAILABLE: {
    value: "N/A",
    color: "bg-[#494949]"
  },
  FOR_REVIEW: {
    value: "For Review",
    color: "bg-[#3073E2]"
  },
  WAITING_OCULAR: {
    value: "Waiting Ocular",
    color: "bg-[#FF9900]"
  },
  DRAFTING: {
    value: "Drafting Quotation",
    color: "bg-[#E26630]"
  },
  FOR_APPROVAL: {
    value: "For Approval",
    color: "bg-[#A930E2]"
  },
  FOR_REVISION: {
    value: "For Revision",
    color: "bg-[#FF557E]"
  },
  CLIENT_APPROVAL: {
    value: "For Client Approval",
    color: "bg-[#A930E2]"
  },
  APPROVED: {
    value: "Approved",
    color: "bg-[#53B45A]"
  },
  CANCELLED: {
    value: "Cancelled",
    color: "bg-[#D12B2E]"
  },
  REJECTED_QUOTATION: {
    value: "Rejected Quotation",
    color: "bg-[#D12B2E]"
  },
  REJECTED_OCULAR: {
    value: "Rejected Ocular",
    color: "bg-[#D12B2E]"
  }
}

function Quotation() {
  const app = useSelector(selectApp)

  const navigate = useNavigate()

  const { offset } = useOutletContext() as OutletContext

  const [filter, setFilter] = useState<{ query: string }>({ query: "" })

  const { isLoading, isError, data: queryQuotations } = useFetchQuotationsByQueryQuery(filter);

  const [currentQuotations, setCurrentQuotations] = useState<typeof queryQuotations>([])

  const { register, handleSubmit } = useForm<FieldValues>({})

  const handleSearch: SubmitHandler<FieldValues> = (values) => {
    const { query } = values;
    setFilter({ query })
  }

  const getStatus = (val: string) => {
    if (val === "NOT_AVAILABLE") return STATUS.NOT_AVAILABLE;
    if (val === "FOR_REVIEW") return STATUS.FOR_REVIEW;
    if (val === "WAITING_OCULAR") return STATUS.WAITING_OCULAR;
    if (val === "DRAFTING") return STATUS.DRAFTING;
    if (val === "FOR_APPROVAL") return STATUS.FOR_APPROVAL;
    if (val === "FOR_REVISION") return STATUS.FOR_REVISION;
    if (val === "CLIENT_APPROVAL") return STATUS.CLIENT_APPROVAL;
    if (val === "APPROVED") return STATUS.APPROVED;
    if (val === "CANCELED") return STATUS.CANCELLED;
    if (val === "REJECTED_QUOTATION") return STATUS.REJECTED_QUOTATION;
    if (val === "REJECTED_OCULAR") return STATUS.REJECTED_OCULAR;
    return STATUS.NOT_AVAILABLE;
  }

  const getProjectPrice = (q: QuotationType) => {
    const mCost = q.materialsCost ? parseFloat(q.materialsCost.toString()) : 0;
    const lCost = q.laborCost ? parseFloat(q.laborCost.toString()) : 0;
    const rCost = q.requirementsCost ? parseFloat(q.requirementsCost.toString()) : 0;
    return (mCost + lCost + rCost).toFixed(2);
  }

  return (
    <>
      <Helmet>
        <title>{ `${ app?.appName || "Veltech Inc." } | Quotations` }</title>
      </Helmet>
      {
        isLoading ? <p>Loading....</p> :
          isError ? <p>Error.</p> :
            <main className={`${offset}`}>
              <h1 className="text-3xl text-accent px-5 font-grandview-bold">Quotations</h1>

              <main className="flex flex-col gap-y-5 p-5">

                <form className="flex flex-row justify-start items-center gap-x-5" onSubmit={(e) => e.preventDefault()} onChange={debounce(handleSubmit(handleSearch), 500)}>
                  <SearchInput placeholder="Search by company name" {...register("query")} />
                </form>

                <h4 className='text-lg mt-4'>Quotations List</h4>

                <PaginatedTable
                  columns={[
                    'ID',
                    'Client Company Name',
                    'Project Price',
                    'Status',
                    'Action']}
                  rowData={queryQuotations}
                  rowsPerPage={10}
                  current={{ set: setCurrentQuotations }}
                >
                  {
                    currentQuotations?.map(quotation => (
                      <tr key={quotation.id}>
                        <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                          {quotation.id.split("-")[0]}
                        </td>

                        <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                          {['ADMIN', 'ACCOUNTING'].includes(quotation.user.type) ? 'Veltech Industrial Supresssion' : quotation.user.companyName}
                        </td>

                        <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                          {`PHP ${getProjectPrice(quotation)}`}
                        </td>

                        <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                          <StatusIndicator type={getStatus(quotation.quotationStatus)} />
                        </td>

                        <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                          <div className="flex flex-row">
                            <TableAction text="View" icon={faEye} textHoverColor="hover:text-white" backgroundHoverColor="hover:bg-[#00BDB3]" onClick={() => navigate(`/admin/quotation/${quotation.id}`)} />
                          </div>
                        </td>
                      </tr>
                    )
                    )
                  }
                </PaginatedTable>
              </main>
            </main>
      }
    </>
  )
}

export default Quotation