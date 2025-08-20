// import components
import Button from "../../components/Button";
import FormInput from "../../components/FormInput";
import PlusButton from "../../components/PlusButton";
import Sidebar from "../../components/Sidebar";
import Title from "../../components/Title";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import Confirm from "../../components/Confirm";
// import icons
import { IoIosSearch } from "react-icons/io";
import { FiPlus } from "react-icons/fi";
import { MdEdit, MdDelete } from "react-icons/md";
// import hooks
import { useEffect, useRef, useState } from "react";
// import images
import successImage from "../../assets/success.gif";
import confirmDelete from "../../assets/deleteConfirm.jpg"
import error from "../../assets/error.gif";
// import axios library
import axios from "axios";
// import backend server configurations
import { BaseUrl, ImageUrl } from "../../config";
import Cookies from "universal-cookie";

export default function MedicationsPlans() {
  // States
  const [cards, setCards] = useState([]);
  const [medications, setMedications] = useState([]);
  const [count, setCount] = useState(0);
  const [addBox, setAddBox] = useState(false);
  const [editBox, setEditBox] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const [confirm, setConfirmDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [modal, setModal] = useState({
    isOpen: false,
    message: "",
    image: "",
  });

  const [medicationPlan, setMedicationPlan] = useState({
    id: null,
    medicationId: null,
    name: "",
    dose: "",
    duration_value: 1,
    duration_unit: "days",
    info: "",
    image: null,
  });

  const [oldMedicationPlan, setOldMedicationPlan] = useState({
    id: null,
    medicationId: null,
    name: "",
    dose: "",
    duration_value: 1,
    duration_unit: "days",
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Cookies
  const cookie = new Cookies();
  const token = cookie.get("token");

  // useRef
  const medicationPlanId = useRef(null);

  useEffect(() => {
    axios
      .get(`${BaseUrl}/medication-plan`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((data) => {
        setCards(data.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [count]);

  useEffect(() => {
    axios
      .get(`${BaseUrl}/medication`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((data) => {
        setMedications(data.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (confirm || addBox || editBox || showBox) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [confirm, addBox, editBox, showBox]);

  useEffect(() => {
    if (modal.isOpen) {
      const timer = setTimeout(() => {
        setModal((prev) => ({ ...prev, isOpen: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [modal.isOpen]);

  const showOptions = medications.map((medication, index) => (
    <option index={index} value={medication.id}>
      {medication.name}
    </option>
  ));

  async function handleDelete() {
    setIsLoading(true);
    try {
      await axios.delete(`${BaseUrl}/medication-plan/${medicationPlan.id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setConfirmDelete(false);
      setCount((prev) => prev + 1);
      setModal({
        isOpen: true,
        message: "The Medication Plan Has Been Deleted Successfully !",
        image: successImage,
      });
    } catch {
      setModal({
        isOpen: true,
        message: "Something Went Wrong !",
        image: error,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function Submit() {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("medication_id", medicationPlan.medicationId);
    formData.append("dose", medicationPlan.dose);
    formData.append("duration_value", medicationPlan.duration_value);
    formData.append("duration_unit", medicationPlan.duration_unit);
    try {
      await axios.post(`${BaseUrl}/medication-plan`, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setAddBox(false);
      setCount((prev) => prev + 1);
      setMedicationPlan({
        id: null,
        medicationId: null,
        name: "",
        dose: "",
        duration_value: 1,
        duration_unit: "days",
      });
      setModal({
        isOpen: true,
        message: "The Medication Plan Has Been Added Successfully !",
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

  async function Edit() {
    setIsLoading(true);
    const formData = new FormData();
    if (medicationPlan.medicationId !== oldMedicationPlan.medicationId) {
      formData.append("medication_id", medicationPlan.medicationId);
    }
    if (medicationPlan.dose !== oldMedicationPlan.dose) {
      formData.append("dose", medicationPlan.dose);
    }
    if (medicationPlan.duration_value !== oldMedicationPlan.duration_value) {
      formData.append("duration_value", medicationPlan.duration_value);
    }
    if (medicationPlan.duration_unit !== oldMedicationPlan.duration_unit) {
      formData.append("duration_unit", medicationPlan.duration_unit);
    }
    formData.append("_method", "patch");
    try {
      await axios.post(
        `${BaseUrl}/medication-plan/${medicationPlan.id}`,
        formData,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditBox(false);
      setCount((prev) => prev + 1);
      setMedicationPlan({
        id: null,
        medicationId: null,
        name: "",
        dose: "",
        duration_value: 1,
        duration_unit: "days",
      });
      setModal({
        isOpen: true,
        message: "The Medication Plan Has Been Added Successfully !",
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

  const filteredCards = cards?.filter((card) => {
    const title = (card.medication?.name || "").toString().toLowerCase();
    const q = searchQuery.trim().toLowerCase();
    return title.startsWith(q);
  });

  // Mapping
  const showCards = filteredCards.map((card, index) => (
    <div
      key={index}
      onClick={() => {
        setShowBox(true);
        setMedicationPlan({
          name: card.medication.name,
          dose: card.dose,
          duration_value: card.duration_value,
          duration_unit: card.duration_unit,
          info: card.medication.info,
          image: `${ImageUrl}${card.medication.image}`,
        });
      }}
      className="cursor-pointer shadow-xl bg-white rounded-xl p-4 flex flex-col justify-between text-center"
    >
      <div className="bg-blue-300 rounded-md h-[150px] md:h-[125px] bg-contain">
        <imgDose
          className="rounded-md w-full h-full"
          src={`${ImageUrl}${card.medication.image}`}
          alt="medication_image"
        />
      </div>
      <div className="my-3 font-semibold">
        <div className="flex justify-between">
          <label className="font-bold mr-2">Name:</label>
          <label>{card.medication.name}</label>
        </div>
        <div className="flex justify-between my-2">
          <label className="font-bold mr-2">Dose:</label>
          <label className="text-right">{card.dose || "No Informations"}</label>
        </div>
        <div className="flex justify-between">
          <label className="font-bold mr-2">Duration:</label>
          <label>
            {card.duration_value} {card.duration_unit}
          </label>
        </div>
      </div>
      <div className="flex text-2xl justify-center">
        <div
          onClick={(e) => {
            setEditBox(true);
            e.stopPropagation();
            const selectedPlan = {
              id: card.id,
              medicationId: card.medication.id,
              name: card.medication.name,
              dose: card.dose,
              duration_value: card.duration_value,
              duration_unit: card.duration_unit,
            };
            setMedicationPlan(selectedPlan);
            setOldMedicationPlan(selectedPlan);
          }}
          className="bg-[#089bab] p-1 mr-2 text-white rounded-lg md:rounded-xl border-2 border-[#089bab] hover:bg-transparent hover:text-black transition duration-300 cursor-pointer"
        >
          <MdEdit className="text-sm md:text-base" />
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            medicationPlanId.current = card.id;
            setConfirmDelete(true);
            setMedicationPlan((prev) => ({
              ...prev,
              id: card.id,
              name: card.medication.name,
            }));
          }}
          className="bg-red-500 p-1 text-white rounded-lg md:rounded-xl border-2 border-red-500 hover:bg-transparent hover:text-black transition duration-300 cursor-pointer"
        >
          <MdDelete className="text-sm md:text-base" />
        </div>
      </div>
    </div>
  ));

  const increment = () =>
    setMedicationPlan((prev) => ({
      ...prev,
      duration_value: medicationPlan.duration_value + 1,
  }));

  const decrement = () =>
    setMedicationPlan((prev) => ({
      ...prev,
      duration_value:
        medicationPlan.duration_value > 1
          ? medicationPlan.duration_value - 1
          : medicationPlan.duration_value,
  }));

  const handleCancelDelete = () => {
    setConfirmDelete(false);
    setMedicationPlan((prev) => ({
      ...prev,
      name: "",
    }));
  }

  return (
    <>
      <Sidebar />

      <div className="page-content p-3 md:py-5 md:p-5 bg-[#089bab1c]">
        <Title label="Medications Plans" />
        <div className="mt-3 flex items-center">
          <Button
            onClick={() => setAddBox(true)}
            className="md:mr-5 min-w-[250px] hidden md:flex"
            variant="primary"
            icon={<FiPlus className="mr-3 text-2xl" />}
            children="Add Medication Plan"
          />
          <PlusButton onClick={() => setAddBox(true)} />
          <FormInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<IoIosSearch className="text-black text-lg" />}
            placeholder="Search"
            className="w-full md:w-[250px] bg-white border-[#089bab] placeholder-black shadow-lg"
          />
        </div>
        <div className="content grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 py-5">
          {showCards}
        </div>
      </div>

      {addBox && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-2">
          <div className="bg-white rounded-xl p-5 text-xl flex flex-col items-center shadow-xl w-[500px]">
            <div className=" mb-5 w-full">
              <h1 className="font-bold text-2xl text-center">
                Add Treatment Note
              </h1>
              <div className="flex items-center my-3 font-semibold">
                <label className="px-4 mb-1">Medication Name <span className="ml-1 text-red-500 text-sm">required</span></label>
                <select
                  value={medicationPlan.medicationId}
                  onChange={(e) =>
                    setMedicationPlan((prev) => ({
                      ...prev,
                      medicationId: e.target.value,
                    }))
                  }
                  className="w-[175px] mb-[10px] ml-5 border-2 border-transparent focus:border-[#089bab] bg-gray-300 rounded-xl px-3 py-1 outline-none cursor-pointer"
                >
                  <option>None</option>
                  {showOptions}
                </select>
              </div>
              <div className="flex flex-col my-3 font-semibold">
                <label className="px-4 mb-2">Dose</label>
                <input
                  name="Medication Name"
                  value={medicationPlan.dose}
                  onChange={(e) =>
                    setMedicationPlan((prev) => ({
                      ...prev,
                      dose: e.target.value,
                    }))
                  }
                  autoFocus
                  placeholder="Add medication plan dose"
                  className="placeholder:text-base outline-none border-2 border-transparent focus:border-[#089bab] bg-gray-100 rounded-xl py-1 px-4"
                />
              </div>
              <div className="flex items-center font-semibold mt-3 flex-wrap justify-end">
                <label className="px-4 flex-1 mb-[10px]">Duration</label>
                <div className="flex items-center mb-[10px]">
                <button
                  onClick={decrement}
                  disabled={medicationPlan.duration_value <= 1}
                  className={`border-2 border-transparent w-[25px] h-[25px] flex items-center justify-center rounded-full duration-300
                    ${medicationPlan.duration_value <= 1
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-[#089bab] text-white hover:bg-white hover:text-black hover:border-[#089bab]"}
                  `}
                >
                  −
                </button>
                  <input
                    type="number"
                    value={medicationPlan.duration_value}
                    onChange={(e) =>
                      setMedicationPlan((prev) => ({
                        ...prev,
                        duration_value: e.target.value,
                      }))
                    }
                    className="bg-gray-300 w-20 text-center outline-none border-none rounded-xl mx-2 px-2 py-1"
                  />
                  <button
                    onClick={increment}
                    className="border-2 border-transparent bg-[#089bab] w-[25px] h-[25px] flex items-center justify-center text-white hover:bg-white hover:text-black hover:border-[#089bab] rounded-full duration-300"
                  >
                    +
                  </button>
                </div>
                <select
                  value={medicationPlan.duration_unit}
                  onChange={(e) =>
                    setMedicationPlan((prev) => ({
                      ...prev,
                      duration_unit: e.target.value,
                    }))
                  }
                  className="mb-[10px] ml-5 border-2 border-transparent focus:border-[#089bab] bg-gray-300 rounded-xl px-3 py-1 outline-none cursor-pointer"
                >
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center w-full mt-5">
              <button
                onClick={() => {
                  setAddBox(false);
                  setMedicationPlan({
                    id: null,
                    medicationId: null,
                    name: "",
                    dose: "",
                    duration_value: 1,
                    duration_unit: "days",
                  });
                }}
                className="w-[85px] bg-[#9e9e9e] border-2 border-[#9e9e9e] p-1 rounded-xl text-white hover:bg-transparent hover:text-black duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => Submit()}
                disabled={!medicationPlan.medicationId || medicationPlan.medicationId === "None"}
                className={`w-[85px] p-1 rounded-xl text-white ml-7 border-2 
                  ${!medicationPlan.medicationId || medicationPlan.medicationId === "None" 
                    ? "bg-gray-400 border-gray-400 cursor-not-allowed" 
                    : "bg-[#089bab] border-[#089bab] hover:bg-transparent hover:text-black duration-300"}`}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {editBox && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-2">
          <div className="bg-white rounded-xl p-5 text-xl flex flex-col items-center shadow-xl w-[500px]">
            <div className=" mb-5 w-full">
              <h1 className="font-bold text-2xl text-center">
                Edit Treatment Note
              </h1>
              <div className="flex flex items-center my-3 font-semibold">
                <label className="px-4 mb-2">Medication Name <span className="ml-1 text-red-500 text-sm">required</span></label>
                <select
                  value={medicationPlan.medicationId}
                  onChange={(e) =>
                    setMedicationPlan((prev) => ({
                      ...prev,
                      medicationId: e.target.value,
                    }))
                  }
                  className="w-[175px] mb-[10px] ml-5 border-2 border-transparent focus:border-[#089bab] bg-gray-300 rounded-xl px-3 py-1 outline-none cursor-pointer"
                >
                  <option>None</option>
                  {showOptions}
                </select>
              </div>
              <div className="flex flex-col my-3 font-semibold">
                <label className="px-4 mb-2">Dose</label>
                <input
                  name="Medication Name"
                  value={medicationPlan.dose}
                  onChange={(e) =>
                    setMedicationPlan((prev) => ({
                      ...prev,
                      dose: e.target.value,
                    }))
                  }
                  autoFocus
                  placeholder="Add medication plan dose"
                  className="placeholder:text-base outline-none border-2 border-transparent focus:border-[#089bab] bg-gray-100 rounded-xl py-1 px-4"
                />
              </div>
              <div className="flex items-center font-semibold mt-3 flex-wrap justify-end">
                <label className="px-4 flex-1 mb-[10px]">Duration</label>
                <div className="flex items-center mb-[10px]">
                <button
                  onClick={decrement}
                  disabled={medicationPlan.duration_value <= 1}
                  className={`border-2 border-transparent w-[25px] h-[25px] flex items-center justify-center rounded-full duration-300
                    ${medicationPlan.duration_value <= 1
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-[#089bab] text-white hover:bg-white hover:text-black hover:border-[#089bab]"}
                  `}
                >
                  −
                </button>
                  <input
                    type="number"
                    value={medicationPlan.duration_value}
                    onChange={(e) =>
                      setMedicationPlan((prev) => ({
                        ...prev,
                        duration_value: e.target.value,
                      }))
                    }
                    className="bg-gray-300 w-20 text-center outline-none border-none rounded-xl mx-2 px-2 py-1"
                  />
                  <button
                    onClick={increment}
                    className="border-2 border-transparent bg-[#089bab] w-[25px] h-[25px] flex items-center justify-center text-white hover:bg-white hover:text-black hover:border-[#089bab] rounded-full duration-300"
                  >
                    +
                  </button>
                </div>
                <select
                  value={medicationPlan.duration_unit}
                  onChange={(e) =>
                    setMedicationPlan((prev) => ({
                      ...prev,
                      duration_unit: e.target.value,
                    }))
                  }
                  className="mb-[10px] ml-5 border-2 border-transparent focus:border-[#089bab] bg-gray-300 rounded-xl px-3 py-1 outline-none cursor-pointer"
                >
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center w-full mt-5">
              <button
                onClick={() => {
                  setEditBox(false);
                  setMedicationPlan({
                    id: null,
                    medicationId: null,
                    name: "",
                    dose: "",
                    duration_value: 1,
                    duration_unit: "days",
                  });
                }}
                className="w-[85px] bg-[#9e9e9e] border-2 border-[#9e9e9e] p-1 rounded-xl text-white hover:bg-transparent hover:text-black duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => Edit()}
                disabled={
                  !medicationPlan.medicationId ||
                  medicationPlan.medicationId === "None" ||
                  (
                    medicationPlan.medicationId === oldMedicationPlan.medicationId &&
                    medicationPlan.dose === oldMedicationPlan.dose &&
                    medicationPlan.duration_value === oldMedicationPlan.duration_value &&
                    medicationPlan.duration_unit === oldMedicationPlan.duration_unit
                  )
                }
                className={`w-[85px] p-1 rounded-xl text-white ml-7 border-2 
                  ${
                    !medicationPlan.medicationId ||
                    medicationPlan.medicationId === "None" ||
                    (
                      medicationPlan.medicationId === oldMedicationPlan.medicationId &&
                      medicationPlan.dose === oldMedicationPlan.dose &&
                      medicationPlan.duration_value === oldMedicationPlan.duration_value &&
                      medicationPlan.duration_unit === oldMedicationPlan.duration_unit
                    )
                      ? "bg-gray-400 border-gray-400 cursor-not-allowed"
                      : "bg-[#089bab] border-[#089bab] hover:bg-transparent hover:text-black duration-300"
                  }`}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {showBox && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-2">
          <div className="relative bg-white rounded-xl p-5 text-xl flex flex-col items-center shadow-xl w-[500px]">
            <div
              onClick={() => {
                setShowBox(false);
                setMedicationPlan({
                  name: "",
                  dose: "",
                  duration_value: 1,
                  duration_unit: "days",
                  info: "",
                });
              }}
              className="absolute top-[15px] right-[15px] hover:text-[#089bab] font-bold cursor-pointer duration-300"
            >
              X
            </div>
            <div className=" mb-5 w-full font-semibold">
              <h1 className="font-bold text-2xl text-center">
                Medication Plan Details
              </h1>
              <div className="my-3 object-cover w-full flex justify-center">
                <img
                  className="w-[150px] h-[150px]"
                  alt="medication-plan-image"
                  src={medicationPlan.image}
                />
              </div>
              <div className="flex justify-between my-3">
                <label>Name</label>
                <label className="text-[#089bab] ml-2">
                  {medicationPlan.name}
                </label>
              </div>
              <div className="flex flex-col">
                <label>Description</label>
                <div className="h-[200px] bg-gray-200 rounded-2xl p-5 mt-2 overflow-y-auto text-[#089bab]">
                  {medicationPlan.info}
                </div>
              </div>
              <div className="flex justify-between mt-3">
                <label>Duration</label>
                <div className="text-[#089bab] ml-2">
                  <label className="mr-2">
                    {medicationPlan.duration_value}
                  </label>
                  <label>{medicationPlan.duration_unit}</label>
                </div>
              </div>
              <div className="flex justify-between mt-3">
                <label>Dose</label>
                <label className="text-[#089bab] ml-2">
                  {medicationPlan.dose}
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirm &&(
        <Confirm
          img={confirmDelete}
          label={<>Do You Want Really To Delete <span className="font-bold">{medicationPlan.name}</span> ?</>}
          onCancel={() => handleCancelDelete()}
          onConfirm={() => handleDelete()}
        />
      )}

      {isLoading && <Loading />}

      {modal.isOpen && <Modal message={modal.message} imageSrc={modal.image} />}
    </>
  );
}
