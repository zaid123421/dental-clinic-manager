// Hooks
import { useEffect, useState } from "react";
// Cookies
import Cookies from "universal-cookie";
// Axios Library
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Title from "../../components/Title";
import Loading from "../../components/Loading";
import { BaseUrl } from "../../config";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export default function Reviews() {
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");

  const cookie = new Cookies();
  const token = cookie.get("token");

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${BaseUrl}/doctor`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDoctors(res.data.data))
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (selectedDoctorId === "All") {
      setReviews([]);
      return;
    }

    setIsLoading(true);
    axios
  .get(`${BaseUrl}/doctor/${selectedDoctorId}/review`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  .then((res) => {
    setReviews(Array.isArray(res.data.data.data) ? res.data.data.data : []);
  })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }, [selectedDoctorId]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-400" />);
      else if (rating + 0.5 >= i) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      else stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
    return stars;
  };

  const filteredReviews = Array.isArray(reviews)
    ? reviews.filter((rev) => {
        if (ratingFilter === "All") return true;
        return Math.floor(rev.rating) === Number(ratingFilter);
      })
    : [];

  return (
    <>
      <Sidebar />
      <div className="page-content p-3 md:py-5 md:p-5 bg-[#089bab1c]">
        <Title label="Reviews" />

        {/* Dropdown لاختيار الدكتور */}
        <div className="flex gap-3 mt-4">
          <select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            className="w-64 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#089bab]"
          >
            <option value="All">All Doctors</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </select>

        </div>

        {/* عرض الكروت */}
        <div
          className={`grid md:grid-cols-2 lg:${
            selectedDoctorId === "All" ? "grid-cols-6" : "grid-cols-4"
          } gap-3 py-5`}
        >
          {selectedDoctorId === "All" ? (
            doctors.length > 0 ? (
              doctors.map((doc) => (
                <div
                  key={doc.id}
                  className={`border rounded-xl p-4 shadow-lg flex flex-col items-start gap-2 hover:shadow-xl transition duration-300 ${
                    doc.is_banned ? "bg-gray-200 opacity-60" : "bg-white"
                  }`}
                >
                  <h2 className="font-bold text-lg">{doc.name}</h2>
                  <p className="text-gray-600 font-semibold">{doc.phone_number}</p>
                  <div className="flex">{renderStars(doc.avg_rating)}</div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center">No doctors found.</p>
            )
          ) : filteredReviews.length > 0 ? (
            filteredReviews.map((rev, idx) => (
              <div
                key={idx}
                className="border rounded-xl p-4 shadow-lg flex flex-col items-start gap-2 hover:shadow-xl transition duration-300 bg-white"
              >
                <div className="flex-1 w-full flex justify-between">
                  <span className="font-bold">Patient Name:</span>
                  <span className="font-semibold">{rev.patient?.name}</span>
                </div>
                <div className="flex-1 w-full flex justify-between">
                  <span className="font-bold">Doctor Name:</span>
                  <span className="font-semibold">{rev.doctor?.name}</span>
                </div>
                <div className="flex-1 w-full flex justify-between">
                  <span className="font-bold">Treatment Plan:</span>
                  <span className="font-semibold text-right">{rev.treatment?.name}</span>
                </div>
                <div className="flex-1 w-full">
                  <div className="w-full flex items-center justify-between">

                  <span className="font-bold">Rating:</span>
                  <div className="w-full flex justify-end">{renderStars(rev.rating)}</div>
                  </div>
                    <p className="text-gray-600 font-semibold bg-gray-100 p-2 rounded-xl text-right mt-2">
                      {rev.comment || "لا يوجد تعليق من المريض"}
                    </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">No reviews found.</p>
          )}
        </div>

      </div>

      {isLoading && <Loading />}
    </>
  );
}
