import {
  FaBuilding,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaGraduationCap,
  FaTachometerAlt,
  FaUsers,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import Tooltip from "./Tooltip";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      <nav className="sidebar-nav">
        <Tooltip text="View dashboard overview and statistics" position="right">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <FaTachometerAlt style={{ marginRight: "8px" }} /> Dashboard
          </NavLink>
        </Tooltip>

        <Tooltip text="Manage system users and access control" position="right">
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <FaUsers style={{ marginRight: "8px" }} /> Users
          </NavLink>
        </Tooltip>

        <Tooltip text="Manage departments and sections" position="right">
          <NavLink
            to="/admin/departments"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <FaBuilding style={{ marginRight: "8px" }} /> Departments
          </NavLink>
        </Tooltip>

        <Tooltip text="Manage academic years and sessions" position="right">
          <NavLink
            to="/admin/academic-years"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <FaCalendarAlt style={{ marginRight: "8px" }} /> Academic Years
          </NavLink>
        </Tooltip>

        <Tooltip text="View and manage student records" position="right">
          <NavLink
            to="/admin/students"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <FaGraduationCap style={{ marginRight: "8px" }} />
            Students
          </NavLink>
        </Tooltip>

        <Tooltip text="View and manage faculty information" position="right">
          <NavLink
            to="/admin/faculty"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <FaChalkboardTeacher style={{ marginRight: "8px" }} />
            Faculty
          </NavLink>
        </Tooltip>
      </nav>

      {/* Add styled logout button */}
      <Tooltip text="Sign out of the system" position="right">
        <button
          className="sidebar-logout-btn"
          onClick={handleLogout}
          aria-label="Logout"
        >
          Logout
        </button>
      </Tooltip>
    </aside>
  );
};

export default Sidebar;
