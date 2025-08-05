// import components
import Cookies from "universal-cookie";
import Sidebar from "../../components/Sidebar";
import Title from "../../components/Title";

export default function Overview() {
  // Cookies
  const cookie = new Cookies();
  const token = cookie.get("token");

  return (
    <>
      <Sidebar />
      <div className="page-content p-3 md:py-5 md:p-5 bg-[#089bab1c]">
        <Title label="Overview" />
      </div>
    </>
  );
}
