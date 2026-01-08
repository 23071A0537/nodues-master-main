import React from "react";
import {
  FaChartBar,
  FaCheckCircle,
  FaLock,
  FaPlusCircle,
  FaTachometerAlt,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import Tooltip from "../../components/Tooltip";
import "./OperatorSidebar.css";

const OperatorSidebar: React.FC = () => {
  // Get user from sessionStorage
  const userString = sessionStorage.getItem("user");
  let userDept = "";
  if (userString) {
    try {
      const user = JSON.parse(userString);
      userDept = user.department;
    } catch {}
  }

  // Special departments that can view external dues and have restricted sidebar options
  const specialDepartments = ["ACCOUNTS", "ACADEMICS", "HR", "SCHOLARSHIP"];

  return (
    <aside className="operator-sidebar">
      <h2 className="sidebar-title">{userDept} Operator</h2>
      <nav className="sidebar-nav">
        <Tooltip text="View dashboard overview and statistics" position="right">
          <NavLink
            to="/operator"
            end
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <FaTachometerAlt style={{ marginRight: "8px" }} /> Dashboard
          </NavLink>
        </Tooltip>

        {/* Show Add Due and Clear Dues only for non-special departments */}
        {!specialDepartments.includes(userDept) && (
          <>
            <Tooltip text="Add new dues for students" position="right">
              <NavLink
                to="/operator/add-due"
                className={({ isActive }) =>
                  isActive ? "sidebar-link active" : "sidebar-link"
                }
              >
                <FaPlusCircle style={{ marginRight: "8px" }} /> Add Due
              </NavLink>
            </Tooltip>

            <Tooltip text="Mark student dues as cleared" position="right">
              <NavLink
                to="/operator/clear-dues"
                className={({ isActive }) =>
                  isActive ? "sidebar-link active" : "sidebar-link"
                }
              >
                <FaCheckCircle style={{ marginRight: "8px" }} /> Clear Dues
              </NavLink>
            </Tooltip>
          </>
        )}

        {/* Render External Dept. Dues only for special departments */}
        {specialDepartments.includes(userDept) && (
          <>
            {/* All Dept. Dues - Only for non-ACCOUNTS departments */}
            {userDept !== "ACCOUNTS" && (
              <Tooltip text="View dues from all departments" position="right">
                <NavLink
                  to="/operator/other-dues"
                  className={({ isActive }) =>
                    isActive ? "sidebar-link active" : "sidebar-link"
                  }
                >
                  <FaChartBar style={{ marginRight: "8px" }} /> All Dept. Dues
                </NavLink>
              </Tooltip>
            )}

            {/* Accounts-specific pages */}
            {userDept === "ACCOUNTS" && (
              <>
                <Tooltip
                  text="View students with pending dues"
                  position="right"
                >
                  <NavLink
                    to="/operator/accounts-student-dues/uncleared"
                    className={({ isActive }) =>
                      isActive ? "sidebar-link active" : "sidebar-link"
                    }
                  >
                    Students (Uncleared)
                  </NavLink>
                </Tooltip>

                <Tooltip
                  text="View students with cleared dues"
                  position="right"
                >
                  <NavLink
                    to="/operator/accounts-student-dues/cleared"
                    className={({ isActive }) =>
                      isActive ? "sidebar-link active" : "sidebar-link"
                    }
                  >
                    Students (Cleared)
                  </NavLink>
                </Tooltip>

                <Tooltip text="View faculty with pending dues" position="right">
                  <NavLink
                    to="/operator/accounts-faculty-dues/uncleared"
                    className={({ isActive }) =>
                      isActive ? "sidebar-link active" : "sidebar-link"
                    }
                  >
                    Faculty (Uncleared)
                  </NavLink>
                </Tooltip>

                <Tooltip text="View faculty with cleared dues" position="right">
                  <NavLink
                    to="/operator/accounts-faculty-dues/cleared"
                    className={({ isActive }) =>
                      isActive ? "sidebar-link active" : "sidebar-link"
                    }
                  >
                    Faculty (Cleared)
                  </NavLink>
                </Tooltip>
              </>
            )}

            {/* HR-specific pages */}
            {userDept === "HR" && (
              <>
                <Tooltip
                  text="Add new dues for faculty members"
                  position="right"
                >
                  <NavLink
                    to="/operator/add-due"
                    className={({ isActive }) =>
                      isActive ? "sidebar-link active" : "sidebar-link"
                    }
                  >
                    <FaPlusCircle style={{ marginRight: "8px" }} /> Add Faculty
                    Due
                  </NavLink>
                </Tooltip>

                <Tooltip
                  text="View all faculty dues and status"
                  position="right"
                >
                  <NavLink
                    to="/operator/hr-faculty-dues"
                    className={({ isActive }) =>
                      isActive ? "sidebar-link active" : "sidebar-link"
                    }
                  >
                    View Faculty Dues
                  </NavLink>
                </Tooltip>
              </>
            )}

            {/* Scholarship Department Routes */}
            {userDept === "SCHOLARSHIP" && (
              <>
                <Tooltip text="Add scholarship-related dues" position="right">
                  <NavLink
                    to="/operator/add-due"
                    className={({ isActive }) =>
                      isActive ? "sidebar-link active" : "sidebar-link"
                    }
                  >
                    <FaPlusCircle style={{ marginRight: "8px" }} /> Add
                    Scholarship Due
                  </NavLink>
                </Tooltip>

                <Tooltip text="View all scholarship dues" position="right">
                  <NavLink
                    to="/operator/scholarship-dues"
                    className={({ isActive }) =>
                      isActive ? "sidebar-link active" : "sidebar-link"
                    }
                  >
                    Scholarship Dues
                  </NavLink>
                </Tooltip>

                <Tooltip text="Clear scholarship dues" position="right">
                  <NavLink
                    to="/operator/clear-dues"
                    className={({ isActive }) =>
                      isActive ? "sidebar-link active" : "sidebar-link"
                    }
                  >
                    <FaCheckCircle style={{ marginRight: "8px" }} /> Clear Dues
                  </NavLink>
                </Tooltip>
              </>
            )}
          </>
        )}

        {/* Change Password link for all operators */}
        <Tooltip text="Update your account password" position="right">
          <NavLink
            to="/operator/change-password"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <FaLock style={{ marginRight: "8px" }} /> Change Password
          </NavLink>
        </Tooltip>
      </nav>
    </aside>
  );
};

export default OperatorSidebar;
