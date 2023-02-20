import { Helmet } from "react-helmet-async"
import { useOutletContext } from "react-router-dom"
import type { OutletContext } from "../../types"

import { useFetchQuotationsByQueryQuery } from '../../features/api/quotation'
import { useFetchProjectsByQueryQuery } from '../../features/api/project'
import { useFetchUsersQuery } from '../../features/api/user'
import { useState } from "react"
import PageError from "../misc/PageError"
import LoadingScreen from "../misc/LoadingScreen"
import { useSelector } from "react-redux"
import { selectApp } from "../../features/app/app"

function Dashboard() {
  const { offset } = useOutletContext() as OutletContext
  const app = useSelector(selectApp)

  const [filter, setFilter] = useState<{ query: string }>({ query: "" })
  const { isError: quotationError, isLoading: quotationLoading, data: quotationData } = useFetchQuotationsByQueryQuery(filter)
  const { isError: projectError, isLoading: projectLoading, data: projectData } = useFetchProjectsByQueryQuery(filter)
  const { isError: userError, isLoading: userLoading, data: userData } = useFetchUsersQuery()

  const getTotalQuatations = () => {
    return quotationData?.length || 0
  }

  const getTotalProjects = () => {
    return projectData?.length || 0
  }

  const getOngoingProjects = () => {
    return projectData?.length ? projectData?.filter((value: any) => value.projectStatus === "ONGOING").length : 0
  }

  const getWebUserAccounts = () => {
    return userData?.length || 0
  }


  return (
    quotationError ? <PageError /> : projectError ? <PageError /> : userError ? <PageError /> :
      quotationLoading ? <LoadingScreen /> : projectLoading ? <LoadingScreen /> : userLoading? <LoadingScreen /> :
        <>
          <Helmet>
            <title>{`${app?.appName || "Veltech Inc."} | Dashboard`}</title>
          </Helmet>

          <main className={`${offset}`}>
            <main className="flex flex-col gap-y-5 p-5">
              <div className="grid grid-cols-4 gap-x-4 w-full">
                {/*  */}
                <div className="relative flex flex-col items-left w-full h-full p-1 rounded-[10px] gap-y-3 bg-[#0B2653]
           text-[#fff] lg:w-[100%] px-30 py-8">
                  <h1 className="text-lg font-grandview-medium w-full pl-4">
                    Total Quotations
                  </h1>
                  <p className="text-[2rem] text-sm pl-4 font-grandview-bold text-left">
                  {getTotalQuatations()}
                  </p>
                </div>
                {/*  */}
                <div className="relative flex flex-col items-left w-full h-full p-1 rounded-[10px] gap-y-3 bg-[#0B2653]
           text-[#fff] lg:w-[100%] px-30 py-8">
                  <h1 className="text-lg font-grandview-medium w-full pl-4">
                    Total Projects
                  </h1>
                  <p className="text-[2rem] text-sm pl-4 font-grandview-bold text-left">
                    {getTotalProjects()}
                  </p>
                </div>
                {/*  */}
                <div className="relative flex flex-col items-left w-full h-full p-1 rounded-[10px] gap-y-3 bg-[#0B2653]
           text-[#fff] lg:w-[100%] px-30 py-8">
                  <h1 className="text-lg font-grandview-medium w-full pl-4">
                    On Going Projects
                  </h1>
                  <p className="text-[2rem] text-sm pl-4 font-grandview-bold text-left">
                    {getOngoingProjects()}
                  </p>
                </div>
                {/*  */}
                <div className="relative flex flex-col items-left h-full p-1 rounded-[10px] gap-y-3 bg-[#0B2653]
           text-[#fff] w-full lg:w-[100%] px-30 py-8">
                  <h1 className="text-lg font-grandview-medium w-full pl-4">
                    Website User Account
                  </h1>
                  <p className="text-[2rem] text-sm pl-4 font-grandview-bold text-left">
                    {getWebUserAccounts()}
                  </p>
                </div>
                {/*  */}
              </div>
            </main>
          </main>
        </>
  )
}

export default Dashboard