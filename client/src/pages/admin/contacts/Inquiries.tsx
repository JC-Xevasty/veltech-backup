import { Fragment, useState } from "react"
import { Helmet } from "react-helmet-async"
import { useNavigate, useOutletContext } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"
import { selectUser } from "../../../features/auth/auth"
import { faCheckCircle, faXmarkCircle, faEye, faCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { camelCase, debounce, startCase } from "lodash"
import type { MutationResult, OutletContext, User } from "../../../types"
import { SubmitHandler, FieldValues, useForm } from "react-hook-form"
import { useFetchInquiriesQuery, useUpdateInquiryIsRepliedMutation, Inquiry } from "../../../features/api/inquiry.api"
import { useCreateActivityMutation } from "../../../features/api/activity.log"

import LoadingScreen from "../../misc/LoadingScreen"
import PageError from "../../misc/PageError"
import SearchInput from "../../../components/SearchInput"
import PaginatedTable from "../../../components/PaginatedTable"
import TableAction from "../../../components/TableAction"
import HeaderGroup from "../../../components/HeaderGroup"

function Inquiries() {
  const navigate = useNavigate()

  const app = useSelector(selectApp)

  const auth = useSelector(selectUser)

  const [filter, setFilter] = useState<{ search: string }>({
    search: ""
  })

  const { offset } = useOutletContext() as OutletContext
  const [currentInquiries, setCurrentInquiries] = useState<Inquiry[]>([])

  const { isLoading: inquiriesLoading, isError: inquiriesError, data: inquiries } = useFetchInquiriesQuery(filter)
  
  const { register, handleSubmit } = useForm<FieldValues>({})

  const handleSearch: SubmitHandler<FieldValues> = (values) => {
    setFilter({ search: values.search })
  }

  const [updateInquiryIsReplied] = useUpdateInquiryIsRepliedMutation()

  const [createActivityMutation] = useCreateActivityMutation();
  
  const handleSetReplied = async (id: string) => {
    const update: MutationResult<Inquiry> = await updateInquiryIsReplied({
      isReplied: true,
      id
    })

    await createActivityMutation({
      userRole: auth.type,
      entry: `${ auth.username }-set-inquiry-replied`,
      module: "INQUIRIES",
      category: "UPDATE",
      status: (update?.data!?.id ? "SUCCEEDED" : "FAILED")
    });
    
    if (update?.data?.id) {
      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={ faCheckCircle } size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Successfully update inquiry!</h1>
        </div>,
        {
          toastId: "update-inquiry-is-replied--succeded-toast",
          theme: "colored",
          className: "!bg-primary !rounded",
          progressClassName: "!bg-white"
        }
      )
    }
    
    if (!update?.data?.id || update?.error) {
      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={ faXmarkCircle } size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Failed to update inquiry!</h1>
        </div>,
        {
          toastId: "update-inquiry-is-replied-failed-toast",
          theme: "colored",
          className: "!bg-red-700 !rounded",
          progressClassName: "!bg-white"
        }
      )
    }
  }

  return (
    inquiriesLoading ? <LoadingScreen /> :
    inquiriesError ? <PageError /> :
    <Fragment>
      <Helmet>
        <title>{ `${ app?.appName || "Veltech Inc." } | Inquiries` }</title>
      </Helmet>

      <main className={ `${ offset }` }>
        <main className="flex flex-col gap-y-5 px-5">
          <HeaderGroup text="Inquiries" />

          <form className="flex flex-row justify-start items-center gap-x-5" onChange={ debounce(handleSubmit(handleSearch), 500) }>
            <SearchInput placeholder="Search by full name or company name" { ...register("search") } />
          </form>

          <h4 className='text-lg mt-4'>Inquiries List</h4>

          <PaginatedTable
            columns={[
              'ID',
              'Subject',
              'Client Name',
              'Company Name',
              'E-mail Address',
              'Received Reply',
              'Actions'
            ]}
            rowData= { inquiries }
            rowsPerPage= { 10 }
            current={{ set: setCurrentInquiries }}
          >
            {
              currentInquiries?.map(inquiry => (
                <tr key={ inquiry.id }>
                  <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[12ch] px-2 py-2">
                    { inquiry.id.split("-")[0] }
                  </td>

                  <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                    { startCase(camelCase(inquiry.subject)) }
                  </td>

                  <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[15ch] px-2 py-2">
                    { inquiry.fullName }
                  </td>

                  <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[15ch] px-2 py-2">
                    { inquiry.companyName }
                  </td>

                  <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                    { inquiry.emailAddress }
                  </td>

                  <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[10ch] px-2 py-2">
                    { inquiry.isReplied ? "true" : "false" }
                  </td>

                  <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[30ch] px-2 py-2">
                    <div className="flex flex-row">
                      <TableAction onClick={ () => navigate(`/admin/inquiries/id=${ inquiry.id }`) } text="View Message" icon={ faEye } textHoverColor="hover:text-white" backgroundHoverColor="hover:bg-[#3475E1]" />

                      {
                        !inquiry.isReplied && (
                          <TableAction onClick={ () => handleSetReplied(inquiry.id) } text="Set as Replied" icon={ faCheck } textHoverColor="hover:text-white" backgroundHoverColor="hover:bg-[#EE9D00]" />
                        )
                      }
                    </div>
                  </td>
                </tr>
              ))
            }
          </PaginatedTable>
        </main>
      </main>
    </Fragment>
  )
}

export default Inquiries