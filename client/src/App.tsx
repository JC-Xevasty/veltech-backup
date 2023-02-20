import { useEffect } from "react"
import { Helmet } from "react-helmet-async"
import { Route, Routes } from "react-router-dom"
import { Bounce, ToastContainer } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import { useFetchAuthenticatedQuery } from "./features/api/user"
import { useFetchApplicationQuery } from "./features/api/application.api"
import { authenticateUser } from "./features/auth/auth"
import { registerApp } from "./features/app/app"

import LoadingScreen from "./pages/misc/LoadingScreen"
import PageError from "./pages/misc/PageError"
import PageNotFound from "./pages/misc/PageNotFound"

import ClientAuthMiddleware from "./components/middlewares/ClientAuthMiddleware"
import ClientLogin from "./pages/client/auth/Login"
import ClientRegistration from "./pages/client/auth/Registration"
import Verification from "./pages/client/auth/Verification"
import ChangeEmailAddress from "./pages/client/auth/ChangeEmailAddress"
import AccountVerified from "./pages/client/auth/AccountVerified"
import ForgotPassword from "./pages/client/auth/ForgotPassword"
import ResetCode from "./pages/client/auth/ResetCode"
import ChangePassword from "./pages/client/auth/ChangePassword"

import ClientMiddleware from "./components/middlewares/ClientMiddleware"
import ClientLayout from "./components/layouts/ClientLayout"
import Home from "./pages/client/home/Home"
import Quotation from "./pages/client/Quotation"
import Notification from "./pages/client/Notification"
import ClientQuotations from "./pages/client/quotations/ClientQuotations"
import ClientViewQuotations from "./pages/client/quotations/ClientViewQuotations"
import ClientProjects from "./pages/client/contracts/ClientProjects"
import ClientViewProject from "./pages/client/contracts/ClientViewProject"
import AddPayment from "./pages/client/contracts/AddPayment"
import ProfileChangePassword from "./pages/client/profile/ProfileChangePassword"
import ViewProfile from "./pages/client/profile/ViewProfile"
import EditProfile from "./pages/client/profile/EditProfile"


import AdminAuthMiddleware from "./components/middlewares/AdminAuthMiddleware"
import AdminLogin from "./pages/admin/auth/Login"

import AdminMiddleware from "./components/middlewares/AdminMiddleware"
import AdminLayout from "./components/layouts/AdminLayout"
import Dashboard from "./pages/admin/Dashboard"
import UserManagement from "./pages/admin/management/users/UserManagement"
import CreateUser from "./pages/admin/management/users/CreateUser"
import EditUser from "./pages/admin/management/users/EditUser"
import AdminQuotation from "./pages/admin/quotation/Quotation"
import AdminViewQuotation from "./pages/admin/quotation/ViewQuotation"
import AdminProject from "./pages/admin/project/Project"
import ViewProject from "./pages/admin/project/ViewProject"
import AdminClients from "./pages/admin/clients/Clients"
import ViewClient from "./pages/admin/clients/ViewClient"
import AdminSuppliers from "./pages/admin/accounting/suppliers/Suppliers"
import AdminViewSuppliers from "./pages/admin/accounting/suppliers/ViewSupplier"
import AdminPurchaseOrders from "./pages/admin/accounting/purchase_orders/PurchaseOrders"
import AdminViewPurchaseOrders from "./pages/admin/accounting/purchase_orders/ViewPurchaseOrder"
import AdminPayments from "./pages/admin/accounting/payments/Payments"
import AdminCreatePayment from "./pages/admin/accounting/payments/CreatePayment"
import ApplicationSettings from "./pages/admin/management/ApplicationSettings"
import Carousel from "./pages/admin/management/carousel/Carousel"
import CreateCarousel from "./pages/admin/management/carousel/CreateCarousel"
import EditCarousel from "./pages/admin/management/carousel/EditCarousel"
import ActivityLogs from "./pages/admin/ActivityLogs"

import ViewQuotation from "./pages/admin/quotation/ViewQuotation"
import TermsConditions from "./pages/client/TermsConditions"
import PrivacyPolicy from "./pages/client/PrivacyPolicy"

import AccountingLayout from "./components/layouts/AccountingLayout"

import AccountingAuthMiddleware from "./components/middlewares/AccountingAuthMiddleware"
import AccountingLogin from "./pages/accounting/auth/Login"

