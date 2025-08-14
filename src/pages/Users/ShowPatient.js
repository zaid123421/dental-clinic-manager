import { useLocation, useNavigate } from "react-router-dom";
import Title from "../../components/Title";
import { IoIosArrowBack } from "react-icons/io";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { BaseUrl } from "../../config";
import Cookies from "universal-cookie";

export default function ShowEmployee() {
  const [patient, setPatient] = useState(null);

  // useNavigate
  const nav = useNavigate();

  // Cookies
  const cookie = new Cookies();
  const token = cookie.get("token");

  // useLocation
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const patientId = params.get("patientId");

  useEffect(() => {
    axios
      .get(`${BaseUrl}/patient/${patientId}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((data) => {
        setPatient(data.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  console.log(patient);

  return(
    <>
      <Sidebar />
      <div className="page-content p-3 md:py-5 md:p-5 bg-[#089bab1c] overflow-hidden">

        <div className="flex items-center">
          <IoIosArrowBack onClick={() => nav("/users")} className="text-2xl cursor-pointer duration-300 hover:text-[#089bab]"/>
          <Title className="flex-1" label="Patient Infomation" />
        </div>

          <div className="font-semibold text-xl md:p-5">
            <div>
              <label className="mr-5 font-bold">Name:</label>
              <label>{patient?.name}</label>
            </div>
            <div className="mt-5">
              <label className="mr-5 font-bold">Phone:</label>
              <label>{patient?.phone_number}</label>
            </div>
            <div className="mt-5">
              <label className="mr-5 font-bold">Address:</label>
              <label>{patient?.address || "Qudsaya Suburb, Damascus"}</label>
            </div>
            <div className="mt-5">
              <label className="mr-5 font-bold">Gender:</label>
              <label>{patient?.gender}</label>
            </div>
            <div className="mt-5">
              <label className="mr-5 font-bold">Birthdate:</label>
              <label>{patient?.birthdate} ({patient?.age})</label>
            </div>
            <div className="mt-5">
              <label className="mr-5 font-bold">Ban:</label>
              <label>
                {patient?.is_banned === true ? (
                  patient.ban_expired_at === null ? (
                    <span className="text-red-600">Banned Forever</span>
                  ) : (
                    <>
                      <span>
                        Ban Expired At <span className="text-orange-500">{patient?.ban_expired_at?.slice(0, 10)}</span>
                      </span>{" "}
                      <span className="text-blue-600">
                        {patient?.ban_expired_at?.slice(11, 19)}
                      </span>
                    </>
                  )
                ) : (
                  <span style={{ color: "green" }}>Not Banned</span>
                )}
              </label>
            </div>
            <div className="mt-5">
              <label className="mr-5 font-bold">Balance:</label>
              <label className={`${patient?.balance > 0 ? "text-green-500" : patient?.balance < 0 ? "text-red-500" : "text-gray-500"}`}>{patient?.balance.toLocaleString()}</label>
            </div>
            <div className="mt-5">
              <label className="mr-5 font-bold">Job:</label>
              <label >{patient?.job}</label>
            </div>
            <div className="mt-5">
              <label className="mr-5 font-bold">Marital Status:</label>
              <label >{patient?.marital_status || "Single"}</label>
            </div>
          </div>

      </div>
    </>
  );
}