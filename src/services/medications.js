import axios from "axios";
import { BaseUrl } from "../config";
import Cookies from "universal-cookie";

  // Cookies
  const cookie = new Cookies();
  const token = cookie.get("token");

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  }

  export const getMedications = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/medication`, { headers });
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  export const addMedication = async (medicationForm) => {
    const formData = new FormData();
    formData.append("name", medicationForm.name);
    formData.append("info", medicationForm.description);
    if (medicationForm.image !== null) {
      formData.append("image", medicationForm.image);
    }
    try {
      const response = await axios.post(`${BaseUrl}/medication`, formData, { headers });
      return response.data.data;
    } catch (error) {
      console.error("Error adding medication:", error);
      throw error;
    }
  };

  export const deleteMedication = async (medicationId) => {
    try {
      const response = await axios.delete(`${BaseUrl}/medication/${medicationId}`, { headers });
      return response.data.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  export const editMedication = async (medicationForm, oldMedicationForm) => {
    const formData = new FormData();
    if (medicationForm.name !== oldMedicationForm.name) {
      formData.append("name", medicationForm.name);
    }
    if (medicationForm.description !== oldMedicationForm.description) {
      formData.append("info", medicationForm.description);
    }
    if (medicationForm.image && typeof medicationForm.image !== "string") {
      formData.append("image", medicationForm.image);
    }
    formData.append("_method", "patch");
    try {
      const response = await axios.post(`${BaseUrl}/medication/${medicationForm.id}`, formData, { headers });
      return response.data.data;
    } catch (error) {
      console.error("Error adding medication:", error);
      throw error;
    }
  };