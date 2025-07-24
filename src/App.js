import { Route, Routes } from "react-router-dom";
import Login from "./pages/Authentication/Login";
import Overview from "./pages/Dashboard/Overview";
import Medications from "./pages/Medications/Medications";
import Treatments from "./pages/Treatment Notes/Treatments";
import MedicationsPlans from "./pages/Medications Plans/MedicationsPlans";
import TreatmentsPlans from "./pages/Treatments Plans/TreatmentsPlans";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/overview" element={<Overview />}></Route>
      <Route path="/medications" element={<Medications />}></Route>
      <Route path="/medications-plans" element={<MedicationsPlans />}></Route>
      <Route path="/treatments-plans" element={<TreatmentsPlans />}></Route>
      <Route path="/treatments-notes" element={<Treatments />}></Route>
    </Routes>
  );
}
