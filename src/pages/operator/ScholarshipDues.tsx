import React, { useEffect, useState } from "react";
import api from "../../api";
import "./ScholarshipDues.css";

interface ScholarshipDue {
  _id: string;
  personId: string;
  personName: string;
  department: string;
  description: string;
  amount: number;
  dueDate: string;
  dateAdded: string;
  scholarshipCertificateCleared: boolean;
  scholarshipSpecialPermission: boolean;
  scholarshipPermissionDate?: string;
}

const ScholarshipDues: React.FC = () => {
  const [dues, setDues] = useState<ScholarshipDue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    if (user.department !== "SCHOLARSHIP") {
      setError("Only Scholarship Department can access this page ❌");
      return;
    }
    fetchDues();
  }, []);

  const fetchDues = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/operator/scholarship/pending");
      setDues(res.data);
    } catch (err) {
      setError("Failed to fetch scholarship dues ❌");
      console.error(err);
    }
    setLoading(false);
  };

  const filteredDues = dues.filter(
    (d) =>
      d.personName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.personId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unclearedCount = dues.filter(
    (d) => !d.scholarshipCertificateCleared
  ).length;
  const clearedCount = dues.filter(
    (d) => d.scholarshipCertificateCleared
  ).length;

  return (
    <div className="scholarship-dues-container">
      <h2 className="scholarship-dues-title">🎓 Scholarship Dues Management</h2>

      {error && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="scholarship-dues-summary">
        <div className="summary-card">
          <div className="summary-label">Total Scholarship Dues</div>
          <div className="summary-value">{dues.length}</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Uncleared</div>
          <div className="summary-value" style={{ color: "#dc2626" }}>
            {unclearedCount}
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Cleared (Pending or Approved)</div>
          <div className="summary-value" style={{ color: "#16a34a" }}>
            {clearedCount}
          </div>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search by name or roll number..."
        className="scholarship-dues-search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {loading ? (
        <p>Loading scholarship dues...</p>
      ) : (
        <table className="scholarship-dues-table">
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Student Name</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Added Date</th>
              <th>Certificate Status</th>
              <th>Special Permission</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDues.length === 0 ? (
              <tr>
                <td colSpan={9} className="scholarship-dues-no-data">
                  No scholarship dues found
                </td>
              </tr>
            ) : (
              filteredDues.map((due) => (
                <tr key={due._id}>
                  <td>{due.personId}</td>
                  <td>{due.personName}</td>
                  <td>{due.description || "—"}</td>
                  <td>₹{due.amount}</td>
                  <td>{new Date(due.dueDate).toLocaleDateString()}</td>
                  <td>{new Date(due.dateAdded).toLocaleDateString()}</td>
                  <td>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "600",
                        backgroundColor: due.scholarshipCertificateCleared
                          ? "#d1fae5"
                          : "#fee2e2",
                        color: due.scholarshipCertificateCleared
                          ? "#065f46"
                          : "#991b1b",
                      }}
                    >
                      {due.scholarshipCertificateCleared
                        ? "✅ Cleared"
                        : "❌ Uncleared"}
                    </span>
                  </td>
                  <td>
                    {due.scholarshipSpecialPermission ? (
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "600",
                          backgroundColor: "#dbeafe",
                          color: "#0c4a6e",
                        }}
                      >
                        ✓ Granted
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    {!due.scholarshipCertificateCleared && (
                      <a
                        href={`/operator/scholarship-permissions/${due._id}`}
                        className="scholarship-dues-grant-btn"
                      >
                        Grant Permission
                      </a>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ScholarshipDues;
