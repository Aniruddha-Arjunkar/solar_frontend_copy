import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams , useSearchParams } from "react-router";

import {
    ArrowLeft,
    CalendarDays,
    IndianRupee,
    RefreshCw,
    Search,
    UserRound,
    WalletCards,
    CircleDollarSign,
    MinusCircle,
    AlertCircle
} from "lucide-react";

import "./AdvanceDetails.css";

const API_BASE_URL = "http://localhost:8080/api";

function AdvanceDetails() {

  
    const { employeeId } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [employee, setEmployee] = useState(null);
    const [salaries, setSalaries] = useState([]);
    
    const currentMonth = new Date().toISOString().slice(0, 7);
    const [selectedMonth, setSelectedMonth] = useState(
           searchParams.get("month") || currentMonth);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const handleMonthChange = (event) => {

    const month = event.target.value;

    setSelectedMonth(month);
    setSearchParams({ month });
     };


    // ============================================================
    // FETCH EMPLOYEE + SALARY / ADVANCE RECORDS
    // ============================================================

    const fetchAdvanceDetails = async () => {

        try {

            setLoading(true);
            setError("");


            // ----------------------------------------------------
            // FETCH EMPLOYEE
            // ----------------------------------------------------

            const employeeResponse = await fetch(
                `${API_BASE_URL}/employees/${employeeId}`
            );

            if (!employeeResponse.ok) {
                throw new Error("Unable to fetch employee details.");
            }

            const employeeData =
                await employeeResponse.json();

            setEmployee(employeeData);


            // ----------------------------------------------------
            // FETCH ALL SALARY RECORDS OF EMPLOYEE
            // ----------------------------------------------------

            const salaryResponse = await fetch(
                `${API_BASE_URL}/salaries/employee/${employeeId}`
            );

            if (!salaryResponse.ok) {
                throw new Error(
                    "Unable to fetch advance records."
                );
            }

            const salaryData =
                await salaryResponse.json();

            setSalaries(
                Array.isArray(salaryData)
                    ? salaryData
                    : []
            );

        } catch (fetchError) {

            console.error(
                "Advance Details Error:",
                fetchError
            );

            setError(
                "Unable to load advance details."
            );

        } finally {

            setLoading(false);
        }
    };


    // ============================================================
    // INITIAL FETCH
    // ============================================================

    useEffect(() => {

        if (employeeId) {
            fetchAdvanceDetails();
        }

    }, [employeeId]);


    // ============================================================
    // HELPER
    // ============================================================

    const normalizePaymentType = (paymentType) => {

        return String(
            paymentType || ""
        )
            .trim()
            .toUpperCase()
            .replace(/[\s-]+/g, "_");
    };


    // ============================================================
    // ADVANCE RECORDS
    // ============================================================

    const advanceRecords = useMemo(() => {

        return salaries.filter((salary) => {

            const paymentType =
                normalizePaymentType(
                    salary.paymentType
                );

            return paymentType === "ADVANCE";
        });

    }, [salaries]);


    // ============================================================
    // SALARY DEDUCTION RECORDS
    // ============================================================

    const deductionRecords = useMemo(() => {

        return salaries.filter((salary) => {

            const paymentType =
                normalizePaymentType(
                    salary.paymentType
                );

            return (
                paymentType === "SALARY" &&
                Number(salary.advance || 0) > 0
            );

        });

    }, [salaries]);


    // ============================================================
    // MONTH DATE RANGE
    // ============================================================

    const monthStart = `${selectedMonth}-01`;

    const getLastDayOfMonth = (yearMonth) => {

        const [year, month] =
            yearMonth.split("-").map(Number);

        return new Date(
            year,
            month,
            0
        )
            .toISOString()
            .slice(0, 10);
    };

    const monthEnd =
        getLastDayOfMonth(selectedMonth);


    // ============================================================
    // CURRENT MONTH ADVANCES
    // ============================================================

    const currentMonthAdvances = useMemo(() => {

        return advanceRecords.filter((record) => {

            if (!record.advanceDate) {
                return false;
            }

            return (
                record.advanceDate >= monthStart &&
                record.advanceDate <= monthEnd
            );

        });

    }, [
        advanceRecords,
        monthStart,
        monthEnd
    ]);


    // ============================================================
    // CURRENT MONTH DEDUCTIONS
    // ============================================================

    const currentMonthDeductions = useMemo(() => {

        return deductionRecords.filter((record) => {

            return record.month === selectedMonth;

        });

    }, [
        deductionRecords,
        selectedMonth
    ]);


    // ============================================================
    // PREVIOUS ADVANCES
    // ============================================================

    const previousAdvance = useMemo(() => {

        return advanceRecords.reduce(
            (total, record) => {

                if (
                    record.advanceDate &&
                    record.advanceDate < monthStart
                ) {

                    return (
                        total +
                        Number(
                            record.advance || 0
                        )
                    );

                }

                return total;

            },
            0
        );

    }, [
        advanceRecords,
        monthStart
    ]);


    // ============================================================
    // PREVIOUS SALARY DEDUCTIONS
    // ============================================================

    const previousDeductions = useMemo(() => {

        return deductionRecords.reduce(
            (total, record) => {

                if (
                    record.month &&
                    record.month < selectedMonth
                ) {

                    return (
                        total +
                        Number(
                            record.advance || 0
                        )
                    );

                }

                return total;

            },
            0
        );

    }, [
        deductionRecords,
        selectedMonth
    ]);


    // ============================================================
    // CARRY FORWARD
    // ============================================================

    const carryForward = Math.max(
        previousAdvance -
        previousDeductions,
        0
    );


    // ============================================================
    // CURRENT MONTH TOTAL ADVANCE
    // ============================================================

    const totalCurrentAdvance =
        currentMonthAdvances.reduce(
            (total, record) =>
                total +
                Number(record.advance || 0),
            0
        );


    // ============================================================
    // CURRENT MONTH TOTAL DEDUCTION
    // ============================================================

    const totalCurrentDeduction =
        currentMonthDeductions.reduce(
            (total, record) =>
                total +
                Number(record.advance || 0),
            0
        );


    // ============================================================
    // TOTAL AVAILABLE WITH CARRY
    // ============================================================

    const totalWithCarry =
        carryForward +
        totalCurrentAdvance;


    // ============================================================
    // PENDING ADVANCE
    // ============================================================

    const pendingAdvance = Math.max(
        totalWithCarry -
        totalCurrentDeduction,
        0
    );


    // ============================================================
    // FORMAT CURRENCY
    // ============================================================

    const formatCurrency = (amount) => {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2
            }
        ).format(
            Number(amount || 0)
        );

    };


    // ============================================================
    // FORMAT DATE
    // ============================================================

    const formatDate = (date) => {

        if (!date) {
            return "—";
        }

        const parsedDate =
            new Date(`${date}T00:00:00`);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "—";
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    // ============================================================
    // FORMAT MONTH
    // ============================================================

    const formatMonth = (month) => {

        if (!month) {
            return "";
        }

        const [year, monthNumber] =
            month.split("-");

        const date = new Date(
            Number(year),
            Number(monthNumber) - 1,
            1
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
    // BACK
    // ============================================================

    const handleBack = () => {

        navigate("/dashboard/view-advance");

    };


    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {

        return (
            <section className="accounts-advance-details-page">

                <div className="accounts-advance-details-loading">

                    <RefreshCw
                        size={32}
                        className="accounts-advance-details-spin"
                    />

                    <p>
                        Loading advance details...
                    </p>

                </div>

            </section>
        );

    }


    // ============================================================
    // MAIN UI
    // ============================================================

    return (

        <section className="accounts-advance-details-page">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="accounts-advance-details-header">

                <div className="accounts-advance-details-header-left">

                    <div className="accounts-advance-details-header-icon">
                        <WalletCards size={28} />
                    </div>

                    <div>

                        <p className="accounts-advance-details-breadcrumb">
                            Dashboard / Accounts / View Advance / Details
                        </p>

                        <h1>
                            Advance Details
                        </h1>

                        <p className="accounts-advance-details-subtitle">
                            View employee advance history,
                            deductions and pending advance.
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    className="accounts-advance-details-back-btn"
                    onClick={handleBack}
                >

                    <ArrowLeft size={17} />

                    Back to Advance

                </button>

            </div>


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

                <div className="accounts-advance-details-error">

                    <AlertCircle size={20} />

                    <span>
                        {error}
                    </span>

                    <button
                        type="button"
                        onClick={fetchAdvanceDetails}
                    >
                        Try Again
                    </button>

                </div>

            )}


            {/* ==================================================
                EMPLOYEE CARD
            ================================================== */}

            {employee && (

                <div className="accounts-advance-details-employee-card">

                    <div className="accounts-advance-details-employee-avatar">

                        {employee.name
                            ?.charAt(0)
                            ?.toUpperCase() || "E"}

                    </div>

                    <div className="accounts-advance-details-employee-info">

                        <span>
                            Employee
                        </span>

                        <h2>
                            {employee.name || "Unnamed Employee"}
                        </h2>

                        <p>
                            Employee ID: #{employee.id}
                        </p>

                    </div>

                    <div className="accounts-advance-details-employee-meta">

                        <div>
                            <UserRound size={17} />

                            <span>
                                {employee.designation ||
                                    "Employee"}
                            </span>
                        </div>

                        <div>
                            <CalendarDays size={17} />

                            <span>
                                Joining Date:{" "}
                                {formatDate(
                                    employee.joiningDate
                                )}
                            </span>
                        </div>

                    </div>

                </div>

            )}


            {/* ==================================================
                MONTH FILTER
            ================================================== */}

            <div className="accounts-advance-details-filter-card">

                <div className="accounts-advance-details-filter-info">

                    <div className="accounts-advance-details-filter-icon">
                        <CalendarDays size={21} />
                    </div>

                    <div>

                        <h3>
                            Advance Period
                        </h3>

                        <p>
                            Select a month to view
                            advance and deduction details.
                        </p>

                    </div>

                </div>


                <div className="accounts-advance-details-filter-control">

                    <label htmlFor="advance-month">
                        Select Month
                    </label>

                    <div className="accounts-advance-details-month-input">

                        <CalendarDays size={17} />

                        <input
                            id="advance-month"
                            type="month"
                            value={selectedMonth}
                            onChange={handleMonthChange}
                        />

                    </div>

                    <button
                        type="button"
                        className="accounts-advance-details-search-btn"
                        onClick={() => {
                            setSelectedMonth(
                                selectedMonth
                            );
                        }}
                    >
                        <Search size={16} />
                        View
                    </button>

                </div>

            </div>


            {/* ==================================================
                SUMMARY CARDS
            ================================================== */}

            <div className="accounts-advance-details-summary">

                {/* Carry Forward */}

                <div className="accounts-advance-details-summary-card">

                    <div className="accounts-advance-details-summary-icon accounts-advance-details-summary-info">
                        <WalletCards size={22} />
                    </div>

                    <div>

                        <span>
                            Carry Forward
                        </span>

                        <strong>
                            {formatCurrency(
                                carryForward
                            )}
                        </strong>

                        <small>
                            Previous pending advance
                        </small>

                    </div>

                </div>


                {/* Current Advance */}

                <div className="accounts-advance-details-summary-card">

                    <div className="accounts-advance-details-summary-icon accounts-advance-details-summary-warning">
                        <IndianRupee size={22} />
                    </div>

                    <div>

                        <span>
                            Current Advance
                        </span>

                        <strong>
                            {formatCurrency(
                                totalCurrentAdvance
                            )}
                        </strong>

                        <small>
                            {currentMonthAdvances.length}{" "}
                            advance record
                            {currentMonthAdvances.length !== 1
                                ? "s"
                                : ""}
                        </small>

                    </div>

                </div>


                {/* Pending Advance */}

                <div className="accounts-advance-details-summary-card">

                    <div
                        className={`accounts-advance-details-summary-icon ${
                            pendingAdvance > 0
                                ? "accounts-advance-details-summary-danger"
                                : "accounts-advance-details-summary-success"
                        }`}
                    >
                        <CircleDollarSign size={22} />
                    </div>

                    <div>

                        <span>
                            Pending Advance
                        </span>

                        <strong>
                            {formatCurrency(
                                pendingAdvance
                            )}
                        </strong>

                        <small>
                            After current deduction
                        </small>

                    </div>

                </div>

            </div>


            {/* ==================================================
                ADVANCE TAKEN
            ================================================== */}

            <div className="accounts-advance-details-content-card">

                <div className="accounts-advance-details-section-header">

                    <div>

                        <h2>
                            Advance Taken
                        </h2>

                        <p>
                            {formatMonth(selectedMonth)}
                        </p>

                    </div>

                    <div className="accounts-advance-details-section-total">

                        <span>
                            Total
                        </span>

                        <strong>
                            {formatCurrency(
                                totalCurrentAdvance
                            )}
                        </strong>

                    </div>

                </div>


                <div className="accounts-advance-details-table-wrapper">

                    <table className="accounts-advance-details-table">

                        <thead>

                            <tr>

                                <th>
                                    #
                                </th>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Amount
                                </th>

                                <th>
                                    Remark
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {currentMonthAdvances.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="accounts-advance-details-empty-cell"
                                    >
                                        <WalletCards size={25} />

                                        <span>
                                            No advance taken
                                            in this month.
                                        </span>
                                    </td>

                                </tr>

                            ) : (

                                currentMonthAdvances.map(
                                    (record, index) => (

                                        <tr key={record.id}>

                                            <td>
                                                <span className="accounts-advance-details-index">
                                                    {index + 1}
                                                </span>
                                            </td>

                                            <td>

                                                <div className="accounts-advance-details-date-cell">

                                                    <CalendarDays size={16} />

                                                    <span>
                                                        {formatDate(
                                                            record.advanceDate
                                                        )}
                                                    </span>

                                                </div>

                                            </td>

                                            <td>

                                                <strong className="accounts-advance-details-amount">
                                                    {formatCurrency(
                                                        record.advance
                                                    )}
                                                </strong>

                                            </td>

                                            <td>

                                                <span className="accounts-advance-details-remark">
                                                    {record.remark ||
                                                        "No remark"}
                                                </span>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}


                            {currentMonthAdvances.length > 0 && (

                                <>
                                    <tr className="accounts-advance-details-total-row">

                                        <td colSpan="2">
                                            Total This Month
                                        </td>

                                        <td colSpan="2">
                                            {formatCurrency(
                                                totalCurrentAdvance
                                            )}
                                        </td>

                                    </tr>

                                    <tr className="accounts-advance-details-carry-row">

                                        <td colSpan="2">
                                            Including Carry Forward
                                        </td>

                                        <td colSpan="2">
                                            {formatCurrency(
                                                totalWithCarry
                                            )}
                                        </td>

                                    </tr>
                                </>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* ==================================================
                DEDUCTION HISTORY
            ================================================== */}

            <div className="accounts-advance-details-content-card">

                <div className="accounts-advance-details-section-header">

                    <div>

                        <h2>
                            Deduction History
                        </h2>

                        <p>
                            Salary deductions for{" "}
                            {formatMonth(selectedMonth)}
                        </p>

                    </div>

                    <div className="accounts-advance-details-section-total accounts-advance-details-section-deduction">

                        <span>
                            Total Deducted
                        </span>

                        <strong>
                            {formatCurrency(
                                totalCurrentDeduction
                            )}
                        </strong>

                    </div>

                </div>


                <div className="accounts-advance-details-table-wrapper">

                    <table className="accounts-advance-details-table">

                        <thead>

                            <tr>

                                <th>
                                    #
                                </th>

                                <th>
                                    Month
                                </th>

                                <th>
                                    Deducted
                                </th>

                                <th>
                                    Status
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {currentMonthDeductions.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="accounts-advance-details-empty-cell"
                                    >
                                        <MinusCircle size={25} />

                                        <span>
                                            No advance deduction
                                            for this month.
                                        </span>

                                    </td>

                                </tr>

                            ) : (

                                currentMonthDeductions.map(
                                    (record, index) => (

                                        <tr key={record.id}>

                                            <td>

                                                <span className="accounts-advance-details-index">
                                                    {index + 1}
                                                </span>

                                            </td>

                                            <td>

                                                <div className="accounts-advance-details-date-cell">

                                                    <CalendarDays size={16} />

                                                    <span>
                                                        {formatMonth(
                                                            record.month
                                                        )}
                                                    </span>

                                                </div>

                                            </td>

                                            <td>

                                                <strong className="accounts-advance-details-deduction-amount">
                                                    {formatCurrency(
                                                        record.advance
                                                    )}
                                                </strong>

                                            </td>

                                            <td>

                                                <span className="accounts-advance-details-deduction-badge">
                                                    Deducted
                                                </span>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}


                            {currentMonthDeductions.length > 0 && (

                                <tr className="accounts-advance-details-total-row">

                                    <td colSpan="2">
                                        Total Deduction
                                    </td>

                                    <td colSpan="2">
                                        {formatCurrency(
                                            totalCurrentDeduction
                                        )}
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* ==================================================
                FINAL PENDING SECTION
            ================================================== */}

            <div
                className={`accounts-advance-details-pending-card ${
                    pendingAdvance > 0
                        ? "accounts-advance-details-pending-danger"
                        : "accounts-advance-details-pending-success"
                }`}
            >

                <div className="accounts-advance-details-pending-left">

                    <div className="accounts-advance-details-pending-icon">

                        <CircleDollarSign size={25} />

                    </div>

                    <div>

                        <span>
                            Current Pending Advance
                        </span>

                        <p>
                            Carry forward + current advance
                            − current salary deduction
                        </p>

                    </div>

                </div>


                <strong>
                    {formatCurrency(
                        pendingAdvance
                    )}
                </strong>

            </div>

        </section>
    );
}

export default AdvanceDetails;