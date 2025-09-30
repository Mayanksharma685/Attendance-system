import React, { useEffect, useState } from "react";
import { studentApi } from "../../api/studentApi";
import { Outlet } from "react-router-dom"; // for nested routes

const StudentDashboard: React.FC = () => {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const studentId = "12345"; // TODO: replace with logged-in user’s ID

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const p = await studentApi.getProfile(studentId);
        setProfile(p);
      } catch (err) {
        console.error(err);

        // fallback mock data
        setProfile({
          name: "MAYANK SHARMA",
          status: "Active",
          admissionNo: "E23CSEU1507",
          admissionYear: "2023",
          rollNo: "E23CSEU1507",
          degree: "Undergraduate",
          department: "School of Computer Science Engineering & Technology",
          semester: "Semester - 5",
          tenure: "2023 - 2027",
          year: "3rd Year",
          courseName: "Bachelor of Technology (Computer Science and Engineering)",
          specialization: "Full Stack Development",
          college: "Bennett University",
          curriculum: "B.Tech CSE Full Stack",
          academicStanding: "Good",
          academicClassification: "UG",
          discountCategory: "N/A",
          intake: "2023",
          validity: "2027",
          firstName: "MAYANK",
          lastName: "SHARMA",
          dob: "10-09-2005",
          age: "20",
          gender: "Male",
          fatherName: "Pushpendra Sharma",
          motherName: "Pooja Sharma",
          address: "House No. 10, Pratap Vihar",
          city: "Aligarh",
          state: "Uttar Pradesh-202150",
          contact: "8214345620",
          email: "e23cseu1507@bennett.edu.in",
          profileImage: "",
        });

        setError(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="p-6">Loading student data...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Student Dashboard
      </h1>

      {/* 👇 Student Profile Section (always visible) */}
      {profile && (
        <section className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column → Image + Basic Info */}
            <div className="flex flex-col items-center md:items-start">
              <img
                src={
                  profile.profileImage ||
                  "https://via.placeholder.com/150?text=Student"
                }
                alt="Student"
                className="w-36 h-36 rounded-full border shadow-md object-cover mb-4"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {profile.name}
                </h2>
                <p className="text-gray-600">{profile.rollNo}</p>
                <p className="text-gray-600">{profile.courseName}</p>
                <span className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full">
                  {profile.status}
                </span>
              </div>
            </div>

            {/* Right Column → Academic + Personal Info */}
            <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase">
                  College
                </h3>
                <p>{profile.college}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase">
                  Specialization
                </h3>
                <p>{profile.specialization}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase">
                  Tenure
                </h3>
                <p>{profile.tenure}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase">
                  Current Semester
                </h3>
                <p>{profile.semester}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase">
                  Year
                </h3>
                <p>{profile.year}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase">
                  Curriculum Plan
                </h3>
                <p>{profile.curriculum}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase">
                  Academic Standing
                </h3>
                <p>{profile.academicStanding}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase">
                  Academic Classification
                </h3>
                <p>{profile.academicClassification}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase">
                  Enrollment No.
                </h3>
                <p>{profile.admissionNo}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase">
                  Admission Year
                </h3>
                <p>{profile.admissionYear}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase">
                  Program Validity Date
                </h3>
                <p>{profile.validity}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase">
                  Father's Name
                </h3>
                <p>{profile.fatherName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase">
                  Mother's Name
                </h3>
                <p>{profile.motherName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase">
                  DOB
                </h3>
                <p>{profile.dob}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase">
                  Age
                </h3>
                <p>{profile.age}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase">
                  Gender
                </h3>
                <p>{profile.gender}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase">
                  Email
                </h3>
                <p>{profile.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase">
                  Contact
                </h3>
                <p>{profile.contact}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500 uppercase">
                  Address
                </h3>
                <p>
                  {profile.address}, {profile.city}, {profile.state}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/*  Nested route outlet */}
      <Outlet />
    </div>
  );
};

export default StudentDashboard;



