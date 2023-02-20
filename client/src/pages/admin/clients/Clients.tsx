import { useState, Fragment } from "react"
import { Helmet } from "react-helmet-async"
import { useForm, SubmitHandler } from "react-hook-form"
import { useNavigate, useOutletContext } from "react-router-dom"
import { faEye } from "@fortawesome/free-solid-svg-icons"
import { debounce } from "lodash"
import { useFetchClientsQuery } from "../../../features/api/client"

import type { OutletContext } from "../../../types"

import HeaderGroup from "../../../components/HeaderGroup"
import PaginatedTable from "../../../components/PaginatedTable"
import SearchInput from "../../../components/SearchInput"
import TableAction from "../../../components/TableAction"
import LoadingScreen from "../../../pages/misc/LoadingScreen"
import PageError from "../../../pages/misc/PageError"
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"

interface FieldValues {
   search: string
}

function Client() {
    const app = useSelector(selectApp)

   const navigate = useNavigate()

   const { offset } = useOutletContext() as OutletContext

   const [filter, setFilter] = useState<{ search: string }>({
      search: ""
   })

   const { isLoading: clientsLoading, isError: clientsError, data: clients } = useFetchClientsQuery(filter)

   const [currentClients, setCurrentClients] = useState<typeof clients>([])

   const { register, handleSubmit } = useForm<FieldValues>({})

   const handleSearch: SubmitHandler<FieldValues> = (values) => {
      const { search } = values

      setFilter({ search })
   }

   return (
      clientsLoading ? <LoadingScreen /> :
      clientsError ? <PageError /> :
      <Fragment>
        <Helmet>
          <title>{`${app?.appName || "Veltech Inc."} | Clients`}</title>
        </Helmet>

        <div className={ `${ offset }` }>
          <main className={ `grow flex flex-col justify-start items-start gap-y-5 w-full h-full px-5` }>
            <HeaderGroup text="Clients" />

            <form className="flex flex-row justify-start items-center gap-x-5" onChange={ debounce(handleSubmit(handleSearch), 500) }>
              <SearchInput placeholder="Seach by client or company name" { ...register("search") } />
            </form>

            <span className="text-lg">Client List</span>

            <PaginatedTable
              columns={[
                "Client Name",
                "Company",
                "E-mail Address",
                "Contact Number",
                "Actions"
              ]}
              rowData={ clients }
              rowsPerPage={ 10 }
              current={{ set: setCurrentClients }}
            >
              {
                currentClients?.map((client: any) => (
                  <tr key={ client.id }>
                    <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                        { client.firstName }
                    </td>

                    <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                        { client!.companyName }
                    </td>

                    <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                        { client.emailAddress }
                    </td>

                    <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                        { client.contactNumber }
                    </td>

                    <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                        <div className="flex flex-row">
                          <TableAction text="View" icon={ faEye } textHoverColor="hover:text-white" backgroundHoverColor="hover:bg-[#00BDB3]" onClick={ () => navigate(`/admin/clients/${ client.id }`) } />
                        </div>
                    </td>
                  </tr>
                ))
              }
            </PaginatedTable>
          </main>
        </div>
      </Fragment>
   )
}

 export default Client