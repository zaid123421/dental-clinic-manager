import avatar from "../assets/avatar.webp";
import { MdDashboard } from "react-icons/md";
import { FaBookMedical } from "react-icons/fa";
import { FaNotesMedical } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { RiMedicineBottleFill } from "react-icons/ri";
import { FaArrowRight } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import { useState } from "react";
import Link from "./Link";

export default function Sidebar() {
  const [responsive, setResponsive] = useState(true);

  function changeSize () {
    setResponsive(!responsive);
  }

  return(
    <div className={`text-sm md:text-lg ${responsive ? `w-[60px]` : 'w-[250px]'} md:w-[250px] text-white bg-[#089bab] h-screen flex flex-col items-center p-5 font-bold fixed z-10 transition-all duration-300`}>
      <button onClick={changeSize} className="md:hidden absolute right-[-15px] top-[20px] text-white bg-[#089bab] w-[20px] h-[50px] rounded-br-lg rounded-tr-lg flex justify-end items-center px-1 "><FaArrowRight className="text-sm" /></button>
      <div className={`flex flex-col items-center md:flex ${responsive ? 'hidden' : 'flex'}`}>
        <img className="w-[75px] h-[75px] md:w-[100px] md:h-[100px] rounded-[50%]" src={avatar} alt="profile_picture"></img>
        <h1 className="text-[16px] md:text-[20px] font-extrabold my-5">Zaid Alshamaa</h1>
      </div>
      <ul>
        <Link to="/overview" label="Overview" responsive={responsive} icon= {<MdDashboard className={`md:mr-3 ${responsive ? '' : 'mr-3'} text-lg md:text-2xl`}/>}/>
        <Link to="/medications" label="Medications" responsive={responsive} icon= {<RiMedicineBottleFill className={`md:mr-3 ${responsive ? '' : 'mr-3'} text-lg md:text-2xl`}/>}/>
        <Link to="/" label="Medications Plans" responsive={responsive} icon= {<FaBookMedical className={`md:mr-3 ${responsive ? '' : 'mr-3'} text-lg md:text-2xl`}/>}/>
        <Link to="/treatments-notes" label="Treatment Notes" responsive={responsive} icon= {<FaNotesMedical className={`md:mr-3 ${responsive ? '' : 'mr-3'} text-lg md:text-2xl`}/>}/>
        <Link to="/" label="Logout" responsive={responsive} icon= {<RiLogoutBoxRLine className={`md:mr-3 ${responsive ? '' : 'mr-3'} text-lg md:text-2xl`}/>}/>
      </ul>
      <div className="hover:text-[#089bab] hover:bg-white p-2 duration-[0.3s] rounded-md cursor-pointer absolute bottom-[15px] flex items-center">
          <TbWorld className={`md:mr-3 ${responsive ? '' : 'mr-3'} text-lg md:text-2xl`} />
          <span className={`md:block ${responsive ? 'hidden' : 'block'}`}>Arabic</span>
      </div>
    </div>
  );
}