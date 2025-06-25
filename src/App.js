import { Route, Routes } from "react-router-dom";
import Login from "./pages/Authentication/Login";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
    </Routes>
  );
}
