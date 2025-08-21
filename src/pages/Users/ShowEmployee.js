import { useLocation, useNavigate } from "react-router-dom";
import Title from "../../components/Title";
import { IoIosArrowBack } from "react-icons/io";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { BaseUrl, ImageUrl } from "../../config";
import Cookies from "universal-cookie";
import male from "../../assets/avatar.webp";

export default function ShowEmployee() {
  const [employee, setEmployee] = useState(null);

  // useNavigate
  const nav = useNavigate();

  // Cookies
  const cookie = new Cookies();
  const token = cookie.get("token");

  // useLocation
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const employeeId = params.get("employeeId");

  useEffect(() => {
    axios
      .get(`${BaseUrl}/employee/${employeeId}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((data) => {
        setEmployee(data.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return(
    <>
      <Sidebar />
      <div className="page-content p-3 md:py-5 md:p-5 bg-[#089bab1c] overflow-hidden">

        <div className="flex items-center">
          <IoIosArrowBack onClick={() => nav("/users")} className="text-2xl cursor-pointer duration-300 hover:text-[#089bab]"/>
          <Title className="flex-1" label="Employee Infomation" />
        </div>

        <div className="flex flex-col-reverse justify-center lg:flex-row">

          <div className="font-semibold text-xl md:p-5 w-2/3">
            <div>
              <label className="mr-5 font-bold">Name:</label>
              <label>{employee?.name}</label>
            </div>
            <div className="mt-5">
              <label className="mr-5 font-bold">Phone:</label>
              <label>{employee?.phone_number}</label>
            </div>
            <div className="mt-5">
              <label className="mr-5 font-bold">Address:</label>
              <label className="text-center">{employee?.address || "No Address"}</label>
            </div>
            <div className="mt-5">
              <label className="mr-5 font-bold">Gender:</label>
              <label>{employee?.gender}</label>
            </div>
            <div className="mt-5">
              <label className="mr-5 font-bold">Birthdate:</label>
              <label>{employee?.birthdate} ({employee?.age})</label>
            </div>
            <div className="mt-5">
              <label className="mr-5 font-bold">SSN:</label>
              <label>
                {employee?.ssn}
              </label>
            </div>
            <div className="mt-5">
              <label className="mr-5 font-bold">Ban:</label>
              <label>
                {employee?.is_banned === true ? (
                  employee.ban_expired_at === null ? (
                    <span className="text-red-600">Banned Forever</span>
                  ) : (
                    <>
                      <span>
                        Ban Expired At <span className="text-orange-500">{employee?.ban_expired_at?.slice(0, 10)}</span>
                      </span>{" "}
                      <span className="text-blue-600">
                        {employee?.ban_expired_at?.slice(11, 19)}
                      </span>
                    </>
                  )
                ) : (
                  <span style={{ color: "green" }}>Not Banned</span>
                )}
              </label>
            </div>
            <div className="mt-5 flex flex-col">
              <label className="mr-5 font-bold">Roles:</label>
              <label className="flex flex-col">
                {employee?.roles?.map((role, index) => (
                  <div className="mt-2">
                    <span key={index} className="text-center bg-gray-300 w-[150px] px-4 py-1 rounded-xl mr-2 text-lg px-5 block">
                      {role}
                    </span>
                  </div>
                ))}
              </label>
            </div>
          </div>

          <div className="flex justify-center mt-5 w-full mb-5 md:mb-0">
            <img
            className="w-[200px] h-[200px] lg:w-[350px] lg:h-[350px] bg-red-500 rounded-full"
            alt="employee_image"
            src={employee?.image ? ImageUrl + employee?.image : employee?.gender === "male" ? male : "female"}
            />
          </div>

        </div>

      </div>
    </>
  );
}