import Button from "../../components/Button";
import { IoIosSearch } from "react-icons/io";
import { FiPlus } from "react-icons/fi";
import FormInput from "../../components/FormInput";
import Title from "../../components/Title";
import Sidebar from "../../components/Sidebar";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import { BaseUrl, ImageUrl } from "../../config";
import axios from "axios";
import PlusButton from "../../components/PlusButton";

export default function Medications() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    axios.get(`${BaseUrl}/medication`, {
      headers: {
        Accept: "application/json",
        // Authorization: `Bearer ${token}`,
      },
    }).then((data) => {
      setCards(data.data.data);
    }).catch((error) => {
      console.log(error)
    })
  },[])

  const showCards = cards.map((card, index) => (
    <div key={index} className="shadow-xl bg-white rounded-xl p-5 flex flex-col justify-between text-center">
      <div className="bg-blue-300 rounded-md h-[200px] bg-contain">
        <img className="rounded-md w-full h-full" src={`${ImageUrl}${card.image}`} alt="medication_image"/>
      </div>
      <p className="my-5 font-bold">{card.name}</p>
      <div className="flex text-2xl justify-center">
        <div className="bg-blue-500 p-2 mr-5 text-white rounded-xl border-2 border-blue-500 hover:bg-transparent hover:text-black transition duration-[0.3s] cursor-pointer">
          <MdEdit />
        </div>
        <div className="bg-red-500 p-2 text-white rounded-xl border-2 border-red-500 hover:bg-transparent hover:text-black transition duration-[0.3s] cursor-pointer">
          <MdDelete />
        </div>
      </div>
    </div>
  ))

  return (
    <div className="flex bg-[#089bab1c]">
      <Sidebar />
      <div className="p-5 flex-1">
        <Title label="Medications" />
        <div className="mt-3 flex items-center">
          <Button
            className="md:mr-5 md:w-[200px] hidden md:flex"
            variant="primary"
            icon={<FiPlus className="mr-3 text-2xl" />}
            children="Add Medication"
          />
          <PlusButton />
          <FormInput
            icon={<IoIosSearch className="text-black text-lg" />}
            placeholder="Search"
            className="w-[200px] md:w-[300px] bg-gray-300 placeholder-black"
          />
        </div>
        <div className="content grid md:grid-cols-2 lg:grid-cols-4 gap-2 py-5">
          {showCards}
        </div>
      </div>
    </div>
  );
}
