import Sidebar from "../../components/Sidebar";
import Title from "../../components/Title";


export default function Overview(){
  return(
    <>
      <Sidebar />
      <div className="page-content px-7 py-5 md:p-5 bg-[#089bab1c]">
        <Title label="Overview" />
      </div>
    </>
  );
}