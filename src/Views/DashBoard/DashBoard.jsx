import {
    CalendarDays,
    Sun,
    ArrowRight,
    TrendingUp
} from "lucide-react";

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

    // ============================================================
    // STATE
    // ============================================================

    const [leads, setLeads] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ============================================================
    // CURRENT DATE
    // ============================================================

    const currentDate = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });


    // ============================================================
    // FETCH LEADS FROM BACKEND
    // ============================================================

    useEffect(() => {

        const fetchLeads = async () => {

            try {

                setLoading(true);

                setError("");


                const response = await fetch(
                    "http://localhost:8080/api/leads"
                );


                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch dashboard data."
                    );

                }


                const data = await response.json();


                setLeads(
                    Array.isArray(data)
                        ? data
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


    // ============================================================
    // DASHBOARD COUNTS
    // ============================================================

    const dashboardCounts = useMemo(() => {

        const total = leads.length;


        const newQueries = leads.filter(
            (lead) =>
                lead.status === "NEW"
        ).length;


        const scheduledQueries = leads.filter(
            (lead) =>
                lead.status === "SCHEDULED"
        ).length;


        const serviceQueries = leads.filter(
            (lead) =>
                lead.status === "SERVICE"
        ).length;


        return {
            total,
            newQueries,
            scheduledQueries,
            serviceQueries
        };

    }, [leads]);


    // ============================================================
    // DASHBOARD CARDS
    // ============================================================

    const data = [

        {
            sr: "1",
            title: "Total Queries",
            count: dashboardCounts.total,
            type: "total"
        },

        {
            sr: "2",
            title: "New Queries",
            count: dashboardCounts.newQueries,
            type: "new"
        },

        {
            sr: "3",
            title: "Service Queries",
            count: dashboardCounts.serviceQueries,
            type: "resolved"
        },

        {
            sr: "4",
            title: "Scheduled Queries",
            count: dashboardCounts.scheduledQueries,
            type: "scheduled"
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


    // ============================================================
    // RETURN
    // ============================================================

    return (

        <section className="main-body">


            {/* ====================================================
                PAGE HEADER
            ==================================================== */}

            <div className="page-header">

                <div>

                    <p className="breadcrumb">
                        Dashboard
                    </p>

                    <h1 className="page-heading">
                        Overview
                    </h1>

                </div>

            </div>


            {/* ====================================================
                ERROR MESSAGE
            ==================================================== */}

            {error && (

                <div className="dashboard-error">

                    {error}

                </div>

            )}


            {/* ====================================================
                WELCOME BANNER
            ==================================================== */}

            <div className="greet_bar">

                <div className="greet_bar_greeting">

                    <span className="welcome-label">
                        ADMIN DASHBOARD
                    </span>


                    <h1>
                        Welcome Back, Admin!
                    </h1>


                    <p>

                        You have{" "}

                        <strong>
                            {loading
                                ? "..."
                                : dashboardCounts.newQueries
                            }
                        </strong>

                        {" "}
                        new inquiries
                        waiting for your attention.

                    </p>


                    <button
                        className="check-now-btn"
                    >

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


            {/* ====================================================
                DASHBOARD CARDS
            ==================================================== */}

            <div className="cards_section">


                {/* ==================================================
                    DATE & GREETING CARD
                ================================================== */}

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


                {/* ==================================================
                    DATA CARDS
                ================================================== */}

                <div className="data_cards">

                    {
                        data.map((item) => (

                            <div
                                className={`card ${item.type}`}
                                key={item.sr}
                            >

                                <div className="card-top">

                                    <span className="card-title">

                                        {item.title}

                                    </span>


                                    <span className="card-number">

                                        {
                                            loading
                                                ? "..."
                                                : item.count
                                        }

                                    </span>

                                </div>


                                <div className="card-bottom">

                                    <span>
                                        View details
                                    </span>

                                    <ArrowRight size={15} />

                                </div>

                            </div>

                        ))
                    }

                </div>

            </div>


            {/* ====================================================
                ANALYTICS SECTION
            ==================================================== */}

            <div className="analytics-section">


                {/* ==================================================
                    QUERY DISTRIBUTION
                ================================================== */}

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
                            height={280}
                        >

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


                {/* ==================================================
                    QUERY TREND
                ================================================== */}

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