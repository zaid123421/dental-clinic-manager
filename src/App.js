import { Route, Routes } from "react-router-dom";
import Login from "./pages/Authentication/Login";
import Overview from "./pages/Dashboard/Overview";
import Medications from "./pages/Medications/Medications";
import MedicationDetails from "./pages/Medications/MedicationDetails";
import Treatments from "./pages/Treatment Notes/Treatments";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/overview" element={<Overview />}></Route>
      <Route path="/medications" element={<Medications />}></Route>
      <Route path="/medication-details" element={<MedicationDetails />}></Route>
      <Route path="/treatments-notes" element={<Treatments />}></Route>
    </Routes>
  );
}
