// import components
import Link from "./Link";
import Loading from "./Loading";
// import images
import avatar from "../assets/avatar.webp";
import UnBan from "../assets/UnBan.jpg";
// import icons
import { FaBookMedical, FaNotesMedical, FaArrowRight, FaUsers } from "react-icons/fa";
import { RiLogoutBoxRLine, RiMedicineBottleFill } from "react-icons/ri";
import { MdDashboard } from "react-icons/md";
import { TbWorld } from "react-icons/tb";
import { FaBriefcaseMedical } from "react-icons/fa6";
// Hooks
import { useState } from "react";
// Cookies
import Cookies from "universal-cookie";
// Axios Library
import axios from "axios";
// Commuunicating With Backend
import { BaseUrl } from "../config";
// react router dom tool
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  // States
    // Loading Spinner To Communicating With Backend
    const [isLoading, setIsLoading] = useState(false);
    // To Make The Sidebar Responsive In Small Screens
    const [responsive, setResponsive] = useState(true);
    // To Show Confirm Logout Box
    const [logutConfirmBox, setLogoutConfirmBox] = useState(false);

  // useNavigate
  const nav = useNavigate();

  // Cookies
  const cookie = new Cookies();
  // Get The Username And Token That Stored In The Browser
  const username = cookie.get("username");
  const token = cookie.get("token");

  // Functions

    // To Send Login From To The backend
    async function handleLogout() {
      setIsLoading(true);
      console.log(token);
      try {
        await axios.get(`${BaseUrl}/logout`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        cookie.remove("username");
        cookie.remove("token");
        nav("/");
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
        setLogoutConfirmBox(false);
      }
    }

  return(
    <>

      <div className={`text-sm md:text-lg ${responsive ? `w-[60px]` : 'w-[250px]'} md:w-[250px] text-white bg-[#089bab] h-screen flex flex-col items-center p-5 font-bold fixed z-10 transition-all duration-300`}>
        <button onClick={() => setResponsive(!responsive)} className="md:hidden absolute right-[-15px] top-[10px] text-white bg-[#089bab] w-[20px] h-[50px] rounded-br-lg rounded-tr-lg flex justify-end items-center px-1 "><FaArrowRight className="text-sm" /></button>
        <div className={`flex flex-col items-center md:flex mb-2 ${responsive ? 'hidden' : 'flex'}`}>
          <img className="w-[75px] h-[75px] md:w-[100px] md:h-[100px] rounded-[50%]" src={avatar} alt="profile_picture"></img>
          <h1 className="text-[16px] md:text-[20px] font-extrabold mt-5">
            {username}
          </h1>
          <span className="text-xs text-gray-200">The Manager</span>
        </div>
        <ul>
          <Link to="/overview" label="Overview" responsive={responsive} icon= {<MdDashboard className={`md:mr-3 ${responsive ? '' : 'mr-3'} text-lg md:text-2xl`}/>}/>
          <Link to="/users" label="Users" responsive={responsive} icon= {<FaUsers className={`md:mr-3 ${responsive ? '' : 'mr-3'} text-lg md:text-2xl`}/>}/>
          <Link to="/medications" label="Medications" responsive={responsive} icon= {<RiMedicineBottleFill className={`md:mr-3 ${responsive ? '' : 'mr-3'} text-lg md:text-2xl`}/>}/>
          <Link to="/medications-plans" label="Medications Plans" responsive={responsive} icon= {<FaBookMedical className={`md:mr-3 ${responsive ? '' : 'mr-3'} text-lg md:text-2xl`}/>}/>
          <Link to="/treatments-plans" label="Treatments Plans" responsive={responsive} icon= {<FaBriefcaseMedical className={`md:mr-3 ${responsive ? '' : 'mr-3'} text-lg md:text-2xl`}/>}/>
          <Link to="/treatments-notes" label="Treatments Notes" responsive={responsive} icon= {<FaNotesMedical className={`md:mr-3 ${responsive ? '' : 'mr-3'} text-lg md:text-2xl`}/>}/>
          <button
          className={`${responsive ? 'w-full' : 'w-[200px]'} md:w-[220px] p-2 rounded-md cursor-pointer my-2 flex items-center duration-[0.3s] hover:bg-white hover:text-[#089bab]`}
          onClick={() => setLogoutConfirmBox(true)}
          >
            <RiLogoutBoxRLine className={`md:mr-3 ${responsive ? '' : 'mr-3'} text-lg md:text-2xl`}/>
            <span className={`${responsive ? "hidden" : "block"} md:block`}>Logout</span>
          </button>
        </ul>
        <div className="hover:text-[#089bab] hover:bg-white p-2 duration-[0.3s] rounded-md cursor-pointer absolute bottom-[15px] flex items-center">
            <TbWorld className={`md:mr-3 ${responsive ? '' : 'mr-3'} text-lg md:text-2xl`} />
            <span className={`md:block ${responsive ? 'hidden' : 'block'}`}>Arabic</span>
        </div>
      </div>

      {/* Show Logout Confirm Box */}
      {logutConfirmBox && (
        <div className="font-semibold fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-2">
          <div className="bg-white rounded-xl p-5 text-xl flex flex-col items-center shadow-xl w-[400px] overflow-hidden">
            <img alt="image_delete" src={UnBan} className="w-[250px]" />
            <p className="my-5 text-center">
              Do You Really Want To Logout ?
            </p>
            <div className="flex justify-center w-full">
              <button
                onClick={() => setLogoutConfirmBox(false)}
                className="w-[85px] bg-[#9e9e9e] border-2 border-[#9e9e9e] p-1 rounded-xl text-white hover:bg-transparent hover:text-black duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleLogout()}
                className="w-[85px] bg-[#DD1015] border-2 border-[#DD1015] p-1 rounded-xl text-white hover:bg-transparent hover:text-black duration-300 ml-7"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Spinner When Communicating With Backend */}
      {isLoading && <Loading />}

    </>
  );
}