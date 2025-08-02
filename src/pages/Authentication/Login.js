import { useState } from "react";
import Manager from "../../assets/Manager.webp";
import FormInput from "../../components/FormInput";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../../config";
import Loading from "../../components/Loading";
import Cookies from "universal-cookie";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const nav = useNavigate();

  const [formData, setFormData] = useState({
    phone_number: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const cookie = new Cookies();

  async function Submit(){
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${BaseUrl}/manager/login`, formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res.data.data.name)
        cookie.set("userAccessToken", res.data.data.token, { path: "/" });
        cookie.set("username", res.data.data.name, { path: "/" });
        nav("/overview");
    } catch(err) {
      console.log(err);
    } finally {
    setIsLoading(false);
    }
  }


  return (
    <>

      <div className="flex items-center justify-center h-screen bg-[#089bab1c] md:p-5">
        <div className="flex flex-col-reverse md:flex-row bg-white w-full h-full md:w-[900px] md:h-[500px] rounded-2xl shadow-2xl ">
          <div className="flex-1 flex flex-col">
            <p className="mt-5 md:mt-10 mb-3 text-2xl font-bold text-center"> Sign in</p>
            <form className="p-3 md:p-10" onSubmit={(e) => { e.preventDefault(); Submit(); }}>
              <FormInput
                className="w-full bg-[#089bab1c]"
                autoFocus
                name="phone_number"
                label="Phone Number"
                type="number"
                placeholder="Enter Phone Number"
                onChange={handleChange}
              />
              <FormInput
                className="w-full bg-[#089bab1c]"
                name="password"
                label="Password"
                type="password"
                placeholder="Enter Your Password"
                onChange={handleChange}
              />
              <Button variant="primary" className="mt-10 w-full">
                Sign in
              </Button>
            </form>
          </div>
          <div className="md:flex-1 flex justify-center mb-2 md:mb-0 mt-10 md:mt-0">
            <img
              className="w-[100px] h-[100px] md:w-full md:h-full object-cover rounded-2xl"
              src={Manager}
              alt="manager"
            />
          </div>
        </div>
      </div>

      {isLoading && <Loading />}

    </>
  );
}
