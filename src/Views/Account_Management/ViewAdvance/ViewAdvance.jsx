import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import {
    WalletCards,
    Search,
    RefreshCw,
    CalendarDays,
    Users,
    IndianRupee,
    Eye,
    ArrowRight,
    AlertCircle
} from "lucide-react";

import "./ViewAdvance.css";

const API_BASE_URL = "http://localhost:8080/api";

function ViewAdvance() {

    const navigate = useNavigate();


    // DEFAULT MONTH

    const getCurrentMonth = () => {
        const date = new Date();

        return `${date.getFullYear()}-${String(
            date.getMonth() + 1
        ).padStart(2, "0")}`;
    };

    const [selectedMonth, setSelectedMonth] =
        useState(getCurrentMonth());

    const [employees, setEmployees] = useState([]);
    const [advanceData, setAdvanceData] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // FETCH ADVANCE DATA
    const fetchAdvanceData = async () => {

        try {

            setLoading(true);
            setError("");

            // FETCH EMPLOYEES

            const employeeResponse = await fetch(
                `${API_BASE_URL}/employees`
            );

            if (!employeeResponse.ok) {
                throw new Error(
                    "Unable to fetch employees."
                );
            }

            const employeeData =
                await employeeResponse.json();

            const sortedEmployees =
                [...employeeData].sort(
                    (a, b) =>
                        (a.name || "").localeCompare(
                            b.name || ""
                        )
                );

            setEmployees(sortedEmployees);

            // ----------------------------------------------------
            // FETCH SALARIES FOR EACH EMPLOYEE
            // ----------------------------------------------------

            const employeeAdvanceData =
                await Promise.all(

                    sortedEmployees.map(
                        async (employee) => {

                            try {

                                const salaryResponse =
                                    await fetch(
                                        `${API_BASE_URL}/salaries/employee/${employee.id}`
                                    );

                                if (!salaryResponse.ok) {

                                    throw new Error(
                                        `Unable to fetch salary records for employee ${employee.id}`
                                    );
                                }

                                const salaries =
                                    await salaryResponse.json();

                                // ------------------------------------------------
                                // ADVANCE RECORDS
                                // ------------------------------------------------

                                const advanceRecords =
                                    salaries.filter(
                                        (salary) => {

                                            const paymentType =
                                                (
                                                    salary.paymentType ||
                                                    ""
                                                ).toUpperCase();

                                            const advance =
                                                Number(
                                                    salary.advance || 0
                                                );

                                            return (
                                                paymentType ===
                                                    "ADVANCE" &&
                                                advance > 0
                                            );
                                        }
                                    );

                                // ------------------------------------------------
                                // MONTH ADVANCE
                                // ------------------------------------------------

                                const monthAdvance =
                                    advanceRecords.reduce(
                                        (total, salary) => {

                                            if (
                                                salary.advanceDate
                                                    ?.startsWith(
                                                        selectedMonth
                                                    )
                                            ) {

                                                return (
                                                    total +
                                                    Number(
                                                        salary.advance || 0
                                                    )
                                                );
                                            }

                                            return total;
                                        },
                                        0
                                    );

                                // ------------------------------------------------
                                // TOTAL ADVANCE
                                // ------------------------------------------------

                                const totalAdvance =
                                    advanceRecords.reduce(
                                        (total, salary) =>
                                            total +
                                            Number(
                                                salary.advance || 0
                                            ),
                                        0
                                    );

                                return {
                                    employee,
                                    salaries,
                                    advanceRecords,
                                    monthAdvance,
                                    totalAdvance
                                };

                            } catch (employeeError) {

                                console.error(
                                    employeeError
                                );

                                return {
                                    employee,
                                    salaries: [],
                                    advanceRecords: [],
                                    monthAdvance: 0,
                                    totalAdvance: 0
                                };
                            }

                        }
                    )
                );

            // ----------------------------------------------------
            // SHOW ONLY EMPLOYEES WITH ADVANCE
            // ----------------------------------------------------

            const filteredEmployees =
                employeeAdvanceData.filter(
                    (item) =>
                        item.totalAdvance > 0
                );

            setAdvanceData(filteredEmployees);

        } catch (fetchError) {

            console.error(
                "View Advance Error:",
                fetchError
            );

            setError(
                "Unable to load employee advance information."
            );

        } finally {

            setLoading(false);
        }
    };

    // ============================================================
    // LOAD DATA WHEN MONTH CHANGES
    // ============================================================

    useEffect(() => {

        fetchAdvanceData();

    }, [selectedMonth]);

    // ============================================================
    // SEARCH
    // ============================================================

    const filteredAdvanceData = useMemo(() => {

        const search =
            searchTerm
                .trim()
                .toLowerCase();

        if (!search) {
            return advanceData;
        }

        return advanceData.filter(
            (item) =>
                item.employee.name
                    ?.toLowerCase()
                    .includes(search) ||
                item.employee.phone
                    ?.toLowerCase()
                    .includes(search) ||
                item.employee.email
                    ?.toLowerCase()
                    .includes(search)
        );

    }, [advanceData, searchTerm]);

    // ============================================================
    // MONTH DISPLAY
    // ============================================================

    const formatMonth = (month) => {

        if (!month) {
            return "";
        }

        const date = new Date(
            `${month}-01T00:00:00`
        );

        return date.toLocaleDateString(
            "en-IN",
            {
                month: "long",
                year: "numeric"
            }
        );
    };

    // ============================================================
    // CURRENCY
    // ============================================================

    const formatCurrency = (amount) => {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2
            }
        ).format(amount);
    };

    // ============================================================
    // TOTALS
    // ============================================================

    const selectedMonthTotal =
        advanceData.reduce(
            (total, item) =>
                total + item.monthAdvance,
            0
        );

    const overallAdvanceTotal =
        advanceData.reduce(
            (total, item) =>
                total + item.totalAdvance,
            0
        );

    // ============================================================
    // VIEW DETAILS
    // ============================================================

    const handleViewDetails = (employeeId) => {

        navigate(
            `/dashboard/view-advance/details/${employeeId}?month=${selectedMonth}`
        );
    };

    return (

        <section className="accounts-view-advance-page">

            {/* =====================================================
                HEADER
            ====================================================== */}

            <div className="accounts-view-advance-header">

                <div className="accounts-view-advance-header-left">

                    <div className="accounts-view-advance-header-icon">
                        <WalletCards size={28} />
                    </div>

                    <div>

                        <p className="accounts-view-advance-breadcrumb">
                            Dashboard / Accounts / View Advance
                        </p>

                        <h1>
                            Employee Advance
                        </h1>

                        <p className="accounts-view-advance-subtitle">
                            Track employee advances and outstanding advance amounts.
                        </p>

                    </div>

                </div>

                <button
                    type="button"
                    className="accounts-view-advance-add-btn"
                    onClick={() =>
                        navigate(
                            "/dashboard/add-advance"
                        )
                    }
                >
                    <WalletCards size={17} />
                    Add Advance
                </button>

            </div>


            {/* =====================================================
                SUMMARY CARDS
            ====================================================== */}

            <div className="accounts-view-advance-stats">

                <div className="accounts-view-advance-stat-card">

                    <div className="accounts-view-advance-stat-icon">
                        <Users size={22} />
                    </div>

                    <div>

                        <span>
                            Employees With Advance
                        </span>

                        <strong>
                            {advanceData.length}
                        </strong>

                    </div>

                </div>


                <div className="accounts-view-advance-stat-card">

                    <div className="accounts-view-advance-stat-icon">
                        <IndianRupee size={22} />
                    </div>

                    <div>

                        <span>
                            {formatMonth(selectedMonth)} Advance
                        </span>

                        <strong>
                            {formatCurrency(
                                selectedMonthTotal
                            )}
                        </strong>

                    </div>

                </div>


                <div className="accounts-view-advance-stat-card">

                    <div className="accounts-view-advance-stat-icon">
                        <WalletCards size={22} />
                    </div>

                    <div>

                        <span>
                            Total Advance
                        </span>

                        <strong>
                            {formatCurrency(
                                overallAdvanceTotal
                            )}
                        </strong>

                    </div>

                </div>

            </div>


            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}

            <div className="accounts-view-advance-content">

                {/* =================================================
                    FILTER
                ================================================== */}

                <div className="accounts-view-advance-filter">

                    <div className="accounts-view-advance-filter-field">

                        <label>
                            <CalendarDays size={16} />
                            Select Month
                        </label>

                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={(event) =>
                                setSelectedMonth(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    <div className="accounts-view-advance-search">

                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search employee..."
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    <button
                        type="button"
                        className="accounts-view-advance-refresh-btn"
                        onClick={fetchAdvanceData}
                        disabled={loading}
                    >

                        <RefreshCw
                            size={17}
                            className={
                                loading
                                    ? "accounts-view-advance-refresh-spin"
                                    : ""
                            }
                        />

                        Refresh

                    </button>

                </div>


                {/* =================================================
                    ERROR
                ================================================== */}

                {error && (

                    <div className="accounts-view-advance-error">

                        <AlertCircle size={19} />

                        <span>
                            {error}
                        </span>

                        <button
                            type="button"
                            onClick={fetchAdvanceData}
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* =================================================
                    TABLE HEADER
                ================================================== */}

                <div className="accounts-view-advance-table-heading">

                    <div>

                        <h2>
                            Advance Records
                        </h2>

                        <p>
                            Employee advances for{" "}
                            <strong>
                                {formatMonth(selectedMonth)}
                            </strong>
                        </p>

                    </div>

                    <span className="accounts-view-advance-count">
                        {filteredAdvanceData.length} Employees
                    </span>

                </div>


                {/* =================================================
                    LOADING
                ================================================== */}

                {loading ? (

                    <div className="accounts-view-advance-loading">

                        <RefreshCw
                            size={30}
                            className="accounts-view-advance-refresh-spin"
                        />

                        <p>
                            Loading advance records...
                        </p>

                    </div>

                ) : filteredAdvanceData.length === 0 ? (

                    /* =============================================
                       EMPTY
                    ============================================== */

                    <div className="accounts-view-advance-empty">

                        <div className="accounts-view-advance-empty-icon">
                            <WalletCards size={30} />
                        </div>

                        <h3>
                            No Advance Records
                        </h3>

                        <p>
                            {searchTerm
                                ? "No employees match your search."
                                : `No advance records found for ${formatMonth(
                                      selectedMonth
                                  )}.`
                            }
                        </p>

                    </div>

                ) : (

                    /* =============================================
                       TABLE
                    ============================================== */

                    <div className="accounts-view-advance-table-wrapper">

                        <table className="accounts-view-advance-table">

                            <thead>

                                <tr>

                                    <th>#</th>

                                    <th>
                                        Employee
                                    </th>

                                    <th>
                                        Advance ({formatMonth(
                                            selectedMonth
                                        )})
                                    </th>

                                    <th>
                                        Total Advance
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredAdvanceData.map(
                                    (item, index) => {

                                        const employee =
                                            item.employee;

                                        return (

                                            <tr
                                                key={
                                                    employee.id
                                                }
                                            >

                                                <td>

                                                    <span className="accounts-view-advance-index">
                                                        {index + 1}
                                                    </span>

                                                </td>


                                                <td>

                                                    <div className="accounts-view-advance-employee">

                                                        <div className="accounts-view-advance-avatar">

                                                            {employee.name
                                                                ?.charAt(0)
                                                                ?.toUpperCase() ||
                                                                "E"}

                                                        </div>

                                                        <div>

                                                            <strong>
                                                                {employee.name ||
                                                                    "Unnamed Employee"}
                                                            </strong>

                                                            <small>
                                                                Employee ID: #
                                                                {employee.id}
                                                            </small>

                                                        </div>

                                                    </div>

                                                </td>


                                                <td>

                                                    <strong className="accounts-view-advance-month-amount">

                                                        {formatCurrency(
                                                            item.monthAdvance
                                                        )}

                                                    </strong>

                                                </td>


                                                <td>

                                                    <strong className="accounts-view-advance-total-amount">

                                                        {formatCurrency(
                                                            item.totalAdvance
                                                        )}

                                                    </strong>

                                                </td>


                                                <td>

                                                    <button
                                                        type="button"
                                                        className="accounts-view-advance-details-btn"
                                                        onClick={() =>handleViewDetails(employee.id)}>
                                                        <Eye size={16} />
                                                        Details
                                                        <ArrowRight
                                                            size={15}
                                                        />
                                                    </button>

                                                </td>

                                            </tr>

                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </section>
    );
}

export default ViewAdvance;