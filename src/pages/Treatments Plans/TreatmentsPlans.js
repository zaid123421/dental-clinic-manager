// import hooks
import { useState } from "react";
// import components
import Button from "../../components/Button";
import FormInput from "../../components/FormInput";
import PlusButton from "../../components/PlusButton";
import Sidebar from "../../components/Sidebar";
import Title from "../../components/Title";
// import icons
import { IoIosSearch } from "react-icons/io";
import { FiPlus } from "react-icons/fi";

export default function TreatmentsPlans() {
  // States
  const [addBox, setAddBox] = useState(false);

  return(
    <>
      <Sidebar />
      <div className="page-content px-7 py-5 md:p-5 bg-[#089bab1c]">
        <Title label="Treatments Plans" />
        <div className="mt-3 flex items-center">
          <Button onClick={() => setAddBox(true)} className="md:mr-5 min-w-[250px] hidden md:flex"
            variant="primary"
            icon={<FiPlus className="mr-3 text-2xl" />}
            children="Add Treatment Plan"
          />
          <PlusButton onClick={() => setAddBox(true)} />
          <FormInput icon={<IoIosSearch className="text-black text-lg" />}
            placeholder="Search"
            className="w-full md:w-[250px] bg-white border-[#089bab] placeholder-black shadow-lg"/>
        </div>
        <div className="content grid md:grid-cols-3 lg:grid-cols-6 gap-3 py-5">
          {/* {showCards} */}
        </div>
      </div>
    </>
  );
}