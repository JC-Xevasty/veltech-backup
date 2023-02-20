import { Fragment, useState } from "react"
import { Helmet } from "react-helmet-async"
import { useNavigate, useOutletContext } from "react-router-dom"
import { useSelector } from "react-redux"
import { faEdit, faCheckCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import _, { debounce } from "lodash"
import { useFetchAdminsQuery, useUpdateUserStatusMutation } from "../../../../features/api/user"
import type { MutationResult, OutletContext, User } from "../../../../types"
import { SubmitHandler, FieldValues, useForm } from "react-hook-form"

import LoadingScreen from "../../../misc/LoadingScreen"
import PageError from "../../../misc/PageError"
import SearchInput from "../../../../components/SearchInput"
import AddButton from "../../../../components/AddButton"
import PaginatedTable from "../../../../components/PaginatedTable"
import TableAction from "../../../../components/TableAction"
import HeaderGroup from "../../../../components/HeaderGroup"
import { selectApp } from "../../../../features/app/app"
import { selectUser } from "../../../../features/auth/auth"
import { useCreateActivityMutation } from "../../../../features/api/activity.log"

interface Users{
  id: string
  firstName: string
  middleName: string
  lastName: string
  username: string
  emailAddress: string
  type: string
  isVerified? : boolean
  status: string
  actions: null
}

function UserManagement() {
  const [createActivityMutation] = useCreateActivityMutation();
  const navigate = useNavigate()

  const app = useSelector(selectApp)

  const auth = useSelector(selectUser)

  const [filter, setFilter] = useState<{ search: string }>({
    search: ""
  })

  const { offset } = useOutletContext() as OutletContext
  const [currentUsers, setCurrentUsers] = useState<Users[]>([])

  const { isLoading: usersLoading, isError: usersError, data: users } = useFetchAdminsQuery(filter)
  
  const { register, handleSubmit } = useForm<FieldValues>({})

  const handleSearch: SubmitHandler<FieldValues> = (values) => {
    setFilter({ search: values.search })
  }

  const [updateUserStatusMutation] = useUpdateUserStatusMutation()

  const handleEditStatus = async (status: string, id: string) => {
    const updateUser: MutationResult<User> = await updateUserStatusMutation({
      status: status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
      id
    })

    await createActivityMutation({
      userRole: auth.type,
      entry: `${ auth.username }-update-user-status`,
      module: "USER-MANAGEMENT",
      category: "UPDATE",
      status: (updateUser?.data?.id ? "SUCCEEDED" : "FAILED")
    });

    if (updateUser?.data?.id) {
      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={ faCheckCircle } size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Successfully update user!</h1>
        </div>,
        {
          toastId: "update-user-succeded-toast",
          theme: "colored",
          className: "!bg-primary !rounded",
          progressClassName: "!bg-white"
        }
      )

      navigate("/admin/management/users", {
        replace: true
      })
    } else {
      toast(
        <div className="flex justify-center items-center gap-x-3">
          <FontAwesomeIcon className="text-white" icon={ faXmarkCircle } size="lg" fixedWidth />
          <h1 className="text-white font-grandview-bold">Failed to update user!</h1>
        </div>,
        {
          toastId: "update-user-failed-toast",
          theme: "colored",
          className: "!bg-red-700 !rounded",
          progressClassName: "!bg-white"
        }
      )
    }
  }

  return (
    usersLoading ? <LoadingScreen /> :
    usersError ? <PageError /> :
    <Fragment>
      <Helmet>
        <title>{`${app?.appName || "Veltech Inc."} | User Management`}</title>
      </Helmet>

      <main className={ `${ offset }` }>
        <main className="flex flex-col gap-y-5 px-5">
          <HeaderGroup text="User Management" />

          <form className="flex flex-row justify-start items-center gap-x-5" onChange={ debounce(handleSubmit(handleSearch), 500) }>
            <SearchInput placeholder="Search by name, username, or e-mail address" { ...register("search") } />

            <AddButton text="Add New User" onClick={ () => navigate("/admin/management/users/create") } />            
          </form>

          <h4 className='text-lg mt-4'>Users List</h4>

          <PaginatedTable
            columns={[
              'Full Name',
              'Username',
              'E-mail Address',
              'Type',
              'Verified',
              'Status',
              'Actions'
            ]}
            rowData= { users }
            rowsPerPage= { 10 }
            current={{ set: setCurrentUsers }}
          >
            {
              currentUsers?.map(user => (
                <tr key={ user.id }>
                  <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                    { `${ _.startCase(_.camelCase(user.firstName)) } ${ user.middleName ? (_.startCase(_.camelCase(user?.middleName)).charAt(0) + ".") : "" } ${ _.startCase(_.camelCase(user.lastName)) }` }
                  </td>

                  <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                    { user.username }
                  </td>

                  <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                    { user.emailAddress }
                  </td>

                  <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                    { _.startCase(_.camelCase(user.type)) }
                  </td>

                  <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                    { user.isVerified + "" }
                  </td>

                  <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                    { _.startCase(_.camelCase(user.status)) }
                  </td>

                  <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                    <div className="flex flex-row">
                      <TableAction onClick={ () => navigate(`/admin/management/users/id=${ user.id }/edit`) } text="Edit" icon={ faEdit } textHoverColor="hover:text-white" backgroundHoverColor="hover:bg-[#EE9D00]" />
                      
                      {
                        user.type !== "SUPERADMIN" && (
                          <TableAction text={ user.status === "ACTIVE" ? "Set Inactive" : "Set Active" } icon={ user.status === "ACTIVE" ? faXmarkCircle : faCheckCircle } textHoverColor="hover:text-white" backgroundHoverColor="hover:bg-primary" onClick={ () => handleEditStatus(user.status, user.id) } />
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

export default UserManagement