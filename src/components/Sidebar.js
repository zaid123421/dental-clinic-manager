import avatar from "../assets/avatar.webp";
import { MdDashboard } from "react-icons/md";
import { FaBookMedical } from "react-icons/fa";
import { FaNotesMedical } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { RiMedicineBottleFill } from "react-icons/ri";
import { FaArrowRight } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const [responsive, setResponsive] = useState(false);

  function changeSize () {
    setResponsive(!responsive);
  }

  return(
    <div className={`${responsive ? `w-[60px]` : 'w-[250px]'} text-white bg-[#089bab] h-screen flex flex-col items-center p-5 font-bold relative transition-all duration-300`}>
      <button onClick={changeSize} className="md:hidden absolute right-[-15px] top-[20px] text-white bg-[#089bab] w-[20px] h-[50px] rounded-br-lg rounded-tr-lg flex justify-end items-center px-1 "><FaArrowRight className="text-sm" /></button>
      <div className={`flex flex-col items-center ${!responsive ? 'block' : 'hidden'}`}>
        <img className="w-[75px] h-[75px] md:w-[100px] md:h-[100px] rounded-[50%]" src={avatar} alt="profile_picture"></img>
        <h1 className="text-[16px] md:text-[20px] font-extrabold my-5">Zaid Alshamaa</h1>
      </div>
      <ul className="text-[14px] text-center md:text-[18px]">
        <NavLink to="/overview" className={({ isActive }) => `p-2 rounded-md cursor-pointer my-2 flex items-center duration-[0.3s] ${
        isActive ? 'text-[#089bab] bg-white' : 'hover:text-[#089bab] hover:bg-white'}`}>
          <MdDashboard className={`${responsive ? '' : 'mr-3'} text-lg md:text-2xl`}/>
          <span className={`${responsive ? 'hidden' : 'inline'}`}>Overview</span>
        </NavLink>
        <NavLink to="/medications" className={({ isActive }) => `p-2 rounded-md cursor-pointer my-2 flex items-center duration-[0.3s] ${
        isActive ? 'text-[#089bab] bg-white' : 'hover:text-[#089bab] hover:bg-white'}`}>
          <RiMedicineBottleFill className={`${responsive ? '' : 'mr-3'} text-lg md:text-2xl`}/>
          <span className={`${responsive ? 'hidden' : 'block'}`}>Medications</span>
        </NavLink>
        <NavLink to="/" className={({ isActive }) => `p-2 rounded-md cursor-pointer my-2 flex items-center duration-[0.3s] ${
        isActive ? 'text-[#089bab] bg-white' : 'hover:text-[#089bab] hover:bg-white'}
        ${responsive ? 'w-full' : 'min-w-[175px]'}`}>
          <FaBookMedical className={`${responsive ? '' : 'mr-3'} text-lg md:text-2xl`}/>
          <span className={`${responsive ? 'hidden' : 'block'}`}>Medications Plans</span>
        </NavLink>
        <NavLink to="/" className={({ isActive }) => `p-2 rounded-md cursor-pointer my-2 flex items-center duration-[0.3s] ${
        isActive ? 'text-[#089bab] bg-white' : 'hover:text-[#089bab] hover:bg-white'}`}>
          <FaNotesMedical className={`${responsive ? '' : 'mr-3'} text-lg md:text-2xl`}/>
          <span className={`${responsive ? 'hidden' : 'block'}`}>Treatment Notes</span>
        </NavLink>
        <NavLink to="/" className="hover:bg-white hover:text-[#089bab] p-2 rounded-md cursor-pointer my-2 flex items-center duration-[0.3s]">
          <RiLogoutBoxRLine className={`${responsive ? '' : 'mr-3'} text-lg md:text-2xl`}/>
          <span className={`${responsive ? 'hidden' : 'block'}`}>Logout</span>
        </NavLink>
      </ul>
      <div className="hover:text-[#089bab] hover:bg-white p-2 duration-[0.3s] rounded-md cursor-pointer absolute bottom-[15px] flex items-center">
          <TbWorld className={`${responsive ? '' : 'mr-3'} text-lg md:text-2xl`} />
          <span className={`${responsive ? 'hidden' : 'block'}`}>Arabic</span>
      </div>
    </div>
  );
}