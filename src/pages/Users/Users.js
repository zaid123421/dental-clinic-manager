  // Components
  import Button from "../../components/Button";
  import FormInput from "../../components/FormInput";
  import Sidebar from "../../components/Sidebar";
  import Title from "../../components/Title";
  import Confirm from "../../components/Confirm";
  import Loading from "../../components/Loading";
  import Modal from "../../components/Modal";
  // Icons
  import { MdDelete, MdEdit } from "react-icons/md";
  import { FaBan } from "react-icons/fa";
  import { GoDash } from "react-icons/go";
  import { IoIosSearch } from "react-icons/io";
  import { FiPlus } from "react-icons/fi";
  // Images
  import successImage from "../../assets/success.gif";
  import error from "../../assets/error.gif";
  import confirmDelete from "../../assets/deleteConfirm.jpg"
  import Unban from "../../assets/UnBan.jpg";
  // Hooks
  import { useEffect, useRef, useState } from "react";
  // Axios Library
  import axios from "axios";
  // Commuunicating With Backend
  import { BaseUrl } from "../../config";
  // Cookies
  import Cookies from "universal-cookie";
  // react router dom tool
  import { useNavigate } from "react-router-dom";

  export default function Users() {
    // States
    // refreshFlag To Refresh The Component After An Event
    const [refreshFlag, setRefreshFlag] = useState(0);
    // SelectedType To Choose The Type Of Data (Employees Or Patients)
    const [selectedType, setSelectedType] = useState("Employees");
    // These Two States To Store The Data From The Backend
    const [employees, setEmployees] = useState(null);
    const [patients, setPatients] = useState(null);
    // Loading Spinner To Communicating With Backend
    const [isLoading, setIsLoading] = useState(false);
    // To Show Ban Box
    const [banBox, setBanBox] = useState(false);
    // To Show UnBan Confirm Box
    const [confirmUnBanBox, setConfirmUnBanBox] = useState(false);
    // To Manipulate Style According To Checked Or Not
    const [isChecked, setIsChecked] = useState(true);
    // These Two States To Show Confirm Delete Box (Employee and Patient)
    const [confirmDeleteEmployee, setConfirmDeleteEmployee] = useState(false);
    const [confirmDeletePatient, setConfirmDeletePatient] = useState(false);
    // Pagination
    const [pagination, setPagination] = useState({
      current_page: 1,
      last_page: null,
    });

    // State To Store Ban Duration If its Exist
    const [banDuration, setBanDuration] = useState({
      duration_unit: "days",
      duration_value: 1,
    });

    // Employee Informations
    const [employee, setEmployee] = useState({
      id: null,
      name: "",
      phone_number: null,
    });

    // Patient Informations
    const [patient, setPatient] = useState({
      id: null,
      name: "",
      phone_number: null,
    });

    // Modal Informations
    const [modal, setModal] = useState({
      isOpen: false,
      message: "",
      image: "",
    });

    const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = employees?.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.phone_number.startsWith(searchTerm)
  );

  const filteredPatients = patients?.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone_number.startsWith(searchTerm)
  );

    // useRef To Store id and url When Need To Communicating Backend
    const banId = useRef(null);
    const banUrl = useRef(null);

    // useNavigate
    const nav = useNavigate();

    // Cookies
    const cookie = new Cookies();
    // Get The Token That Stored In The Browser
    const token = cookie.get("token");

    useEffect(() => {
      axios
        .get(`${BaseUrl}/employee`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((data) => {
          setEmployees(data.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }, [refreshFlag]);

    useEffect(() => {
      axios
        .get(`${BaseUrl}/patient?page=${pagination.current_page}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((data) => {
          console.log(data);
          setPatients(data.data.data.data);
          setPagination({
            current_page: data.data.data.current_page,
            last_page: data.data.data.last_page
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }, [refreshFlag]);

    useEffect(() => {
      if (modal.isOpen) {
        const timer = setTimeout(() => {
          setModal((prev) => ({ ...prev, isOpen: false }));
        }, 3000);
        return () => clearTimeout(timer);
      }
    }, [modal.isOpen]);

    useEffect(() => {
      if (confirmDeleteEmployee || confirmDeletePatient || banBox) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
      return () => {
        document.body.style.overflow = "auto";
      };
    }, [confirmDeleteEmployee, confirmDeletePatient, banBox]);

    async function DeleteEmployee() {
      setIsLoading(true);
      try {
        await axios.delete(`${BaseUrl}/employee/${employee.id}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setRefreshFlag((prev) => prev + 1);
        setModal({
          isOpen: true,
          message: "The Employee Has Been Deleted Successfully !",
          image: successImage,
        });
      } catch {
        setModal({
          isOpen: true,
          message: "Something Went Wrong !",
          image: error,
        });
      } finally {
        setConfirmDeleteEmployee(false);
        setIsLoading(false);
      }
    }

    async function DeletePatient() {
      setIsLoading(true);
      try {
        await axios.delete(`${BaseUrl}/patient/${patient.id}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setRefreshFlag((prev) => prev + 1);
        setModal({
          isOpen: true,
          message: "The Patient Has Been Deleted Successfully !",
          image: successImage,
        });
      } catch {
        setModal({
          isOpen: true,
          message: "Something Went Wrong !",
          image: error,
        });
      } finally {
        setConfirmDeletePatient(false);
        setIsLoading(false);
      }
    }

    async function Ban() {
      const formData = new FormData();
      if (!isChecked) {
        formData.append("until_value", banDuration.duration_value);
        formData.append("until_unit", banDuration.duration_unit);
      }
      setIsLoading(true);
      try {
        await axios.post(
          `${BaseUrl}/${banUrl.current}/${banId.current}/ban`,
          formData,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRefreshFlag((prev) => prev + 1);
        setModal({
          isOpen: true,
          message: "The User Has Been Banned Successfully !",
          image: successImage,
        });
      } catch {
        setModal({
          isOpen: true,
          message: "Something Went Wrong !",
          image: error,
        });
      } finally {
        setIsChecked(true);
        setBanDuration({
          duration_unit: "days",
          duration_value: 1,
        });
        setBanBox(false);
        setIsLoading(false);
      }
    }

    async function UnBan() {
      setIsLoading(true);
      try {
        await axios.get(`${BaseUrl}/${banUrl.current}/${banId.current}/unban`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setRefreshFlag((prev) => prev + 1);
        setModal({
          isOpen: true,
          message: "The User Has Been UnBanned Successfully !",
          image: successImage,
        });
      } catch {
        setModal({
          isOpen: true,
          message: "Something Went Wrong !",
          image: error,
        });
      } finally {
        setConfirmUnBanBox(false);
        setIsLoading(false);
      }
    }

    function hanldeIncremetPage() {
      if(pagination.current_page < pagination.last_page) {
        setPagination((prev) => ({
          ...prev,
          current_page: pagination.current_page + 1
        }))
        setRefreshFlag((prev) => prev + 1)
      }
    }

    function handleDecrementPage() {
      if(pagination.current_page > 1) {
        setPagination((prev) => ({
          ...prev,
          current_page: pagination.current_page - 1
        }))
        setRefreshFlag((prev) => prev + 1)
      }
    }

    const increment = () =>
      setBanDuration((prev) => ({
        ...prev,
        duration_value: banDuration.duration_value + 1,
    }));

    const decrement = () =>
      setBanDuration((prev) => ({
        ...prev,
        duration_value:
          banDuration.duration_value > 1
            ? banDuration.duration_value - 1
            : banDuration.duration_value,
    }));

    const showEmployees = filteredEmployees?.map((employee, index) => (
      <tr
      onClick={() => nav(`/show-employee?employeeId=${employee.id}`)}
        className={`p-3 ${
          index !== employees.length - 1 ? "border-b-[1px] border-b-gray-300" : ""
        } text-center font-semibold bg-white hover:text-white hover:bg-[#089bab] cursor-pointer`}
      >
        <td
          className={`p-3 ${
            index === employees.length - 1 ? "rounded-bl-2xl" : ""
          }`}
        >
          {employee.name}
        </td>
        <td className="p-3">{employee.phone_number}</td>
        <td className="p-3">
          {employee.is_banned ? (
            <FaBan
              onClick={(e) => {
                e.stopPropagation();
                banId.current = employee.id;
                banUrl.current = "employee";
                setConfirmUnBanBox(true);
              }}
              className="text-2xl text-red-500 hover:text-red-700 duration-300 cursor-pointer justify-self-center"
            />
          ) : (
            <GoDash
              onClick={(e) => {
                e.stopPropagation();
                banId.current = employee.id;
                banUrl.current = "employee";
                setBanBox(true);
              }}
              className="text-2xl text-green-500 hover:text-green-700 duration-300 cursor-pointer justify-self-center"
            />
          )}
        </td>
        <td className="p-3">
          <MdEdit onClick={(e) =>{
            e.stopPropagation();
            nav(`/edit-employee?employeeId=${employee.id}`);
          }}
          className="text-2xl text-green-400 hover:text-green-500 duration-300 cursor-pointer justify-self-center" />
        </td>
        <td
          className={`p-3 ${
            index === employees.length - 1 ? "rounded-br-2xl" : ""
          }`}
        >
          <MdDelete
            onClick={(e) => {
              e.stopPropagation();
              setEmployee((prev) => ({
                ...prev,
                id: employee.id,
                name: employee.name,
              }));
              setConfirmDeleteEmployee(true);
            }}
            className="text-2xl text-red-500 hover:text-red-700 duration-300 cursor-pointer justify-self-center"
          />
        </td>
      </tr>
    ));

    const showPatients = filteredPatients?.map((patient, index) => (
      <tr onClick={() => nav(`/show-patient?patientId=${patient.id}`)} className={`p-3 ${index !== patients.length - 1 ? "border-b-[1px] border-b-gray-300" : ""} text-center font-semibold bg-white hover:text-white hover:bg-[#089bab] cursor-pointer`}>
        <td className={`p-3 ${index === patients.length - 1 ? "rounded-bl-2xl" : ""}`}>
          {patient.name}
        </td>
        <td className="p-3">{patient.phone_number}</td>
        <td className={`${patient.balance > 0 ? "text-green-500" : patient.balance < 0 ? "text-red-500" : "text-gray-500"}`}>{patient.balance.toLocaleString()}</td>
        <td className="p-3">
          {patient.is_banned ? (
            <FaBan
              onClick={(e) => {
                e.stopPropagation();
                banId.current = patient.id;
                banUrl.current = "patient";
                setConfirmUnBanBox(true);
              }}
              className="text-2xl text-red-500 hover:text-red-700 duration-300 cursor-pointer justify-self-center"
            />
          ) : (
            <GoDash
              onClick={(e) => {
                e.stopPropagation();
                banId.current = patient.id;
                banUrl.current = "patient";
                setBanBox(true);
              }}
              className="text-2xl text-green-500 hover:text-green-700 duration-300 cursor-pointer justify-self-center"
            />
          )}
        </td>
        <td className={`p-3 ${index === patients.length - 1 ? "rounded-br-2xl" : ""}`}>
          <MdDelete onClick={(e) => {
              e.stopPropagation();
              setPatient((prev) => ({
                ...prev,
                id: patient.id,
                name: patient.name,
              }));
              setConfirmDeletePatient(true);
            }}
            className="text-2xl text-red-500 hover:text-red-700 duration-300 cursor-pointer justify-self-center"
          />
        </td>
      </tr>
    ));

    return (
      <>

        <Sidebar />
        <div className="page-content p-3 md:py-5 md:p-5 bg-[#089bab1c]">
          <Title label="Users" />
          <div className="mt-3 flex items-center">
            {selectedType === "Employees" ? (
              <>
                <Button
                  onClick={() => nav(`/add-employee`)}
                  className="hidden md:flex"
                  variant="primary"
                  icon={<FiPlus className="mr-3 text-2xl" />}
                  children="Add Employee"
                />
                <Button
                  onClick={() => nav(`/add-employee`)}
                  className="flex md:hidden"
                  variant="plus"
                  icon={<FiPlus className="text-2xl" />}
                />
              </>
            ) : (
              ""
            )}
            <FormInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<IoIosSearch className="text-black text-lg" />}
              placeholder="Search"
              className="w-full md:w-[250px] bg-white border-[#089bab] placeholder-black shadow-lg"
            />
          </div>
          <div className="my-3 rounded-md md:rounded-3xl bg-white flex flex-row gap-2 md:gap-4 w-fit m-auto font-semibold">
            <button
              onClick={() => {
                setSelectedType("Employees");
              }}
              className={`${
                "Employees" === selectedType ? "bg-[#089bab] text-white" : ""
              } py-2 px-3 rounded-md  md:rounded-3xl hover:text-white hover:bg-[#089bab] duration-300`}
            >
              Employees
            </button>
            <button
              onClick={() => {
                setSelectedType("Patients");
              }}
              className={`${
                "Patients" === selectedType ? "bg-[#089bab] text-white" : ""
              } py-2 px-3 rounded-md md:rounded-3xl hover:text-white hover:bg-[#089bab] duration-300`}
            >
              Patients
            </button>
          </div>
          <div className="overflow-x-auto shadow-xl rounded-2xl">
            <table className="w-full bg-transparent">
              <thead className="font-bold bg-gray-300">
                <th className="p-3 rounded-tl-2xl">Name</th>
                <th className="p-3">Phone Number</th>
                {selectedType === "Patients" && <th className="p-3">Payments</th>}
                <th className="p-3">Banned</th>
                {selectedType === "Employees" && <th className="p-3">Edit</th>}
                <th className="py-3 rounded-tr-2xl ">Delete</th>
              </thead>
              <tbody className="rounded-2xl">
                {selectedType === "Employees" ? (
                  filteredEmployees?.length > 0 ? showEmployees : (
                    <tr>
                      <td colSpan={5} className="text-center p-5 text-gray-500 font-semibold bg-white">
                        No Results Found
                      </td>
                    </tr>
                  )
                ) : (
                  filteredPatients?.length > 0 ? showPatients : (
                    <tr>
                      <td colSpan={5} className="text-center p-5 text-gray-500 font-semibold bg-white">
                        No Results Found
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

        {/* Pagination Section When Selected Type is Patients */}
        {selectedType === "Patients" && filteredPatients.length > 0 && (
          <div className="flex justify-center items-center w-full mt-5 text-xl">
            {/* Decrement Page Button */}
            <button
              onClick={() => handleDecrementPage()}
              disabled={pagination.current_page === 1}
              className={`bg-[#089bab] border-2 border-[#089bab] text-white w-[25px] h-[25px] rounded-full flex justify-center items-center duration-300 ${
                pagination.current_page === 1
                  ? "bg-gray-400 border-gray-400 cursor-not-allowed hover:text-white"
                  : "hover:bg-transparent hover:text-black"
              }`}
            >
              <GoDash className="text-sm" />
            </button>

            <span className="text-2xl font-semibold mx-5">
              {pagination.current_page}
            </span>

            {/* Increment Page Button */}
            <button
              onClick={() => hanldeIncremetPage()}
              disabled={pagination.current_page === pagination.last_page}
              className={`bg-[#089bab] border-2 border-[#089bab] text-white w-[25px] h-[25px] rounded-full flex justify-center items-center duration-300 ${
                pagination.current_page === pagination.last_page
                  ? "bg-gray-400 border-gray-400 cursor-not-allowed hover:text-white"
                  : "hover:bg-transparent hover:text-black"
              }`}
            >
              <FiPlus className="text-sm" />
            </button>
          </div>
        )}

        </div>

        {/* Show Ban User Confrim Box */}
        {banBox &&
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-2">
            <div className="bg-white rounded-xl p-5 text-xl flex flex-col items-center shadow-xl w-[500px]">
              {/* Ban State Section (Permanently Or Temporarily) */}
              <div className="flex items-center justify-between w-full font-semibold">
                <label className="pr-4">Ban State</label>
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      className="sr-only"
                      onChange={() => setIsChecked(!isChecked)}
                    />
                    <div
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition ${
                        isChecked ? "bg-[#089bab]" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                          isChecked ? "translate-x-0" : "translate-x-4"
                        }`}
                      />
                    </div>
                    <span className="ml-2 text-sm w-[75px]">
                      {isChecked ? "Permanently" : "Temporarily"}
                    </span>
                  </label>
                </div>
              </div>
              {/* Duration Section */}
              <div className="flex items-center font-semibold w-full mt-5 flex-wrap justify-end md:justify-start">
                <label className="pr-4 flex-1 mb-[10px]">Duration</label>
                {/* Duration Value */}
                <div className="flex items-center mb-[10px]">
                  <button
                    disabled={isChecked}
                    onClick={decrement}
                    className={`${
                      isChecked
                        ? "bg-gray-300 text-gray-600 border-gray-300 cursor-not-allowed"
                        : "bg-[#089bab] text-white hover:bg-white hover:text-black hover:border-[#089bab]"
                    } border-2 border-transparent rounded-full duration-300 w-[25px] h-[25px] flex items-center justify-center`}
                  >
                    −
                  </button>
                  <input
                    disabled={isChecked}
                    type="number"
                    value={banDuration.duration_value}
                    onChange={(e) =>
                      setBanDuration((prev) => ({
                        ...prev,
                        duration_value: e.target.value,
                      }))
                    }
                    className={`${
                      isChecked
                        ? "text-gray-500 cursor-not-allowed"
                        : "text-black"
                    } bg-gray-300 w-20 text-center outline-none border-none rounded-xl mx-2 px-2 py-1 `}
                  />
                  <button
                    disabled={isChecked}
                    onClick={increment}
                    className={`${
                      isChecked
                        ? "bg-gray-300 text-gray-600 border-gray-300 cursor-not-allowed"
                        : "bg-[#089bab] text-white hover:bg-white hover:text-black hover:border-[#089bab]"
                    } border-2 border-transparent rounded-full duration-300 w-[25px] h-[25px] flex items-center justify-center`}
                  >
                    +
                  </button>
                </div>
                {/* Duration Unit */}
                <select
                  disabled={isChecked}
                  value={banDuration.duration_unit}
                  onChange={(e) =>
                    setBanDuration((prev) => ({
                      ...prev,
                      duration_unit: e.target.value,
                    }))
                  }
                  className={`${
                    isChecked ? "cursor-not-allowed" : "cursor-pointer"
                  } mb-[10px] ml-5 border-2 border-transparent focus:border-[#089bab] bg-gray-300 rounded-xl px-3 py-1 outline-none`}
                >
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                </select>
              </div>
              {/* Buttons Section (Cancel + Ban) */}
              <div className="flex justify-center w-full mt-5">
                <button
                  onClick={() => {
                    setIsChecked(true);
                    setBanBox(false);
                    setBanDuration({
                      duration_unit: "days",
                      duration_value: 1,
                    });
                  }}
                  className="w-[85px] bg-[#9e9e9e] border-2 border-[#9e9e9e] p-1 rounded-xl text-white hover:bg-transparent hover:text-black duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => Ban()}
                  className="w-[85px] bg-[#089bab] border-2 border-[#089bab] p-1 rounded-xl text-white hover:bg-transparent hover:text-black duration-300 ml-7"
                >
                  Ban
                </button>
              </div>
            </div>
          </div>
        }

        {/* Show UnBan User Confrim Box */}
        {confirmUnBanBox && (
          <Confirm
            img={Unban}
            label={<>Do You Want Really To UnBan <span className="font-bold">{employee.name}</span> ?</>}
            onCancel={() => setConfirmUnBanBox(false)}
            onConfirm={() => UnBan()}
            confirmButtonName = "UnBan"
          />
        )}

        {/* Show Delete Employee Confirm Box */}
        {confirmDeleteEmployee && (
          <Confirm
            img={confirmDelete}
            label={<>Do You Want Really To Delete <span className="font-bold">{employee.name}</span> ?</>}
            onCancel={() => setConfirmDeleteEmployee(false)}
            onConfirm={() => DeleteEmployee()}
          />
        )}

        {/* Show Delete Patient Confirm Box */}
        {confirmDeletePatient && (
          <Confirm
            img={confirmDelete}
            label={<>Do You Want Really To Delete <span className="font-bold">{patient.name}</span> ?</>}
            onCancel={() => setConfirmDeletePatient(false)}
            onConfirm={() => DeletePatient()}
          />
        )}

        {/* Loading Spinner When Communicating With Backend */}
        {isLoading && <Loading />}

        {/* State Of The Communicating With Backend (Successfull Or Failure) */}
        {modal.isOpen && <Modal message={modal.message} imageSrc={modal.image} />}

      </>
    );
  }
