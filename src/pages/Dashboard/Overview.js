// import components
import Cookies from "universal-cookie";
import Sidebar from "../../components/Sidebar";
import Title from "../../components/Title";
import { useEffect, useState } from "react";
import axios from "axios";
import { BaseUrl } from "../../config";
import { BsThreeDots } from "react-icons/bs";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import errorImage from "../../assets/error.gif";

export default function Overview() {
  // Modal Informations
  const [modal, setModal] = useState({
    isOpen: false,
    message: "",
    image: "",
  });
  // Loading Spinner To Communicating With Backend
  const [isLoading, setIsLoading] = useState(false);

const today = new Date();
const oneMonthLater = new Date();
oneMonthLater.setMonth(today.getMonth() + 1);

  const [refreshFlag, setRefreshFlag] = useState(0);

  const [finances, setFinances] = useState([]);
  const [patients, setPatients] = useState([]);

  const [formDateFinance, setFormDateFinance] = useState(formatDate(today));
  const [toDateFinance, setToDateFinance] = useState(formatDate(oneMonthLater));
  const [frequencyFinance, setFrequencyFinance] = useState("monthly");

  const [formDatePatients, setFormDatePatients] = useState(formatDate(today));
  const [toDatePatients, setToDatePatients] = useState(formatDate(oneMonthLater));
  const [frequencyPatients, setFrequencyPatients] = useState("monthly");

  // Cookies
  const cookie = new Cookies();
  const token = cookie.get("token");

  useEffect(() => {
    if (modal.isOpen) {
      const timer = setTimeout(() => {
        setModal((prev) => ({ ...prev, isOpen: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [modal.isOpen]);

  useEffect(() => {
    sendFinance();
    sendPatients();
  }, []);

  function formatDate(date) {
  return date.toISOString().split("T")[0];
  }

  async function sendFinance() {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("start_date", formDateFinance);
    formData.append("end_date", toDateFinance);
    formData.append("frequency", frequencyFinance);
    try {
      const response = await axios.post(
        `${BaseUrl}/reports/patient-account`, formData,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFinances(response.data.data)
      console.log(response.data.data);
    } catch (err) {
      console.error(err);
      setModal({
        isOpen: true,
        message: "Something Went Wrong!",
        image: errorImage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function sendPatients() {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("start_date", formDatePatients);
    formData.append("end_date", toDatePatients);
    formData.append("frequency", frequencyPatients);
    try {
      const response = await axios.post(
        `${BaseUrl}/reports/patient`, formData,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPatients(response.data.data)
      console.log(response.data.data);
    } catch (err) {
      console.error(err);
      setModal({
        isOpen: true,
        message: "Something Went Wrong!",
        image: errorImage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function downloadFinancePdf() {
  setIsLoading(true);
  const formData = new FormData();
  formData.append("start_date", formDateFinance);
  formData.append("end_date", toDateFinance);
  formData.append("frequency", frequencyFinance);
  try {
    const response = await axios.post(
      `${BaseUrl}/reports/patient-account/download/pdf`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );
    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", "finance-report.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("Error downloading PDF:", err);
    setModal({
      isOpen: true,
      message: "Something Went Wrong!",
      image: errorImage,
    });
  } finally {
    setIsLoading(false);
  }
  }

  async function downloadFinanceExcel() {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("start_date", formDateFinance);
    formData.append("end_date", toDateFinance);
    formData.append("frequency", frequencyFinance);

    try {
      const response = await axios.post(
        `${BaseUrl}/reports/patient-account/download/excel`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const file = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const fileURL = URL.createObjectURL(file);

      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", "finance-report.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error downloading Excel:", err);
      setModal({
        isOpen: true,
        message: "Something Went Wrong!",
        image: errorImage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function downloadPatientsPdf() {
  setIsLoading(true);
  const formData = new FormData();
  formData.append("start_date", formDatePatients);
  formData.append("end_date", toDatePatients);
  formData.append("frequency", frequencyPatients);
  try {
    const response = await axios.post(
      `${BaseUrl}/reports/patient/download/pdf`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );
    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", "finance-report.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("Error downloading PDF:", err);
    setModal({
      isOpen: true,
      message: "Something Went Wrong!",
      image: errorImage,
    });
  } finally {
    setIsLoading(false);
  }
  }

  async function downloadPatientsExcel() {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("start_date", formDatePatients);
    formData.append("end_date", toDatePatients);
    formData.append("frequency", frequencyPatients);

    try {
      const response = await axios.post(
        `${BaseUrl}/reports/patient/download/excel`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const file = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const fileURL = URL.createObjectURL(file);

      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", "finance-report.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error downloading Excel:", err);
      setModal({
        isOpen: true,
        message: "Something Went Wrong!",
        image: errorImage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Sidebar />
      <div className="page-content p-3 md:py-5 md:p-5 bg-[#089bab1c]">
        <Title label="Overview" />
        <div>
          <h2 className="font-bold text-2xl my-4">Reports Section</h2>
          <h2 className="font-bold text-xl mb-4">Finance Reports</h2>
          {/* Finances Section */}

          {/* Buttons Section */}
          <div className="flex flex-col md:flex-row gap-3 mt-5 flex-wrap">
          <div className="flex items-center">
            <label className="mb-1 text-sm font-bold text-gray-600 mr-2 w-[50px] md:w-fit">From</label>
            <input
              type="date"
              value={formDateFinance}
              onChange={(e) => setFormDateFinance(e.target.value)}
              className="cursor-pointer shadow-lg rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#089bab]"
            />
          </div>

          <div className="flex items-center">
            <label className="mb-1 text-sm font-bold text-gray-600 mr-2 w-[50px] md:w-fit">To</label>
            <input
              type="date"
              value={toDateFinance}
              onChange={(e) => setToDateFinance(e.target.value)}
              className="cursor-pointer shadow-lg rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#089bab]"
            />
          </div>
          
          {/* DropDown List */}
          <div className="flex items-center">
            <select
              value={frequencyFinance}
              onChange={(e) => setFrequencyFinance(e.target.value)}
              className="cursor-pointer shadow-lg rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#089bab]"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <button
            onClick={() => sendFinance()}
            className="px-4 py-2 bg-[#089bab] text-white rounded-xl hover:bg-[#077c89]"
          >
            Apply Filter
          </button>

          <button onClick={() => downloadFinancePdf()} className="border-2 border-red-500 bg-red-500 px-4 rounded-xl text-white font-semibold hover:bg-transparent duration-300 hover:text-black">Download Pdf</button>
          <button onClick={() => downloadFinanceExcel()} className="border-2 border-green-500 bg-green-500 px-4 rounded-xl text-white font-semibold hover:bg-transparent duration-300 hover:text-black">Download Excel</button>
          </div>
          {/* Results */}
          <div className="mt-5 realtive">
            {finances.length > 0 ? (
              <div className="overflow-x-auto shadow-xl rounded-2xl mt-5">
                <table className="overflow-auto min-w-full border border-gray-200 bg-white rounded-xl shadow-sm">
                  <thead className="bg-[#089bab] text-white">
                    <tr>
                      <th className="px-4 py-2 text-center rounded-tl-2xl">Patient</th>
                      <th className="px-4 py-2 text-center">Doctor</th>
                      <th className="px-4 py-2 text-center">Date</th>
                      <th className="px-4 py-2 text-center">Time</th>
                      <th className="px-4 py-2 text-center">Duration (min)</th>
                      <th className="px-4 py-2 text-center">Status</th>
                      <th className="px-4 py-2 text-center rounded-tr-2xl">Edit Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {finances?.map((finance, index) => (
                      <tr
                        key={index}
                        className={`p-3 ${
                          index !== finances.length - 1
                            ? "border-b-[1px] border-b-gray-300"
                            : ""
                        } text-center font-semibold`}
                      >
                        <td className="px-4 py-2">{finance.from}</td>
                        <td className="px-4 py-2">{finance.to}</td>
                        <td className="px-4 py-2">{finance.accounts}</td>
                        <td className="px-4 py-2">{finance.with_due}</td>
                        <td className="px-4 py-2">{finance.clear_balance}</td>
                        <td className="px-4 py-2">{finance.total_balance}</td>
                        <td className="px-4 py-2">{finance.avg_balance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto shadow-xl rounded-2xl mt-5">
                <table className="overflow-auto min-w-full border border-gray-200 bg-white rounded-xl shadow-sm">
                  <thead className="bg-[#089bab] text-white">
                    <tr>
                      <th className="px-4 py-2 text-center rounded-tl-2xl">Patient</th>
                      <th className="px-4 py-2 text-center">Doctor</th>
                      <th className="px-4 py-2 text-center">Date</th>
                      <th className="px-4 py-2 text-center">Time</th>
                      <th className="px-4 py-2 text-center">Duration (min)</th>
                      <th className="px-4 py-2 text-center">Status</th>
                      <th className="px-4 py-2 text-center rounded-tr-2xl">Edit Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center p-5 text-gray-500 font-semibold"
                      >
                        No Results Found
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Patients Section */}

          <h2 className="font-bold text-xl mt-8 mb-4">Patients Reports</h2>
          {/* Buttons Section */}
          <div className="flex flex-col md:flex-row gap-3 mt-5 flex-wrap">
          <div className="flex items-center">
            <label className="mb-1 text-sm font-bold text-gray-600 mr-2 w-[50px] md:w-fit">From</label>
            <input
              type="date"
              value={formDatePatients}
              onChange={(e) => setFormDatePatients(e.target.value)}
              className="cursor-pointer shadow-lg rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#089bab]"
            />
          </div>

          <div className="flex items-center">
            <label className="mb-1 text-sm font-bold text-gray-600 mr-2 w-[50px] md:w-fit">To</label>
            <input
              type="date"
              value={toDatePatients}
              onChange={(e) => setToDatePatients(e.target.value)}
              className="cursor-pointer shadow-lg rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#089bab]"
            />
          </div>

          <div className="flex items-center">
            <select
              value={frequencyPatients}
              onChange={(e) => setFrequencyPatients(e.target.value)}
              className="cursor-pointer shadow-lg rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#089bab]"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <button
            onClick={() => sendPatients()}
            className="px-4 py-2 bg-[#089bab] text-white rounded-xl hover:bg-[#077c89]"
          >
            Apply Filter
          </button>
          <button onClick={() => downloadFinancePdf()} className="border-2 border-red-500 bg-red-500 px-4 rounded-xl text-white font-semibold hover:bg-transparent duration-300 hover:text-black">Download Pdf</button>
          <button onClick={() => downloadFinanceExcel()} className="border-2 border-green-500 bg-green-500 px-4 rounded-xl text-white font-semibold hover:bg-transparent duration-300 hover:text-black">Download Excel</button>
          </div>
          {/* Results */}
          <div className="mt-5 realtive">
            {patients.length > 0 ? (
              <div className="overflow-x-auto shadow-xl rounded-2xl mt-5">
                <table className="overflow-auto min-w-full border border-gray-200 bg-white rounded-xl shadow-sm">
                  <thead className="bg-[#089bab] text-white">
                    <tr>
                      <th className="px-4 py-2 text-center rounded-tl-2xl">From</th>
                      <th className="px-4 py-2 text-center">To</th>
                      <th className="px-4 py-2 text-center">New Patients</th>
                      <th className="px-4 py-2 text-center">Total Visits</th>
                      <th className="px-4 py-2 text-center">In Progress Treatments</th>
                      <th className="px-4 py-2 text-center">Avg Patient Rating</th>
                      <th className="px-4 py-2 text-center rounded-tr-2xl">
                        Avg Visits Per Patient
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients?.map((patient, index) => (
                      <tr
                        key={index}
                        className={`p-3 ${
                          index !== patients.length - 1
                            ? "border-b-[1px] border-b-gray-300"
                            : ""
                        } text-center font-semibold`}
                      >
                        <td className="px-4 py-2">{patient.from}</td>
                        <td className="px-4 py-2">{patient.to}</td>
                        <td className="px-4 py-2">{patient.new_patients}</td>
                        <td className="px-4 py-2">{patient.total_visits}</td>
                        <td className="px-4 py-2">{patient.inprogress_treatments}</td>
                        <td className="px-4 py-2">{patient.avg_patient_rating}</td>
                        <td className="px-4 py-2">{patient.avg_visits_per_patient}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto shadow-xl rounded-2xl mt-5">
                <table className="overflow-auto min-w-full border border-gray-200 bg-white rounded-xl shadow-sm">
                  <thead className="bg-[#089bab] text-white">
                    <tr>
                      <th className="px-4 py-2 text-center rounded-tl-2xl">From</th>
                      <th className="px-4 py-2 text-center">To</th>
                      <th className="px-4 py-2 text-center">New Patients</th>
                      <th className="px-4 py-2 text-center">Total Visits</th>
                      <th className="px-4 py-2 text-center">In Progress Treatments</th>
                      <th className="px-4 py-2 text-center">Avg Patient Rating</th>
                      <th className="px-4 py-2 text-center rounded-tr-2xl">
                        Avg Visits Per Patient
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center p-5 text-gray-500 font-semibold"
                      >
                        No Results Found
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
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
