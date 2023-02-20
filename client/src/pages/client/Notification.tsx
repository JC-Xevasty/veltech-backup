import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { camelCase, startCase } from "lodash"
import ProfileSidebar from "../../components/client/ProfileSidebar"
import { format, parseISO } from "date-fns"

import { useFetchNotificationsQuery, Notification as INotification } from "../../features/api/notification.api"
import { User, ReduxState } from "../../types"
import PaginatedTable from "../../components/PaginatedTable"
import LoadingScreen from "../misc/LoadingScreen"
import PageError from "../misc/PageError"
import { useSelector } from "react-redux"
import { selectApp } from "../../features/app/app"

function Notification() {
  const app = useSelector(selectApp)

  const user: User = useSelector((state: ReduxState) => state.auth.user)

  const { isLoading, isError, data: notifications } = useFetchNotificationsQuery({
    userId: user.id
  })

  const [currentNotifications, setCurrentNotifications] = useState<INotification[]>()

    return (
      isLoading ? <LoadingScreen /> :
      isError ? <PageError /> :
      <>
      <Helmet>
        <title>{ `${ app?.appName || "Veltech Inc." } | Notifications` }</title>
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
              <span className="font-normal text-md">All Notifications</span>
            </div>

          <PaginatedTable
            columns={[]}
            rowData= { notifications }
            rowsPerPage= { 10 }
            current={{ set: setCurrentNotifications }}
          >
            {
              currentNotifications?.map(notification => (
                <tr key={ notification.id }>
                  <td colSpan={ 100 } className="flex flex-col gap-y-1.5 py-3 border-b-2">
                    <p className="text-2xl font-grandview-bold text-[#0B2653]">{ startCase(camelCase(notification.origin)) } #{ (notification.origin === "QUOTATION" ? notification.quotationId : notification.projectId)!.split("-")[0] } - { notification.title }</p>
                    
                    <p>{ notification.body }</p>
                    
                    <p className="text-xs">{ format(parseISO(notification.createdAt), "MM-dd-yyyy") }</p>
                  </td>
                </tr>
              ))
            }
          </PaginatedTable>
          </div>
        </div>
      </div>
      </>
    )
}

export default Notification
