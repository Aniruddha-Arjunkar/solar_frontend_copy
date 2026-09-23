import {
    ArrowLeft,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    UserRound,
    UsersRound
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useNavigate,
    useParams,
    useSearchParams
} from "react-router";

import API_BASE_URL
    from "../../../config/api";

import "./ViewEmployeeAttendance.css";


function ViewEmployeeAttendance() {

    const {employeeId} = useParams();

    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    const [employee,setEmployee] = useState(null);
    const [attendanceRecords,setAttendanceRecords] = useState([]);
    const [selectedMonth,setSelectedMonth] = useState(
        searchParams.get("month") ||
        new Date().toISOString().slice(0, 7)
    );

    const [loading,setLoading] = useState(true);

    const [error,setError] = useState("");


    // ============================================================
    // FETCH EMPLOYEE + ATTENDANCE
    // ============================================================

    useEffect(() => {

        const fetchData = async () => {

            try {
                setLoading(true);
                setError("");


                // ------------------------------------------------
                // FETCH EMPLOYEE
                // ------------------------------------------------

                const employeeResponse =
                    await fetch(
                        `${API_BASE_URL}/employees/${employeeId}`
                    );

                if (!employeeResponse.ok) {

                    throw new Error(
                        "Unable to fetch employee."
                    );

                }

                const employeeData =
                    await employeeResponse.json();

                setEmployee(
                    employeeData
                );


                // ------------------------------------------------
                // FETCH EMPLOYEE ATTENDANCE
                // ------------------------------------------------

                const attendanceResponse =
                    await fetch(
                        `${API_BASE_URL}/attendance/employee/${employeeId}/month/${selectedMonth}`
                    );

                if (!attendanceResponse.ok) {

                    throw new Error(
                        "Unable to fetch employee attendance."
                    );

                }

                const attendanceData =
                    await attendanceResponse.json();

                setAttendanceRecords(
                    Array.isArray(attendanceData)
                        ? attendanceData
                        : []
                );

            } catch (fetchError) {

                console.error(
                    "Employee Attendance Error:",
                    fetchError
                );

                setError(
                    fetchError.message ||
                    "Unable to load attendance."
                );

            } finally {
                setLoading(false);
            }
        };

        if (employeeId) {
            fetchData();
        }

    }, [
        employeeId,
        selectedMonth
    ]);


    // ================= MONTH INFORMATION =======================

    const monthInformation =
        useMemo(() => {

            const [
                year,
                month
            ] = selectedMonth
                .split("-")
                .map(Number);


            const daysInMonth =
                new Date(
                    year,
                    month,
                    0
                ).getDate();


            const firstDay =
                new Date(
                    year,
                    month - 1,
                    1
                ).getDay();


            const mondayOffset =
                firstDay === 0
                    ? 6
                    : firstDay - 1;


            const days =
                Array.from(
                    {
                        length:
                            daysInMonth
                    },
                    (_, index) => {

                        const day =
                            index + 1;

                        const date =
                            `${year}-${String(month)
                                .padStart(2, "0")}-${String(day)
                                .padStart(2, "0")}`;

                        return {
                            day,
                            date
                        };
                    }
                );

            return {
                year,
                month,
                days,
                mondayOffset
            };

        }, [selectedMonth]);

    // ==================== GET ATTENDANCE STATUS ======================

    const getAttendanceStatus =
        (date) => {
            const record =
                attendanceRecords.find(
                    (attendance) =>
                        attendance.attendanceDate ===
                        date
                );
            return record?.status || "";
        };


    // ================== STATUS LABEL =============================

    const getStatusLabel =
        (status) => {

            switch (status) {

                case "Present":
                    return "Pr";

                case "Absent":
                    return "Ab";

                case "Leave":
                    return "Le";

                case "Half Day":
                    return "HD";

                case "Holiday":
                    return "Ho";

                case "Week Off":
                    return "WO";

                default:
                    return "-";
            }
        };


    // ================  STATUS CLASS ================================

    const getStatusClass =
        (status) => {

            switch (status) {

                case "Present":
                    return "employee-attendance-present";

                case "Absent":
                    return "employee-attendance-absent";

                case "Leave":
                    return "employee-attendance-leave";

                case "Half Day":
                    return "employee-attendance-half-day";

                case "Holiday":
                    return "employee-attendance-holiday";

                case "Week Off":
                    return "employee-attendance-week-off";

                default:
                    return "employee-attendance-empty";
            }
        };

    // ============================ MONTH NAVIGATION ===================================

    const changeMonth =
        (direction) => {

            const [
                year,
                month
            ] = selectedMonth
                .split("-")
                .map(Number);

            const nextDate =
                new Date(
                    year,
                    month - 1 +
                    direction,
                    1
                );

            const nextMonth =
                `${nextDate.getFullYear()}-${String(
                    nextDate.getMonth() + 1
                ).padStart(2, "0")}`;

            setSelectedMonth(
                nextMonth
            );
        };


// ======================== FORMATTED MONTH ==============================

    const formattedMonth =
        new Date(
            monthInformation.year,
            monthInformation.month - 1,
            1
        ).toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );


    // =============== LOADING ============

    if (loading) {

        return (
            <section className="employee-attendance-page">

                <div className="employee-attendance-state">

                    <p>
                        Loading employee attendance...
                    </p>

                </div>

            </section>
        );

    }


    // ============================================================
    // ERROR
    // ============================================================

    if (error || !employee) {

        return (
            <section className="employee-attendance-page">

                <div className="employee-attendance-state">

                    <UsersRound size={32} />

                    <h2>
                        Unable to Load Attendance
                    </h2>

                    <p>
                        {error ||
                            "Employee not found."}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/dashboard/view-attendence"
                            )
                        }
                    >
                        <ArrowLeft size={17} />
                        Back
                    </button>
                </div>
            </section>
        );
    }

    return (

        <section className="employee-attendance-page">

            {/* ============  HEADER ============ */}

            <div className="employee-attendance-header">

                <div className="employee-attendance-header-left">

                    <div className="employee-attendance-header-icon">
                        <UserRound size={25}/>
                    </div>
                    <div>
                        <h1>
                            {employee.name}
                            {" "}
                            Attendance
                        </h1>
                        <p>
                            Monthly attendance record
                        </p>
                    </div>
                </div>


                <button
                    type="button"
                    className="employee-attendance-back-btn"
                    onClick={() =>
                        navigate("/dashboard/view-attendence")
                    }>
                    <ArrowLeft size={17} />
                    Back
                </button>

            </div>


            {/* ==================================================
                MONTH NAVIGATION
            ================================================== */}

            <div className="employee-attendance-toolbar">

                <button
                    type="button"
                    onClick={() =>
                        changeMonth(-1)
                    }>

                    <ChevronLeft size={18}/>
                    Previous
                </button>

                <div>
                    <CalendarDays size={18}/>
                    <strong>
                        {formattedMonth}
                    </strong>
                </div>


                <button
                    type="button"
                    onClick={() =>
                        changeMonth(1)
                    }>
                    Next
                    <ChevronRight
                        size={18}
                    />
                </button>
            </div>


            {/* ==================================================
                LEGEND
            ================================================== */}

            <div className="employee-attendance-legend">

                <span>Pr Present</span>
                <span>Ab Absent</span>
                <span>Le Leave</span>
                <span>HD Half Day</span>
                <span>Ho Holiday</span>
                <span>WO Week Off</span>

            </div>


            {/* ==================================================
                CALENDAR
            ================================================== */}

            <div className="employee-attendance-calendar">

                {[
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                    "Sun"
                ].map(
                    (day) => (

                        <div
                            key={day}
                            className="employee-attendance-calendar-head"
                        >
                            {day}
                        </div>
                    )
                )}

                {Array.from({
                    length:
                        monthInformation
                            .mondayOffset
                }).map(
                    (_, index) => (
                        <div
                            key={`empty-${index}`}
                            className="employee-attendance-calendar-empty"
                        />
                    )
                )}

                {monthInformation.days.map(
                    (day) => {
                        const status =
                            getAttendanceStatus(
                                day.date
                            );

                        return (

                            <div
                                key={day.date}
                                className={`employee-attendance-calendar-cell ${getStatusClass(
                                    status
                                )}`}
                            >

                                <strong>
                                    {day.day}
                                </strong>

                                <span>
                                    {getStatusLabel(status)}
                                </span>
                            </div>
                        );
                    }
                )}
            </div>
        </section>
    );
}
export default ViewEmployeeAttendance;