import AccountingMiddleware from "./components/middlewares/AccountingMiddleware"
import AccountingDashboard from "./pages/accounting/Dashboard"
import AccountingQuotations from "./pages/accounting/quotations/Quotations"
import AccountingCreateQuotation from "./pages/accounting/quotations/CreateQuotation"
import AccountingViewQuotation from "./pages/accounting/quotations/ViewQuotation"
import AccountingProjects from "./pages/accounting/projects/Projects"
import AccountingViewProject from "./pages/accounting/projects/ViewProject"
import AccountingPurchaseOrders from "./pages/accounting/purchase_orders/PurchaseOrders"
import AccountingCreatePurchaseOrder from "./pages/accounting/purchase_orders/CreatePurchaseOrder"
import AccountingEditPurchaseOrder from "./pages/accounting/purchase_orders/EditPurchaseOrder"
import AccountingViewPurchaseOrder from "./pages/accounting/purchase_orders/ViewPurchaseOrder"
import AccountingSuppliers from "./pages/accounting/suppliers/Suppliers"
import AccountingCreateSupplier from "./pages/accounting/suppliers/CreateSupplier"
import AccountingEditSupplier from "./pages/accounting/suppliers/EditSupplier"
import AccountingViewSupplier from "./pages/accounting/suppliers/ViewSupplier"
import AccountingPayments from "./pages/accounting/payments/Payments"
import AccountingCreatePayment from "./pages/accounting/payments/CreatePayment" 
import VerifiedMiddleware from "./components/middlewares/VerifiedMiddleware"
import Inquiries from "./pages/admin/contacts/Inquiries"
import ViewInquiry from "./pages/admin/contacts/ViewInquiry"

import { selectApp } from "./features/app/app"

