import { useState, useEffect } from "react";
import { deleteMedication, editMedication, getMedications } from "../services/medications";
import { addMedication } from "../services/medications";
import successImage from "../assets/success.gif";
import errorImage from "../assets/error.gif";

const useMedications = () => {
  const [medications, setMedications] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [modal, setModal] = useState({ isOpen: false, message: "", image: "" });

  useEffect(() => {
    getMedications()
      .then(setMedications)
      .catch(setError)
  }, []);

  const handleAddMedication = async (medicationForm, onSuccess) => {
    setIsLoading(true);
    setNameError("");
    try {
      await addMedication(medicationForm);
      const updatedMedications = await getMedications();
      setMedications(updatedMedications);
      setModal({
        isOpen: true,
        message: "The Medication Has Been Added Successfully !",
        image: successImage,
      });
      console.log(medicationForm.image)
      if (onSuccess) onSuccess();
    } catch (err) {
      console.log(err);
      if (err.response?.data?.message?.name) {
        setNameError(err.response.data.message.name[0]);
      } else {
        setModal({
          isOpen: true,
          message: "Something Went Wrong !",
          image: errorImage,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMedication = async (medicationId, onSuccess) => {
    setIsLoading(true);
    try {
      await deleteMedication(medicationId)
      setMedications((prev) =>
        prev.filter((med) => med.id !== medicationId)
      );
      setModal({
        isOpen: true,
        message: "The Medication Has Been Deleted Successfully !",
        image: successImage,
      });
    if (onSuccess) onSuccess();
    } catch {
      setModal({
        isOpen: true,
        message: "Something Went Wrong !",
        image: errorImage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMedication = async (medicationForm, oldMedicationForm, onSuccess) => {
    setIsLoading(true);
    setNameError("");
    try {
      await editMedication(medicationForm, oldMedicationForm);
      const updatedMedications = await getMedications();
      setMedications(updatedMedications);
      setModal({
        isOpen: true,
        message: "The Medication Has Been Edited Successfully !",
        image: successImage,
      });
      console.log(medicationForm.image)
      if (onSuccess) onSuccess();
    } catch (err) {
      console.log(err);
      if (err.response?.data?.message?.name) {
        setNameError(err.response.data.message.name[0]);
      } else {
        setModal({
          isOpen: true,
          message: "Something Went Wrong !",
          image: errorImage,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    medications,
    isLoading,
    error,
    nameError,
    modal,
    setModal,
    handleAddMedication,
    handleDeleteMedication,
    handleEditMedication
  };
};

export default useMedications;