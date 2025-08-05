// import components
import Button from "../../components/Button";
import FormInput from "../../components/FormInput";
import PlusButton from "../../components/PlusButton";
import Sidebar from "../../components/Sidebar";
import Title from "../../components/Title";
import Modal from "../../components/Modal"
import Loading from "../../components/Loading";
import ConfirmDelete from "../../components/ConfirmDelete";
// import icons
import { IoIosSearch } from "react-icons/io";
import { FiPlus } from "react-icons/fi";
import { MdEdit, MdDelete } from "react-icons/md";
// import hooks
import { useEffect, useState } from "react";
import axios from "axios";
import { BaseUrl } from "../../config";
// import images
import successImage from '../../assets/success.gif';
import error from '../../assets/error.gif';

import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

export default function TreatmentsPlans() {
  // States
  const [addBox, setAddBox] = useState(false);
  const [addCategoryBox, setAddCategoryBox] = useState(false);
  const [editCategoryBox, setEditCategoryBox] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tooth, setTooth] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmCategoryDelete, setConfirmCategoryDelete] = useState(false);
  const [confirmPlanDelete, setConfirmPlanDelete] = useState(false);
  
  const [category, setCategory] = useState({
    id: null,
    name: ""
  });
  const [oldCategory, setOldCategory] = useState({
    id: null,
    name: ""
  });
  const [plan, setPlan] = useState({
    id: null,
    name: "",
    category: "",
    cost: null,
    tooth_status: "",
  });
  const [modal, setModal] = useState({
    isOpen: false,
    message: "",
    image: "",
  });

  // useEffect
  useEffect(() => {
    axios
      .get(`${BaseUrl}/category`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((data) => {
        setCategories(data.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refreshFlag]);

  useEffect(() => {
    axios
      .get(`${BaseUrl}/treatment-plan`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((data) => {
        setPlans(data.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refreshFlag]);

  useEffect(() => {
    axios
      .get(`${BaseUrl}/tooth-status`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((data) => {
        setTooth(data.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refreshFlag]);

  useEffect(() => {
    if (modal.isOpen) {
      const timer = setTimeout(() => {
        setModal((prev) => ({ ...prev, isOpen: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [modal.isOpen]);

  useEffect(() => {
  if (addCategoryBox || editCategoryBox || confirmCategoryDelete || addBox || confirmPlanDelete) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
  return () => {
    document.body.style.overflow = "auto";
  };
  }, [addCategoryBox, editCategoryBox, confirmCategoryDelete, addBox, confirmPlanDelete]);

  // useNavigate
  const nav = useNavigate();

  // Cookies
  const cookie = new Cookies();
  const token = cookie.get("userAccessToken");

  // Destructure
  const allCategories = [{ name: "All" }, ...categories];

  // Mapping
  const showCategories = allCategories?.map((category, index) => (
    <button
      onClick={() => {
        setSelectedType(category.name);
        setCategory({
          id: category.id,
          name: category.name
        });
        setOldCategory({
          id: category.id,
          name: category.name
        })
      }}
      className={`${category.name === selectedType ? "bg-[#089bab] text-white" : ""} py-2 px-3 rounded-xl w-full lg:w-fit font-semibold hover:text-white hover:bg-[#089bab] duration-300`} key={index}>
      {category.name}
    </button>
  ));

  const showCategoriesOptions = categories?.map((category, index) => (
    <option className="border-none outline-none" key={index} value={category.id}>{category.name}</option>
  ));

  const showToothNames = tooth?.map((onlyTooth, index) => (
    <option className="border-none outline-none" key={index} value={onlyTooth.id}>{onlyTooth.name}</option>
  ));

  const filteredPlans = selectedType === "All"
    ? plans
    : plans?.filter(plan => plan.category.name === selectedType);

  const showPlans = filteredPlans?.map((plan, index) => (
    <div key={index} className="bg-white shadow-md p-3 rounded-xl text-lg font-semibold overflow-hidden">
        <p className=" flex justify-between">Name: <span className="ml-2 text-[#089bab]">{plan.name}</span></p>
        <p className="flex justify-between">Category: <span className="ml-2 text-[#089bab]">{plan.category.name}</span></p>
        <p className="flex justify-between">Cost: <span className="ml-2 text-[#089bab]">{plan.cost.toLocaleString()}</span></p>
        <p className="flex justify-between">Tooth Status After Plan: <span className="ml-2 text-[#089bab]">{plan.tooth_status?.name}</span></p>
        <div className="flex text-2xl justify-center mt-2">
          <div onClick={() => nav(`/treatment-plan?id=${plan.id}`)} className="bg-[#089bab] p-1 mr-2 text-white rounded-lg md:rounded-xl border-2 border-[#089bab] hover:bg-transparent hover:text-black transition duration-300 cursor-pointer">
            <MdEdit className="text-sm md:text-base" />
          </div>
          <div onClick={(e) => {
            e.stopPropagation();
            setConfirmPlanDelete(true)
            setPlan({
              id: plan.id,
              name: plan.name,
              category: plan.category.name,
              cost: plan.cost,
              tooth_status: plan.tooth_status.name
            })
          }} className="bg-red-500 p-1 text-white rounded-lg md:rounded-xl border-2 border-red-500 hover:bg-transparent hover:text-black transition duration-300 cursor-pointer">
            <MdDelete className="text-sm md:text-base" />
          </div>
        </div>
    </div>
  ));

  async function AddCategory() {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", category.name);
    try {
      const res = await axios.post(`${BaseUrl}/category`, formData, 
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data.data);
        setSelectedType(category.name);
        setAddCategoryBox(false);
        setRefreshFlag((prev) => prev + 1);
        setCategory({
          id: res.data.data.id,
          name: res.data.data.name
        })
        setOldCategory({
          id: res.data.data.id,
          name: res.data.data.name
        })
        setModal({
          isOpen: true,
          message: "The Category Has Been Added Successfully !",
          image: successImage,
        });
    } catch (err) {
      console.log(err);
      setModal({
        isOpen: true,
        message: "Something Went Wrong !",
        image: error,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function EditCategory() {
    console.log(category.id)
    setIsLoading(true);
    const formData = new FormData();
    if(category.name !== oldCategory.name) {
      formData.append("name", category.name);
    }
    formData.append("_method", "patch");
    try {
      await axios.post(`${BaseUrl}/category/${category.id}`, formData,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setSelectedType(category.name)
        setEditCategoryBox(false);
        setRefreshFlag((prev) => prev + 1);
        setModal({
          isOpen: true,
          message: "The Category Has Been Edited Successfully !",
          image: successImage,
        });
    } catch (err) {
      console.log(err);
      setModal({
        isOpen: true,
        message: "Something Went Wrong !",
        image: error,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function DeleteCategory() {
    setIsLoading(true);
    try {
      await axios.delete(`${BaseUrl}/category/${category.id}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
          setCategory(() => ({
            id: null,
            name: ""
          }))
          setConfirmCategoryDelete(false);
          setSelectedType("All");
          setRefreshFlag((prev) => prev + 1);
          setModal({
            isOpen: true,
            message: "The Category Has Been Deleted Successfully !",
            image: successImage,
          });
    } catch {
      setConfirmCategoryDelete(false);
      setModal({
        isOpen: true,
        message: "Something Went Wrong !",
        image: error,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function DeletePlan() {
    setIsLoading(true);
    try {
      await axios.delete(`${BaseUrl}/treatment-plan/${plan.id}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
          setPlan(() => ({
            id: null,
            name: "",
            category: "",
            cost: null,
            tooth_status: "",
          }))
          setConfirmPlanDelete(false);
          setRefreshFlag((prev) => prev + 1);
          setModal({
            isOpen: true,
            message: "The Plan Has Been Deleted Successfully !",
            image: successImage,
          });
    } catch {
      setConfirmPlanDelete(false);
      setModal({
        isOpen: true,
        message: "Something Went Wrong !",
        image: error,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function AddPlan() {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", plan.name);
    formData.append("category_id", plan.category);
    formData.append("cost", plan.cost);
    formData.append("tooth_status_id", plan.tooth_status);
    try {
      const res = await axios.post(`${BaseUrl}/treatment-plan`, formData,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
          setPlan(() => ({
            id: null,
            name: "",
            category: "",
            cost: null,
            tooth_status: "",
          }))
          setRefreshFlag((prev) => prev + 1);
          setModal({
            isOpen: true,
            message: "The Plan Has Been Added Successfully !",
            image: successImage,
          });
          setAddBox(false);
          setTimeout(() => {
            nav(`/treatment-plan?id=${res.data.data.id}`);
        }, 3000);
    } catch (err) {
      console.log(err);
      setModal({
        isOpen: true,
        message: "Something Went Wrong !",
        image: error,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return(
    <>
      <Sidebar />
      <div className="page-content px-7 py-5 md:p-5 bg-[#089bab1c] overflow-hidden">
        <Title label="Treatments Plans" />
        <div className="mt-3 flex flex-col lg:flex-row">
          <Button onClick={() => setAddBox(true)} className="min-w-[250px] hidden md:flex"
            variant="primary"
            icon={<FiPlus className="mr-3 text-2xl" />}
            children="Add Treatment Plan"
          />
          <Button onClick={() => {
            setAddCategoryBox(true);
            setCategory({
              id: null,
              name: ""
            })
          }} className="lg:mx-2 my-5 lg:my-0 min-w-[200px] flex"
            variant="primary"
            icon={<FiPlus className="mr-3 text-2xl" />}
            children="Add Category"
          />
          <PlusButton onClick={() => setAddBox(true)} />
          <FormInput icon={<IoIosSearch className="text-black text-lg" />}
            placeholder="Search"
            className="w-full lg:w-[250px] bg-white border-[#089bab] placeholder-black shadow-lg"/>
        </div>
        <div className="my-3 rounded-xl bg-white flex flex-col lg:flex-row flex-wrap w-full lg:w-fit gap-4 overflow-hidden">
          {showCategories}
        </div>
        <div className="flex items-center">
          <p className="text-3xl font-semibold ml-1 mr-4">{selectedType === "All" ? "All Categories" : selectedType}</p>
          <div className={`${selectedType === "All" ? "hidden" : "flex"}`}>
            <MdDelete onClick={() => setConfirmCategoryDelete(true)} className="text-xl text-red-500 md:text-2xl mr-2 hover:text-red-600 duration-300 cursor-pointer" />
            <MdEdit onClick={() => {
              setEditCategoryBox(true)
            }} className="text-xl md:text-2xl text-[#089bab] hover:text-[#087b88] duration-300 cursor-pointer" />
          </div>
        </div>
        <div className="content grid md:grid-cols-2 lg:grid-cols-4 gap-3 py-5">
          {showPlans}
        </div>
      </div>

      {
        addCategoryBox &&
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-2">
          <div className="bg-white rounded-xl p-5 text-xl flex flex-col items-center shadow-xl w-[500px]">
            <div className=" mb-5 w-full">
              <h1 className="font-bold text-2xl text-center">Add Category</h1>
              <div className="flex flex-col my-3 font-semibold">
                <label className="px-4 mb-2">Name</label>
                <input
                name="name"
                value={category.name}
                onChange={(e) =>
                  setCategory((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                autoFocus
                placeholder="Add category name"
                className="placeholder:text-base outline-none border-2 border-transparent focus:border-[#089bab] bg-gray-100 rounded-xl py-1 px-4"
                />
              </div>
            </div>
            <div className="flex justify-center w-full mt-5">
              <button className="w-[85px] bg-[#9e9e9e] border-2 border-[#9e9e9e] p-1 rounded-xl text-white hover:bg-transparent hover:text-black duration-300" onClick={() => {
                setAddCategoryBox(false);
                setCategory({
                  id: null,
                  name: ""
                })
              }}>Cancel</button>
              <button className="w-[85px] bg-[#089bab] border-2 border-[#089bab] p-1 rounded-xl text-white hover:bg-transparent hover:text-black duration-300 ml-7" onClick={() => AddCategory()}>Add</button>
            </div>
          </div>
        </div>
      }

      {
        editCategoryBox &&
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-2">
          <div className="bg-white rounded-xl p-5 text-xl flex flex-col items-center shadow-xl w-[500px]">
            <div className=" mb-5 w-full">
              <h1 className="font-bold text-2xl text-center">Edit Category</h1>
              <div className="flex flex-col my-3 font-semibold">
                <label className="px-4 mb-2">Name</label>
                <input
                name="name"
                value={category.name}
                onChange={(e) =>
                  setCategory((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                autoFocus
                placeholder="Edit category name"
                className="placeholder:text-base outline-none border-2 border-transparent focus:border-[#089bab] bg-gray-100 rounded-xl py-1 px-4"
                />
              </div>
            </div>
            <div className="flex justify-center w-full mt-5">
              <button className="w-[85px] bg-[#9e9e9e] border-2 border-[#9e9e9e] p-1 rounded-xl text-white hover:bg-transparent hover:text-black duration-300" onClick={() => {
                setEditCategoryBox(false);
                setCategory((prev) => ({
                  ...prev,
                  name: oldCategory.name
                }))
              }}>Cancel</button>
              <button className="w-[85px] bg-[#089bab] border-2 border-[#089bab] p-1 rounded-xl text-white hover:bg-transparent hover:text-black duration-300 ml-7"
              onClick={() =>
              EditCategory()
              }>Edit</button>
            </div>
          </div>
        </div>
      }

      {
        addBox &&
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-2">
          <div className="bg-white rounded-xl p-5 text-xl flex flex-col items-center shadow-xl w-[500px]">
            <div className=" mb-5 w-full">
              <h1 className="font-bold text-2xl text-center">Add Plan</h1>
              <div className="flex flex-col my-3 font-semibold">
                <label className="px-4 mb-2">Name</label>
                <input
                name="name"
                value={plan.name}
                onChange={(e) =>
                  setPlan((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                autoFocus
                placeholder="Add Plan name"
                className="placeholder:text-base outline-none border-2 border-transparent focus:border-[#089bab] bg-gray-200 rounded-xl py-1 px-4"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="px-4 mb-2 font-semibold">Category</label>
                <select
                  value={plan.category}
                  onChange={(e) => setPlan((prev) => ({
                    ...prev,
                    category: e.target.value
                  }))}
                  className="max-w-[150px] mb-[10px] border-2 border-transparent focus:border-[#089bab] bg-gray-200 rounded-xl px-3 py-1 outline-none cursor-pointer"
                >
                  <option>None</option>
                  {showCategoriesOptions}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="px-4 mb-2 font-semibold">Tooth Status After Plan</label>
                <select
                  value={plan.tooth_status}
                  onChange={(e) => setPlan((prev) => ({
                    ...prev,
                    tooth_status: e.target.value
                  }))}
                  className="min-w-[150px] mb-[10px] border-2 border-transparent focus:border-[#089bab] bg-gray-200 rounded-xl px-3 py-1 outline-none cursor-pointer"
                >
                  <option>None</option>
                  {showToothNames}
                </select>
              </div>
              <div className="flex my-3 font-semibold justify-between">
                <label className="px-4">Cost</label>
                <input placeholder="Add plan cost" type="number"
                  value={plan.cost}
                  onChange={(e) => setPlan((prev) => ({
                    ...prev,
                    cost: e.target.value
                  }))}
                  className="placeholder:text-base w-[150px] bg-gray-200 text-center outline-none border-2 border-transparent focus:border-[#089bab] rounded-xl px-2 py-1"
                />
              </div>
            </div>
            <div className="flex justify-center w-full mt-5">
              <button className="w-[85px] bg-[#9e9e9e] border-2 border-[#9e9e9e] p-1 rounded-xl text-white hover:bg-transparent hover:text-black duration-300" onClick={() => {
                setAddBox(false);
                setPlan({
                  name: "",
                  category: "",
                  cost: null,
                  tooth_status: "",
                });
              }}>Cancel</button>
              <button onClick={() => AddPlan()} className="w-[85px] bg-[#089bab] border-2 border-[#089bab] p-1 rounded-xl text-white hover:bg-transparent hover:text-black duration-300 ml-7">Add</button>
            </div>
          </div>
        </div>
      }

      {confirmCategoryDelete && <ConfirmDelete
        onClick1={() => {setConfirmCategoryDelete(false)}}
        onClick2={() => DeleteCategory()} name={category.name}
        plan={true}/>}

      {confirmPlanDelete && <ConfirmDelete
        onClick1={() => {
          setConfirmPlanDelete(false)
          setPlan({
            id: null,
            name: "",
            category: "",
            cost: null,
            tooth_status: "",
          })
        }}
        onClick2={() => DeletePlan()} name={plan.name}/>}

      {isLoading && <Loading />}

      {modal.isOpen && <Modal message={modal.message} imageSrc={modal.image}/>}

    </>
  );
}