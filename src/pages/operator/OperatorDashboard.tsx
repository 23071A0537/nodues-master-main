import React, { useEffect, useState } from "react";
import {
  FaChartBar,
  FaCheckCircle,
  FaCoins,
  FaFileInvoiceDollar,
  FaLock,
  FaMoneyBillWave,
  FaPlusCircle,
  FaUserGraduate,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// Removed import OperatorSidebar from "./OperatorSidebar";
import api from "../../api";
import Tooltip from "../../components/Tooltip";
import "./OperatorDashboard.css";

interface DepartmentBreakdown {
  payableDues: number;
  nonPayableDues: number;
  payableAmount: number;
  nonPayableAmount: number;
  totalDues: number;
  totalAmount: number;
}

const OperatorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [operatorDept, setOperatorDept] = useState("");
  const [stats, setStats] = useState({
    totalStudents: 0,
    deptDues: 0,
    externalDues: 0,
    pendingAmount: 0,
    breakdown: {
      payableDues: 0,
      nonPayableDues: 0,
      payableAmount: 0,
      nonPayableAmount: 0,
      totalDues: 0,
      totalAmount: 0,
    } as DepartmentBreakdown,
  });

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setOperatorDept(user.department || "N/A");
    }

    const fetchStats = async () => {
      try {
        const res = await api.get("/operator/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };

    fetchStats();
  }, []);

  // ✅ show external dept dues only for accounts and academic operators
  const canViewExternalDues =
    operatorDept === "ACCOUNTS" || operatorDept === "ACADEMICS";

  // Check if accounts or HR operator
  const isAccountsOperator = operatorDept === "ACCOUNTS";
  const isHROperator = operatorDept === "HR";
  const isScholarshipOperator = operatorDept === "SCHOLARSHIP";
  const isAcademicsOperator = operatorDept === "ACADEMICS";
  const specialDepartments = ["ACCOUNTS", "ACADEMICS", "HR", "SCHOLARSHIP"];
  const isRegularOperator = !specialDepartments.includes(operatorDept);

  return (
    <div className="operator-main-content">
      <header className="operator-dashboard-header">
        <h1>👋 Welcome, OPERATOR</h1>
        <p>
          {operatorDept === "HR"
            ? "Manage faculty dues efficiently."
            : "Manage your department dues efficiently and track stats."}
        </p>
      </header>

      {/* Special buttons for HR operator */}
      {isHROperator && (
        <div
          style={{
            marginBottom: "30px",
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => navigate("/operator/add-due")}
            style={{
              padding: "12px 24px",
              backgroundColor: "#7c3aed",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.2s",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#6d28d9";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 8px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#7c3aed";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
            }}
          >
            ➕ Add Faculty Due
          </button>
          <button
            onClick={() => navigate("/operator/hr-faculty-dues")}
            style={{
              padding: "12px 24px",
              backgroundColor: "#7c3aed",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.2s",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#6d28d9";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 8px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#7c3aed";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
            }}
          >
            📋 View Faculty Dues
          </button>
        </div>
      )}

      {/* Special buttons for accounts operator */}
      {isAccountsOperator && (
        <div
          style={{
            marginBottom: "30px",
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => navigate("/operator/accounts-dashboard")}
            style={{
              padding: "12px 24px",
              backgroundColor: "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.2s",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#4338ca";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 8px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#4f46e5";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
            }}
          >
            💰 Manage All Students & Payments
          </button>
        </div>
      )}

      <div className="operator-dashboard-two-col">
        {/* Left: Vertical compact stats */}
        <div className="stat-vertical-list">
          <div className="stat-vertical">
            <FaUserGraduate className="stat-icon" />
            <div>
              <p className="stat-number">{stats.totalStudents}</p>
              <p className="stat-label">
                {operatorDept === "HR"
                  ? "Total Faculty"
                  : "Students across Institute"}
              </p>
            </div>
          </div>
          <div className="stat-vertical">
            <FaCoins className="stat-icon" />
            <div>
              <p className="stat-number">{stats.deptDues}</p>
              <p className="stat-label">
                {operatorDept === "HR" ? "Faculty Dues" : "Dept. Dues"}
              </p>
            </div>
          </div>
          {canViewExternalDues && (
            <div className="stat-vertical">
              <FaFileInvoiceDollar className="stat-icon" />
              <div>
                <p className="stat-number">{stats.externalDues}</p>
                <p className="stat-label">External Dept. Dues</p>
              </div>
            </div>
          )}
          <div className="stat-vertical">
            <FaMoneyBillWave className="stat-icon" />
            <div>
              <p className="stat-number">₹{stats.pendingAmount}</p>
              <p className="stat-label">Pending Amount</p>
            </div>
          </div>
        </div>

        {/* Right: Dues Breakdown */}
        {stats.breakdown && (
          <section style={{ marginTop: 0 }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#4f46e5",
                marginBottom: "20px",
                textAlign: "left",
              }}
            >
              {operatorDept === "HR"
                ? "Faculty Dues Breakdown"
                : `${operatorDept} Department - Dues Breakdown`}
            </h2>

            <div
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
                overflow: "hidden",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#eef2ff" }}>
                    <th
                      style={{
                        padding: "16px",
                        textAlign: "left",
                        fontWeight: "700",
                        color: "#4338ca",
                        fontSize: "14px",
                        borderBottom: "2px solid #c7d2fe",
                      }}
                    >
                      Category
                    </th>
                    <th
                      style={{
                        padding: "16px",
                        textAlign: "center",
                        fontWeight: "700",
                        color: "#4338ca",
                        fontSize: "14px",
                        borderBottom: "2px solid #c7d2fe",
                      }}
                    >
                      Number of Dues
                    </th>
                    <th
                      style={{
                        padding: "16px",
                        textAlign: "right",
                        fontWeight: "700",
                        color: "#4338ca",
                        fontSize: "14px",
                        borderBottom: "2px solid #c7d2fe",
                      }}
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    style={{ transition: "background-color 0.2s" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#fef3c7")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "white")
                    }
                  >
                    <td
                      style={{
                        padding: "16px",
                        fontWeight: "600",
                        color: "#1f2937",
                        fontSize: "14px",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "12px",
                          backgroundColor: "#fef3c7",
                          color: "#d97706",
                          fontWeight: "600",
                          fontSize: "13px",
                        }}
                      >
                        Payable Dues
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        textAlign: "center",
                        fontWeight: "600",
                        color: "#d97706",
                        fontSize: "16px",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {stats.breakdown.payableDues || 0}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        textAlign: "right",
                        fontWeight: "700",
                        color: "#d97706",
                        fontSize: "16px",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      ₹{(stats.breakdown.payableAmount || 0).toLocaleString()}
                    </td>
                  </tr>

                  <tr
                    style={{ transition: "background-color 0.2s" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#e0e7ff")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "white")
                    }
                  >
                    <td
                      style={{
                        padding: "16px",
                        fontWeight: "600",
                        color: "#1f2937",
                        fontSize: "14px",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <span
                        style={{
                          padding: "4px 12px",
                          borderRadius: "12px",
                          backgroundColor: "#e0e7ff",
                          color: "#4338ca",
                          fontWeight: "600",
                          fontSize: "13px",
                        }}
                      >
                        Non-Payable Dues
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        textAlign: "center",
                        fontWeight: "600",
                        color: "#4338ca",
                        fontSize: "16px",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {stats.breakdown.nonPayableDues || 0}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        textAlign: "right",
                        fontWeight: "700",
                        color: "#4338ca",
                        fontSize: "16px",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      ₹
                      {(stats.breakdown.nonPayableAmount || 0).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr style={{ backgroundColor: "#f3f4f6", fontWeight: "700" }}>
                    <td
                      style={{
                        padding: "16px",
                        color: "#1f2937",
                        fontSize: "15px",
                        borderTop: "2px solid #c7d2fe",
                      }}
                    >
                      TOTAL
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        textAlign: "center",
                        color: "#dc2626",
                        fontSize: "17px",
                        borderTop: "2px solid #c7d2fe",
                      }}
                    >
                      {stats.breakdown.totalDues || 0}
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        textAlign: "right",
                        color: "#dc2626",
                        fontSize: "17px",
                        borderTop: "2px solid #c7d2fe",
                      }}
                    >
                      ₹{(stats.breakdown.totalAmount || 0).toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        )}
      </div>

      {/* Quick Access Buttons - Match Sidebar Options */}
      <section style={{ marginBottom: "30px", marginTop: "30px" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#4f46e5",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Quick Access
        </h2>
        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Regular operators - Add Due and Clear Dues */}
          {isRegularOperator && (
            <>
              <Tooltip text="Add new dues for students" position="top">
                <button
                  onClick={() => navigate("/operator/add-due")}
                  className="quick-access-btn"
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "15px",
                    fontWeight: "600",
                    transition: "all 0.2s",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#059669";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 8px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#10b981";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px rgba(0,0,0,0.1)";
                  }}
                >
                  <FaPlusCircle /> Add Due
                </button>
              </Tooltip>

              <Tooltip text="Mark student dues as cleared" position="top">
                <button
                  onClick={() => navigate("/operator/clear-dues")}
                  className="quick-access-btn"
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "15px",
                    fontWeight: "600",
                    transition: "all 0.2s",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#2563eb";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 8px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#3b82f6";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px rgba(0,0,0,0.1)";
                  }}
                >
                  <FaCheckCircle /> Clear Dues
                </button>
              </Tooltip>
            </>
          )}

          {/* ACCOUNTS specific buttons */}
          {isAccountsOperator && (
            <>
              <Tooltip text="View students with pending dues" position="top">
                <button
                  onClick={() =>
                    navigate("/operator/accounts-student-dues/uncleared")
                  }
                  className="quick-access-btn"
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "15px",
                    fontWeight: "600",
                    transition: "all 0.2s",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#dc2626";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 8px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#ef4444";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px rgba(0,0,0,0.1)";
                  }}
                >
                  Students (Uncleared)
                </button>
              </Tooltip>

              <Tooltip text="View students with cleared dues" position="top">
                <button
                  onClick={() =>
                    navigate("/operator/accounts-student-dues/cleared")
                  }
                  className="quick-access-btn"
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "15px",
                    fontWeight: "600",
                    transition: "all 0.2s",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#059669";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 8px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#10b981";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px rgba(0,0,0,0.1)";
                  }}
                >
                  Students (Cleared)
                </button>
              </Tooltip>

              <Tooltip text="View faculty with pending dues" position="top">
                <button
                  onClick={() =>
                    navigate("/operator/accounts-faculty-dues/uncleared")
                  }
                  className="quick-access-btn"
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#f59e0b",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "15px",
                    fontWeight: "600",
                    transition: "all 0.2s",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#d97706";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 8px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#f59e0b";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px rgba(0,0,0,0.1)";
                  }}
                >
                  Faculty (Uncleared)
                </button>
              </Tooltip>

              <Tooltip text="View faculty with cleared dues" position="top">
                <button
                  onClick={() =>
                    navigate("/operator/accounts-faculty-dues/cleared")
                  }
                  className="quick-access-btn"
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#8b5cf6",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "15px",
                    fontWeight: "600",
                    transition: "all 0.2s",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#7c3aed";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 8px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#8b5cf6";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px rgba(0,0,0,0.1)";
                  }}
                >
                  Faculty (Cleared)
                </button>
              </Tooltip>
            </>
          )}

          {/* HR specific buttons (in addition to top buttons) */}
          {isHROperator && (
            <Tooltip text="View dues from all departments" position="top">
              <button
                onClick={() => navigate("/operator/other-dues")}
                className="quick-access-btn"
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#06b6d4",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontWeight: "600",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#0891b2";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 8px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#06b6d4";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
                }}
              >
                <FaChartBar /> All Dept. Dues
              </button>
            </Tooltip>
          )}

          {/* SCHOLARSHIP specific buttons */}
          {isScholarshipOperator && (
            <>
              <Tooltip text="Add scholarship-related dues" position="top">
                <button
                  onClick={() => navigate("/operator/add-due")}
                  className="quick-access-btn"
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "15px",
                    fontWeight: "600",
                    transition: "all 0.2s",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#059669";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 8px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#10b981";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px rgba(0,0,0,0.1)";
                  }}
                >
                  <FaPlusCircle /> Add Scholarship Due
                </button>
              </Tooltip>

              <Tooltip text="View all scholarship dues" position="top">
                <button
                  onClick={() => navigate("/operator/scholarship-dues")}
                  className="quick-access-btn"
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#8b5cf6",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "15px",
                    fontWeight: "600",
                    transition: "all 0.2s",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#7c3aed";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 8px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#8b5cf6";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px rgba(0,0,0,0.1)";
                  }}
                >
                  Scholarship Dues
                </button>
              </Tooltip>

              <Tooltip text="Clear scholarship dues" position="top">
                <button
                  onClick={() => navigate("/operator/clear-dues")}
                  className="quick-access-btn"
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "15px",
                    fontWeight: "600",
                    transition: "all 0.2s",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#2563eb";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 8px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#3b82f6";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px rgba(0,0,0,0.1)";
                  }}
                >
                  <FaCheckCircle /> Clear Dues
                </button>
              </Tooltip>
            </>
          )}

          {/* ACADEMICS - All Dept. Dues */}
          {isAcademicsOperator && (
            <Tooltip text="View dues from all departments" position="top">
              <button
                onClick={() => navigate("/operator/other-dues")}
                className="quick-access-btn"
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#06b6d4",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontWeight: "600",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#0891b2";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 8px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#06b6d4";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
                }}
              >
                <FaChartBar /> All Dept. Dues
              </button>
            </Tooltip>
          )}

          {/* Change Password - Available for all operators */}
          <Tooltip text="Update your account password" position="top">
            <button
              onClick={() => navigate("/operator/change-password")}
              className="quick-access-btn"
              style={{
                padding: "12px 24px",
                backgroundColor: "#64748b",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "600",
                transition: "all 0.2s",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#475569";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 8px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#64748b";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
              }}
            >
              <FaLock /> Change Password
            </button>
          </Tooltip>
        </div>
      </section>
    </div>
  );
};

export default OperatorDashboard;
