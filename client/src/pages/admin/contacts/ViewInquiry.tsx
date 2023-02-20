import { useEffect, Fragment } from "react"
import { Helmet } from "react-helmet-async"
import { useOutletContext, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useFetchInquiryQuery } from "../../../features/api/inquiry.api"

import HeaderGroup from "../../../components/HeaderGroup"
import InputGroup from "../../../components/accounting/InputGroup"
import LoadingScreen from "../../misc/LoadingScreen"
import PageError from "../../misc/PageError"
import { OutletContext } from "../../../types"
import TextGroup from "../../../components/accounting/TextGroup"
import { useSelector } from "react-redux"
import { selectApp } from "../../../features/app/app"

interface FieldValues {
  [key: string]: string
}

function ViewInquiry() {
   const app = useSelector(selectApp)

  const { id } = useParams() as { id: string }

  const { offset } = useOutletContext() as OutletContext

  const { isLoading: inquiryLoading, isError: inquiryError, data: inquiry } = useFetchInquiryQuery({ id })

  const { register, reset } = useForm<FieldValues>({})

  useEffect(() => {
    if (inquiry) {
      const { fullName, companyName, emailAddress, message } = inquiry

      reset({ fullName, companyName, emailAddress, message })
    }
  }, [inquiry, reset])

  return (
    inquiryLoading ? <LoadingScreen /> :
    inquiryError ? <PageError /> :
    <Fragment>
      <Helmet>
        <title>{`${app?.appName || "Veltech Inc."} | View Inquiry #${ inquiry?.id.split("-")[0] }`}</title>
      </Helmet>

      <main className={ `${ offset }` }>
         <main className="grow flex flex-col justify-start items-start gap-y-5 px-5 w-full h-full">
            <HeaderGroup text={ `View Inquiry #${ inquiry?.id.split("-")[0] }` } link="/admin/inquiries" />

            <form className="flex flex-col gap-y-3 w-full">
               <div className="rounded-sm bg-[#F3F1F1] w-full py-1.5 px-3">
                  Inquiry Details
               </div>

               <div className="grid grid-cols-4 gap-x-5 py-5">
                  <div className="flex flex-col w-full gap-y-3">
                     <InputGroup id="client-name" label="Client Name:" { ...register("fullName") } readOnly />
                  </div>

                  <div className="flex flex-col w-full gap-y-3">
                     <InputGroup id="company-name" label="Company Name:" { ...register("companyName") } readOnly />
                  </div>

                  <div className="flex flex-col w-full gap-y-3">
                     <InputGroup id="email-address" label="E-mail Address:" { ...register("emailAddress") } readOnly />
                  </div>
               </div>

               <TextGroup id="message" label="Message:" { ...register("message") } rows={ 8 } readOnly />
            </form>
         </main>
      </main>
    </Fragment>
  )
}

export default ViewInquiry