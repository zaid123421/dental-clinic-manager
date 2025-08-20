// import components
import Button from "../../components/Button";
import FormInput from "../../components/FormInput";
import Sidebar from "../../components/Sidebar";
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import Title from "../../components/Title";
import Confirm from "../../components/Confirm";
// import icons
import { IoIosSearch } from "react-icons/io";
import { FiPlus } from "react-icons/fi";
import { MdEdit, MdDelete } from "react-icons/md";
// import images
import successImage from "../../assets/success.gif";
import error from "../../assets/error.gif";
import confirmDelete from "../../assets/deleteConfirm.jpg"
// import style file
import "../../index.css";
//import hooks
import { useEffect, useRef, useState } from "react";
// import backend configuration
import { BaseUrl, ImageUrl } from "../../config";
// import axios
import axios from "axios";
import Cookies from "universal-cookie";

export default function Medications() {
  // States
  const [cards, setCards] = useState([]);
  const [confirm, setConfirmDelete] = useState(false);
  const [addBox, setAddBox] = useState(false);
  const [editBox, setEditBox] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const [count, setCount] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState(null);

  const [modal, setModal] = useState({
    isOpen: false,
    message: "",
    image: "",
  });

  const [medicationForm, setMedicationForm] = useState({
    name: "",
    description: "",
    image: null,
  });

  const [oldMedicationForm, setOldMedicationForm] = useState({
    name: "",
    description: "",
    image: null,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [nameError, setNameError] = useState("");
  const [imageError, setImageError] = useState("");

  // useRef
  const medicationId = useRef();
  const inputImageRef = useRef(null);

  // Cookies
  const cookie = new Cookies();
  const token = cookie.get("token");

  // useEffect
  useEffect(() => {
    axios
      .get(`${BaseUrl}/medication`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
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
    if (confirm || addBox || editBox) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [confirm, addBox, editBox]);

  useEffect(() => {
    if (modal.isOpen) {
      const timer = setTimeout(() => {
        setModal((prev) => ({ ...prev, isOpen: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [modal.isOpen]);

  // Mapping
  const imageShow = medicationForm.image
    ? typeof medicationForm.image === "string"
      ? medicationForm.image
      : URL.createObjectURL(medicationForm.image)
    : null;

  const filteredCards = cards.filter((card) => {
    const title = (card?.name || "").toString().toLowerCase();
    const q = searchQuery.trim().toLowerCase();
    return title.startsWith(q);
  });

  const showCards = filteredCards.map((card, index) => (
    <div
      key={index}
      onClick={() => {
        setShowBox(true);
        setMedicationForm({
          name: card.name,
          description: card.info,
          image: `${ImageUrl}${card.image}`,
        });
      }}
      className="cursor-pointer shadow-xl bg-white rounded-xl p-4 flex flex-col justify-between text-center"
    >
      <div className="bg-blue-300 rounded-md h-[150px] md:h-[125px] bg-contain">
        <img
          className="rounded-md w-full h-full"
          src={`${ImageUrl}${card.image}`}
          alt="medication_image"
        />
      </div>
      <p className="my-3 font-bold">{card.name}</p>
      <div className="flex text-2xl justify-center">
        <div
          onClick={(e) => {
            setOldMedicationForm({
              name: card.name,
              description: card.info,
              image: `${ImageUrl}${card.image}`,
            });
            setMedicationForm({
              name: card.name,
              description: card.info,
              image: `${ImageUrl}${card.image}`,
            });
            setId(card.id);
            setEditBox(true);
            e.stopPropagation();
          }}
          className="bg-[#089bab] p-1 mr-2 text-white rounded-lg md:rounded-xl border-2 border-[#089bab] hover:bg-transparent hover:text-black transition duration-300 cursor-pointer"
        >
          <MdEdit className="text-sm md:text-base" />
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            setMedicationForm((prev) => ({
              ...prev,
              name: card.name,
            }));
            medicationId.current = card.id;
            setConfirmDelete(true);
          }}
          className="bg-red-500 p-1 text-white rounded-lg md:rounded-xl border-2 border-red-500 hover:bg-transparent hover:text-black transition duration-300 cursor-pointer"
        >
          <MdDelete className="text-sm md:text-base" />
        </div>
      </div>
    </div>
  ));

  // Functions
  const handleImageClick = () => {
    if (inputImageRef.current) {
      inputImageRef.current.click();
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setMedicationForm((prev) => ({
        ...prev,
        image: file,
      }));
      e.dataTransfer.clearData();
    }
  };

  const handlCancelDelete = () => {
    setConfirmDelete(false);
    setMedicationForm((prev) => ({
      ...prev,
      name: "",
    }));
  }

  const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const maxSize = 256 * 1024; 
  let errorMsg = "";

  if (!file.type.startsWith("image/")) {
    errorMsg = "The selected file must be an image (jpg, png, ...).";
  } else if (file.size > maxSize) {
    errorMsg = "Image size must be less than 256KB.";
  }

  if (errorMsg) {
    setImageError(errorMsg);
    setMedicationForm((prev) => ({
      ...prev,
      image: null,
    }));
    return;
  }

  setMedicationForm((prev) => ({
    ...prev,
    image: file,
  }));
  setImageError("");
};

  async function submit() {
    setIsLoading(true);
    setNameError("");
    setImageError("");
    const formData = new FormData();
    formData.append("name", medicationForm.name);
    formData.append("info", medicationForm.description);
    if(medicationForm.image !== null) formData.append("image", medicationForm.image);
    try {
      await axios.post(`${BaseUrl}/medication`, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setImageError("");
      setNameError("");
      setAddBox(false);
      setCount((prev) => prev + 1);
      setMedicationForm({
        name: "",
        description: "",
        image: null,
      });
      setModal({
        isOpen: true,
        message: "The Medication Has Been Added Successfully !",
        image: successImage,
      });
    } catch (err) {
      console.log(err);
      if (err.response?.data?.message?.name) {
        setNameError(err.response?.data?.message.name[0]);
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

  async function edit() {
    setImageError("");
    setNameError("");
    setIsLoading(true);
    const formData = new FormData();
    if (medicationForm.name !== oldMedicationForm.name) {
      formData.append("name", medicationForm.name);
    }
    formData.append("info", " ");
    if (medicationForm.image && typeof medicationForm.image !== "string") {
      formData.append("image", medicationForm.image);
    }
    formData.append("_method", "patch");
    try {
      await axios.post(`${BaseUrl}/medication/${id}`, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setImageError("");
      setNameError("");
      setEditBox(false);
      setCount((prev) => prev + 1);
      setMedicationForm({
        name: "",
        description: "",
        image: null,
      });
      setModal({
        isOpen: true,
        message: "The Medication Has Been Edited Successfully !",
        image: successImage,
      });
    } catch (err) {
      console.log(err);
      if (err.response?.data?.message?.name) {
        setNameError(err.response?.data?.message.name[0]); 
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

  async function handleDelete() {
    setIsLoading(true);
    try {
      await axios.delete(`${BaseUrl}/medication/${medicationId.current}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setMedicationForm(() => ({
        name: "",
        description: "",
        image: null,
      }));
      setConfirmDelete(false);
      setCount((prev) => prev + 1);
      setModal({
        isOpen: true,
        message: "The Medication Has Been Deleted Successfully !",
        image: successImage,
      });
    } catch {
      setConfirmDelete(false);
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
        <Title label="Medications" />
        <div className="mt-3 flex items-center">
          <Button
            onClick={() => setAddBox(true)}
            className="hidden md:flex"
            variant="primary"
            icon={<FiPlus className="mr-3 text-2xl" />}
            children="Add Medication"
          />
          <Button
            onClick={() => setAddBox(true)}
            className="mr-3 flex md:hidden"
            variant="plus"
            icon={<FiPlus className="text-2xl" />}
          />
          <FormInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<IoIosSearch className="text-black text-lg" />}
            placeholder="Search"
            className="w-full md:w-[250px] bg-white border-[#089bab] placeholder-black shadow-lg"
          />
        </div>
        <div className="content grid md:grid-cols-3 lg:grid-cols-6 gap-3 py-5">
          {showCards}
        </div>
      </div>

      {addBox && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-2">
          <div className="bg-white rounded-xl p-5 text-xl flex flex-col items-center shadow-xl w-[500px]">
            <div className=" mb-5 w-full">
              <h1 className="font-bold text-2xl text-center">Add Medication</h1>
              <div className="flex flex-col my-3 font-semibold">
                <label className="px-4 mb-2">Name <span className="text-red-500 text-sm ml-1">required</span></label>
                <input
                  name="name"
                  value={medicationForm.name}
                  onChange={(e) =>
                    setMedicationForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  autoFocus
                  placeholder="Add medication name"
                  className="placeholder:text-base outline-none border-2 border-transparent focus:border-[#089bab] bg-gray-100 rounded-xl py-1 px-4"
                />
                {nameError && (
                  <span className="text-red-500 text-sm mt-1 ml-2">{nameError}</span>
                )}
              </div>
              <div className="flex flex-col font-semibold">
                <label className="px-4 mb-2">Description</label>
                <textarea
                  name="description"
                  value={medicationForm.description}
                  onChange={(e) =>
                    setMedicationForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Descripe the mdeication"
                  className="placeholder:text-base outline-none border-2 border-transparent focus:border-[#089bab] min-h-[100px] resize-none bg-gray-100 rounded-xl py-1 px-4"
                />
              </div>
            </div>
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onClick={handleImageClick}
              onDrop={handleDrop}
              className="grow relative flex items-center justify-center my-[10px] bg-transparent w-full md:w-[375px] h-[175px] md:h-[225px] border-2 border-dashed border-[#AEAEAE] rounded-[15px] self-center cursor-pointer"
            >
              <input
                ref={inputImageRef}
                hidden
                type="file"
                onChange={handleFileChange}
              />

              <div
                className={`${
                  medicationForm.image ? `hidden` : `flex flex-col items-center`
                }`}
              >
                <i className="fa-solid fa-image text-[#7F7F7F] text-[30px] md:text-[60px] mb-[10px]"></i>
                <p className="text-[12px] md:text-[14px]">
                  Choose An Image{" "}
                  <span className="hidden md:inline-block">
                    or Drag & Drop It
                  </span>{" "}
                </p>
              </div>
              {imageShow && (
                <img
                  className="w-full h-full rounded-xl"
                  src={imageShow}
                  alt="Uploaded"
                />
              )}
            </div>
            <span className="text-xs">Max Size 256KB</span>
              {/* error message under upload */}
              {imageError && (
                <span className="text-red-500 text-sm mt-1 font-semibold">{imageError}</span>
              )}
            <div className="flex justify-center w-full mt-5">
              <button
                className="w-[85px] bg-[#9e9e9e] border-2 border-[#9e9e9e] p-1 rounded-xl text-white hover:bg-transparent hover:text-black duration-300"
                onClick={() => {
                  setImageError("");
                  setNameError("");
                  setAddBox(false);
                  setMedicationForm({
                    name: "",
                    description: "",
                    image: null,
                  });
                }}
              >
                Cancel
              </button>
              <button
                disabled={!medicationForm.name.trim() || imageError}
                className={`w-[85px] border-2 p-1 rounded-xl duration-300 ml-7 
                  ${
                    !medicationForm.name.trim() || imageError
                      ? "bg-gray-300 border-gray-300 text-white cursor-not-allowed"
                      : "bg-[#089bab] border-[#089bab] text-white hover:bg-transparent hover:text-black"
                  }`}
                onClick={() => submit()}
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
                Edit Mdeication
              </h1>
              <div className="flex flex-col my-3 font-semibold">
                <label className="px-4 mb-2">Medication Name</label>
                <input
                  name="name"
                  value={medicationForm.name}
                  onChange={(e) =>
                    setMedicationForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  autoFocus
                  placeholder="Add medication name"
                  className="placeholder:text-base outline-none border-2 border-transparent focus:border-[#089bab] bg-gray-100 rounded-xl py-1 px-4"
                />
                {nameError && (
                  <span className="text-red-500 text-sm mt-1 ml-2">{nameError}</span>
                )}
              </div>
              <div className="flex flex-col font-semibold">
                <label className="px-4 mb-2">Medication Description</label>
                <textarea
                  name="description"
                  value={medicationForm.description}
                  onChange={(e) =>
                    setMedicationForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Descripe the mdeication"
                  className="placeholder:text-base outline-none border-2 border-transparent focus:border-[#089bab] min-h-[100px] resize-none bg-gray-100 rounded-xl py-1 px-4"
                />
              </div>
            </div>
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onClick={handleImageClick}
              onDrop={handleDrop}
              className="grow relative flex items-center justify-center my-[10px] bg-transparent w-full md:w-[375px] h-[175px] md:h-[225px] border-2 border-dashed border-[#AEAEAE] rounded-[15px] self-center cursor-pointer"
            >
              <input
                ref={inputImageRef}
                hidden
                type="file"
                onChange={handleFileChange}
              />

              <div
                className={`${
                  medicationForm.image ? `hidden` : `flex flex-col items-center`
                }`}
              >
                <i className="fa-solid fa-image text-[#7F7F7F] text-[30px] md:text-[60px] mb-[10px]"></i>
                <p className="text-[12px] md:text-[14px]">
                  Choose An Image{" "}
                  <span className="hidden md:inline-block">
                    or Drag & Drop It
                  </span>{" "}
                </p>
              </div>
              {imageShow && (
                <img
                  className="w-full h-full rounded-xl"
                  src={imageShow}
                  alt="Uploaded"
                />
              )}
            </div>
              <span className="text-xs">Max Size 256KB</span>
              {/* error message under upload */}
              {imageError && (
                <span className="text-red-500 text-sm mt-1 font-semibold">{imageError}</span>
              )}
            <div className="flex justify-center w-full mt-5">
              <button
                onClick={() => {
                  setImageError("");
                  setNameError("");
                  setEditBox(false);
                  setMedicationForm({
                    name: "",
                    description: "",
                    image: null,
                  });
                }}
                className="w-[85px] bg-[#9e9e9e] border-2 border-[#9e9e9e] p-1 rounded-xl text-white hover:bg-transparent hover:text-black duration-300"
              >
                Cancel
              </button>
              <button
                disabled={
                  !medicationForm.name.trim() ||
                  imageError ||
                  (
                    medicationForm.name === oldMedicationForm.name &&
                    medicationForm.description === oldMedicationForm.description &&
                    (medicationForm.image === oldMedicationForm.image ||
                      (typeof medicationForm.image === "string" &&
                        medicationForm.image === oldMedicationForm.image))
                  )
                }
                onClick={() => edit()}
                className={`w-[85px] border-2 p-1 rounded-xl duration-300 ml-7
                  ${
                    !medicationForm.name.trim() ||
                    imageError ||
                    (
                      medicationForm.name === oldMedicationForm.name &&
                      medicationForm.description === oldMedicationForm.description &&
                      (medicationForm.image === oldMedicationForm.image ||
                        (typeof medicationForm.image === "string" &&
                          medicationForm.image === oldMedicationForm.image))
                    )
                      ? "bg-gray-300 border-gray-300 text-white cursor-not-allowed"
                      : "bg-[#089bab] border-[#089bab] text-white hover:bg-transparent hover:text-black"
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
                setMedicationForm({
                  name: "",
                  description: "",
                  image: null,
                });
              }}
              className="absolute top-[15px] right-[15px] hover:text-[#089bab] font-bold cursor-pointer duration-300"
            >
              X
            </div>
            <div className=" mb-5 w-full font-semibold">
              <h1 className="font-bold text-2xl text-center">
                Medication Details
              </h1>
              <div className="my-3 object-cover w-full flex justify-center">
                <img
                  className="w-[150px] h-[150px]"
                  alt="medication-plan-image"
                  src={medicationForm.image}
                />
              </div>
              <div className="flex justify-between my-3">
                <label>Name</label>
                <label className="text-[#089bab]">{medicationForm.name}</label>
              </div>
              <div className="flex flex-col">
                <label>Description</label>
                <div className="h-[200px] bg-gray-200 rounded-2xl p-5 mt-2 overflow-y-auto text-[#089bab]">
                  {medicationForm.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirm &&
        <Confirm
          img={confirmDelete}
          onCancel={() => handlCancelDelete()}
          onConfirm={() => handleDelete()}
          label={<>Do You Want Really To Delete <span className="font-bold">{medicationForm.name}</span> With All Medication Plans Associated With It ?</>}
        />
      }

      {isLoading && <Loading />}

      {modal.isOpen && <Modal message={modal.message} imageSrc={modal.image} />}
    </>
  );
}
