import React, { useEffect, useState } from "react";
import api from "../../api";
import "./ClearDues.css";

interface Due {
  _id: string;
  personName: string;
  personId: string;
  personType: string;
  department: string;
  description: string;
  amount: number;
  dueDate: string;
  clearDate?: string | null;
  status: string;
  dateAdded: string;
  paymentStatus: "due" | "done";
  category?: string;
  dueType?: string;
}

const ClearDue: React.FC = () => {
  const [dues, setDues] = useState<Due[]>([]);
  const [filteredDues, setFilteredDues] = useState<Due[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedDueId, setSelectedDueId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [statusFilter, setStatusFilter] = useState("all");
  const [dueTypeFilter, setDueTypeFilter] = useState("all");
  const [totalAmount, setTotalAmount] = useState(0);
  const [userDepartment, setUserDepartment] = useState("");

  // Permission-based clearance states
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [documentUrl, setDocumentUrl] = useState("");

  useEffect(() => {
    fetchDues();
  }, []);

  useEffect(() => {
    if (dues.length > 0) filterDues();
  }, [dues, searchQuery, dateRange, statusFilter, dueTypeFilter]);

  const fetchDues = async () => {
    setLoading(true);
    setError("");
    try {
      const storedUser = sessionStorage.getItem("user");
      const department = storedUser ? JSON.parse(storedUser).department : "";
      setUserDepartment(department);
      const res = await api.get(`/operator/department/${department}`);
      setDues(res.data);
    } catch (err) {
      console.error("Failed to clear due", err);
      const msg =
        (err as any)?.response?.data?.message || "Failed to clear due";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const filterDues = () => {
    let temp = [...dues];

    // Search
    if (searchQuery.trim() !== "") {
      temp = temp.filter(
        (d) =>
          d.personName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.personId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Date range
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      temp = temp.filter((d) => {
        const addedDate = new Date(d.dateAdded);
        return addedDate >= startDate && addedDate <= endDate;
      });
    }

    // Status / Payment filter - UPDATED LOGIC
    if (statusFilter !== "all") {
      temp = temp.filter((d) => {
        if (statusFilter === "pending-at-accounts") {
          // Pending status at accounts (not cleared)
          return d.status === "pending";
        }
        if (statusFilter === "cleared-at-accounts") {
          // Cleared by department operator (regular clearance)
          return d.status === "cleared";
        }
        if (statusFilter === "cleared-by-permission") {
          // Cleared by permission (document provided)
          return d.status === "cleared-by-permission";
        }
        if (statusFilter === "payable") {
          // Payable dues (pending)
          return d.category === "payable" && d.status === "pending";
        }
        if (statusFilter === "non-payable") {
          // Non-payable dues (pending)
          return d.category === "non-payable" && d.status === "pending";
        }
        return true;
      });
    }

    // Due Type filter
    if (dueTypeFilter !== "all") {
      temp = temp.filter((d) => d.dueType === dueTypeFilter);
    }

    setFilteredDues(temp);
    const unpaidTotal = temp
      .filter((d) => d.paymentStatus !== "done")
      .reduce((sum, d) => sum + d.amount, 0);
    setTotalAmount(unpaidTotal);
  };

  const handleClearClick = (id: string, type: "regular" | "permission") => {
    setSelectedDueId(id);
    if (type === "permission") {
      setShowPermissionModal(true);
    } else {
      setShowConfirm(true);
    }
  };

  const confirmClearDue = async () => {
    if (!selectedDueId) return;
    try {
      setLoading(true);
      setError("");

      if (showPermissionModal) {
        // Accounts: clear by permission with document
        await api.put(`/operator/grant-permission/${selectedDueId}`, {
          documentUrl,
        });
        setShowPermissionModal(false);
        setDocumentUrl("");
      } else {
        // Regular clearance (non-Accounts or non-payable with payment done)
        await api.put(`/operator/clear-due/${selectedDueId}`, {
          clearanceType: "regular",
        });
        setShowConfirm(false);
      }

      // Refresh dues after action
      await fetchDues();
      setSelectedDueId(null);
    } catch (err) {
      console.error("Failed to clear due", err);
      const msg =
        (err as any)?.response?.data?.message || "Failed to clear due";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="clear-due-container">
      <h2 className="clear-due-title">Clear Dues</h2>

      {/* Filters */}
      <div className="clear-due-filters">
        <input
          type="text"
          placeholder="Search by name or ID..."
          className="clear-due-search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="clear-due-date-container">
          <label>From:</label>
          <input
            type="date"
            className="clear-due-date"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange({ ...dateRange, start: e.target.value })
            }
          />

          <label>To:</label>
          <input
            type="date"
            className="clear-due-date"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange({ ...dateRange, end: e.target.value })
            }
          />
        </div>

        <select
          className="clear-due-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Dues</option>
          <option value="pending-at-accounts">Pending at Accounts</option>
          <option value="cleared-at-accounts">Cleared at Accounts</option>
          <option value="cleared-by-permission">Cleared by Permission</option>
          <option value="payable">Dues with payment (Payable)</option>
          <option value="non-payable">Dues with payment (Non-payable)</option>
        </select>

        <select
          className="clear-due-select"
          value={dueTypeFilter}
          onChange={(e) => setDueTypeFilter(e.target.value)}
        >
          <option value="all">All Due Types</option>
          <option value="damage-to-property">Damage to College Property</option>
          <option value="fee-delay">Fee Delay</option>
          <option value="scholarship">Scholarship</option>
          <option value="scholarship-issue">Scholarship Issue</option>
          <option value="library-fine">Library Fine</option>
          <option value="hostel-dues">Hostel Dues</option>
          <option value="lab-equipment">Lab Equipment</option>
          <option value="sports-equipment">Sports Equipment</option>
          <option value="exam-malpractice">Exam Malpractice</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Enhanced Summary with category breakdown */}
      <div className="clear-due-summary-section">
        {/* Parent blocks adjacent: Overview, Categories, Amounts */}
        <div className="summary-blocks">
          <div className="summary-block">
            <h4 className="category-section-title">Dues Summary</h4>
            {/* Overview Cards */}
            <div className="summary-grid">
              <div className="summary-card summary-card-info">
                <div className="summary-card-header">
                  <span className="summary-icon">📊</span>
                  <span className="summary-label">Showing Results</span>
                </div>
                <div className="summary-value">
                  {filteredDues.length}{" "}
                  <span className="summary-total">of {dues.length}</span>
                </div>
              </div>

              <div className="summary-card summary-card-pending">
                <div className="summary-card-header">
                  <span className="summary-icon">⏳</span>
                  <span className="summary-label">Pending at Accounts</span>
                </div>
                <div className="summary-value">
                  {filteredDues.filter((d) => d.status === "pending").length}
                </div>
              </div>

              <div className="summary-card summary-card-success">
                <div className="summary-card-header">
                  <span className="summary-icon">✅</span>
                  <span className="summary-label">Cleared at Accounts</span>
                </div>
                <div className="summary-value">
                  {filteredDues.filter((d) => d.status === "cleared").length}
                </div>
              </div>

              <div className="summary-card summary-card-permission">
                <div className="summary-card-header">
                  <span className="summary-icon">📄</span>
                  <span className="summary-label">Cleared by Permission</span>
                </div>
                <div className="summary-value">
                  {
                    filteredDues.filter(
                      (d) => d.status === "cleared-by-permission"
                    ).length
                  }
                  {filteredDues.filter(
                    (d) => d.status === "cleared-by-permission"
                  ).length > 0 && (
                    <span className="no-payment-badge">No payment</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="summary-block">
            {/* Category Breakdown */}
            <div className="summary-category-section">
              <h4 className="category-section-title">
                Pending Dues by Category
              </h4>
              <div className="summary-grid-small">
                <div className="summary-card-small summary-card-payable">
                  <div className="summary-card-icon">💰</div>
                  <div className="summary-card-content">
                    <div className="summary-card-label">Payable Dues</div>
                    <div className="summary-card-value">
                      {
                        filteredDues.filter(
                          (d) =>
                            d.category === "payable" && d.status === "pending"
                        ).length
                      }
                    </div>
                  </div>
                </div>

                <div className="summary-card-small summary-card-non-payable">
                  <div className="summary-card-icon">📋</div>
                  <div className="summary-card-content">
                    <div className="summary-card-label">Non-Payable Dues</div>
                    <div className="summary-card-value">
                      {
                        filteredDues.filter(
                          (d) =>
                            d.category === "non-payable" &&
                            d.status === "pending"
                        ).length
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="summary-block">
            {/* Amount Summary */}
            <h4 className="category-section-title">Pending Amount</h4>
            <div className="summary-amount-section">
              <div className="amount-card amount-card-total">
                <div className="amount-card-label">Total Pending Amount</div>
                <div className="amount-card-value">
                  ₹
                  {dues
                    .filter(
                      (d) =>
                        (d.status === "pending" ||
                          d.status === "cleared-by-permission") &&
                        d.paymentStatus === "due"
                    )
                    .reduce((sum, d) => sum + d.amount, 0)
                    .toLocaleString()}
                </div>
              </div>
              <div className="amount-card amount-card-filtered">
                <div className="amount-card-label">Filtered Unpaid Amount</div>
                <div className="amount-card-value">
                  ₹{totalAmount.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="clear-due-loading">Loading dues...</p>
      ) : error ? (
        <p className="clear-due-error">{error}</p>
      ) : (
        <div className="clear-due-table-wrapper">
          <table className="clear-due-table">
            <thead>
              <tr>
                <th>Person Name</th>
                <th>Person ID</th>
                <th>Description</th>
                <th>Category</th>
                <th>Due Type</th>
                <th>Amount</th>
                <th>Added Date</th>
                <th>Due Date</th>
                <th>Clear Date</th>
                <th>Payment Status</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDues.length === 0 ? (
                <tr>
                  <td colSpan={12} className="clear-due-no-data">
                    No dues found
                  </td>
                </tr>
              ) : (
                filteredDues.map((d) => (
                  <tr
                    key={d._id}
                    className={
                      d.status === "cleared" ? "clear-due-row-cleared" : ""
                    }
                  >
                    <td>{d.personName}</td>
                    <td>{d.personId}</td>
                    <td>{d.description}</td>
                    <td>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: "600",
                          backgroundColor:
                            d.category === "payable" ? "#fef3c7" : "#e0e7ff",
                          color:
                            d.category === "payable" ? "#d97706" : "#3730a3",
                        }}
                      >
                        {d.category === "payable" ? "Payable" : "Non-Payable"}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: "500",
                          backgroundColor: "#f3f4f6",
                          color: "#374151",
                        }}
                      >
                        {d.dueType
                          ? d.dueType
                              .split("-")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")
                          : "N/A"}
                      </span>
                    </td>
                    <td>₹{d.amount}</td>
                    <td>{new Date(d.dateAdded).toLocaleDateString()}</td>
                    <td>{new Date(d.dueDate).toLocaleDateString()}</td>
                    <td>
                      {d.clearDate
                        ? new Date(d.clearDate).toLocaleDateString()
                        : "Not Cleared"}
                    </td>
                    <td
                      className={
                        d.paymentStatus === "done"
                          ? "clear-due-payment-done"
                          : "clear-due-payment-due"
                      }
                    >
                      {d.category === "payable"
                        ? d.paymentStatus === "done"
                          ? "Accounts Cleared"
                          : "Accounts not cleared"
                        : "N/A (Non-Payable)"}
                    </td>
                    <td className={`clear-due-status ${d.status}`}>
                      {d.status === "cleared-by-permission" ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <span>Cleared by Permission</span>
                        </div>
                      ) : (
                        d.status.charAt(0).toUpperCase() + d.status.slice(1)
                      )}
                    </td>
                    <td>
                      {d.status === "pending" ? (
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            flexWrap: "wrap",
                          }}
                        >
                          {d.category === "payable" ? (
                            // Payable dues require payment OR can be cleared by permission
                            <>
                              <button
                                className="clear-due-btn-clear"
                                onClick={() =>
                                  handleClearClick(d._id, "regular")
                                }
                                disabled={d.paymentStatus === "due"}
                                title={
                                  d.paymentStatus === "due"
                                    ? "Payment must be completed by Accounts before clearing"
                                    : "Clear this due after payment"
                                }
                                style={{
                                  fontSize: "12px",
                                  padding: "6px 10px",
                                }}
                              >
                                Clear
                              </button>
                              {/* Permission button only for ACCOUNTS dept and only for SCHOLARSHIP dues */}
                              {userDepartment === "ACCOUNTS" &&
                                d.department === "SCHOLARSHIP" && (
                                  <button
                                    className="clear-due-btn-clear"
                                    onClick={() =>
                                      handleClearClick(d._id, "permission")
                                    }
                                    title="Clear by providing document (no payment required)"
                                    style={{
                                      backgroundColor: "#7c3aed",
                                      fontSize: "12px",
                                      padding: "6px 10px",
                                    }}
                                  >
                                    Permission
                                  </button>
                                )}
                            </>
                          ) : (
                            // Non-payable dues can be cleared directly
                            <button
                              className="clear-due-btn-clear"
                              onClick={() => handleClearClick(d._id, "regular")}
                              title="Clear this non-payable due directly"
                              style={{
                                backgroundColor: "#16a34a",
                                cursor: "pointer",
                              }}
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showConfirm && (
        <div className="clear-due-modal-overlay">
          <div className="clear-due-modal">
            <h3 className="clear-due-modal-title">Confirm Clear</h3>
            <p className="clear-due-modal-text">
              Are you sure you want to clear this due?
            </p>
            {selectedDueId &&
              (() => {
                const selectedDue = filteredDues.find(
                  (d) => d._id === selectedDueId
                );
                if (selectedDue?.category !== "payable") {
                  return (
                    <p
                      style={{
                        marginTop: "12px",
                        padding: "8px",
                        backgroundColor: "#e0e7ff",
                        borderRadius: "6px",
                        fontSize: "13px",
                        color: "#3730a3",
                      }}
                    >
                      This is a <strong>non-payable</strong> due and can be
                      cleared directly without payment.
                    </p>
                  );
                }
                return null;
              })()}
            <div className="clear-due-modal-actions">
              <button
                className="clear-due-btn-cancel"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="clear-due-btn-confirm"
                onClick={confirmClearDue}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permission-Based Clearance Modal */}
      {showPermissionModal && (
        <div className="clear-due-modal-overlay">
          <div className="clear-due-modal" style={{ maxWidth: "550px" }}>
            <h3 className="clear-due-modal-title">Clear Due by Permission</h3>
            <p className="clear-due-modal-text">
              This due will be cleared by providing supporting documentation
              instead of payment.
            </p>

            <div
              style={{
                padding: "12px",
                backgroundColor: "#fef3c7",
                borderRadius: "8px",
                marginBottom: "16px",
                fontSize: "13px",
                color: "#92400e",
              }}
            >
              <strong>Important:</strong> The student will no longer see this
              due, but the department's due amount will remain unchanged as no
              payment was received.
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#374151",
                }}
              >
                Document URL (Required){" "}
                <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                type="url"
                className="form-control"
                placeholder="https://drive.google.com/..."
                value={documentUrl}
                onChange={(e) => setDocumentUrl(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              />
              <small
                style={{ color: "#6b7280", marginTop: "4px", display: "block" }}
              >
                Provide a Google Drive link or other document URL as proof
              </small>
            </div>

            <div className="clear-due-modal-actions">
              <button
                className="clear-due-btn-cancel"
                onClick={() => {
                  setShowPermissionModal(false);
                  setDocumentUrl("");
                  setSelectedDueId(null);
                }}
              >
                Cancel
              </button>
              <button
                className="clear-due-btn-confirm"
                onClick={confirmClearDue}
                disabled={!documentUrl.trim()}
                style={{
                  backgroundColor: !documentUrl.trim() ? "#9ca3af" : "#7c3aed",
                }}
              >
                Clear by Permission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClearDue;
