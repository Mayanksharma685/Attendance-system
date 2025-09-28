import React from "react";

const Overview: React.FC = () => {
  // Example mock data – later you can fetch this dynamically from API
  const student = {
    name: "John Doe",
    enrollment: "CS2025",
    email: "john@example.com",
    college: "Bennett University",
    course: "B.Tech Computer Science",
    specialization: "Artificial Intelligence",
    tenure: "2021 - 2025",
    semester: 5,
    year: "3rd Year",
    fatherName: "Mr. Richard Doe",
    motherName: "Mrs. Jane Doe",
    address: "123, Main Street, New Delhi, India",
    contactNumber: "1234567890",
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Student Dashboard</h1>

      <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">
          {student.name}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <div>
            <p><span className="font-medium">Enrollment:</span> {student.enrollment}</p>
            <p><span className="font-medium">Email:</span> {student.email}</p>
            <p><span className="font-medium">College:</span> {student.college}</p>
            <p><span className="font-medium">Course:</span> {student.course}</p>
            <p><span className="font-medium">Specialization:</span> {student.specialization}</p>
            <p><span className="font-medium">Tenure:</span> {student.tenure}</p>
          </div>
          <div>
            <p><span className="font-medium">Current Semester:</span> {student.semester}</p>
            <p><span className="font-medium">Year:</span> {student.year}</p>
            <p><span className="font-medium">Father's Name:</span> {student.fatherName}</p>
            <p><span className="font-medium">Mother's Name:</span> {student.motherName}</p>
            <p><span className="font-medium">Address:</span> {student.address}</p>
            <p><span className="font-medium">Contact Number:</span> {student.contactNumber}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
