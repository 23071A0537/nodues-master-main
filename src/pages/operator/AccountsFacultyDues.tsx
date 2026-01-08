import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api";
import "./OperatorDashboard.css";

interface Faculty {
  _id: string;
  facultyId: string;
  name: string;
  email: string;
  department?: { name: string };
  totalDues: number;
  totalAmount: number;
  paymentDue: boolean;
}

const AccountsFacultyDues: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [filteredFaculty, setFilteredFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search filters
  const [searchFacultyId, setSearchFacultyId] = useState("");
  const [searchName, setSearchName] = useState("");
  const initialStatus = React.useMemo(() => {
    const path = location.pathname.toLowerCase();
    if (path.endsWith("/uncleared") || path.endsWith("/pending"))
      return "pending" as const;
    if (path.endsWith("/cleared")) return "no-dues" as const;
    return "all" as const;
  }, [location.pathname]);

  const [dueStatusFilter, setDueStatusFilter] = useState<
    "all" | "pending" | "no-dues"
  >(initialStatus);

  useEffect(() => {
    fetchFaculty();
  }, []);

  // Keep filter in sync when navigating between cleared/uncleared routes
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path.endsWith("/uncleared") || path.endsWith("/pending")) {
      setDueStatusFilter("pending");
    } else if (path.endsWith("/cleared")) {
      setDueStatusFilter("no-dues");
    } else {
      setDueStatusFilter("all");
    }
  }, [location.pathname]);

  useEffect(() => {
    // Apply filters
    let filtered = faculty;

    if (searchFacultyId) {
      filtered = filtered.filter((f) =>
        f.facultyId.toLowerCase().includes(searchFacultyId.toLowerCase())
      );
    }

    if (searchName) {
      filtered = filtered.filter((f) =>
        f.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (dueStatusFilter === "pending") {
      filtered = filtered.filter((f) => f.totalDues > 0);
    } else if (dueStatusFilter === "no-dues") {
      filtered = filtered.filter((f) => f.totalDues === 0);
    }

    setFilteredFaculty(filtered);
  }, [faculty, searchFacultyId, searchName, dueStatusFilter]);

  const fetchFaculty = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/operator/all-faculty");
      if (!Array.isArray(res.data)) {
        throw new Error("Invalid response format");
      }
      setFaculty(res.data);
      setFilteredFaculty(res.data);
    } catch (err: any) {
      console.error("Failed to fetch faculty", err);
      setError(err?.response?.data?.message || "Failed to load faculty");
      setFaculty([]);
      setFilteredFaculty([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFacultyClick = (facultyId: string) => {
    navigate(`/operator/faculty/${facultyId}`);
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Loading faculty dues...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Faculty Dues Management</h2>
      {initialStatus !== "all" && (
        <div
          style={{
            display: "inline-block",
            marginBottom: 12,
            padding: "6px 10px",
            borderRadius: 8,
            background: initialStatus === "no-dues" ? "#dcfce7" : "#fee2e2",
            color: initialStatus === "no-dues" ? "#166534" : "#991b1b",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          {initialStatus === "no-dues" ? "Cleared" : "Uncleared"} View
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
          placeholder="Search by Faculty ID..."
          value={searchFacultyId}
          onChange={(e) => setSearchFacultyId(e.target.value)}
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
        <select
          value={dueStatusFilter}
          onChange={(e) =>
            setDueStatusFilter(e.target.value as "all" | "pending" | "no-dues")
          }
          className="dashboard-select"
          style={{ width: "100%" }}
        >
          <option value="all">All Faculty</option>
          <option value="pending">With Pending Dues</option>
          <option value="no-dues">No Dues</option>
        </select>
      </div>

      {/* Faculty Table */}
      {filteredFaculty.length === 0 ? (
        <p style={{ textAlign: "center", padding: "20px", color: "#666" }}>
          No faculty found
        </p>
      ) : (
        <div className="dashboard-table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Faculty ID</th>
                <th style={{ textAlign: "left" }}>Name</th>
                <th style={{ textAlign: "left" }}>No. of Dues</th>
                <th style={{ textAlign: "left" }}>Total Amount (₹)</th>
                <th style={{ textAlign: "left" }}>Payment Status</th>
                <th style={{ textAlign: "left" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaculty.map((f) => (
                <tr
                  key={f._id}
                  className={
                    f.totalDues > 0
                      ? "dashboard-row-pending"
                      : "dashboard-row-cleared"
                  }
                >
                  <td>{f.facultyId}</td>
                  <td>{f.name}</td>
                  <td>
                    <strong>{f.totalDues}</strong>
                  </td>
                  <td>
                    <strong>₹{f.totalAmount}</strong>
                  </td>
                  <td>
                    {f.paymentDue ? (
                      <span style={{ color: "#dc2626", fontWeight: "bold" }}>
                        Due
                      </span>
                    ) : (
                      <span style={{ color: "#16a34a", fontWeight: "bold" }}>
                        Clear
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      className="dashboard-btn-view"
                      onClick={() => handleFacultyClick(f.facultyId)}
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

export default AccountsFacultyDues;
