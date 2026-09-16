import {
    CalendarDays,
    Sun,
    ArrowRight,
    TrendingUp,
    Users,
    Truck,
    UserCog
} from "lucide-react";

import API_BASE_URL from "./../../config/api";

import { useNavigate } from "react-router";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";

import {
    useEffect,
    useMemo,
    useState
} from "react";

import "./DashBoard.css";


function DashBoard() {

    const [leads, setLeads] = useState([]);
    const [clients, setClients] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();


    // CURRENT DATE
    const currentDate = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });


    // FETCH LEADS FROM BACKEND
    useEffect(() => {
        const fetchLeads = async () => {
            try {
                setLoading(true);
                setError("");

                // Fetch Leads
                // const response = await fetch(
                //     `${API_BASE_URL}/leads`
                // );

                // if (!response.ok) {
                //     throw new Error(
                //         "Failed to fetch dashboard data."
                //     );
                // }

                // const data = await response.json();

                // setLeads(
                //     Array.isArray(data)
                //         ? data
                //         : []
                // );
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
                        "Failed to fetch dashboard data."
                    );
                }


                const [
                    leadsData,
                    clientsData,
                    vendorsData,
                    employeesData
                ] = await Promise.all([
                    leadsResponse.json(),
                    clientsResponse.json(),
                    vendorsResponse.json(),
                    employeesResponse.json()
                ]);


                setLeads(
                    Array.isArray(leadsData)
                        ? leadsData
                        : []
                );


                setClients(
                    Array.isArray(clientsData)
                        ? clientsData
                        : []
                );


                setVendors(
                    Array.isArray(vendorsData)
                        ? vendorsData
                        : []
                );


                setEmployees(
                    Array.isArray(employeesData)
                        ? employeesData
                        : []
                );

            } catch (error) {
                console.error(
                    "Dashboard API Error:",
                    error
                );

                setError(
                    "Unable to load dashboard data."
                );

            } finally {
                setLoading(false);
            }
        };
        fetchLeads();
    }, []);

    const dashboardCounts = useMemo(() => {

        const newLeads = leads.filter(
            (lead) =>
                lead.status === "NEW"
        ).length;


        // return {
        //     newLeads,
        //     totalCustomers: clients.length,
        //     totalVendors: vendors.length,
        //     totalEmployees: employees.length
        // };
        return {
            newLeads,

            // PIE CHART COUNTS
            newQueries: leads.filter(
                (lead) => lead.status === "NEW"
            ).length,

            serviceQueries: leads.filter(
                (lead) => lead.status === "SERVICE"
            ).length,

            scheduledQueries: leads.filter(
                (lead) => lead.status === "SCHEDULED"
            ).length,

            totalCustomers: clients.length,
            totalVendors: vendors.length,
            totalEmployees: employees.length
        };

    }, [
        leads,
        clients,
        vendors,
        employees
    ]);

    // DASHBOARD CARDS

    const data = [

        {
            sr: "1",
            title: "New Leads",
            count: dashboardCounts.newLeads,
            description: "New inquiries waiting for attention",
            type: "new",
            icon: Users,
            path: "/dashboard/view-inquiry"
        },

        {
            sr: "2",
            title: "Total Customers",
            count: dashboardCounts.totalCustomers,
            description: "Total registered customers",
            type: "customers",
            icon: Users,
            path: "/dashboard/view-client"
        },

        {
            sr: "3",
            title: "Total Vendors",
            count: dashboardCounts.totalVendors,
            description: "Total registered vendors",
            type: "vendors",
            icon: Truck,
            path: "/dashboard/view-vendor"
        },

        {
            sr: "4",
            title: "Total Employees",
            count: dashboardCounts.totalEmployees,
            description: "Total registered employees",
            type: "employees",
            icon: UserCog,
            path: "/dashboard/view-employee"
        }

    ];


    // ============================================================
    // PIE CHART DATA
    // ============================================================

    const pieData = [

        {
            name: "New Queries",
            value: dashboardCounts.newQueries
        },

        {
            name: "Service Queries",
            value: dashboardCounts.serviceQueries
        },

        {
            name: "Scheduled Queries",
            value: dashboardCounts.scheduledQueries
        }

    ];


    // ============================================================
    // MONTHLY QUERY TREND
    // ============================================================

    const queryTrendData = useMemo(() => {

        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ];


        const currentYear =
            new Date().getFullYear();


        const monthlyCounts = months.map(
            (month, index) => {

                const count = leads.filter(
                    (lead) => {

                        if (!lead.inquiryDate) {
                            return false;
                        }


                        const date =
                            new Date(
                                lead.inquiryDate
                            );


                        return (
                            date.getFullYear() ===
                            currentYear &&
                            date.getMonth() ===
                            index
                        );

                    }
                ).length;


                return {
                    month,
                    queries: count
                };

            }
        );


        return monthlyCounts;

    }, [leads]);


    // ============================================================
    // PIE COLORS
    // ============================================================

    const PIE_COLORS = [
        "#14cabe",
        "#3f518c",
        "#f0a43c"
    ];


    return (

        <section className="main-body">


            {/* ====================================================
                PAGE HEADER
            ==================================================== */}

            {/* <div className="page-header">

                <div>

                    <p className="breadcrumb">
                        Dashboard
                    </p>

                    <h1 className="page-heading">
                        Overview
                    </h1>

                </div>

            </div> */}


            {/* === ERROR MESSAGE ==*/}
            {error && (
                <div className="dashboard-error">
                    {error}
                </div>
            )}


            {/* ================ WELCOME BANNER ============== */}

            <div className="greet_bar">

                <div className="greet_bar_greeting">
                    <span className="welcome-label">
                        ADMIN DASHBOARD
                    </span>

                    <h1> Welcome Back, Admin! </h1>

                    <p>
                        You have{" "}
                        <strong>
                            {loading
                                ? "..."
                                : dashboardCounts.newLeads
                            }
                        </strong>
                        {" "}
                        new inquiries
                        waiting for your attention.
                    </p>


                    <button
                        className="check-now-btn"
                        onClick={() => {
                            navigate("/dashboard/view-inquiry");
                        }}>
                        Check Now
                        <ArrowRight size={16} />
                    </button>
                </div>


                <div className="greet_bar_image">

                    <div className="welcome-illustration">
                        <TrendingUp size={75} />
                    </div>

                </div>

            </div>


            {/* ============== DASHBOARD CARDS ================ */}

            <div className="cards_section">

                {/* =============== DATE & GREETING CARD =================== */}

                <div className="greet_card">

                    <div className="greet_card_top">

                        <div className="sun-icon">
                            <Sun size={25} />
                        </div>

                        <span className="greet_card_label">
                            TODAY
                        </span>

                    </div>


                    <h2>
                        Good Morning,
                        <br />
                        <span>
                            Admin!
                        </span>
                    </h2>


                    <div className="card-date">
                        <CalendarDays size={18} />
                        <div>
                            <span>
                                Date
                            </span>
                            <strong>
                                {currentDate}
                            </strong>
                        </div>
                    </div>
                </div>


                {/* ================= DATA CARDS ============== */}

                <div className="data_cards">

                    {
                        data.map((item) => (
                            <div
                                className={`card ${item.type}`}
                                key={item.sr}
                            >

                                <div className="card-top">

                                    <div className="card-heading">

                                        <div className="card-icon">
                                            <item.icon size={22} />
                                        </div>

                                        <span className="card-title">
                                            {item.title}
                                        </span>

                                    </div>


                                    <span className="card-number">
                                        {
                                            loading
                                                ? "..."
                                                : item.count
                                        }
                                    </span>


                                    <span className="card-description">
                                        {item.description}
                                    </span>

                                </div>


                                <button
                                    type="button"
                                    className="card-bottom"
                                    onClick={() => navigate(item.path)}
                                >

                                    <span>
                                        View Details
                                    </span>

                                    <ArrowRight size={16} />

                                </button>

                            </div>

                        ))
                    }

                </div>
            </div>


            {/* ===================== ANALYTICS SECTION ================ */}

            <div className="analytics-section">


                {/* ================= QUERY DISTRIBUTION ================== */}

                <div className="chart-card">
                    <div className="chart-header">

                        <div>
                            <h2>
                                Query Distribution
                            </h2>
                            <p>
                                Current query status
                            </p>
                        </div>


                        <span className="chart-period">
                            Current
                        </span>
                    </div>


                    <div className="pie-chart-container">
                        <ResponsiveContainer
                            width="100%"
                            height={280}>

                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={105}
                                    paddingAngle={4}
                                    dataKey="value"
                                >

                                    {
                                        pieData.map(
                                            (entry, index) => (

                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        PIE_COLORS[index]
                                                    }
                                                />

                                            )
                                        )
                                    }

                                </Pie>

                                <Tooltip />

                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                />

                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ================= QUERY TREND ================== */}

                <div className="chart-card">
                    <div className="chart-header">
                        <div>
                            <h2>
                                Query Overview
                            </h2>
                            <p>
                                Monthly query activity
                            </p>
                        </div>


                        <span className="chart-period">
                            {new Date().getFullYear()}
                        </span>
                    </div>


                    <div className="line-chart-container">

                        <ResponsiveContainer
                            width="100%"
                            height={280}
                        >

                            <LineChart
                                data={queryTrendData}
                            >

                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />


                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                />


                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    allowDecimals={false}
                                />


                                <Tooltip />


                                <Line
                                    type="monotone"
                                    dataKey="queries"
                                    stroke="#3f518c"
                                    strokeWidth={3}
                                    dot={{
                                        r: 4
                                    }}
                                    activeDot={{
                                        r: 6
                                    }}
                                />

                            </LineChart>

                        </ResponsiveContainer>

                    </div>

                </div>

            </div>

        </section>

    );

}
export default DashBoard;