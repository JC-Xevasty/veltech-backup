import { useEffect, useState } from "react"
import { Helmet } from 'react-helmet-async'
import ProfileSidebar from '../../../components/client/ProfileSidebar'
import { User} from "../../../types";
import { useFetchAuthenticatedQuery } from "../../../features/api/user"
import LoadingScreen from '../../misc/LoadingScreen'
import PageError from '../../misc/PageError'
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"

function ViewProfile() {
  const app = useSelector(selectApp)

  const {isLoading,isError,data:userDetails} = useFetchAuthenticatedQuery()

  const [fetchedData,setFetchedData] = useState<User>();

  useEffect(() => {
    if(userDetails!){
       setFetchedData(userDetails)
    }
  },[userDetails])

  return (
    isLoading ? <LoadingScreen/> :
    isError ? <PageError /> :
    <>
      <Helmet>
        <title>{ `${ app?.appName || "Veltech Inc." } | View Profile` }</title>
      </Helmet>
      
      <div className="w-100 px-5 lg:px-10 py-10 lg:py-20">
        <div className="lg:grid grid-cols-10 bg-white items-start">
          <div className="lg:col-span-3 col-span-10 px-lg-10 px-5 flex justify-start items-start">
            <div className="items-center gap-x-4 gap-y-10">
              <ProfileSidebar />
            </div>
          </div>
          <div className="lg:col-span-6 col-span-10 mt-10 lg:mt-0 px-lg-10 px-5 flex flex-col">
            <div className='flex flex-col w-full border-2 border-[#0B2653]'>
                <p className='w-full text-white p-3 font-grandview-bold bg-[#0B2653]'>Personal Details</p>
                <div className='flex flex-col p-4'>
                  <span className='text-xl font-grandview-bold text-[#0B2653]'>Account Name</span>
                  <span className='text-lg mb-3'>{fetchedData?.firstName} {fetchedData?.middleName} {fetchedData?.lastName}</span>
                  <span className='text-xl font-grandview-bold text-[#0B2653]'>Company Name</span>
                  <span className='text-lg mb-3'>{fetchedData?.companyName}</span>
                  <span className='text-xl font-grandview-bold text-[#0B2653]'>Contact Number</span>
                  <span className='text-lg mb-3'>{fetchedData?.contactNumber}</span>
                  <span className='text-xl font-grandview-bold text-[#0B2653]'>Email Address</span>
                  <span className='text-lg'>{fetchedData?.emailAddress}</span>
                </div>
            </div>
          </div>
        </div>
      </div>
      </>
  )
}

export default ViewProfile