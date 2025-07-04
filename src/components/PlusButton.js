import { FiPlus } from "react-icons/fi";

export default function PlusButton ({className}) {
  return(
    <button className={`bg-[#089bab] hover:bg-[#047986] duration-300 text-white p-2 rounded-xl absolute bottom-[15px] right-[15px] md:hidden ${className}`}>
      <FiPlus className="text-lg" />
    </button>
  );
}