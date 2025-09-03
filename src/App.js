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
import AddEmployee from "./pages/Users/AddEmployee";
import ShowEmployee from "./pages/Users/ShowEmployee";
import ShowPatient from "./pages/Users/ShowPatient";
import EditEmployee from "./pages/Users/EditEmployee";
import Reviews from "./pages/Reviews/Reviews";


export default function App() {
  return (
  <Routes>
    <Route path="/" element={<Login />} />
    {/* <Route element={<RequireAuth />}> */}
      <Route path="/overview" element={<Overview />} />
      <Route path="/medications" element={<Medications />} />
      <Route path="/medications-plans" element={<MedicationsPlans />} />
      <Route path="/treatments-plans" element={<TreatmentsPlans />} />
      <Route path="/treatments-notes" element={<Treatments />} />
      <Route path="/treatment-plan" element={<TreatmentPlan />} />
      <Route path="/users" element={<Users />} />
      <Route path="/add-employee" element={<AddEmployee />} />
      <Route path="/show-employee" element={<ShowEmployee />} />
      <Route path="/show-patient" element={<ShowPatient />} />
      <Route path="/edit-employee" element={<EditEmployee />} />
      <Route path="/reviews" element={<Reviews />} />
    {/* </Route> */}
  </Routes>
  );
}
