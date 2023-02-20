import { Outlet } from "react-router-dom"

import Navbar from "../client/Navbar"
import Footer from "../client/Footer"

function ClientLayout() {
  return (
    <div className="relative flex flex-col justify-between min-h-screen">
      <Navbar />

      <Outlet />

      <Footer />
    </div>
  )
}

export default ClientLayout