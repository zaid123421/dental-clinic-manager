import { useState } from "react";
import Manager from "../../assets/Manager.webp";
import FormInput from "../../components/FormInput";
import Button from "../../components/Button";
export default function Login() {

  const [formData, setFormData] = useState({
    phoneNumber: null,
    paswword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-100 md:p-5">
      <div className="flex flex-col-reverse md:flex-row bg-white w-full h-full md:w-[900px] md:h-[500px] rounded-2xl shadow-2xl">
        <div className="flex-1 flex flex-col">
          <p className="mt-5 text-center text-3xl font-medium w-full text-blue-500 ">
            Manager Dashboard
          </p>
          <p className="mt-5 md:mt-10 mb-3 text-2xl font-bold text-center"> Sign in</p>
          <form className="p-3 md:p-10" onSubmit="">
            <FormInput
              autoFocus
              name="phoneNumber"
              label="Phone Number"
              type="phone"
              placeholder="Enter Phone Number"
              onChange={handleChange}
            />
            <FormInput
              name="paswword"
              label="Password"
              type="password"
              placeholder="Enter Your Password"
              onChange={handleChange}
            />
            <Button label="Sign in" />
          </form>
        </div>
        <div className="md:flex-1 flex justify-center mt-10 md:mt-0">
          <img
            className="w-[100px] h-[100px] md:w-full md:h-full object-cover rounded-2xl"
            src={Manager}
            alt="manager"
          />
        </div>
      </div>
    </div>
  );
}
