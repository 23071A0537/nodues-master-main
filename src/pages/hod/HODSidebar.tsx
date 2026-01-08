import React from "react";
import { FaLock, FaUserGraduate } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import Tooltip from "../../components/Tooltip";
import "../operator/OperatorSidebar.css";

const HODSidebar: React.FC = () => {
  // Get HOD department from sessionStorage
  const userString = sessionStorage.getItem("user");
  let hodDept = "HOD";
  if (userString) {
    try {
      const user = JSON.parse(userString);
      hodDept = user.hodDepartment || user.department || "HOD";
    } catch {}
  }

  return (
    <aside className="operator-sidebar">
      <h2 className="sidebar-title">{hodDept} HOD</h2>
      <nav className="sidebar-nav">
        <Tooltip
          text="View and manage student dues in your department"
          position="right"
        >
          <NavLink
            to="/hod"
            end
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <FaUserGraduate style={{ marginRight: "8px" }} /> View Student Dues
          </NavLink>
        </Tooltip>

        <Tooltip text="Update your account password" position="right">
          <NavLink
            to="/hod/change-password"
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

export default HODSidebar;
