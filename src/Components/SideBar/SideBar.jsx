import { useState } from "react";
import { NavLink } from "react-router";
import {
    Home,
    Users,
    Truck,
    UserRound,
    CalendarDays,
    Wallet,
    UserCog,
    ChevronDown,
    ChevronRight,
    PanelLeftClose,
    PanelLeftOpen,
    Plus,
    Eye,
    Phone,
    Calendar,
    FileText,
    ClipboardList,
    CreditCard,
    ReceiptIndianRupee
} from "lucide-react";

import "./SideBar.css";

function SideBar() {
     
    const [openMenu, setOpenMenu] = useState("lead");
    const [collapsed, setCollapsed] = useState(false);

const toggleMenu = (menuName) => {

    // If sidebar is collapsed,
    // expand it first
    if (collapsed) {
        setCollapsed(false);

        // Open the clicked menu
        setOpenMenu(menuName);

        return;
    }

    // Normal dropdown behavior
    setOpenMenu(
        openMenu === menuName ? null : menuName
    );
      };
    return (
        <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

    <button
    className="sidebar-toggle"
    onClick={() => setCollapsed(!collapsed)}
    title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
>
    {collapsed
        ? <PanelLeftOpen size={30} />
        : <PanelLeftClose size={30} />
    }
</button>

            {/* ================= HEADER ================= */}
            <div className="sidebar-header">

                <div className="logo">
                    <span></span>
                </div>

                <h2>Solar Systems</h2>
                <p>SOLAR SOLUTIONS</p>

            </div>


            {/* ================= DASHBOARD ================= */}
            <NavLink to='/' className="menu-item active"style={{marginTop:'5px', minHeight:'40px'}}>

                <Home size={25} />
                <span>Dashboard</span>

            </NavLink>


            {/* =================================================
                        LEAD MANAGEMENT
            ================================================== */}

            <div className="menu-section">

                <p className="section-title">
                    LEAD MANAGEMENT
                </p>

                <div
                    className="menu-item dropdown-menu"
                    onClick={() => toggleMenu("lead")}
                >

                    <Users size={35} />

                    <span>Lead Management</span>

                    {openMenu === "lead"
                        ? <ChevronDown size={30} />
                        : <ChevronRight size={30} />
                    }

                </div>


                {openMenu === "lead" && (

                    <div className="submenu">

                        <NavLink  
                        to='/dashboard/add-inquiry' 
                        className="submenu-item">
                            <Plus size={20} />
                            <span>Add Inquiry</span>
                        </NavLink>

                        <NavLink to='/dashboard/view-inquiry' className="submenu-item">
                            <Eye size={20} />
                            <span>View Inquiry</span>
                        </NavLink>

                        <NavLink to='/dashboard/re-followup' className="submenu-item">
                            <Phone size={20} />
                            <span>Re Followup</span>
                        </NavLink>

                        <NavLink to='/dashboard/visit' className="submenu-item">
                            <ClipboardList size={20} />
                            <span>Visit</span>
                        </NavLink>

                        <NavLink to='/dashboard/future-client' className="submenu-item">
                            <Users size={20} />
                            <span>Future Client</span>
                        </NavLink>

                        <NavLink to='/dashboard/schedule-client' className="submenu-item">
                            <Calendar size={20} />
                            <span>Schedule Client</span>
                        </NavLink>

                        <NavLink to='/dashboard/quotations' className="submenu-item">
                            <FileText size={20} />
                            <span>Quotations</span>
                        </NavLink>

                    </div>

                )}

            </div>


            {/* =================================================
                        VENDOR
            ================================================== */}

            <div className="menu-section">

                <p className="section-title">
                    VENDOR
                </p>

                <div
                    className="menu-item dropdown-menu"
                    onClick={() => toggleMenu("vendor")}
                >

                    <Truck size={35} />

                    <span>Vendor Management</span>

                    {openMenu === "vendor"
                        ? <ChevronDown size={30} />
                        : <ChevronRight size={30} />
                    }

                </div>


                {openMenu === "vendor" && (

                    <div className="submenu">

                        <NavLink to="/dasboard/add-vendor" className="submenu-item">
                            <Plus size={20} />
                            <span>Add Vendor</span>
                        </NavLink>

                        <NavLink to="/dashboard/view-vendor" className="submenu-item">
                            <Eye size={20} />
                            <span>View Vendor</span>
                        </NavLink>

                    </div>

                )}

            </div>


            {/* =================================================
                        CLIENT
            ================================================== */}

            <div className="menu-section">

                <p className="section-title">
                    CLIENT
                </p>

                <div
                    className="menu-item dropdown-menu"
                    onClick={() => toggleMenu("client")}
                >

                    <Users size={35} />

                    <span>Client Management</span>

                    {openMenu === "client"
                        ? <ChevronDown size={30} />
                        : <ChevronRight size={30} />
                    }

                </div>


                {openMenu === "client" && (

                    <div className="submenu">

                        <NavLink to="/dashboard/view-client" className="submenu-item">
                            <Eye size={20} />
                            <span>View Client</span>
                        </NavLink>

                        <NavLink to="/dashboard/gst-client" className="submenu-item">
                            <FileText size={20} />
                            <span>GST Client</span>
                        </NavLink>

                        <NavLink to="/dashboard/pending-work" className="submenu-item">
                            <ClipboardList size={20} />
                            <span>Pending Work</span>
                        </NavLink>

                    </div>

                )}

            </div>


            {/* =================================================
                        EMPLOYEE
            ================================================== */}

            <div className="menu-section">

                <p className="section-title">
                    EMPLOYEE
                </p>

                <div
                    className="menu-item dropdown-menu"
                    onClick={() => toggleMenu("employee")}
                >
                    <UserCog size={35} />
                    <span>Employee Management</span>
                    {openMenu === "employee"
                        ? <ChevronDown size={30} />
                        : <ChevronRight size={30} />
                    }

                </div>


                {openMenu === "employee" && (

                    <div className="submenu">

                        <NavLink to="/dashboard/add-employee" className="submenu-item">
                            <Plus size={20} />
                            <span>Add Employee</span>
                        </NavLink>

                        <NavLink to="/dashboard/view-employee" className="submenu-item">
                            <Eye size={20} />
                            <span>View Employee</span>
                        </NavLink>

                        <NavLink to="/dashboard/add-salary" className="submenu-item">
                            <Wallet size={20} />
                            <span>Add Salary</span>
                        </NavLink>

                    </div>

                )}

            </div>


            {/* =================================================
                        ATTENDANCE
            ================================================== */}

            <div className="menu-section">

                <p className="section-title">
                    ATTENDANCE
                </p>

                <div
                    className="menu-item dropdown-menu"
                    onClick={() => toggleMenu("attendance")}
                >

                    <CalendarDays size={25} />

                    <span>Attendance</span>

                    {openMenu === "attendance"
                        ? <ChevronDown size={20} />
                        : <ChevronRight size={20} />
                    }

                </div>


                {openMenu === "attendance" && (

                    <div className="submenu">

                        <NavLink to="/dashboard/add-attendence" className="submenu-item">
                            <Plus size={20} />
                            <span>Add Attendance</span>
                        </NavLink>

                        <NavLink to="/dashboard/view-attendence" className="submenu-item">
                            <Eye size={20} />
                            <span>View Attendance</span>
                        </NavLink>

                    </div>

                )}

            </div>


            {/* =================================================
                        ACCOUNTS
            ================================================== */}

            <div className="menu-section">

                <p className="section-title">
                    ACCOUNTS
                </p>

                <div
                    className="menu-item dropdown-menu"
                    onClick={() => toggleMenu("accounts")}
                >

                    <Wallet size={25} />

                    <span>Accounts</span>

                    {openMenu === "accounts"
                        ? <ChevronDown size={20} />
                        : <ChevronRight size={20} />
                    }

                </div>


                {openMenu === "accounts" && (

                    <div className="submenu">

                        <NavLink to="/dashboard/due-payment" className="submenu-item">
                            <CreditCard size={20} />
                            <span>Due Payment</span>
                        </NavLink>

                        <NavLink to="/dashboard/view-payment" className="submenu-item">
                            <Eye size={20} />
                            <span>View Payment</span>
                        </NavLink>

                        <NavLink to="/dashboard/add-advance" className="submenu-item">
                            <Plus size={20} />
                            <span>Add Advance</span>
                        </NavLink>

                        <NavLink to="/dashboard/view-advance" className="submenu-item">
                            <Eye size={20} />
                            <span>View Advance</span>
                        </NavLink>

                        <NavLink to="/dashboard/add-expenses" className="submenu-item">
                            <ReceiptIndianRupee size={20} />
                            <span>Add Expenses</span>
                        </NavLink>

                        <NavLink to="/dashboard/view-expenses" className="submenu-item">
                            <Eye size={20} />
                            <span>View Expenses</span>
                        </NavLink>

                        <NavLink to="/dashboard/gst-invoice" className="submenu-item">
                            <FileText size={20} />
                            <span>GST Invoice</span>
                        </NavLink>

                    </div>

                )}

            </div>


            {/* =================================================
                        USERS
            ================================================== */}

            <div className="menu-section">

                <p className="section-title">
                    USERS
                </p>

                <div
                    className="menu-item dropdown-menu"
                    onClick={() => toggleMenu("users")}
                >

                    <UserRound size={25} />

                    <span>Users</span>

                    {openMenu === "users"
                        ? <ChevronDown size={20} />
                        : <ChevronRight size={20} />
                    }

                </div>


                {openMenu === "users" && (

                    <div className="submenu">

                        <NavLink  to='dashboard/view-users' className="submenu-item">
                            <Eye size={20} />
                            <span>View Users</span>
                        </NavLink>

                    </div>

                )}

            </div>

        </aside>
    );
}

export default SideBar;