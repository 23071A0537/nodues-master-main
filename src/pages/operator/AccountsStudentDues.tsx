import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api";
import "./OperatorDashboard.css";

interface Student {
  _id: string;
  rollNumber: string;
  name: string;
  academicYear?: { from: number; to: number };
  section: string;
  department: string;
  hasPendingDues: boolean;
}

const AccountsStudentDues: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search filters
  const [searchRollNumber, setSearchRollNumber] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");
  const initialStatus = React.useMemo(() => {
    const path = location.pathname.toLowerCase();
    if (path.endsWith("/uncleared") || path.endsWith("/pending"))
      return "pending" as const;
    if (path.endsWith("/cleared")) return "cleared" as const;
    return "all" as const;
  }, [location.pathname]);

  const [dueStatusFilter, setDueStatusFilter] = useState<
    "all" | "pending" | "cleared"
  >(initialStatus);

  useEffect(() => {
    fetchStudents();
  }, []);

  // Keep filter in sync when navigating between cleared/uncleared routes
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path.endsWith("/uncleared") || path.endsWith("/pending")) {
      setDueStatusFilter("pending");
    } else if (path.endsWith("/cleared")) {
      setDueStatusFilter("cleared");
    } else {
      setDueStatusFilter("all");
    }
  }, [location.pathname]);

  useEffect(() => {
    // Apply filters
    let filtered = students;

    if (searchRollNumber) {
      filtered = filtered.filter((student) =>
        student.rollNumber
          .toLowerCase()
          .includes(searchRollNumber.toLowerCase())
      );
    }

    if (searchName) {
      filtered = filtered.filter((student) =>
        student.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (searchDepartment) {
      filtered = filtered.filter((student) =>
        student.department
          .toLowerCase()
          .includes(searchDepartment.toLowerCase())
      );
    }

    if (dueStatusFilter === "pending") {
      filtered = filtered.filter((student) => student.hasPendingDues);
    } else if (dueStatusFilter === "cleared") {
      filtered = filtered.filter((student) => !student.hasPendingDues);
    }

    setFilteredStudents(filtered);
  }, [
    students,
    searchRollNumber,
    searchName,
    searchDepartment,
    dueStatusFilter,
  ]);

  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/operator/all-students");
      if (!Array.isArray(res.data)) {
        throw new Error("Invalid response format");
      }
      setStudents(res.data);
      setFilteredStudents(res.data);
    } catch (err: any) {
      console.error("Failed to fetch students", err);
      setError(err?.response?.data?.message || "Failed to load students");
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentClick = (rollNumber: string) => {
    navigate(`/operator/student/${rollNumber}`);
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Loading student dues...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Student Dues Management</h2>
      {initialStatus !== "all" && (
        <div
          style={{
            display: "inline-block",
            marginBottom: 12,
            padding: "6px 10px",
            borderRadius: 8,
            background: initialStatus === "cleared" ? "#dcfce7" : "#fee2e2",
            color: initialStatus === "cleared" ? "#166534" : "#991b1b",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          {initialStatus === "cleared" ? "Cleared" : "Uncleared"} View
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {/* Filters */}
      <div
        style={{
          marginBottom: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "12px",
          backgroundColor: "white",
          padding: "16px",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
        }}
      >
        <input
          type="text"
          placeholder="Search by Roll Number..."
          value={searchRollNumber}
          onChange={(e) => setSearchRollNumber(e.target.value)}
          className="dashboard-input"
          style={{ width: "100%" }}
        />
        <input
          type="text"
          placeholder="Search by Name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="dashboard-input"
          style={{ width: "100%" }}
        />
        <input
          type="text"
          placeholder="Search by Department..."
          value={searchDepartment}
          onChange={(e) => setSearchDepartment(e.target.value)}
          className="dashboard-input"
          style={{ width: "100%" }}
        />
        <select
          value={dueStatusFilter}
          onChange={(e) =>
            setDueStatusFilter(e.target.value as "all" | "pending" | "cleared")
          }
          className="dashboard-select"
          style={{ width: "100%" }}
        >
          <option value="all">All Students</option>
          <option value="pending">With Pending Dues</option>
          <option value="cleared">Cleared</option>
        </select>
      </div>

      {/* Students Table */}
      {filteredStudents.length === 0 ? (
        <p style={{ textAlign: "center", padding: "20px", color: "#666" }}>
          No students found
        </p>
      ) : (
        <div className="dashboard-table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Roll Number</th>
                <th style={{ textAlign: "left" }}>Name</th>
                <th style={{ textAlign: "left" }}>Department</th>
                <th style={{ textAlign: "left" }}>Section</th>
                <th style={{ textAlign: "left" }}>Pending Dues</th>
                <th style={{ textAlign: "left" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr
                  key={student._id}
                  className={
                    student.hasPendingDues
                      ? "dashboard-row-pending"
                      : "dashboard-row-cleared"
                  }
                >
                  <td>{student.rollNumber}</td>
                  <td>{student.name}</td>
                  <td>{student.department}</td>
                  <td>{student.section}</td>
                  <td>
                    {student.hasPendingDues ? (
                      <span style={{ color: "#dc2626", fontWeight: "bold" }}>
                        Yes
                      </span>
                    ) : (
                      <span style={{ color: "#16a34a", fontWeight: "bold" }}>
                        No
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      className="dashboard-btn-view"
                      onClick={() => handleStudentClick(student.rollNumber)}
                    >
                      View Dues
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AccountsStudentDues;
