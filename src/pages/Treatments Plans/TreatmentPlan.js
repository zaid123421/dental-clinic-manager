import { useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Title from "../../components/Title";
import { useEffect, useState } from "react";
import axios from "axios";
import { BaseUrl } from "../../config";
import MedicationDropdown from "../../components/MedicationDropdown";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import successImage from '../../assets/success.gif';
import error from '../../assets/error.gif';
import TreatmentNoteDropDown from "../../components/TreatmentNoteDropDown";

export default function TreatmentPlan() {

  // useState
  const [plan, setPlan] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tooth, setTooth] = useState([]);
  const [addStep, setAddStep] = useState(false);
  const [medications, setMedicationsPlans] = useState(null);
  const [treatmentsNotes, setTreatmentsNotes] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [stepInfo, setStepInfo] = useState({
    name: "",
    number: null,
    optionality: 0,
    medication_plan: null,
    treatment_note: null
  })

  const [modal, setModal] = useState({
    isOpen: false,
    message: "",
    image: "",
  });

  // useLocation
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const PlanId = params.get('id');

  useEffect(() => {
    axios
      .get(`${BaseUrl}/treatment-plan/${PlanId}`, {
        headers: {
          Accept: "application/json",
        },
      })
      .then((data) => {
        setPlan(data.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
  axios
    .get(`${BaseUrl}/category`, {
      headers: {
        Accept: "application/json",
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

  const showCategoriesOptions = categories?.map((category, index) => (
    <option className="border-none outline-none" key={index} value={category.id}>{category.name}</option>
  ));

  const showToothNames = tooth?.map((onlyTooth, index) => (
    <div className="border-none outline-none" key={index} value={onlyTooth.id}>{onlyTooth.name}</div>
  ));

  async function Add(){
    setIsLoading(true);
    const formData = new FormData();
    formData.append("treatment_plan_id", PlanId);
    formData.append("name", stepInfo.name);
    formData.append("queue", stepInfo.number);
    formData.append("optional", stepInfo.optionality);
    formData.append("medication_plan_id", stepInfo.medication_plan);
    formData.append("treatment_note_id", stepInfo.treatment_note);
    try {
      await axios.post(`${BaseUrl}/treatment-step`, formData,
        {
          headers: {
            // Accept: "application/json",
            // Authorization: `Bearer ${token}`,
          },
        });
          setStepInfo({
            name: "",
            number: null,
            optionality: 0,
            medication_plan: null,
            treatment_note: null
          });
          setAddStep(false);
          setModal({
            isOpen: true,
            message: "The Step Has Been Added Successfully!",
            image: successImage,
          });
    } catch (err) {
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
      <div className="page-content px-7 py-5 md:p-5 bg-[#089bab1c] overflow-hidden">
        <Title label="Treatment Plan Details" />
        {/* Main Details Box */}
        <div style={{ boxShadow: "0px 15px 20px 5px rgba(0, 0, 0, 0.25)" }}
        className="bg-white mt-3 p-5 rounded-xl flex flex-col lg:flex-row">
          <div className="lg:w-1/2 text-xl pr-5">
            <div className="flex flex-col md:flex-row md:items-center w-full justify-between">
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
                className="w-full md:w-[200px] md:ml-5 placeholder:text-base outline-none border-2 border-transparent focus:border-[#089bab] bg-gray-200 rounded-xl py-1 px-4"
                />
            </div>
            <div className="flex flex-col md:flex-row md:items-center my-2 justify-between">
              <p className="font-semibold mb-2 md:mb-0">Category:</p>
              <select
                value={plan?.category?.name}
                onChange={(e) => setPlan((prev) => ({
                  ...prev,
                  category: e.target.value
                }))}
                className="w-full md:w-[200px] md:ml-5 border-2 border-transparent focus:border-[#089bab] bg-gray-200 rounded-xl px-3 py-1 outline-none cursor-pointer"
              >
                  <option>None</option>
                  {showCategoriesOptions}
                </select>
            </div>
            <div className="flex flex-col md:flex-row md:items-center w-full justify-between my-2">
              <p className="font-semibold mb-2 md:mb-0">Cost:</p>
              <input placeholder="Edit plan cost" type="number"
                  value={plan?.cost}
                  onChange={(e) => setPlan((prev) => ({
                    ...prev,
                    cost: e.target.value
                  }))}
                  className="w-full md:w-[200px] md:ml-5 placeholder:text-base bg-gray-200 text-center outline-none border-2 border-transparent focus:border-[#089bab] rounded-xl px-2 py-1"
                />
            </div>
            <div className="flex flex-col md:flex-row md:items-center w-full justify-between">
              <p className="font-semibold mb-2 md:mb-0">Tooth Status After Plan:</p>
              <select
                  value={plan?.tooth_status?.name}
                  onChange={(e) => setPlan((prev) => ({
                    ...prev,
                    tooth_status: e.target.value
                  }))}
                  className="w-full md:w-[200px] md:ml-5 border-2 border-transparent focus:border-[#089bab] bg-gray-200 rounded-xl px-3 py-1 outline-none cursor-pointer"
                >
                  <option>None</option>
                  {showToothNames}
                </select>
            </div>
            <div className="flex justify-center mt-5">
              <button className="text-sm md:text-xl rounded-xl bg-[#089bab] text-white px-4 py-1 hover:text-black hover:bg-transparent duration-300 border-2 border-[#089bab]">Save Changes</button>
            </div>
          </div>
          <div className="bg-gray-200 lg:w-1/2 mt-5 lg:mt-0">
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold">Steps</h1>
              <button onClick={() => setAddStep(true)} className="flex items-center justify-center w-[25px] h-[25px] ml-3 text-xl rounded-full bg-[#089bab] text-white hover:text-black hover:bg-transparent duration-300 border-2 border-[#089bab]">+</button>
            </div>
          </div>
        </div>
      </div>

      {
        addStep &&
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
                <input placeholder="Add step number" type="number"
                  value={stepInfo.number}
                  onChange={(e) => setStepInfo((prev) => ({
                    ...prev,
                    number: e.target.value
                  }))}
                  className="placeholder:text-base w-[150px] bg-gray-200 text-center outline-none border-2 border-transparent focus:border-[#089bab] rounded-xl px-2 py-1"
                />
              </div>
              <div className="flex items-center justify-between items-center">
                <label className="pr-4 mb-2 font-semibold">Medications Plan</label>
                <MedicationDropdown
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
                <label className="pr-4 mb-2 font-semibold">Treatment Note</label>
                <TreatmentNoteDropDown
                  treatmentsNotes={treatmentsNotes}
                  // selected={stepInfo.treatment_note}
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
                        stepInfo.optionality === 1 ? 'bg-gray-300' : 'bg-[#089bab]'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                          stepInfo.optionality === 1 ? 'translate-x-4' : 'translate-x-0'
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
              <button className="w-[85px] bg-[#9e9e9e] border-2 border-[#9e9e9e] p-1 rounded-xl text-white hover:bg-transparent hover:text-black duration-300" onClick={() => {
                setAddStep(false);
              }}>Cancel</button>
              <button onClick={() => Add()} className="w-[85px] bg-[#089bab] border-2 border-[#089bab] p-1 rounded-xl text-white hover:bg-transparent hover:text-black duration-300 ml-7">Add</button>
            </div>
          </div>
        </div>
      }

      {isLoading && <Loading />}

      {modal.isOpen && <Modal message={modal.message} imageSrc={modal.image}/>}


    </>
  );
}


{/* <p className="ml-10 flex-1 pr-5">{plan?.name || ""}</p> */}
{/* <p className="ml-10 flex-1 pr-5">{plan?.category?.name || ""}</p> */}
{/* <p className="ml-10 flex-1 pr-5">{plan?.tooth_status?.name || ""}</p> */}
{/* <p className="ml-10 flex-1 pr-5">{plan?.cost.toLocaleString() || ""}</p> */}
