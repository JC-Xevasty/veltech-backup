import { Fragment } from "react"
import { Helmet } from "react-helmet-async"
import { faBoxesPacking, faFileCircleCheck, faHandshakeAngle, faMoneyBillTransfer, faReceipt } from "@fortawesome/free-solid-svg-icons"
import CardLink from "../../components/accounting/CardLink"
import HeaderGroup from "../../components/HeaderGroup"
import { useSelector } from "react-redux"
import { selectApp } from "../../features/app/app"

function Dashboard() {
   const app = useSelector(selectApp)

   return (
      <Fragment>
         <Helmet>
            <title>{`${ app?.appName || "Veltech Inc."} | Dashboard`}</title>
         </Helmet>

         <main className="grow flex flex-col justify-start items-start gap-y-5 w-full h-full px-52 py-10">
            <HeaderGroup text="Dashboard" />

            <div className="grid grid-cols-4 gap-x-8 gap-y-12 w-full">
               <CardLink label="Quotations" icon={ faFileCircleCheck } link="/accounting/quotations" />

               <CardLink label="Projects" icon={ faHandshakeAngle } link="/accounting/projects" />

               <CardLink label="Suppliers" icon={ faBoxesPacking } link="/accounting/suppliers" />

               <CardLink label="Purchase Orders" icon={ faReceipt } link="/accounting/purchase-orders" />

               <CardLink label="Payments" icon={ faMoneyBillTransfer } link="/accounting/payments" />
            </div>
         </main>
      </Fragment>
   )
}

export default Dashboard