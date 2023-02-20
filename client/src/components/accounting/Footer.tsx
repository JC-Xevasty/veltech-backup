import { Link } from "react-router-dom"

function Footer() {
   return (
      <footer className="flex flex-row justify-between items-center bg-[#0B2653] w-full px-5 py-2.5">
         <span className="text-xs text-[#FFFFFF88]">&copy; 2022 Veltech, All rights reserved.</span>

         <span className="text-xs text-[#FFFFFF88]">
            <Link to="">Terms and Conditions</Link> & <Link to="">Privacy Policy</Link>
         </span>
      </footer>
   )
}

export default Footer