import { useState } from "react"
import { Outlet } from "react-router-dom"
import Navbar from "../sidebar/Navbar"
import Sidebar from "../sidebar/Sidebar"

function AdminLayout() {
  const [sidebarIsToggled, setSidebarIsToggled] = useState(true)

  return (
    <>
      <div className="flex flex-col">
        <Sidebar isToggled={ sidebarIsToggled } setToggled={ setSidebarIsToggled }/>

        <Navbar />
        
        <Outlet context={ { offset: "pl-[320px] mt-[100px]" } } />
      </div>
    </>
  )
}

export default AdminLayout