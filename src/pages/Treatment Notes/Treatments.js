// import components
import Sidebar from "../../components/Sidebar";
import Title from "../../components/Title";
import PlusButton from "../../components/PlusButton";
import Button from "../../components/Button";
import FormInput from "../../components/FormInput";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import Confirm from "../../components/Confirm";
import { useEffect, useRef, useState } from "react";
// import icons
import { IoIosSearch } from "react-icons/io";
import { FiPlus } from "react-icons/fi";
import { MdEdit, MdDelete } from "react-icons/md";
// import axios library
import axios from "axios";
// import backend server configurations
import { BaseUrl } from "../../config";
// import images
import successImage from "../../assets/success.gif";
import confirmDelete from "../../assets/deleteConfirm.jpg"
import error from "../../assets/error.gif";

import Cookies from "universal-cookie";

export default function Treatments() {
  // States
  const [cards, setCards] = useState([]);
  const [count, setCount] = useState(0);
  const [addBox, setAddBox] = useState(false);
  const [editBox, setEditBox] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const [confirm, setConfirmDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState(null);
  const [modal, setModal] = useState({
    isOpen: false,
    message: "",
    image: "",
  });

  const [treatmentNote, setTreatmentNote] = useState({
    name: "",
    description: "",
    duration_value: 1,
    duration_unit: "",
  });

  const [oldTreatmentNote, setOldTreatmentNote] = useState({
    name: "",
    description: "",
    duration_value: 1,
    duration_unit: "",
  });

  // useRef
  const treatmentNoteId = useRef(null);

  // Cookies
  const cookie = new Cookies();
  const token = cookie.get("token");

  // useEffect
  useEffect(() => {
    axios
      .get(`${BaseUrl}/treatment-note`, {
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

  // Mapping
  const showCards = cards.map((card, index) => (
    <div
      key={index}
      onClick={() => {
        setTreatmentNote({
          name: card.title,
          description: card.text,
          duration_value: card.duration_value,
          duration_unit: card.duration_unit,
        });
        setShowBox(true);
      }}
      className="cursor-pointer shadow-xl bg-white rounded-xl p-4 flex flex-col justify-between text-center"
    >
      <div>
        <div className="flex justify-between items-center">
          <p className="font-bold mr-2">Name:</p>
          <span className="font-semibold">{card.title}</span>
        </div>
        <div className="flex justify-between items-center">
          <p className="font-bold flex justify-between my-3 mr-2">Duration: </p>
          <span className="font-semibold">
            {card.duration_value} {card.duration_unit}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <p className="font-bold flex justify-between mr-2">Description:</p>
          <span className="font-semibold truncate w-[50px] sm:w-full text-right">
            {card.text}
          </span>
        </div>
      </div>
      <div className="flex text-2xl justify-center mt-5">
        <div
          onClick={(e) => {
            e.stopPropagation();
            setTreatmentNote({
              name: card.title,
              description: card.text,
              duration_value: card.duration_value,
              duration_unit: card.duration_unit,
            });
            setOldTreatmentNote({
              name: card.title,
              description: card.text,
              duration_value: card.duration_value,
              duration_unit: card.duration_unit,
            });
            setId(card.id);
            setEditBox(true);
          }}
          className="bg-[#089bab] p-1 mr-2 text-white rounded-lg md:rounded-xl border-2 border-[#089bab] hover:bg-transparent hover:text-black transition duration-300 cursor-pointer"
        >
          <MdEdit className="text-sm md:text-base" />
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            treatmentNoteId.current = card.id;
            setConfirmDelete(true);
            setTreatmentNote((prev) => ({
              ...prev,
              name: card.title,
            }));
          }}
          className="bg-red-500 p-1 text-white rounded-lg md:rounded-xl border-2 border-red-500 hover:bg-transparent hover:text-black transition duration-300 cursor-pointer"
        >
          <MdDelete className="text-sm md:text-base" />
        </div>
      </div>
    </div>
  ));

  // Functions
  const increment = () =>
    setTreatmentNote((prev) => ({
      ...prev,
      duration_value: treatmentNote.duration_value + 1,
  }));

  const decrement = () =>
    setTreatmentNote((prev) => ({
      ...prev,
      duration_value:
        treatmentNote.duration_value > 1
          ? treatmentNote.duration_value - 1
          : treatmentNote.duration_value,
  }));

  const handleCancelDelete = () => {
    setConfirmDelete(false);
    setTreatmentNote((prev) => ({
      ...prev,
      name: "",
    }));
  }

  async function handleDelete() {
    setIsLoading(true);
    try {
      await axios.delete(
        `${BaseUrl}/treatment-note/${treatmentNoteId.current}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTreatmentNote((prev) => ({
        ...prev,
        name: "",
      }));
      setConfirmDelete(false);
      setCount((prev) => prev + 1);
      setModal({
        isOpen: true,
        message: "The Treatment Note Has Been Deleted Successfully !",
        image: successImage,
      });
    } catch {
      setTreatmentNote((prev) => ({
        ...prev,
        name: "",
      }));
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
    formData.append("title", treatmentNote.name);
    formData.append("text", treatmentNote.description);
    formData.append("duration_value", treatmentNote.duration_value);
    formData.append("duration_unit", treatmentNote.duration_unit);
    try {
      await axios.post(`${BaseUrl}/treatment-note`, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setAddBox(false);
      setCount((prev) => prev + 1);
      setTreatmentNote({
        name: "",
        description: "",
        duration_value: 1,
        duration_unit: "",
      });
      setModal({
        isOpen: true,
        message: "The Tretment Note Has Been Added Successfully !",
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
    if (treatmentNote.name !== oldTreatmentNote.name) {
      formData.append("title", treatmentNote.name);
    }
    formData.append("text", treatmentNote.description);
    formData.append("duration_value", treatmentNote.duration_value);
    formData.append("duration_unit", treatmentNote.duration_unit);
    formData.append("_method", "patch");
    try {
      await axios.post(`${BaseUrl}/treatment-note/${id}`, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setEditBox(false);
      setCount((prev) => prev + 1);
      setTreatmentNote({
        name: "",
        description: "",
        duration_value: 1,
        duration_unit: "",
      });
      setModal({
        isOpen: true,
        message: "The Treatment Note Has Been Edited Successfully !",
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

  return (
    <>
      <Sidebar />

      <div className="page-content p-3 md:py-5 md:p-5 bg-[#089bab1c]">
        <Title label="Treatments Notes" />
        <div className="mt-3 flex items-center">
          <Button
            onClick={() => setAddBox(true)}
            className="md:mr-5 min-w-[250px] hidden md:flex"
            variant="primary"
            icon={<FiPlus className="mr-3 text-2xl" />}
            children="Add Treatment Note"
          />
          <PlusButton onClick={() => setAddBox(true)} />
          <FormInput
            icon={<IoIosSearch className="text-black text-lg" />}
            placeholder="Search"
            className="w-full md:w-[250px] bg-white border-[#089bab] placeholder-black shadow-lg"
          />
        </div>
        <div className="content grid md:grid-cols-3 lg:grid-cols-4 gap-3 py-5">
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
              <div className="flex flex-col my-3 font-semibold">
                <label className="px-4 mb-2">Name</label>
                <input
                  name="name"
                  value={treatmentNote.name}
                  onChange={(e) =>
                    setTreatmentNote((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  autoFocus
                  placeholder="Add treatment note name"
                  className="placeholder:text-base outline-none border-2 border-transparent focus:border-[#089bab] bg-gray-100 rounded-xl py-1 px-4"
                />
              </div>
              <div className="flex flex-col font-semibold">
                <label className="px-4 mb-2">Description</label>
                <textarea
                  name="description"
                  value={treatmentNote.description}
                  onChange={(e) =>
                    setTreatmentNote((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Descripe the treatment note"
                  className="placeholder:text-base outline-none border-2 border-transparent focus:border-[#089bab] min-h-[100px] resize-none bg-gray-100 rounded-xl py-1 px-4"
                />
              </div>
              <div className="flex items-center font-semibold mt-3 flex-wrap justify-end">
                <label className="px-4 flex-1 mb-[10px]">Duration</label>
                <div className="flex items-center mb-[10px]">
                  <button
                    onClick={decrement}
                    className="border-2 border-transparent bg-[#089bab] w-[25px] h-[25px] flex items-center justify-center text-white hover:bg-white hover:text-black hover:border-[#089bab] rounded-full duration-300"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={treatmentNote.duration_value}
                    onChange={(e) =>
                      setTreatmentNote((prev) => ({
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
                  value={treatmentNote.duration_unit}
                  onChange={(e) =>
                    setTreatmentNote((prev) => ({
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
                  setTreatmentNote({
                    name: "",
                    description: "",
                    duration_value: 1,
                    duration_unit: "",
                  });
                }}
                className="w-[85px] bg-[#9e9e9e] border-2 border-[#9e9e9e] p-1 rounded-xl text-white hover:bg-transparent hover:text-black duration-300"
              >
                Cancel
              </button>
              <button
                onClick={Submit}
                className="w-[85px] bg-[#089bab] border-2 border-[#089bab] p-1 rounded-xl text-white hover:bg-transparent hover:text-black duration-300 ml-7"
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
              <div className="flex flex-col my-3 font-semibold">
                <label className="px-4 mb-2">Name</label>
                <input
                  name="name"
                  value={treatmentNote.name}
                  onChange={(e) =>
                    setTreatmentNote((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  autoFocus
                  placeholder="Add treatment note name"
                  className="placeholder:text-base outline-none border-2 border-transparent focus:border-[#089bab] bg-gray-100 rounded-xl py-1 px-4"
                />
              </div>
              <div className="flex flex-col font-semibold">
                <label className="px-4 mb-2">Description</label>
                <textarea
                  name="description"
                  value={treatmentNote.description}
                  onChange={(e) =>
                    setTreatmentNote((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Descripe the treatment note"
                  className="placeholder:text-base outline-none border-2 border-transparent focus:border-[#089bab] min-h-[100px] resize-none bg-gray-100 rounded-xl py-1 px-4"
                />
              </div>
              <div className="flex items-center font-semibold mt-3 flex-wrap justify-end">
                <label className="px-4 flex-1 mb-[10px]">Duration</label>
                <div className="flex items-center mb-[10px]">
                  <button
                    onClick={decrement}
                    className="border-2 border-transparent bg-[#089bab] w-[25px] h-[25px] flex items-center justify-center text-white hover:bg-white hover:text-black hover:border-[#089bab] rounded-full duration-300"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={treatmentNote.duration_value}
                    onChange={(e) =>
                      setTreatmentNote((prev) => ({
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
                  value={treatmentNote.duration_unit}
                  onChange={(e) =>
                    setTreatmentNote((prev) => ({
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
                  setTreatmentNote({
                    name: "",
                    description: "",
                    duration_value: 1,
                    duration_unit: "",
                  });
                }}
                className="w-[85px] bg-[#9e9e9e] border-2 border-[#9e9e9e] p-1 rounded-xl text-white hover:bg-transparent hover:text-black duration-300"
              >
                Cancel
              </button>
              <button
                onClick={Edit}
                className="w-[85px] bg-[#089bab] border-2 border-[#089bab] p-1 rounded-xl text-white hover:bg-transparent hover:text-black duration-300 ml-7"
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
                setTreatmentNote({
                  name: "",
                  description: "",
                  duration_value: 1,
                  duration_unit: "",
                });
              }}
              className="absolute top-[15px] right-[15px] hover:text-[#089bab] font-bold cursor-pointer duration-300"
            >
              X
            </div>
            <div className=" mb-5 w-full font-semibold">
              <h1 className="font-bold text-2xl text-center">
                {treatmentNote.name} Details
              </h1>
              <div className="flex justify-between my-3">
                <label>Name</label>
                <label className="text-[#089bab]">{treatmentNote.name}</label>
              </div>
              <div className="flex flex-col">
                <label>Description</label>
                <div className="h-[200px] bg-gray-200 rounded-2xl p-5 mt-2 overflow-y-auto text-[#089bab]">
                  {treatmentNote.description}
                </div>
              </div>
              <div className="flex mt-3 justify-between">
                <label>Duration</label>
                <div className="text-[#089bab]">
                  <label className="mr-2">{treatmentNote.duration_value}</label>
                  <label>{treatmentNote.duration_unit}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirm && (
        <Confirm
          img={confirmDelete}
          label={<>Do You Want Really To Delete <span className="font-bold">{treatmentNote.name}</span> ?</>}
          onCancel={() => handleCancelDelete()}
          onConfirm={() => handleDelete()}
        />
      )}

      {isLoading && <Loading />}

      {modal.isOpen && <Modal message={modal.message} imageSrc={modal.image} />}
    </>
  );
}
