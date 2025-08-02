// import components
import Cookies from "universal-cookie";
import Sidebar from "../../components/Sidebar";
import Title from "../../components/Title";

export default function Overview(){

  // Cookies
  const cookie = new Cookies();
  const token = cookie.get("userAccessToken");
  
  return(
    <>
      <Sidebar />
      <div className="page-content px-7 py-5 md:p-5 bg-[#089bab1c]">
        <Title label="Overview" />
      </div>
    </>
  );
}