function App() {
  const { isLoading: authenticatedUserLoading, isError: authenticatedUserError, data: authenticatedUser } = useFetchAuthenticatedQuery()

  const { isLoading: applicationLoading, isError: applicationError, data: application } = useFetchApplicationQuery()

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(authenticateUser({ user: authenticatedUser?.id ? authenticatedUser : null }))
    dispatch(registerApp({ app: application }))
  }, [dispatch, authenticatedUser, application])

  const app = useSelector(selectApp)

  return (
    authenticatedUserLoading || applicationLoading ? <LoadingScreen /> :
    authenticatedUserError || applicationError ? <PageError /> :
    <>
      <Helmet>
        <title>{ app?.appName }</title>
        <body className="overflow-x-hidden antialiased font-grandview" />
        <link id="favicon" rel="icon" href={ app?.faviconPath ? `${process.env.REACT_APP_API_URL}/app/${ app.faviconPath }` : `${process.env.REACT_APP_API_URL}/assets/favicon.png` } type="image/x-icon" />
      </Helmet>

      <Routes>
        <Route element={ <ClientLayout /> }>
          <Route path="" element={ <Home /> } />
          <Route path="quotation" element={ <Quotation /> } />
          <Route path="terms-and-conditions" element={ <TermsConditions />}  />
          <Route path="privacy-policy" element={ <PrivacyPolicy />}  />
          <Route path="forgot-password" element={ <ForgotPassword />}  />
          <Route path="reset-code" element={ <ResetCode />}  />
          <Route path="change-password" element={ <ChangePassword />}  />
          <Route path="verify" element={ <Verification /> } />
          <Route path="change-email-address" element={ <ChangeEmailAddress />}  />
          <Route path="verify/id=:id/email-address=:emailAddress/token=:verifyToken" element={ <AccountVerified /> } />
        </Route>

        <Route element={ <ClientMiddleware /> }>
          <Route element={ <VerifiedMiddleware /> }>
            <Route element={ <ClientLayout /> }>
              <Route path="account">
                <Route path="" element={ <ViewProfile /> }></Route>
                <Route path="edit" element={ <EditProfile /> }></Route>
                <Route path="change-password" element={ <ProfileChangePassword /> }></Route>
              </Route>
              <Route path="notification" element={ <Notification />}  />
              <Route path="my-quotations">
                <Route path="" element={ <ClientQuotations /> }></Route>
                <Route path="view/id=:id" element={ <ClientViewQuotations /> }></Route>
              </Route>
              <Route path="my-projects">
                <Route path="" element={ <ClientProjects /> }></Route>
                <Route path="view/id=:id" element={ <ClientViewProject /> }></Route>
                <Route path="payment/id=:id" element={ <AddPayment /> }></Route>
              </Route>
            </Route>
          </Route>
        </Route>

        <Route element={ <ClientAuthMiddleware /> }>
          <Route element={ <ClientLayout /> }>
            <Route path="login" element={ <ClientLogin /> } />
            <Route path="registration" element={ <ClientRegistration /> } />
          </Route>
        </Route>

        <Route element={ <AdminMiddleware /> }>
          <Route path="admin" element={ <AdminLayout /> }>
            <Route path="dashboard" element={ <Dashboard /> } />
            <Route path="activity-logs" element={ <ActivityLogs /> }></Route>
            <Route path="quotation">
              <Route path="" element={<AdminQuotation />}></Route>
              <Route path=":id" element={<AdminViewQuotation />}></Route>
            </Route>
            <Route path="project">
              <Route path="" element={<AdminProject />}></Route>
              <Route path=":id" element={<ViewProject />}></Route>
            </Route>
            <Route path="clients">
              <Route path="" element={ <AdminClients /> }></Route>
              <Route path=":id" element={ <ViewClient /> }></Route>
            </Route>
            <Route path="accounting">
              <Route path="suppliers">
                <Route path="" element={ <AdminSuppliers /> }></Route>
                <Route path=":id" element={ <AdminViewSuppliers /> }></Route>
              </Route>
              <Route path="purchase-orders">
                <Route path="" element={ <AdminPurchaseOrders /> }></Route>
                <Route path=":poNo" element={ <AdminViewPurchaseOrders /> }></Route>
              </Route>
              <Route path="payments">
                <Route path="" element={ <AdminPayments /> } />
                <Route path="create" element={ <AdminCreatePayment /> } />
              </Route>
            </Route>
            <Route path="management">
              <Route path="users">
                <Route path="" element={ <UserManagement /> } />
                <Route path="create" element={ <CreateUser /> } />
                <Route path="id=:id/edit" element={ <EditUser /> } />
              </Route>
              <Route path="carousel">
                <Route path="" element={ <Carousel /> }></Route>
                <Route path=":id/edit" element={ <EditCarousel /> }></Route>
                <Route path="create" element={ <CreateCarousel /> }></Route>
              </Route>
              <Route path="gallery">
              </Route>
              <Route path="application-settings" element={ <ApplicationSettings /> }></Route>
            </Route>

            <Route path="inquiries">
              <Route path="" element={ <Inquiries /> } />
              <Route path="id=:id" element={ <ViewInquiry /> } />
            </Route>
          </Route>
        </Route>

        <Route path="admin" element={ <AdminAuthMiddleware /> }>
          <Route path="login" element={ <AdminLogin /> } />
        </Route>
 
        <Route element={ <AccountingMiddleware /> }>
          <Route path="accounting" element={ <AccountingLayout hasNavbar /> }>
            <Route path="dashboard" element={ <AccountingDashboard /> } />

            <Route path="quotations">
              <Route path="" element={ <AccountingQuotations /> } />
              <Route path="create" element={ <AccountingCreateQuotation /> } />
              <Route path=":id" element={ <AccountingViewQuotation /> } />
            </Route>

            <Route path="projects">
              <Route path="" element={ <AccountingProjects /> } />
              <Route path=":id" element={ <AccountingViewProject /> } />
            </Route>

            <Route path="purchase-orders">
              <Route path="" element={ <AccountingPurchaseOrders /> } />
              <Route path="create" element={ <AccountingCreatePurchaseOrder /> } />
              <Route path=":poNo" element={ <AccountingViewPurchaseOrder /> } />
              <Route path=":poNo/edit" element={ <AccountingEditPurchaseOrder /> } />
            </Route>

            <Route path="suppliers">
              <Route path="" element={ <AccountingSuppliers /> } />
              <Route path="create" element={ <AccountingCreateSupplier /> } />
              <Route path=":id" element={ <AccountingViewSupplier /> } />
              <Route path=":id/edit" element={ <AccountingEditSupplier /> } />
            </Route>
      
            <Route path="payments">
              <Route path="" element={ <AccountingPayments /> } />
              <Route path="create" element={ <AccountingCreatePayment /> } />
            </Route>
          </Route>
        </Route>

        <Route path="accounting" element={ <AccountingAuthMiddleware /> }>
          <Route element={ <AccountingLayout /> }>
            <Route path="login" element={ <AccountingLogin /> } />
          </Route>
        </Route>

        <Route path="*" element={ <PageNotFound /> } />
      </Routes>

      <ToastContainer
        position="top-right"
        limit={ 2 }
        newestOnTop
        pauseOnHover
        autoClose={ 3000 }
        closeOnClick
        closeButton={ false }
        draggable
        draggableDirection="x"
        transition={ Bounce }
      />
    </>
  )
}

export default App