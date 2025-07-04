import Sidebar from "../../components/Sidebar";
import Title from "../../components/Title";


export default function Overview(){
  return(
    <div className="flex bg-[#089bab1c]">
      <Sidebar />
      <div className="px-7 py-5 md:p-5 flex-1">
        <Title label="Overview" />
      </div>
    </div>
  );
}