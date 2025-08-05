import { Route, Routes } from "react-router-dom";
import Login from "./pages/Authentication/Login";
import Overview from "./pages/Dashboard/Overview";
import Medications from "./pages/Medications/Medications";
import Treatments from "./pages/Treatment Notes/Treatments";
import MedicationsPlans from "./pages/Medications Plans/MedicationsPlans";
import TreatmentsPlans from "./pages/Treatments Plans/TreatmentsPlans";
import TreatmentPlan from "./pages/Treatments Plans/TreatmentPlan";
import RequireAuth from "./pages/Authentication/RequireAuth";
import Users from "./pages/Users/Users";


export default function App() {
  return (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route element={<RequireAuth />}>
      <Route path="/overview" element={<Overview />} />
      <Route path="/medications" element={<Medications />} />
      <Route path="/medications-plans" element={<MedicationsPlans />} />
      <Route path="/treatments-plans" element={<TreatmentsPlans />} />
      <Route path="/treatments-notes" element={<Treatments />} />
      <Route path="/treatment-plan" element={<TreatmentPlan />} />
      <Route path="/users" element={<Users />} />
    </Route>
  </Routes>
  );
}
