import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Title from "../../components/Title";
import { useEffect, useState } from "react";
import axios from "axios";
import { BaseUrl } from "../../config";
import MedicationDropDown from "../../components/MedicationDropDown";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import successImage from "../../assets/success.gif";
import error from "../../assets/error.gif";
import TreatmentNoteDropDown from "../../components/TreatmentNoteDropDown";
import { MdEdit, MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import Confirm from "../../components/Confirm";
import { IoIosArrowBack } from "react-icons/io";
import Cookies from "universal-cookie";
import confirmDelete from "../../assets/deleteConfirm.jpg"

export default function TreatmentPlan() {
  // useState
  const [plan, setPlan] = useState(null);
  const [originalPlan, setOriginalPlan] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tooth, setTooth] = useState([]);
  const [addStep, setAddStep] = useState(false);
  const [addSubstep, setAddSubstep] = useState(false);
  const [medications, setMedicationsPlans] = useState(null);
  const [treatmentsNotes, setTreatmentsNotes] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [confirmDeleteStep, setConfirmDeleteStep] = useState(false);
  const [confirmDeleteSubstep, setConfirmDeleteSubstep] = useState(false);

  const [stepInfo, setStepInfo] = useState({
    id: null,
    name: "",
    number: null,
    optionality: 0,
    medication_plan: null,
    treatment_note: null,
  });

  const [substepInfo, setSubstepInfo] = useState({
    id: null,
    step_id: null,
    name: "",
    number: null,
    optionality: 0,
  });

  const [modal, setModal] = useState({
    isOpen: false,
    message: "",
    image: "",
  });

  // useLocation
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const PlanId = params.get("id");

  const nav = useNavigate();

  // Cookies
  const cookie = new Cookies();
  const token = cookie.get("token");

  useEffect(() => {
    axios
      .get(`${BaseUrl}/treatment-plan/${PlanId}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((data) => {
        setPlan(data.data.data);
        setOriginalPlan(data.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refreshFlag]);

  useEffect(() => {
    axios
      .get(`${BaseUrl}/category`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((data) => {
        setCategories(data.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${BaseUrl}/tooth-status`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((data) => {
        setTooth(data.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${BaseUrl}/medication-plan`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((data) => {
        setMedicationsPlans(data.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${BaseUrl}/treatment-note`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((data) => {
        setTreatmentsNotes(data.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (addStep) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [addStep]);

  useEffect(() => {
    if (modal.isOpen) {
      const timer = setTimeout(() => {
        setModal((prev) => ({ ...prev, isOpen: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [modal.isOpen]);

  const showCategoriesOptions = categories
    ? categories.map((category, index) => (
        <option
          className="border-none outline-none"
          key={index}
          value={category.id}
        >
          {category.name}
        </option>
      ))
    : null;

  const showToothNames = tooth
    ? tooth.map((onlyTooth, index) => (
        <option
          className="border-none outline-none"
          key={index}
          value={onlyTooth.id}
        >
          {onlyTooth.name}
        </option>
      ))
    : null;

  const showSteps = plan?.steps
    ? plan.steps.map((step, index) => (
        <div key={index} className="mt-5 md:mt-4">
          <div className="flex items-center flex-col md:flex-row">
            <span className="text-xl font-semibold">
              {step?.queue}. {step?.name}
            </span>
            <span className="mx-3 text-base font-semibold text-gray-500">
              {step?.optional === 0 ? "(Mandatory)" : "(Optional)"}
            </span>
            <div className="flex text-white">
              <div
                onClick={() => {
                  setAddSubstep(true);
                  setSubstepInfo((prev) => ({
                    ...prev,
                    step_id: step.id,
                  }));
                }}
                title="Add Substep"
                className="text-[#089bab] p-1 hover:text-black transition duration-300 cursor-pointer"
              >
                <FaPlus className="text-lg" />
              </div>
              <div
                onClick={(e) => {}}
                className="text-[#089bab] p-1 hover:text-black transition duration-300 cursor-pointer"
              >
                <MdEdit className="text-lg" />
              </div>
              <div
                onClick={(e) => {
                  setConfirmDeleteStep(true);
                  setStepInfo({
                    id: step.id,
                    name: step.name,
                  });
                }}
                className="text-red-500 p-1 hover:text-black transition duration-300 cursor-pointer"
              >
                <MdDelete className="text-lg" />
              </div>
            </div>
          </div>
          <div className="md:ml-5 font-semibold text-gray-500 flex justify-center md:justify-start">
            <span className="mr-3">
              {step?.medication_plan?.medication?.name}
            </span>
            <span>{step?.treatment_note?.title}</span>
          </div>
          {step?.treatment_substeps && (
            <div className="ml-8 mt-1 space-y-1 font-semibold">
              {step.treatment_substeps.map((sub, subIndex) => (
                <div key={subIndex} className="text-gray-700 flex">
                  <div>
                    <span className="mr-2">
                      {step?.queue}.{sub?.queue}
                    </span>
                    <span>{sub?.name}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      {sub?.optional === 0 ? "(Mandatory)" : "(Optional)"}
                    </span>
                  </div>
                  <div className="flex ml-3">
                    <div
                      onClick={(e) => {}}
                      className="text-[#089bab] p-1 hover:text-black transition duration-300 cursor-pointer"
                    >
                      <MdEdit className="text-lg" />
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDeleteSubstep(true);
                        setSubstepInfo({
                          id: sub.id,
                          name: sub.name,
                        });
                      }}
                      className="text-red-500 p-1 hover:text-black transition duration-300 cursor-pointer"
                    >
                      <MdDelete className="text-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))
    : null;

  function isDirty() {
    if (!originalPlan || !plan) return false;
    return (
      plan.name !== originalPlan.name ||
      plan.cost !== originalPlan.cost ||
      plan.category?.id !== originalPlan.category?.id ||
      plan.tooth_status?.id !== originalPlan.tooth_status?.id
    );
  }

  const handleCancelStepDelete = () => {
    setConfirmDeleteStep(false);
    setStepInfo({
      id: null,
      name: "",
    });
  }

  const handleCancelSubstepDelete = () => {
    setConfirmDeleteSubstep(false);
    setSubstepInfo({
      id: null,
      name: "",
      optionality: 0,
    });
  }

  async function Add() {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("treatment_plan_id", PlanId);
    formData.append("name", stepInfo.name);
    formData.append("queue", stepInfo.number !== null ? stepInfo.number : 0);
    formData.append("optional", stepInfo.optionality === "undefined" ? 0 : 1);
    if (stepInfo.medication_plan !== null && stepInfo.medication_plan !== "undefined") {
      formData.append("medication_plan_id", stepInfo.medication_plan);
    }
    if (stepInfo.treatment_note !== null) {
      formData.append("treatment_note_id", stepInfo.treatment_note);
    }
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    try {
      await axios.post(`${BaseUrl}/treatment-step`, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setRefreshFlag((prev) => prev + 1);
      setStepInfo({
        name: "",
        number: null,
        optionality: 0,
        medication_plan: null,
        treatment_note: null,
      });
      setAddStep(false);
      setModal({
        isOpen: true,
        message: "The Step Has Been Added Successfully!",
        image: successImage,
      });
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

  async function AddSubstep() {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("treatment_step_id", substepInfo.step_id);
    formData.append("name", substepInfo.name);
    formData.append(
      "queue",
      substepInfo.number !== null ? substepInfo.number : 0
    );
    formData.append(
      "optional",
      substepInfo.optionality === "undefined" ? 0 : substepInfo.optionality
    );
    try {
      await axios.post(`${BaseUrl}/treatment-substep`, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setRefreshFlag((prev) => prev + 1);
      setSubstepInfo({
        step_id: null,
        name: "",
        number: null,
        optionality: 0,
      });
      setAddStep(false);
      setModal({
        isOpen: true,
        message: "The Substep Has Been Added Successfully!",
        image: successImage,
      });
      setAddSubstep(false);
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

  async function DeleteSubstep() {
    setIsLoading(true);
    try {
      await axios.delete(`${BaseUrl}/treatment-substep/${substepInfo.id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setSubstepInfo(() => ({
        id: null,
        name: "",
        optionality: 0,
      }));
      setRefreshFlag((prev) => prev + 1);
      setModal({
        isOpen: true,
        message: "The Substep Has Been Deleted Successfully !",
        image: successImage,
      });
    } catch {
      setModal({
        isOpen: true,
        message: "Something Went Wrong !",
        image: error,
      });
    } finally {
      setConfirmDeleteSubstep(false);
      setIsLoading(false);
    }
  }

  async function DeleteStep() {
    setIsLoading(true);
    try {
      await axios.delete(`${BaseUrl}/treatment-step/${stepInfo.id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setStepInfo(() => ({
        name: "",
        number: null,
        optionality: 0,
        medication_plan: null,
        treatment_note: null,
      }));
      setRefreshFlag((prev) => prev + 1);
      setModal({
        isOpen: true,
        message: "The Step Has Been Deleted Successfully !",
        image: successImage,
      });
    } catch {
      setModal({
        isOpen: true,
        message: "Something Went Wrong !",
        image: error,
      });
    } finally {
      setConfirmDeleteStep(false);
      setIsLoading(false);
    }
  }

  async function EditPlan() {
    const formData = new FormData();

    if (plan.name !== originalPlan.name) {
      formData.append("name", plan.name);
    }

    if (plan.cost !== originalPlan.cost) {
      formData.append("cost", plan.cost);
    }

    if (plan.category?.id !== originalPlan.category?.id) {
      formData.append("category_id", parseInt(plan.category));
    }

    if (plan.tooth_status?.id !== originalPlan.tooth_status?.id) {
      formData.append("tooth_status_id", plan.tooth_status);
    }

    formData.append("_method", "patch");
    try {
      await axios.post(`${BaseUrl}/treatment-plan/${PlanId}`, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setPlan(() => ({
        id: null,
        name: "",
        category: "",
        cost: null,
        tooth_status: "",
      }));
      setRefreshFlag((prev) => prev + 1);
      setModal({
        isOpen: true,
        message: "The Plan Has Been Edited Successfully !",
        image: successImage,
      });
      setTimeout(() => {
        nav(`/treatments-plans`);
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

  return (
    <>
      <Sidebar />
      <div className="page-content p-3 md:py-5 md:p-5 bg-[#089bab1c] overflow-hidden">
        <div className="flex items-center">
          <IoIosArrowBack
            onClick={() => nav("/treatments-plans")}
            className="text-2xl cursor-pointer duration-300 hover:text-[#089bab]"
          />
          <Title className="flex-1" label="Treatment Plan Details" />
        </div>
        {/* Main Details Box */}
        <div className="bg-transparent mt-3 p-5 rounded-xl flex flex-col lg:flex-row">
          <div className="lg:w-1/2 text-xl pr-5">
            <div className=" flex flex-col md:flex-row md:items-center w-full justify-between">
              <p className="font-semibold mb-2 md:mb-0">Name:</p>
              <input
                name="name"
                value={plan?.name || ""}
                onChange={(e) =>
                  setPlan((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                autoFocus
                placeholder="Edit Plan name"
                className="bg-white shadow-lg w-full md:w-[200px] md:ml-5 placeholder:text-base outline-none border-2 border-transparent focus:border-[#089bab] rounded-xl py-1 px-4"
              />
            </div>
            <div className="flex flex-col md:flex-row md:items-center my-2 justify-between">
              <p className="font-semibold mb-2 md:mb-0">Category:</p>
              <select
                value={plan?.category?.id}
                onChange={(e) =>
                  setPlan((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className="bg-white shadow-lg w-full md:w-[200px] md:ml-5 border-2 border-transparent focus:border-[#089bab] rounded-xl px-3 py-1 outline-none cursor-pointer"
              >
                <option>None</option>
                {showCategoriesOptions}
              </select>
            </div>
            <div className="flex flex-col md:flex-row md:items-center w-full justify-between my-2">
              <p className="font-semibold mb-2 md:mb-0">Cost:</p>
              <input
                placeholder="Edit plan cost"
                type="number"
                value={plan?.cost}
                onChange={(e) =>
                  setPlan((prev) => ({
                    ...prev,
                    cost: e.target.value,
                  }))
                }
                className="bg-white shadow-lg w-full md:w-[200px] md:ml-5 placeholder:text-base text-center outline-none border-2 border-transparent focus:border-[#089bab] rounded-xl px-2 py-1"
              />
            </div>
            <div className="flex flex-col md:flex-row md:items-center w-full justify-between">
              <p className="font-semibold mb-2 md:mb-0">
                Tooth Status After Plan:
              </p>
              <select
                value={plan?.tooth_status?.id}
                onChange={(e) =>
                  setPlan((prev) => ({
                    ...prev,
                    tooth_status: e.target.value,
                  }))
                }
                className="bg-white shadow-lg w-full md:w-[200px] md:ml-5 border-2 border-transparent focus:border-[#089bab] rounded-xl px-3 py-1 outline-none cursor-pointer"
              >
                <option>None</option>
                {showToothNames}
              </select>
            </div>
            <div className="flex justify-center mt-5">
              <button
                disabled={!isDirty()}
                onClick={EditPlan}
                className={`text-sm md:text-xl rounded-xl px-4 py-1 border-2 duration-300
                  ${
                    isDirty()
                      ? "bg-[#089bab] text-white border-[#089bab] hover:text-black hover:bg-transparent"
                      : "bg-gray-300 text-gray-600 border-gray-300 cursor-not-allowed"
                  }
                `}
              >
                Save Changes
              </button>
            </div>
          </div>
          <div
            style={{ boxShadow: "0px 15px 20px 5px rgba(0, 0, 0, 0.25)" }}
            className="bg-white rounded-xl p-5 lg:w-1/2 mt-5 lg:mt-0"
          >
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold">Steps</h1>
              <button
                onClick={() => setAddStep(true)}
                className="flex items-center justify-center w-[25px] h-[25px] ml-3 text-xl rounded-full bg-[#089bab] text-white hover:text-black hover:bg-transparent duration-300 border-2 border-[#089bab]"
              >
                +
              </button>
            </div>
            {showSteps}
          </div>
        </div>
      </div>

      {addStep && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-2">
          <div className="bg-white rounded-xl p-5 text-xl flex flex-col items-center shadow-xl w-[500px]">
            <div className=" mb-5 w-full">
              <h1 className="font-bold text-2xl text-center">Add Step</h1>
              <div className="flex flex-col my-3 font-semibold">
                <label className="pr-4 mb-2">Name</label>
                <input
                  name="name"
                  value={stepInfo.name}
                  onChange={(e) =>
                    setStepInfo((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  autoFocus
                  placeholder="Add step name"
                  className="placeholder:text-base outline-none border-2 border-transparent focus:border-[#089bab] bg-gray-200 rounded-xl py-1 px-4"
                />
              </div>
              <div className="flex my-3 font-semibold justify-between items-center">
                <label className="pr-4">Number</label>
                <input
                  placeholder="Add step number"
                  type="number"
                  value={stepInfo.number}
                  onChange={(e) =>
                    setStepInfo((prev) => ({
                      ...prev,
                      number: e.target.value,
                    }))
                  }
                  className="placeholder:text-base w-[150px] bg-gray-200 text-center outline-none border-2 border-transparent focus:border-[#089bab] rounded-xl px-2 py-1"
                />
              </div>
              <div className="flex items-center justify-between items-center">
                <label className="pr-4 mb-2 font-semibold">
                  Medications Plan
                </label>
                <MedicationDropDown
                  medications={medications}
                  onSelect={(med) =>
                    setStepInfo((prev) => ({
                      ...prev,
                      medication_plan: med.id,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between items-center">
                <label className="pr-4 mb-2 font-semibold">
                  Treatment Note
                </label>
                <TreatmentNoteDropDown
                  treatmentsNotes={treatmentsNotes}
                  onSelect={(med) =>
                    setStepInfo((prev) => ({
                      ...prev,
                      treatment_note: med.id,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between font-semibold">
                <label className="pr-4">Optionality</label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={stepInfo.optionality === 1}
                      onChange={() =>
                        setStepInfo((prev) => ({
                          ...prev,
                          optionality: prev.optionality === 1 ? 0 : 1,
                        }))
                      }
                      className="sr-only"
                    />
                    <div
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition ${
                        stepInfo.optionality === 1
                          ? "bg-gray-300"
                          : "bg-[#089bab]"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                          stepInfo.optionality === 1
                            ? "translate-x-4"
                            : "translate-x-0"
                        }`}
                      />
                    </div>
                    <span className="ml-2 text-sm w-[75px]">
                      {stepInfo.optionality === 1 ? "Optional" : "Mandatory"}
                    </span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-center w-full mt-5">
              <button
                className="w-[85px] bg-[#9e9e9e] border-2 border-[#9e9e9e] p-1 rounded-xl text-white hover:bg-transparent hover:text-black duration-300"
                onClick={() => {
                  setAddStep(false);
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => Add()}
                className="w-[85px] bg-[#089bab] border-2 border-[#089bab] p-1 rounded-xl text-white hover:bg-transparent hover:text-black duration-300 ml-7"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {addSubstep && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-2">
          <div className="bg-white rounded-xl p-5 text-xl flex flex-col items-center shadow-xl w-[500px]">
            <div className=" mb-5 w-full">
              <h1 className="font-bold text-2xl text-center">Add Substep</h1>
              <div className="flex flex-col my-3 font-semibold">
                <label className="pr-4 mb-2">Name</label>
                <input
                  name="name"
                  value={substepInfo.name}
                  onChange={(e) =>
                    setSubstepInfo((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  autoFocus
                  placeholder="Add substep name"
                  className="placeholder:text-base outline-none border-2 border-transparent focus:border-[#089bab] bg-gray-200 rounded-xl py-1 px-4"
                />
              </div>
              <div className="flex my-3 font-semibold justify-between items-center">
                <label className="pr-4">Number</label>
                <input
                  placeholder="Substep number"
                  type="number"
                  value={substepInfo.number}
                  onChange={(e) =>
                    setSubstepInfo((prev) => ({
                      ...prev,
                      number: e.target.value,
                    }))
                  }
                  className="placeholder:text-base w-[150px] bg-gray-200 text-center outline-none border-2 border-transparent focus:border-[#089bab] rounded-xl px-2 py-1"
                />
              </div>
              <div className="flex items-center justify-between font-semibold">
                <label className="pr-4">Optionality</label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={substepInfo.optionality === 1}
                      onChange={() =>
                        setSubstepInfo((prev) => ({
                          ...prev,
                          optionality: prev.optionality === 1 ? 0 : 1,
                        }))
                      }
                      className="sr-only"
                    />
                    <div
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition ${
                        substepInfo.optionality === 1
                          ? "bg-gray-300"
                          : "bg-[#089bab]"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                          substepInfo.optionality === 1
                            ? "translate-x-4"
                            : "translate-x-0"
                        }`}
                      />
                    </div>
                    <span className="ml-2 text-sm w-[75px]">
                      {substepInfo.optionality === 1 ? "Optional" : "Mandatory"}
                    </span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-center w-full mt-5">
              <button
                className="w-[85px] bg-[#9e9e9e] border-2 border-[#9e9e9e] p-1 rounded-xl text-white hover:bg-transparent hover:text-black duration-300"
                onClick={() => {
                  setAddSubstep(false);
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => AddSubstep()}
                className="w-[85px] bg-[#089bab] border-2 border-[#089bab] p-1 rounded-xl text-white hover:bg-transparent hover:text-black duration-300 ml-7"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteStep && (
        <Confirm
          img={confirmDelete}
          label={<>Do You Want Really To Delete <span className="font-bold">{stepInfo.name}</span> ?</>}
          onCancel={() => handleCancelStepDelete()}
          onConfirm={() => DeleteStep()}
        />
      )}

      {confirmDeleteSubstep &&
        <Confirm
          img={confirmDelete}
          label={<>Do You Want Really To Delete <span className="font-bold">{substepInfo.name}</span> ?</>}
          onCancel={() => handleCancelSubstepDelete()}
          onConfirm={() => DeleteSubstep()}
        />
      }

      {isLoading && <Loading />}

      {modal.isOpen && <Modal message={modal.message} imageSrc={modal.image} />}
    </>
  );
}
