// import hooks
import { useEffect, useState } from "react";
// import components
import Sidebar from "../../components/Sidebar";
import Title from "../../components/Title";
// import axios
import axios from "axios";
// import backend configuration
import { BaseUrl, ImageUrl } from "../../config";
// import useNavigate tools
import { useLocation, useNavigate } from "react-router-dom";
// import icons
import { IoIosArrowBack } from "react-icons/io";


export default function MedicationDetails () {
  // States
  const [details, setDetails] = useState({
    name: "",
    description: "",
    img: ""
  });

  // useNavigate
  const nav = useNavigate();

  // useLocation
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const mdeicationId = params.get('medicationId');

    useEffect(() => {
      axios
        .get(`${BaseUrl}/medication/${mdeicationId}`, {
          headers: {
            Accept: "application/json",
          },
        })
        .then((data) => {
          console.log(data.data.data.name);
          setDetails({
            name: data.data.data.name,
            description: data.data.data.info,
            img: data.data.data.image,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }, []);

  return(
    <>
      <Sidebar />

      <div className="page-content px-7 py-5 md:p-5 bg-[#089bab1c]">

        <div className="flex items-center">
          <IoIosArrowBack onClick={() => nav(`/medications`)} className="text-2xl hover:text-[#089bab] duration-300 cursor-pointer mr-3" />
          <Title className="flex-1" label={`${details.name} Details`} />
        </div>

        <div
        style={{ boxShadow: "0px 15px 20px 5px rgba(0, 0, 0, 0.25)" }}
        className="flex flex-col items-center lg:items-start lg:flex-row p-5 bg-white mt-[25px] rounded-2xl justify-between text-base md:text-xl text-center md:text-left">
          <div>
            <div className="flex flex-col md:flex-row mb-[25px]">
              <p className="font-extrabold md:mr-[25px] w-[100px] sm:w-[200px] md:w-[300px]">Medication Name:</p>
              <p className="font-semibold">{details.name}</p>
            </div>
            <div className="flex flex-col md:flex-row">
              <p className="font-extrabold md:mr-[25px] w-[100px] sm:w-[200px] md:w-[300px]">Medication Description:</p>
              <p className="font-semibold">{details.description}</p>
            </div>
          </div>
          <div className="mt-[25px] lg:mt-0 lg:ml-[50px] w-fit lg:w-[500px]">
            <img alt="medication_image" src={`${ImageUrl}${details.img}`} className="rounded-2xl" />
          </div>
        </div>

      </div>
    </>
  );
}