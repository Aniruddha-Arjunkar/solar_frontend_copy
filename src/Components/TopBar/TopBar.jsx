import { useState } from "react";

import {
    Search,
    Bell,
    Mail,
    CalendarDays,
    ChevronDown,
    LogOut,
    User
} from "lucide-react";

import { useNavigate } from "react-router";

import "./TopBar.css";


function Topbar() {

    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();

    // Get Logged-In User
      const storedUser = localStorage.getItem("user");
      const user = storedUser
        ? JSON.parse(storedUser) : null;
    
    /* ===== USER DETAILS =========*/

    const userName = user?.name || "Admin";
    const userEmail = user?.email || "";
    const userInitial = userName.charAt(0).toUpperCase();


    // Current date
    const currentDate = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

    /* =========== LOGOUT ======= */
    const handleLogout = () => {

        // Remove authentication information
        localStorage.removeItem("isLoggedIn");

        // Remove logged-in user
        localStorage.removeItem("user");

        // Close dropdown
        setProfileOpen(false);

        // Go to login page
        navigate("/login", { replace: true });
    };


    return (

        <header className="topbar">

            {/* ==========SEARCH SECTION =========== */}

            <div className="topbar-search">

                <Search className="search-icon" size={19} />

                <input
                    type="search"
                    placeholder="Search here..."
                />

            </div>


            {/* ======= RIGHT SIDE ============= */}

            <div className="topbar-right">


                {/* ======== NOTIFICATION SECTION ============ */}

                <div className="topbar-alerts">

                    {/* Notification */}

                    <button
                        className="alert-button"
                        title="Notifications"
                    >
                        <Bell size={25} />

                        <span className="notification-badge">
                            3
                        </span>
                    </button>


                    {/* Mail */}

                    <button
                        className="alert-button"
                        title="Messages"
                    >
                        <Mail size={25} />

                        <span className="mail-badge">
                            2
                        </span>
                    </button>

                </div>


                {/* ============ DATE SECTION ================ */}

                <div className="topbar-date">

                    <CalendarDays size={25} />

                    <div className="date-content">

                        <span className="date-label">
                            Date
                        </span>

                        <span className="current-date">
                            {currentDate}
                        </span>

                    </div>

                </div>


                {/* ==============  PROFILE SECTION =============== */}

                <div className="profile-container">

                    <button
                        className="profile-button"
                        onClick={() =>
                            setProfileOpen(!profileOpen)
                        }
                    >

                        <div className="profile-avatar">
                             {userInitial}
                        </div>

                        <div className="profile-info">

                            <span className="profile-name">
                                {userName}
                            </span>

                            <span className="profile-role">
                                Administrator
                            </span>

                        </div>

                        <ChevronDown
                            className={`profile-arrow ${
                                profileOpen ? "rotate" : ""
                            }`}
                            size={20}
                        />

                    </button>


                    {/* ====== PROFILE DROPDOWN ============ */}

                    {profileOpen && (

                        <div className="profile-dropdown">

                            <div className="dropdown-user">

                                <div className="profile-avatar large">
                                     {userInitial}
                                </div>

                                <div>
                                    <strong>
                                        {userName}
                                    </strong>

                                    <span>
                                        Administrator
                                    </span>
                                </div>

                            </div>


                            <div className="dropdown-divider"></div>


                            <button className="dropdown-item">

                                <User size={22} />

                                <span>
                                    My Profile
                                </span>

                            </button>


                            <button className="dropdown-item logout"
                            type="button"
                            onClick={handleLogout}>
                                <LogOut size={22} />
                                <span>
                                    Logout
                                </span>
                            </button>

                        </div>

                    )}

                </div>

            </div>

        </header>
    );
}


export default Topbar;