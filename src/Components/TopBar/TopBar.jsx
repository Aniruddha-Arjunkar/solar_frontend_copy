import { useEffect, useState } from "react";

import API_BASE_URL from "./../../config/api";

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


    // GLOBAL SEARCH
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    const [globalData, setGlobalData] = useState({
        leads: [],
        clients: [],
        vendors: [],
        employees: []
    });


    // LOAD GLOBAL SEARCH DATA
    useEffect(() => {

        const loadGlobalData = async () => {

            try {

                const [
                    leadsResponse,
                    clientsResponse,
                    vendorsResponse,
                    employeesResponse
                ] = await Promise.all([
                    fetch(`${API_BASE_URL}/leads`),
                    fetch(`${API_BASE_URL}/clients`),
                    fetch(`${API_BASE_URL}/vendors`),
                    fetch(`${API_BASE_URL}/employees`)
                ]);


                if (
                    !leadsResponse.ok ||
                    !clientsResponse.ok ||
                    !vendorsResponse.ok ||
                    !employeesResponse.ok
                ) {
                    throw new Error(
                        "Failed to load global search data."
                    );
                }

                const [
                    leads,
                    clients,
                    vendors,
                    employees
                ] = await Promise.all([
                    leadsResponse.json(),
                    clientsResponse.json(),
                    vendorsResponse.json(),
                    employeesResponse.json()
                ]);


                setGlobalData({
                    leads: Array.isArray(leads)
                        ? leads
                        : [],

                    clients: Array.isArray(clients)
                        ? clients
                        : [],

                    vendors: Array.isArray(vendors)
                        ? vendors
                        : [],

                    employees: Array.isArray(employees)
                        ? employees
                        : []
                });

            } catch (error) {

                console.error(
                    "Global Search Data Error:",
                    error
                );
            }
        };
        loadGlobalData();
    }, []);


    // SEARCH GLOBAL DATA LOCALLY

    useEffect(() => {

        if (!searchTerm.trim()) {
            setSearchResults([]);
            setSearchOpen(false);
            return;
        }

        const searchValue =
            searchTerm.trim().toLowerCase();

        const results = [];


        // LEADS
        globalData.leads
            .filter((lead) =>
                [
                    lead.name,
                    lead.contact,
                    lead.email,
                    lead.address
                ].some((value) =>
                    String(value || "")
                        .toLowerCase()
                        .includes(searchValue)
                )
            )
            .slice(0, 5)
            .forEach((lead) => {
                results.push({
                    id: `lead-${lead.id}`,
                    type: "Lead",
                    name: lead.name,
                    contact: lead.contact,
                    path: "/dashboard/view-inquiry"
                });
            });


        // CLIENTS

        globalData.clients
            .filter((client) =>
                [
                    [
                        client.custName,
                        client.custPhone,
                        client.custEmail,
                        client.custAddress,
                        client.service
                    ]
                ].some((value) =>
                    String(value || "")
                        .toLowerCase()
                        .includes(searchValue)
                )
            )
            .slice(0, 5)
            .forEach((client) => {

                results.push({
                    id: `client-${client.id}`,
                    type: "Client",
                    name: client.custName,
                    contact: client.custPhone,
                    path: "/dashboard/view-client"
                });

            });


        // VENDORS

        globalData.vendors
            .filter((vendor) =>
                [
                    vendor.name,
                    vendor.vendorName,
                    vendor.contact,
                    vendor.email,
                    vendor.address
                ].some((value) =>
                    String(value || "")
                        .toLowerCase()
                        .includes(searchValue)
                )
            )
            .slice(0, 5)
            .forEach((vendor) => {

                results.push({
                    id: `vendor-${vendor.id}`,
                    type: "Vendor",
                    name:
                        vendor.name ||
                        vendor.vendorName ||
                        "Vendor",
                    contact: vendor.contact,
                    path: "/dashboard/view-vendor"
                });

            });


        // EMPLOYEES
        globalData.employees
            .filter((employee) =>
                [
                    employee.name,
                    employee.contact,
                    employee.email,
                    employee.address
                ].some((value) =>
                    String(value || "")
                        .toLowerCase()
                        .includes(searchValue)
                )
            )
            .slice(0, 5)
            .forEach((employee) => {

                results.push({
                    id: `employee-${employee.id}`,
                    type: "Employee",
                    name: employee.name,
                    contact: employee.contact,
                    path: "/dashboard/view-employee"
                });

            });


        setSearchResults(results.slice(0, 10));
        setSearchOpen(true);

    }, [searchTerm, globalData]);

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

            {/* <div className="topbar-search">

                <Search className="search-icon" size={19} />

                <input
                    type="search"
                    placeholder="Search here..."
                />

            </div> */}

            <div className="topbar-search">

                <Search
                    className="search-icon"
                    size={19}
                />

                <input
                    type="search"
                    placeholder="Search leads, clients, vendors..."
                    value={searchTerm}
                    onChange={(event) =>
                        setSearchTerm(event.target.value)
                    }
                    onFocus={() => {
                        if (searchTerm.trim()) {
                            setSearchOpen(true);
                        }
                    }}
                />

                {/* =====  GLOBAL SEARCH RESULTS ======== */}

                {searchOpen && searchTerm.trim() && (

                    <div className="topbar-search-results">

                        {searchLoading ? (

                            <div className="topbar-search-message">
                                Searching...
                            </div>

                        ) : searchResults.length > 0 ? (
                            searchResults.map((result) => (

                                <button
                                    type="button"
                                    className="topbar-search-result"
                                    key={result.id}
                                    onClick={() => {
                                        navigate(result.path);
                                        setSearchTerm("");
                                        setSearchOpen(false);
                                    }}
                                >

                                    <div className="topbar-search-result-avatar">
                                        {result.name
                                            ?.charAt(0)
                                            .toUpperCase() || "?"}
                                    </div>

                                    <div className="topbar-search-result-info">

                                        <strong>
                                            {result.name}
                                        </strong>

                                        <span>
                                            {result.type}
                                            {result.contact
                                                ? ` • ${result.contact}`
                                                : ""}
                                        </span>
                                    </div>
                                </button>
                            ))

                        ) : (

                            <div className="topbar-search-message">
                                No results found.
                            </div>
                        )}
                    </div>
                )}
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
                            className={`profile-arrow ${profileOpen ? "rotate" : ""
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