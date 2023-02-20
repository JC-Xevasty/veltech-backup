import { Helmet } from "react-helmet-async"
import { useNavigate } from "react-router-dom"
import ProfileSidebar from "../../../components/client/ProfileSidebar"
import { format} from "date-fns"
import { useFetchClientProjectsQuery } from "../../../features/api/project"
import { useEffect, useState } from "react"
import { Project , User, ReduxState} from "../../../types"
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"

const PROJECT_STATUS = {
  NOT_AVAILABLE:{
    value: "Not Available Yet"
  },
  WAITING_CONTRACT: {
    value: "The contract for the project is now on its drafting process. You can check your email and account for updates.",
  },
  WAITING_SIGNATURE: {
    value: "Project contract is now available for your signature. Please read the terms and conditions stated on the contract.",
  },
  WAITING_PAYMENT: {
    value: "Your project is set for payment. Kindly upload a clear picture of your proof of payment for easier verification.",
  },
  WAITING_APPROVAL: {
    value: "We have received your payment for the project. Please wait while we verify your payment before proceeding.",
  },
  ONGOING: {
    value: "Your project/milestone is now ongoing. You can always monitor the status of the project at the ‘projects tab’ under your profile.",
  },
  COMPLETED: {
    value: "The project is already completed! Our company would like to express its gratitude for your trust and partnership.",
  },
  ON_HOLD: {
    value: "Project is placed on hold. Reasons regarding the pausing of the project will be coordinated to you by a company representative.",
  },
  TERMINATED: {
    value: "Project is Terminated. Please check your email inbox for any further project termination notices.",
  },
}

function ClientProjects() {
  const app = useSelector(selectApp)

  const navigate = useNavigate()

  const user: User = useSelector((state: ReduxState) => state.auth.user)

  const { data: currentClientProject } = useFetchClientProjectsQuery({ id: user?.id })

  const [clientProjects, setClientProject] = useState<Project[]>()

  useEffect(()=>{
    setClientProject(currentClientProject);
    console.log(currentClientProject)
  },[currentClientProject])

  const getStatus = (val: string) => {
    if (val === "NOT_AVAILABLE") return PROJECT_STATUS.NOT_AVAILABLE.value;
    if (val === "WAITING_CONTRACT") return PROJECT_STATUS.WAITING_CONTRACT.value;
    if (val === "WAITING_SIGNATURE") return PROJECT_STATUS.WAITING_SIGNATURE.value;
    if (val === "WAITING_PAYMENT") return PROJECT_STATUS.WAITING_PAYMENT.value;
    if (val === "WAITING_APPROVAL") return PROJECT_STATUS.WAITING_APPROVAL.value;
    if (val === "ONGOING") return PROJECT_STATUS.ONGOING.value;
    if (val === "COMPLETED") return PROJECT_STATUS.COMPLETED.value;
    if (val === "ON_HOLD") return PROJECT_STATUS.ON_HOLD.value;
    if (val === "TERMINTATED") return PROJECT_STATUS.TERMINATED.value;
    return PROJECT_STATUS.WAITING_CONTRACT.value;
  }

  const handleClick = (projectId: string) => {
    window.scrollTo(0, 0);
    navigate(`/my-projects/view/id=${projectId}`, {
      state: {
        userId: user.id
      }
    })
  }

  return (
    <>
      <Helmet>
        <title>{ `${ app?.appName || "Veltech Inc." } | My Projects` }</title>
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
              <span className="font-normal text-md">My Projects</span>
            </div>
            <div className="flex flex-col gap-y-4 py-4">
             { 
                (!clientProjects || clientProjects.length ===0) ? <p>No Projects Available...</p> : 
                clientProjects?.map((project) => (
                  <div  key = {project.id}className="flex flex-col lg:flex-row lg:justify-between gap-y-2 lg:items-center w-full">
                    <div className="flex lg:w-3/4 flex-col">
                      <p className="text-2xl font-grandview-bold text-[#0B2653]">Project #{project.id.split("-")[0]}</p>
                      <p className="lg:pr-10"><span className="font-grandview-bold">Status: </span>{getStatus(project.projectStatus)}</p>
                      <p className="text-xs">
                        {format(new Date(project.createdAt), "MM-dd-yyyy | hh:mm a")}
                      </p>
                    </div>
                    <button onClick={() => handleClick(project.id)} className="lg:w-[200px] w-full transition-all ease-in-out duration-300 py-1 h-fit border rounded border-[#B1C2DE] text-[#B1C2DE] hover:bg-primary hover:text-white hover:border-primary">View Details</button>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ClientProjects
