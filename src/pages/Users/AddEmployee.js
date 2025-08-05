import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Title from "../../components/Title";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import axios from "axios";
import { BaseUrl } from "../../config";
import successImage from '../../assets/success.gif';
import error from '../../assets/error.gif';
import Loading from "../../components/Loading";
import Modal from "../../components/Modal"
import { IoIosArrowBack } from "react-icons/io";

export default function AddEmployee() {
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    message: "",
    image: "",
  });
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
      roles: []
  })

  const nav = useNavigate();

  // Cookies
  const cookie = new Cookies();
  const token = cookie.get("userAccessToken");

  useEffect(() => {
      if (modal.isOpen) {
        const timer = setTimeout(() => {
          setModal((prev) => ({ ...prev, isOpen: false }));
        }, 3000);
        return () => clearTimeout(timer);
      }
  }, [modal.isOpen]);

  async function AddEmployee() {
    setIsLoading(true);
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
      await axios.post(`${BaseUrl}/employee`, formData,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
      });
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
      setModal({
        isOpen: true,
        message: "Something Went Wrong !",
        image: error,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return(
    <>
      <Sidebar />
      <div className="page-content p-3 md:py-5 md:p-5 bg-[#089bab1c]">
        <div className="flex items-center">
          <IoIosArrowBack onClick={() => nav("/users")} className="text-2xl cursor-pointer duration-300 hover:text-[#089bab]" />
          <Title label="Add Employee" />
        </div>
        <div className="p-5 text-xl flex flex-col items-center">
          <div className="bg-white p-5 rounded-xl shadow-xl flex flex-col lg:flex-row flex-wrap gap-5 my-2 font-semibold w-full">
            {/* First Informations Section */}
            <div className="flex flex-col flex-1 max-w-full">
              <label className="mb-2">Name</label>
              <input
                value={employee.name}
                onChange={(e) => setEmployee((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Full Name"
                className="bg-gray-200 rounded-xl py-1 px-4 outline-none mb-5"
              />

              <label className="mb-2">Phone Number</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="09\d{8}"
                maxLength={10}
                value={employee.phone_number || ""}
                onChange={(e) => {
                  // منع أي حرف غير رقمي
                  const onlyNums = e.target.value.replace(/\D/g, "");

                  // التحقق أن يبدأ بـ 09 فقط
                  if (onlyNums.startsWith("09") || onlyNums === "") {
                    const trimmed = onlyNums.slice(0, 10);
                    setEmployee((prev) => ({ ...prev, phone_number: trimmed }));
                  }
                }}
                placeholder="Phone Number"
                className="bg-gray-200 rounded-xl py-1 px-4 outline-none mb-5"
              />

              <label className="mb-2">Password</label>
              <input
                type="password"
                value={employee.password || ""}
                onChange={(e) => setEmployee((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Password"
                className="bg-gray-200 rounded-xl py-1 px-4 outline-none mb-5"
              />

              <label className="mb-2">Birthdate</label>
              <input
                type="date"
                value={employee.birthdate || ""}
                onChange={(e) => setEmployee((prev) => ({ ...prev, birthdate: e.target.value }))}
                className="bg-gray-200 rounded-xl py-1 px-4 outline-none mb-5"
              />

              <label className="mb-2">Gender</label>
              <select
                value={employee.gender}
                onChange={(e) => setEmployee((prev) => ({ ...prev, gender: e.target.value }))}
                className="bg-gray-200 rounded-xl py-1 px-4 outline-none mb-5"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Second Informations Section */}
            <div className="flex flex-col flex-1 max-w-full">
              <label className="mb-2">SSN</label>
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
                className="bg-gray-200 rounded-xl py-1 px-4 outline-none mb-5 min-w-[150px] max-w-full"
              />

              <label className="mb-2">Address</label>
              <input
                value={employee.address}
                onChange={(e) => setEmployee((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Address"
                className="bg-gray-200 rounded-xl py-1 px-4 outline-none mb-5 max-w-full"
              />

              <label className="mb-2">Image</label>
              <input
                type="file"
                onChange={(e) => setEmployee((prev) => ({ ...prev, image: e.target.files[0] }))}
                className="bg-gray-200 rounded-xl py-1 px-4 outline-none mb-5 max-w-full"
              />

              <label className="mb-2">Roles</label>
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

            {/* Add Employee Button */}
            <div className="flex justify-center w-full">
              <button onClick={() => AddEmployee()} className="px-3 bg-[#089bab] text-white p-1 rounded-xl hover:bg-transparent hover:text-black duration-300 ml-7 border-2 border-[#089bab]">
                Add Employee
              </button>
            </div>

          </div>

        </div>

      </div>

      
      {/* Loading Spinner When Communicating With Backend */}
      {isLoading && <Loading />}

      {/* State Of The Communicating With Backend (Successfull Or Failure) */}
      {modal.isOpen && <Modal message={modal.message} imageSrc={modal.image}/>}
    </>
  );
}