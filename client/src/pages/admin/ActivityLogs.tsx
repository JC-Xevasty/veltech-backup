import { Helmet } from "react-helmet-async"
import { useOutletContext } from "react-router-dom"
import { useForm, SubmitHandler, FieldValues } from "react-hook-form"
import { useEffect, useState } from "react"
import { OutletContext } from "../../types"
import PaginatedTable from "../../components/PaginatedTable"
import SelectionGroup from "../../components/SelectionGroup"
import { useSelector } from "react-redux"
import { selectApp } from "../../features/app/app"
import { useFetchActivitiesQuery } from "../../features/api/activity.log"
import { Activities } from "../../types";
import { format } from "date-fns"
import LoadingScreen from "../misc/LoadingScreen"
import PageNotFound from "../misc/PageNotFound"

function ActivityLogs() {
  const app = useSelector(selectApp)

  const [filter, setFilter] = useState<any>({
    userRole: "",
    category: ""
  })

  const { isLoading, isError, data: activityDetails } = useFetchActivitiesQuery(filter)

  useEffect(() => {
    if (activityDetails) {
      console.log(activityDetails)
    }
  }, [activityDetails])

  const [currentActivities, setCurrentActivities] = useState<Activities[]>([])

  const { offset } = useOutletContext() as OutletContext

  const { register, handleSubmit } = useForm<FieldValues>({})

  const handleFilter: SubmitHandler<FieldValues> = (values) => {
    setFilter(values)
  }

  return (
    <>
      <Helmet>
        <title>{ `${app?.appName || "Veltech Inc." } | Activity Logs`}</title>
      </Helmet>
      {
        isLoading ? <LoadingScreen /> :
        isError ? <PageNotFound /> :
            <main className={`${offset}`}>
              <h1 className="text-3xl text-accent px-5 font-grandview-bold">Activity Log</h1>

              <main className="flex flex-col gap-y-5 p-5">
                <form className="flex flex-col lg:grid lg:grid-cols-4 w-full gap-5" onChange={ handleSubmit(handleFilter) }>
                  <SelectionGroup { ...register("userRole") } options={["CLIENT", "ADMIN", "SUPERADMIN", "ACCOUNTING"]} values={["CLIENT", "ADMIN", "SUPERADMIN", "ACCOUNTING"]} label="User Role" />

                  <SelectionGroup { ...register("category") } options={["CREATE", "UPDATE", "DELETE", "AUTH", "PRINT", "OTHERS"]} values={["CREATE", "UPDATE", "DELETE", "AUTH", "PRINT", "OTHERS"]} label="Category" />
                </form>

                <h4 className="text-lg">Activity Logs</h4>

                <PaginatedTable
                  columns={[
                    "User",
                    "Entry",
                    "Module / Page",
                    "Categories",
                    "Created At",
                    "Status"]}
                  rowData={activityDetails}
                  rowsPerPage={10}
                  current={{ set: setCurrentActivities }}
                >
                  {
                    currentActivities?.map((activity, index) => (
                      <tr key={index}>
                        <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                          {activity.userRole}
                        </td>
                        <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                          {activity.entry}
                        </td>
                        <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                          {activity.module}
                        </td>
                        <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                          {activity.category}
                        </td>
                        <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                          {format(new Date(activity.loggedAt.toString()), "MM-dd-yyyy")}
                        </td>
                        <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                          {activity.status}
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

export default ActivityLogs