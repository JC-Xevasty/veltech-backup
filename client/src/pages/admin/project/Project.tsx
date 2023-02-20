import { Helmet } from "react-helmet-async"
import { useNavigate, useOutletContext } from "react-router-dom"
import { useForm, SubmitHandler, FieldValues } from "react-hook-form"
import type { OutletContext, Project as ProjectType } from "../../../types"
import {useEffect, useState} from 'react'
import { faEye } from "@fortawesome/free-solid-svg-icons"
import { debounce } from "lodash"

import SearchInput from "../../../components/SearchInput"
import AddButton from "../../../components/AddButton"
import StatusIndicator from "../../../components/StatusIndicator"
import PaginatedTable from "../../../components/PaginatedTable"
import TableAction from "../../../components/TableAction"
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"

import { useFetchProjectsByQueryQuery } from "../../../features/api/project"

interface Project{
  projectNo: string
  companyName: string
  projectPrice: number
  balance: number
  projectStatus: {
    value: string
    color: string
  }
  paymentStatus: {
    value: string
    color: string
  }
  action: null
}


const PROJECT_STATUS = {
  NOT_AVAILABLE: {
    value: "N/A",
    color: "bg-[#494949]"
  },
  WAITING_CONTRACT: {
    value: "Waiting Contract",
    color: "bg-[#FF9900]"
  },
  SET_MILESTONE:{
    value: "Set Progress Billing",
    color: "bg-[#FF9900]"
  },
  WAITING_SIGNATURE: {
    value: "Waiting Client Signature",
    color: "bg-[#FF9900]"
  },
  WAITING_PAYMENT: {
    value: "Waiting Payment",
    color: "bg-[#E26630]"
  },
  WAITING_APPROVAL: {
    value: "Payment Approval",
    color: "bg-[#A930E2]"
  },
  ONGOING: {
    value: "Ongoing",
    color: "bg-[#3073E2]"
  },
  COMPLETED: {
    value: "Completed",
    color: "bg-[#53B45A]"
  },
  ON_HOLD: {
    value: "On Hold",
    color: "bg-[#EBEBEB]"
  },
  TERMINATED: {
    value: "Terminated",
    color: "bg-[#D12B2E]"
  },
}

const PAYMENT_STATUS = {
  NOT_AVAILABLE: {
    value: "N/A",
    color: "bg-[#494949]"
  },
  WAITING_APPROVAL: {
    value: "Waiting Approval",
    color: "bg-[#A930E2]"
  },
  WAITING_PAYMENT: {
    value: "Waiting Payment",
    color: "bg-[#E26630]"
  },
  PROGRESS_BILLING: {
    value: "Progress Billing",
    color: "bg-[#3073E2]"
  },
  FULLY_PAID: {
    value: "Fully Paid",
    color: "bg-[#53B45A]"
  },
}

function Project() {
  const app = useSelector(selectApp)
  const navigate = useNavigate()
  const { offset } = useOutletContext() as OutletContext

  const [filter, setFilter] = useState<{ query: string }>({ query: "" })

  const { isLoading, isError, data: queryProjects } = useFetchProjectsByQueryQuery(filter);

  const [currentProjects, setCurrentProjects] = useState<typeof queryProjects>([])

  const { register, handleSubmit } = useForm<FieldValues>({})

  const handleSearch: SubmitHandler<FieldValues> = (values) => {
    const { query } = values;
    setFilter({ query })
  }

  const getProjectStatus = (val: string) => {
    if (val === "NOT_AVAILABLE") return PROJECT_STATUS.NOT_AVAILABLE;
    if (val === "WAITING_CONTRACT") return PROJECT_STATUS.WAITING_CONTRACT;
    if (val === 'SET_MILESTONE') return PROJECT_STATUS.SET_MILESTONE;
    if (val === "WAITING_SIGNATURE") return PROJECT_STATUS.WAITING_SIGNATURE;
    if (val === "WAITING_PAYMENT") return PROJECT_STATUS.WAITING_PAYMENT;
    if (val === "WAITING_APPROVAL") return PROJECT_STATUS.WAITING_APPROVAL;
    if (val === "ONGOING") return PROJECT_STATUS.ONGOING;
    if (val === "COMPLETED") return PROJECT_STATUS.COMPLETED;
    if (val === "ON_HOLD") return PROJECT_STATUS.ON_HOLD;
    if (val === "TERMINTATED") return PROJECT_STATUS.TERMINATED;
    return PROJECT_STATUS.NOT_AVAILABLE;
  }

  const getPaymentStatus = (val:string )=>{
    if (val === "NOT_AVAILABLE") return PAYMENT_STATUS.NOT_AVAILABLE;
    if (val === "WAITING_APPROVAL") return PAYMENT_STATUS.WAITING_APPROVAL;
    if (val === "WAITING_PAYMENT") return PAYMENT_STATUS.WAITING_PAYMENT;
    if (val === "PROGRESS_BILLING") return PAYMENT_STATUS.PROGRESS_BILLING;
    if (val === "FULLY_PAID") return PAYMENT_STATUS.FULLY_PAID;
    return PAYMENT_STATUS.NOT_AVAILABLE;
  }

  const getProjectPrice = (project: ProjectType) => {
    const mCost = project.quotation.materialsCost ? parseFloat(project.quotation.materialsCost.toString()) : 0;
    const lCost = project.quotation.laborCost ? parseFloat(project.quotation.laborCost.toString()) : 0;
    const rCost = project.quotation.requirementsCost ? parseFloat(project.quotation.requirementsCost.toString()) : 0;
    return (mCost + lCost + rCost).toFixed(2);
  }

  return (
    <>
      <Helmet>
        <title>{ `${ app?.appName || "Veltech Inc." } | Projects` }</title>
      </Helmet>

      <main className={ `${ offset }`}>
      <h1 className="text-3xl text-accent px-5 font-grandview-bold">Projects</h1>

        <main className="flex flex-col gap-y-5 p-5">

          <form className="flex flex-row justify-start items-center gap-x-5" onChange={ debounce(handleSubmit(handleSearch), 500)} onSubmit={(e) => e.preventDefault()}>
              <SearchInput placeholder="Search by company name" { ...register("query") } />
          </form>

          <h4 className='text-lg mt-4'>Projects List</h4>

          <PaginatedTable
            key={ queryProjects }
            columns={[
              'ID', 
              'Client Company Name', 
              'Project Price', 
              'Remaining Balance',
              'Status', 
              'Action']}
            rowData={ queryProjects }
            rowsPerPage={ 10 }
            current={{ set: setCurrentProjects }}
          >
          {
            currentProjects?.map((project: any) => (
                <tr key={ project.id }>
                    <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                      { project.id.split("-")[0] }
                    </td>

                    <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                      { project.user.companyName }
                    </td>

                    <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                      { `PHP ${getProjectPrice(project)}` }
                    </td>

                    <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                      { `PHP ${ project.remainingBalance }` }
                    </td>

                    <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                      <StatusIndicator type={ getProjectStatus(project.projectStatus)} />
                    </td>

                    <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                      <StatusIndicator type={ getPaymentStatus(project.paymentStatus)} />
                    </td>

                    <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                      <div className="flex flex-row">
                          <TableAction text="View" icon={ faEye } textHoverColor="hover:text-white" backgroundHoverColor="hover:bg-[#00BDB3]" onClick={ () => navigate(`/admin/project/${project.id}`) } />
                      </div>
                    </td>
                </tr>
              )
            )
          }
          </PaginatedTable>

        </main> 
      </main>
    </>
  )
}

export default Project