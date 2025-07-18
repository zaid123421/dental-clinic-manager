import Button from "../../components/Button";
import { IoIosSearch } from "react-icons/io";
import { FiPlus } from "react-icons/fi";
import FormInput from "../../components/FormInput";
import Title from "../../components/Title";
import Sidebar from "../../components/Sidebar";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { BaseUrl, ImageUrl } from "../../config";
import axios from "axios";
import PlusButton from "../../components/PlusButton";
import "../../index.css";
import deleteConfirm from "../../assets/deleteConfirm.jpg"
import Loading from "../../components/Loading";
import Modal from "../../components/Modal";
import successImage from '../../assets/success.gif';

export default function Medications() {
  const [cards, setCards] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [addBox, setAddBox] = useState(false);
  const [count, setCount] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [boxMessage, setBoxMessage] = useState("");
  const [boxImage, setBoxImage] = useState("");

  // useRef
  const medicationName = useRef();
  const medicationId = useRef();
  const inputImageRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${BaseUrl}/medication`, {
        headers: {
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
  if (confirmDelete) {
    document.body.style.overflow = "hidden"; 
  } else {
    document.body.style.overflow = "auto";
  }
  return () => {
    document.body.style.overflow = "auto";  
  };
  }, [confirmDelete]);

  useEffect(() => {
    if (isBoxOpen) {
      const timer = setTimeout(() => {
        setIsBoxOpen(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isBoxOpen]);

  // Mapping
  const imageShow = image ? (
  <img
    className="w-full h-full rounded-xl"
    src={URL.createObjectURL(image)}
    alt="Uploaded"
  />
) : null;

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
      const file = e.dataTransfer.files[0]; // فقط أول ملف
      setImage(file);
      e.dataTransfer.clearData();
    }
  };

  async function submit() {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name)
    formData.append("info", description)
    formData.append("image", image);
    try {
      let res = await axios.post( `${BaseUrl}/medication`, formData,
        {
          headers: {
            Accept: "application/json",
            // Authorization: `Bearer ${token}`,
          },
        });
        setAddBox(false);
        setCount((prev) => prev + 1);
        setName("");
        setDescription("");
        setImage(null);
        setBoxMessage("The Medication Has Been Added Successfully !");
        setBoxImage(successImage);
      } catch (err){
      console.log("Error !");
      console.log(err);
      setBoxMessage("Something Went Wrong !");
      setBoxImage(successImage);
    } finally {
      setIsLoading(false);
      setIsBoxOpen(true);
    }
  }

  async function handleDelete() {
    setIsLoading(true);
    try {
      await axios.delete( `${BaseUrl}/medication/${medicationId.current}`,
        {
          headers: {
            // Accept: "application/json",
            // Authorization: `Bearer ${token}`,
          },
        });
        setConfirmDelete(false);
        setCount((prev) => prev + 1);
        setBoxMessage("The Medication Has Been Deleted Successfully !");
        setBoxImage(successImage);
    } catch {
      console.log("Error !");
      setBoxMessage("Something Went Wrong !");
      setBoxImage(successImage);
    } finally {
      setIsLoading(false);
      setIsBoxOpen(true);
    }
  }

  const showCards = cards.map((card, index) => (
    <div key={index} className="shadow-xl bg-white rounded-xl p-4 flex flex-col justify-between text-center">
      <div className="bg-blue-300 rounded-md h-[150px] md:h-[125px] bg-contain">
        <img
          className="rounded-md w-full h-full"
          src={`${ImageUrl}${card.image}`}
          alt="medication_image"
        />
      </div>
      <p className="my-3 font-bold">{card.name}</p>
      <div className="flex text-2xl justify-center">
        <div className="bg-[#089bab] p-1 mr-2 text-white rounded-lg md:rounded-xl border-2 border-[#089bab] hover:bg-transparent hover:text-black transition duration-300 cursor-pointer">
          <MdEdit className="text-sm md:text-base" />
        </div>
        <div onClick={() => {
          medicationName.current = card.name;
          medicationId.current = card.id;
          setConfirmDelete(true);
        }} className="bg-red-500 p-1 text-white rounded-lg md:rounded-xl border-2 border-red-500 hover:bg-transparent hover:text-black transition duration-300 cursor-pointer">
          <MdDelete className="text-sm md:text-base" />
        </div>
      </div>
    </div>
  ));

  return (
    <>
      <Sidebar />
      <div className="page-content p-5 bg-[#089bab1c] text-sm md:text-lg">
        <Title label="Medications" />
        <div className="mt-3 flex items-center">
          <Button onClick={() => setAddBox(true)} className="md:mr-5 min-w-[225px] hidden md:flex"
            variant="primary"
            icon={<FiPlus className="mr-3 text-2xl" />}
            children="Add Medication"
          />
          <PlusButton onClick={() => setAddBox(true)} />
          <FormInput icon={<IoIosSearch className="text-black text-lg" />}
            placeholder="Search"
            className="w-full md:w-[250px] bg-white border-[#089bab] placeholder-black shadow-lg"/>
        </div>
        <div className="content grid md:grid-cols-3 lg:grid-cols-6 gap-3 py-5">
          {showCards}
        </div>
      </div>

      {
        addBox &&
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-2">
          <div className="bg-white rounded-xl p-5 text-xl flex flex-col items-center shadow-xl w-[500px]">
            <div className=" mb-5 w-full">
              <h1 className="font-bold text-2xl text-center">Add Medication</h1>
              <div className="flex flex-col my-3 font-semibold">
                <label className="px-4 mb-2">Medication Name</label>
                <input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                placeholder="Add medication name"
                className="placeholder:text-base outline-none border-2 border-transparent focus:border-[#089bab] bg-gray-100 rounded-xl py-1 px-4"
                />
              </div>
              <div className="flex flex-col font-semibold">
                <label className="px-4 mb-2">Medication Description</label>
                <textarea
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripe the mdeication"
                className="placeholder:text-base outline-none border-2 border-transparent focus:border-[#089bab] min-h-[100px] resize-none bg-gray-100 rounded-xl py-1 px-4" />
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
                onChange={(e) => setImage(e.target.files[0])}
              />

              <div className={`${image ? `hidden` : `flex flex-col items-center`}`}>
                <i className="fa-solid fa-image text-[#7F7F7F] text-[30px] md:text-[60px] mb-[10px]"></i>
                <p className="text-[12px] md:text-[14px]">
                  Choose An Image {" "}
                  <span className="hidden md:inline-block">
                    or Drag & Drop It
                  </span>{" "}
                </p>
              </div>
              {imageShow}
            </div>
            <div className="flex justify-center w-full mt-5">
              <button className="w-[85px] bg-[#9e9e9e] border-2 border-[#9e9e9e] p-1 rounded-xl text-white hover:bg-transparent hover:text-black duration-300" onClick={() => {
                setAddBox(false);
                setImage(null);
                setName("");
                setDescription("");
              }}>Cancel</button>
              <button className="w-[85px] bg-[#089bab] border-2 border-[#089bab] p-1 rounded-xl text-white hover:bg-transparent hover:text-black duration-300 ml-7" onClick={() => submit()}>Add</button>
            </div>
          </div>
        </div>
      }

      {
        confirmDelete &&
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-2">
          <div className="bg-white rounded-xl p-5 text-xl flex flex-col items-center shadow-xl w-[400px]">
            <img alt="image_delete" src={deleteConfirm} className="w-[200px]"/>
            <p className="my-5 text-center">
              Do You Really Want To Delete {medicationName.current} ?
            </p>
            <div className="flex justify-center w-full">
              <button className="w-[85px] bg-[#9e9e9e] border-2 border-[#9e9e9e] p-1 rounded-xl text-white hover:bg-transparent hover:text-black duration-300" onClick={() => setConfirmDelete(false)}>Cancel</button>
              <button className="w-[85px] bg-[#DD1015] border-2 border-[#DD1015] p-1 rounded-xl text-white hover:bg-transparent hover:text-black duration-300 ml-7" onClick={() => handleDelete()}>Delete</button>
            </div>
          </div>
        </div>
      }

      {isLoading && <Loading />}

      {isBoxOpen && <Modal message={boxMessage} imageSrc={boxImage}/>}

    </>
  );
}
