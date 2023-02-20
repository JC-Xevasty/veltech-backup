import { Helmet } from "react-helmet-async"
import { useNavigate, useOutletContext } from "react-router-dom"
import { useForm, SubmitHandler, FieldValues } from "react-hook-form"
import React, { useState } from 'react'
import { faEye } from "@fortawesome/free-solid-svg-icons"
import { debounce } from "lodash"

import SearchInput from "../../../components/SearchInput"
import StatusIndicator from "../../../components/StatusIndicator"
import PaginatedTable from "../../../components/PaginatedTable"
import TableAction from "../../../components/TableAction"
import HeaderGroup from "../../../components/HeaderGroup"
import { useFetchQuotationsByQueryQuery } from "../../../features/api/quotation"
import { Quotation } from "../../../types"
import LoadingScreen from "../../misc/LoadingScreen"
import AddButton from "../../../components/AddButton"
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

function AccountingQuotations() {
  const app = useSelector(selectApp)
  const navigate = useNavigate()

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

  const getProjectPrice = (q: Quotation) => {
    const mCost = q.materialsCost ? parseFloat(q.materialsCost.toString()) : 0;
    const lCost = q.laborCost ? parseFloat(q.laborCost.toString()) : 0;
    const rCost = q.requirementsCost ? parseFloat(q.requirementsCost.toString()) : 0;
    return (mCost + lCost + rCost).toFixed(2);
    // return "dsadsa";
  }

  return (
    <>
      <Helmet>
      <title>{`${app?.appName || "Veltech Inc."} | Quotations`}</title>
      </Helmet>

      {
        isLoading ? <LoadingScreen /> :
          isError ? <p>Error.</p> :
            <main className="grow flex flex-col justify-start items-start gap-y-5 w-full h-full px-20 py-10">
              <HeaderGroup text="Quotations" link="/accounting/dashboard" />
              <div className="flex flex-row justify-start items-center gap-x-5" >
                <form onSubmit={(e) => e.preventDefault()} onChange={debounce(handleSubmit(handleSearch), 500)}>
                  <SearchInput placeholder="Seach by company name" {...register("query")} />
                </form>
                  <AddButton text="Add New Quotation" onClick={() => navigate("/accounting/quotations/create")} />
              </div>

              <span className="text-lg">Quotations List</span>

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
                        {quotation.user.companyName}
                      </td>

                      <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                        {`PHP ${getProjectPrice(quotation)}`}
                      </td>

                      <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                        <StatusIndicator type={getStatus(quotation.quotationStatus)} />
                      </td>

                      <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                        <div className="flex flex-row">
                          <TableAction text="View" icon={faEye} textHoverColor="hover:text-white" backgroundHoverColor="hover:bg-[#00BDB3]" onClick={() => navigate(`/accounting/quotations/${quotation.id}`)} />
                        </div>
                      </td>
                    </tr>
                  )
                  )
                }
              </PaginatedTable>
            </main>
      }
    </>
  )
}

export default AccountingQuotations