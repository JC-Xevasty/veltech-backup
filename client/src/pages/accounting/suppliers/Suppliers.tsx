import { useState, Fragment } from "react"
import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import { useForm, SubmitHandler, FieldValues } from "react-hook-form"
import { faEdit, faEye } from "@fortawesome/free-solid-svg-icons"
import { camelCase, debounce, startCase } from "lodash"
import { useFetchSuppliersQuery } from "../../../features/api/supplier"

import SearchInput from "../../../components/SearchInput"
import PaginatedTable from "../../../components/PaginatedTable"
import TableAction from "../../../components/TableAction"
import HeaderGroup from "../../../components/HeaderGroup"
import AddButton from "../../../components/AddButton"
import LoadingScreen from "../../misc/LoadingScreen"
import PageError from "../../misc/PageError"
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"

function AccountingSuppliers() {
  const app = useSelector(selectApp)
  const navigate = useNavigate()

  const [filter, setFilter] = useState<{ search: string }>({
    search: ""
  })

  const { isLoading: suppliersLoading, isError: suppliersError, data: suppliers } = useFetchSuppliersQuery(filter)

  const [currentSuppliers, setCurrentSuppliers] = useState<typeof suppliers[]>([])
  
  const { register, handleSubmit } = useForm<FieldValues>({})

  const handleSearch: SubmitHandler<FieldValues> = (values) => {
     setFilter({ search: values.search })
  }

  return (
    suppliersLoading ? <LoadingScreen /> :
    suppliersError ? <PageError /> :
    <Fragment>
      <Helmet>
        <title>{`${app?.appName || "Veltech Inc."} | Suppliers`}</title>
      </Helmet>

      <main className="grow flex flex-col justify-start items-start gap-y-5 w-full h-full px-20 py-10">
         <HeaderGroup text="Suppliers" link="/accounting/dashboard" />

         <form className="flex flex-row justify-start items-center gap-x-5" onChange={ debounce(handleSubmit(handleSearch), 500) }>
            <SearchInput placeholder="Seach by supplier name" { ...register("search") } />

            <AddButton text="Add Supplier" onClick={ () => navigate("/accounting/suppliers/create") } />            
         </form>

         <span className="text-lg">Supplier List</span>

         <PaginatedTable
            key={ suppliers }
            columns={[
              "ID", 
              "Supplier Name", 
              "Contact Person",
              "Contact Number", 
              "Email", 
              "Action"
            ]}
            rowData={ suppliers }
            rowsPerPage={ 10 }
            current={{ set: setCurrentSuppliers }}
          >
          {
            currentSuppliers?.map(supplier => (
              <tr key={ supplier.id }>
                <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                  { supplier.id }
                </td>

                <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                  { supplier.name }
                </td>

                <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                  { `${ startCase(camelCase(supplier.contacts[0].firstName)) } ${ startCase(camelCase(supplier.contacts[0].lastName)) }` }
                </td>

                <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                  { supplier.contacts[0].phone }
                </td>

                <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                  { supplier.contacts[0].emailAddress }
                </td>

                <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                  <div className="flex flex-row justify-start items-center">
                    <TableAction text="View" icon={ faEye } textHoverColor="hover:text-white" backgroundHoverColor="hover:bg-[#00BDB3]" onClick={ () => navigate(`/accounting/suppliers/${ supplier.id }`) } />
                    
                    <TableAction text="Edit" icon={ faEdit } textHoverColor="hover:text-white" backgroundHoverColor="hover:bg-[#EE9D00]" onClick={ () => navigate(`/accounting/suppliers/${ supplier.id }/edit`) } />
                  </div>
                </td>
              </tr>
              )
            )
          }
        </PaginatedTable>
      </main>
    </Fragment>
  )
}

export default AccountingSuppliers