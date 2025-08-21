// Components
import Sidebar from "../../components/Sidebar";
import Title from "../../components/Title";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
// Icons
import { IoIosArrowBack } from "react-icons/io";
// Images
import successImage from "../../assets/success.gif";
import error from "../../assets/error.gif";
// Hooks
import { useEffect, useState } from "react";
// Axios Library
import axios from "axios";
// Communicating With Backend
import { BaseUrl } from "../../config";
// Cookies
import Cookies from "universal-cookie";
// react router dom tool
import { useNavigate } from "react-router-dom";

export default function AddEmployee() {
  // States
    // Loading Spinner To Communicating With Backend
    const [isLoading, setIsLoading] = useState(false);
    // Modal Inforomations
    const [modal, setModal] = useState({
      isOpen: false,
      message: "",
      image: "",
    });
    // Employee Informations
    const [employee, setEmployee] = useState({
      id: null,
      image: null,
      name: "",
      phone_number: "09",
      password: null,
      birthdate: null,
      gender: "",
      ssn: null,
      address: "",
      roles: [],
    });

  const [phoneNumberError, setPhoneNumberError] = useState("");

  // useNavigate
  const nav = useNavigate();

  // Cookies
  const cookie = new Cookies();
    // Get The Token That Stored In The Browser
    const token = cookie.get("token");

  // useEffects
    // Modal Timer useEffect
    useEffect(() => {
      if (modal.isOpen) {
        const timer = setTimeout(() => {
          setModal((prev) => ({ ...prev, isOpen: false }));
        }, 3000);
        return () => clearTimeout(timer);
      }
    }, [modal.isOpen]);

  // Functions
    // Add Employee Function
    async function AddEmployee() {
      setIsLoading(true);
      setPhoneNumberError("");
      const formData = new FormData();
      if (employee.image) {
        formData.append("image", employee.image);
      }
      formData.append("name", employee.name);
      formData.append("phone_number", employee.phone_number);
      formData.append("password", employee.password);
      formData.append("birthdate", employee.birthdate);
      formData.append("gender", employee.gender);
      formData.append("ssn", employee.ssn);
      formData.append("address", employee.address);
      employee.roles.forEach((role) => {
        formData.append("roles[]", role);
      });
      try {
        await axios.post(`${BaseUrl}/employee`, formData, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setPhoneNumberError("");
        setModal({
          isOpen: true,
          message: "The Employee Has Been Added Successfully !",
          image: successImage,
        });
        setTimeout(() => {
          nav(`/users`);
        }, 3000);
      } catch (err) {
        console.log(err);
        if (err.response?.data?.message?.phone_number) {
          setPhoneNumberError(err.response?.data?.message?.phone_number);
        } else {
          setModal({
            isOpen: true,
            message: "Something Went Wrong !",
            image: error,
          });
        }
      } finally {
        setIsLoading(false);
      }
    }

  const isFormValid =
    employee.name.trim() !== "" &&
    employee.phone_number?.length === 10 &&
    employee.password &&
    employee.birthdate &&
    employee.gender !== "" &&
    employee.ssn?.length === 11 &&
    employee.roles?.length > 0;

  return (
    <>
      {/* Sidebar Component */}
      <Sidebar />
      {/* Container Of The Page */}
      <div className="page-content p-3 md:py-5 md:p-5 bg-[#089bab1c]">
        {/* Introduction Section */}
        <div className="flex items-center">
          <IoIosArrowBack
            onClick={() => nav("/users")}
            className="text-2xl cursor-pointer duration-300 hover:text-[#089bab]"
          />
          <Title className="flex-1" label="Add Employee" />
        </div>
        {/* Container Of The Page Content */}
        <div className="p-5 text-xl flex flex-col items-center bg-white rounded-xl shadow-xl my-4 ">
          {/* Informations Section */}
          <div className="flex flex-col lg:flex-row gap-0 lg:gap-5 font-semibold w-full">

            {/* First Informations Section */}
            <div className="flex flex-col w-full lg:w-1/3">
              <label className="mb-2">Name <span className="text-red-500 text-sm ml-1">required</span></label>
              <input
                value={employee.name}
                onChange={(e) =>
                  setEmployee((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Full Name"
                className="bg-gray-200 rounded-xl py-1 px-4 outline-none mb-7"
              />

              <label className="mb-2">Phone Number <span className="text-red-500 text-sm ml-1">required</span></label>
              <input
                type="text"
                inputMode="numeric"
                pattern="09\d{8}"
                maxLength={10}
                value={employee.phone_number || ""}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/\D/g, "");
                  if (onlyNums.startsWith("09") || onlyNums === "") {
                    const trimmed = onlyNums.slice(0, 10);
                    setEmployee((prev) => ({ ...prev, phone_number: trimmed }));
                  }
                }}
                placeholder="Phone Number"
                className="bg-gray-200 rounded-xl py-1 px-4 outline-none mb-7"
              />
              <div>
                {phoneNumberError && (
                  <span className="text-red-500 text-sm ml-2 absolute mt-[-20px]">{phoneNumberError}</span>
                )}
              </div>

              <label className="mb-2">Password <span className="text-red-500 text-sm ml-1">required</span></label>
              <input
                type="password"
                value={employee.password || ""}
                onChange={(e) =>
                  setEmployee((prev) => ({ ...prev, password: e.target.value }))
                }
                placeholder="Password"
                className="bg-gray-200 rounded-xl py-1 px-4 outline-none mb-7"
              />

            </div>

            {/* Second Informations Section */}
            <div className="flex flex-col w-full lg:w-1/3">
              <label className="mb-2">Birthdate <span className="text-red-500 text-sm ml-1">required</span></label>
              <input
                type="date"
                value={employee.birthdate || ""}
                onChange={(e) =>
                  setEmployee((prev) => ({
                    ...prev,
                    birthdate: e.target.value,
                  }))
                }
                className="bg-gray-200 rounded-xl py-1 px-4 outline-none mb-7"
              />

              <label className="mb-2">Gender <span className="text-red-500 text-sm ml-1">required</span></label>
              <select
                value={employee.gender}
                onChange={(e) =>
                  setEmployee((prev) => ({ ...prev, gender: e.target.value }))
                }
                className="bg-gray-200 rounded-xl py-1 px-4 outline-none mb-7"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              <label className="mb-2">SSN <span className="text-red-500 text-sm ml-1">required</span></label>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={11}
                value={employee.ssn || ""}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/\D/g, "");
                  setEmployee((prev) => ({ ...prev, ssn: onlyNums }));
                }}
                placeholder="SSN"
                className="bg-gray-200 rounded-xl py-1 px-4 outline-none mb-7"
              />
            </div>

            {/* Third Informations Section */}
            <div className="flex flex-col w-full lg:w-1/3">
              <label className="mb-2">Address</label>
              <input
                value={employee.address}
                onChange={(e) =>
                  setEmployee((prev) => ({ ...prev, address: e.target.value }))
                }
                placeholder="Address"
                className="bg-gray-200 rounded-xl py-1 px-4 outline-none mb-7 w-full"
              />

              <label className="mb-2">Image</label>
              <input
                type="file"
                onChange={(e) =>
                  setEmployee((prev) => ({ ...prev, image: e.target.files[0] }))
                }
                className="bg-gray-200 rounded-xl py-1 px-4 outline-none mb-7 w-full"
              />

              <label className="mb-2">Roles <span className="text-red-500 text-sm ml-1">required</span></label>
              <div className="flex flex-col gap-1 px-4 mb-5 max-w-full">
                {["doctor", "receptionist"].map((role) => (
                  <label key={role} className="flex gap-2 items-center text-sm">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-blue-500 cursor-pointer"
                      checked={employee.roles.includes(role)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setEmployee((prev) => ({
                          ...prev,
                          roles: checked
                            ? [...prev.roles, role]
                            : prev.roles.filter((r) => r !== role),
                        }));
                      }}
                    />
                    {role}
                  </label>
                ))}
              </div>
            </div>

          </div>
          {/* Add Employee Button */}
            <div className="flex justify-center w-full">
              <button
                onClick={() => AddEmployee()}
                disabled={!isFormValid || isLoading}
                className={`px-3 text-white p-1 rounded-xl ml-7 border-2 duration-300 ${
                  isFormValid && !isLoading
                    ? "bg-[#089bab] hover:bg-transparent hover:text-black border-[#089bab]"
                    : "bg-gray-300 border-gray-300 cursor-not-allowed"
                }`}
              >
                Add Employee
              </button>
            </div>
        </div>
      </div>

      {/* Loading Spinner When Communicating With Backend */}
      {isLoading && <Loading />}

      {/* State Of The Communicating With Backend (Successfull Or Failure) */}
      {modal.isOpen && <Modal message={modal.message} imageSrc={modal.image} />}
    </>
  );
}
