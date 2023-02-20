import{ useState } from "react"
import { Helmet } from "react-helmet-async"
import PaginatedTable from "../../../../components/PaginatedTable"
import StatusIndicator from "../../../../components/StatusIndicator"
import TableAction from "../../../../components/TableAction"
import AddButton from "../../../../components/AddButton"
import { useFetchCarouselEntriesQuery, useUpdateCarouselEntryStatusMutation, Carousel as ICarousel } from "../../../../features/api/carousel.api"
import { useNavigate, useOutletContext } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckCircle, faEdit, faToggleOff, faToggleOn, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import { MutationResult, OutletContext } from "../../../../types"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import LoadingScreen from "../../../misc/LoadingScreen"
import PageError from "../../../misc/PageError"
import { useSelector } from "react-redux"
import { selectApp } from "../../../../features/app/app"
import { selectUser } from "../../../../features/auth/auth"
import { useCreateActivityMutation } from "../../../../features/api/activity.log"

const CAROUSEL_STATUS = {
  ACTIVE: {
    value: "Active",
    color: "bg-[#00FF00]"
  },
  INACTIVE: {
    value: "Inactive",
    color: "bg-[#ff0000]"
  }
}

function Carousel() {
  const app = useSelector(selectApp)
  const auth = useSelector(selectUser)
  const navigate = useNavigate()
  const { offset } = useOutletContext() as OutletContext

  const { isLoading: entriesLoading, isError: entriesError, data: entries } = useFetchCarouselEntriesQuery()
  const [currentEntries, setCurrentEntries] = useState<ICarousel[]>([])

  const getCarouselStatus = (status: string) => {
    switch (status) {
      case "ACTIVE": return CAROUSEL_STATUS.ACTIVE
      default: return CAROUSEL_STATUS.INACTIVE
    }
  }

  const [updateEntryStatus] = useUpdateCarouselEntryStatusMutation()

  const [createActivityMutation] = useCreateActivityMutation();
  
  const handleToggleStatus = async (id: string, status: string) => {
    const update: MutationResult<any> = await updateEntryStatus({
      id,
      status
    })

    await createActivityMutation({
      userRole: auth.type,
      entry: `${ auth.username }-update-carousel-entry-status-to-${ status }`,
      module: "CAROUSEL",
      category: "UPDATE",
      status: (update?.data?.id ? "SUCCEEDED" : "FAILED")
    })

    if (update?.data?.id) {
      toast(
        <div className="flex justify-center items-center gap-x-3">
           <FontAwesomeIcon className="text-white" icon={ faCheckCircle } size="lg" fixedWidth />
           <h1 className="text-white font-grandview-bold">Successfully updated carousel entry status!</h1>
        </div>,
        {
           toastId: "failed-update-status-toast",
           theme: "colored",
           className: "!bg-primary !rounded",
           progressClassName: "!bg-white"
        }
      )
    } else {
      toast(
        <div className="flex justify-center items-center gap-x-3">
           <FontAwesomeIcon className="text-white" icon={ faXmarkCircle } size="lg" fixedWidth />
           <h1 className="text-white font-grandview-bold">Failed to update carousel entry status!</h1>
        </div>,
        {
           toastId: "failed-update-status-toast",
           theme: "colored",
           className: "!bg-primary !rounded",
           progressClassName: "!bg-white"
        }
      )
    }
  }

  return (
    entriesLoading ? <LoadingScreen /> :
    entriesError ? <PageError /> :
    <>
      <Helmet>
        <title>{`${app?.appName || "Veltech Inc."} | Carousel`}</title>
      </Helmet>

      <main className={ `${ offset }`}>
        <h1 className="text-3xl text-accent px-5 font-grandview-bold">Carousel</h1>

        <main className="flex flex-col gap-y-5 p-5">
          <AddButton text="Add New Entry" onClick={ () => navigate("/admin/management/carousel/create") } />

          <h4 className="text-lg mt-4">Carousel List</h4>

          <PaginatedTable 
            columns={[
              "Cover", 
              "Title",
              "Description",
              "Status",
              "Action"
            ]}
            rowData={ entries }
            rowsPerPage={ 5 }
            current={{ set: setCurrentEntries }}
          >
          {
            currentEntries?.map(entry => (
              <tr key={ entry.id }>
                <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                  <img className="w-[250px] h-[150px]" src={ `${ process.env.REACT_APP_API_URL }/uploads/${ entry.imgPath }` } alt="Cover Preview" />
                </td>

                <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                  { entry.title }
                </td>

                <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[25ch] px-2 py-2">
                  { entry.description }
                </td>

                <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                  <StatusIndicator key={ entry.status } type={ getCarouselStatus(entry.status) } />
                </td>

                <td className="text-sm border border-x-0 text-ellipsis whitespace-nowrap overflow-x-hidden max-w-[18ch] px-2 py-2">
                  <div className="flex flex-row">
                    <TableAction text="Edit" icon={ faEdit } textHoverColor="hover:text-white" backgroundHoverColor="hover:bg-[#FF9F40]" onClick={ () => navigate(`/admin/management/carousel/${ entry.id }/edit`) } />
                    <TableAction text={ entry.status === "ACTIVE" ? "Set Inactive" : "Set Active" } icon={ entry.status === "ACTIVE" ? faToggleOff : faToggleOn } textHoverColor="hover:text-white" backgroundHoverColor={ entry.status === "ACTIVE" ? "hover:bg-[#666666]" : "hover:bg-[#00BDB3]" } onClick={ () => handleToggleStatus(entry.id, entry.status === "ACTIVE" ? "INACTIVE" : "ACTIVE") } />
                  </div>
                </td>
              </tr>
            ))
          }
          </PaginatedTable>

        </main> 
      </main>
    </>
  )
}

export default Carousel