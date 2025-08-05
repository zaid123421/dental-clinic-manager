// import icons
import { FaBookMedical, FaNotesMedical, FaArrowRight, FaUsers } from "react-icons/fa";
import { RiLogoutBoxRLine, RiMedicineBottleFill } from "react-icons/ri";
import { MdDashboard } from "react-icons/md";
import { TbWorld } from "react-icons/tb";
import { useState } from "react";
import { FaBriefcaseMedical } from "react-icons/fa6";

// import components
import Link from "./Link";
// import image
import avatar from "../assets/avatar.webp";
import Cookies from "universal-cookie";

export default function Sidebar() {
  // States
  const [responsive, setResponsive] = useState(true);

  // Cookies
  const cookie = new Cookies();
  const username = cookie.get("username");

  // Functions
  function capitalizeName(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return(
    <div className={`text-sm md:text-lg ${responsive ? `w-[60px]` : 'w-[250px]'} md:w-[250px] text-white bg-[#089bab] h-screen flex flex-col items-center p-5 font-bold fixed z-10 transition-all duration-300`}>
      <button onClick={() => setResponsive(!responsive)} className="md:hidden absolute right-[-15px] top-[10px] text-white bg-[#089bab] w-[20px] h-[50px] rounded-br-lg rounded-tr-lg flex justify-end items-center px-1 "><FaArrowRight className="text-sm" /></button>
      <div className={`flex flex-col items-center md:flex mb-2 ${responsive ? 'hidden' : 'flex'}`}>
        <img className="w-[75px] h-[75px] md:w-[100px] md:h-[100px] rounded-[50%]" src={avatar} alt="profile_picture"></img>
        <h1 className="text-[16px] md:text-[20px] font-extrabold mt-5">
          {/* {capitalizeName(username)} */}
        </h1>
        <span className="text-xs text-gray-200">The Manager</span>
      </div>
      <ul>
        <Link to="/overview" label="Overview" responsive={responsive} icon= {<MdDashboard className={`md:mr-3 ${responsive ? '' : 'mr-3'} text-lg md:text-2xl`}/>}/>
        <Link to="/medications" label="Medications" responsive={responsive} icon= {<RiMedicineBottleFill className={`md:mr-3 ${responsive ? '' : 'mr-3'} text-lg md:text-2xl`}/>}/>
        <Link to="/medications-plans" label="Medications Plans" responsive={responsive} icon= {<FaBookMedical className={`md:mr-3 ${responsive ? '' : 'mr-3'} text-lg md:text-2xl`}/>}/>
        <Link to="/treatments-plans" label="Treatments Plans" responsive={responsive} icon= {<FaBriefcaseMedical className={`md:mr-3 ${responsive ? '' : 'mr-3'} text-lg md:text-2xl`}/>}/>
        <Link to="/treatments-notes" label="Treatments Notes" responsive={responsive} icon= {<FaNotesMedical className={`md:mr-3 ${responsive ? '' : 'mr-3'} text-lg md:text-2xl`}/>}/>
        <Link to="/users" label="Users" responsive={responsive} icon= {<FaUsers  className={`md:mr-3 ${responsive ? '' : 'mr-3'} text-lg md:text-2xl`}/>}/>
        <Link to="/" label="Logout" responsive={responsive} icon= {<RiLogoutBoxRLine className={`md:mr-3 ${responsive ? '' : 'mr-3'} text-lg md:text-2xl`}/>}/>
      </ul>
      <div className="hover:text-[#089bab] hover:bg-white p-2 duration-[0.3s] rounded-md cursor-pointer absolute bottom-[15px] flex items-center">
          <TbWorld className={`md:mr-3 ${responsive ? '' : 'mr-3'} text-lg md:text-2xl`} />
          <span className={`md:block ${responsive ? 'hidden' : 'block'}`}>Arabic</span>
      </div>
    </div>
  );
}