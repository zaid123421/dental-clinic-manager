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
import "../../index.css";

export default function Medications() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    axios
      .get(`${BaseUrl}/medication`, {
        headers: {
          Accept: "application/json",
          // Authorization: `Bearer ${token}`,
        },
      })
      .then((data) => {
        setCards(data.data.data);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const showCards = cards.map((card, index) => (
    <div
      key={index}
      className="shadow-xl bg-white rounded-xl p-4 flex flex-col justify-between text-center"
    >
      <div className="bg-blue-300 rounded-md h-[150px] md:h-[100px] bg-contain">
        <img
          className="rounded-md w-full h-full"
          src={`${ImageUrl}${card.image}`}
          alt="medication_image"
        />
      </div>
      <p className="my-3 font-bold">{card.name}</p>
      <div className="flex text-2xl justify-center">
        <div className="bg-[#089bab] p-1 md:p-2 mr-5 text-white rounded-lg md:rounded-xl border-2 border-[#089bab] hover:bg-transparent hover:text-black transition duration-300 cursor-pointer">
          <MdEdit className="text-sm md:text-lg" />
        </div>
        <div className="bg-red-500 p-1 md:p-2 text-white rounded-lg md:rounded-xl border-2 border-red-500 hover:bg-transparent hover:text-black transition duration-300 cursor-pointer">
          <MdDelete className="text-sm md:text-lg" />
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
          <Button
            className="md:mr-5 min-w-[225px] hidden md:flex"
            variant="primary"
            icon={<FiPlus className="mr-3 text-2xl" />}
            children="Add Medication"
          />
          <PlusButton />
          <FormInput
            icon={<IoIosSearch className="text-black text-lg" />}
            placeholder="Search"
            className="w-full md:w-[250px] bg-white border-[#089bab] placeholder-black shadow-lg"
          />
        </div>
        <div className="content grid md:grid-cols-3 lg:grid-cols-6 gap-3 py-5">
          <div className="shadow-xl bg-white rounded-xl p-5 flex flex-col justify-between text-center">
            <div className="bg-blue-300 rounded-md h-[100px] bg-contain">
              <img
                className="rounded-md w-full h-full"
                alt="medication_image"
              />
            </div>
            <p className="my-3 font-bold">Test Medication</p>
            <div className="flex text-2xl justify-center">
              <div className="bg-[#089bab] p-1.5 mr-5 text-white rounded-xl border-2 border-[#089bab] hover:bg-transparent hover:text-black transition duration-300 cursor-pointer">
                <MdEdit className="text-lg" />
              </div>
              <div className="bg-red-500 p-1.5 text-white rounded-xl border-2 border-red-500 hover:bg-transparent hover:text-black transition duration-300 cursor-pointer">
                <MdDelete className="text-lg" />
              </div>
            </div>
          </div>

          {showCards}
        </div>
      </div>
    </>
  );
}
