import { useEffect, useMemo, useState } from "react";

import {
    Search,
    RefreshCw,
    Receipt,
    IndianRupee,
    WalletCards,
    CalendarDays,
    Filter,
    AlertCircle
} from "lucide-react";

import "./ViewExpenses.css";


// ============================================================
// API BASE URL
// ============================================================

const API_BASE_URL = "http://localhost:8080/api";


// ============================================================
// VIEW EXPENSES COMPONENT
// ============================================================

function ViewExpenses() {

    // ========================================================
    // STATE
    // ========================================================

    const [expenses, setExpenses] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");

    const [startDate, setStartDate] = useState("");

    const [endDate, setEndDate] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ========================================================
    // FETCH EXPENSES
    // ========================================================

    const fetchExpenses = async () => {

        try {

            setLoading(true);

            setError("");


            // ------------------------------------------------
            // GET ALL EXPENSES
            // ------------------------------------------------

            const response = await fetch(
                `${API_BASE_URL}/expenses`
            );


            if (!response.ok) {

                throw new Error(
                    "Unable to fetch expense information."
                );

            }


            const data = await response.json();


            // ------------------------------------------------
            // STORE EXPENSE DATA
            // ------------------------------------------------

            setExpenses(
                Array.isArray(data)
                    ? data
                    : []
            );


        } catch (fetchError) {

            console.error(
                "View Expenses Error:",
                fetchError
            );


            setError(
                fetchError.message ||
                "Unable to load expense information."
            );


        } finally {

            setLoading(false);

        }

    };


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        fetchExpenses();

    }, []);


    // ========================================================
    // FILTER EXPENSES
    // ========================================================

    const filteredExpenses = useMemo(() => {

        const search =
            searchTerm
                .trim()
                .toLowerCase();


        return expenses.filter(
            (expense) => {

                // --------------------------------------------
                // SEARCH FILTER
                // --------------------------------------------

                const matchesSearch =
                    !search ||

                    expense.expense
                        ?.toLowerCase()
                        .includes(search) ||

                    expense.paidBy
                        ?.toLowerCase()
                        .includes(search) ||

                    expense.service
                        ?.toLowerCase()
                        .includes(search);


                // --------------------------------------------
                // START DATE FILTER
                // --------------------------------------------

                const matchesStartDate =
                    !startDate ||
                    expense.expenseDate >= startDate;


                // --------------------------------------------
                // END DATE FILTER
                // --------------------------------------------

                const matchesEndDate =
                    !endDate ||
                    expense.expenseDate <= endDate;


                return (
                    matchesSearch &&
                    matchesStartDate &&
                    matchesEndDate
                );

            }
        );

    }, [
        expenses,
        searchTerm,
        startDate,
        endDate
    ]);


    // ========================================================
    // SORT EXPENSES
    // ========================================================

    const sortedExpenses = useMemo(() => {

        return [...filteredExpenses].sort(
            (a, b) => {

                const dateA =
                    new Date(
                        `${a.expenseDate}T00:00:00`
                    );

                const dateB =
                    new Date(
                        `${b.expenseDate}T00:00:00`
                    );

                return dateB - dateA;

            }
        );

    }, [filteredExpenses]);


    // ========================================================
    // STATISTICS
    // ========================================================

    const totalExpense = sortedExpenses.reduce(
        (total, expense) => {

            return (
                total +
                Number(
                    expense.amount ?? 0
                )
            );

        },
        0
    );


    const totalTransactions =
        sortedExpenses.length;


    const uniquePaidBy =
        new Set(
            sortedExpenses
                .map(expense =>
                    expense.paidBy
                )
                .filter(Boolean)
        ).size;


    const averageExpense =
        totalTransactions > 0
            ? totalExpense / totalTransactions
            : 0;


    // ========================================================
    // FORMAT CURRENCY
    // ========================================================

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


    // ========================================================
    // FORMAT DATE
    // ========================================================

    const formatDate = (date) => {

        if (!date) {

            return "Not set";

        }


        const parsedDate =
            new Date(
                `${date}T00:00:00`
            );


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {

            return "Not set";

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


    // ========================================================
    // RESET FILTERS
    // ========================================================

    const handleResetFilters = () => {

        setSearchTerm("");

        setStartDate("");

        setEndDate("");

    };


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <section className="accounts-view-expense-page">


            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div className="accounts-view-expense-header">

                <div className="accounts-view-expense-header-left">

                    <div className="accounts-view-expense-header-icon">

                        <Receipt size={28} />

                    </div>


                    <div>

                        <p className="accounts-view-expense-breadcrumb">
                            Dashboard / Accounts / View Expenses
                        </p>


                        <h1>
                            View Expenses
                        </h1>


                        <p className="accounts-view-expense-subtitle">
                            View and track all business expense transactions.
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    className="accounts-view-expense-refresh-btn"
                    onClick={fetchExpenses}
                    disabled={loading}
                >

                    <RefreshCw
                        size={17}
                        className={
                            loading
                                ? "accounts-view-expense-refresh-spin"
                                : ""
                        }
                    />

                    Refresh

                </button>

            </div>


            {/* ==================================================
                STATISTICS
            ================================================== */}

            <div className="accounts-view-expense-stats">


                {/* TOTAL EXPENSE */}

                <div className="accounts-view-expense-stat-card">

                    <div className="accounts-view-expense-stat-icon accounts-view-expense-stat-danger">

                        <IndianRupee size={22} />

                    </div>


                    <div>

                        <span>
                            Total Expense
                        </span>


                        <strong>
                            {formatCurrency(
                                totalExpense
                            )}
                        </strong>

                    </div>

                </div>


                {/* TRANSACTIONS */}

                <div className="accounts-view-expense-stat-card">

                    <div className="accounts-view-expense-stat-icon accounts-view-expense-stat-primary">

                        <Receipt size={22} />

                    </div>


                    <div>

                        <span>
                            Transactions
                        </span>


                        <strong>
                            {totalTransactions}
                        </strong>

                    </div>

                </div>


                {/* PAID BY */}

                <div className="accounts-view-expense-stat-card">

                    <div className="accounts-view-expense-stat-icon accounts-view-expense-stat-success">

                        <WalletCards size={22} />

                    </div>


                    <div>

                        <span>
                            Payment Sources
                        </span>


                        <strong>
                            {uniquePaidBy}
                        </strong>

                    </div>

                </div>


                {/* AVERAGE */}

                <div className="accounts-view-expense-stat-card accounts-view-expense-stat-average">

                    <div className="accounts-view-expense-stat-icon">

                        <IndianRupee size={22} />

                    </div>


                    <div>

                        <span>
                            Average Expense
                        </span>


                        <strong>
                            {formatCurrency(
                                averageExpense
                            )}
                        </strong>

                    </div>

                </div>

            </div>


            {/* ==================================================
                MAIN CONTENT
            ================================================== */}

            <div className="accounts-view-expense-content">


                {/* ==================================================
                    TABLE HEADER
                ================================================== */}

                <div className="accounts-view-expense-table-top">

                    <div>

                        <h2>
                            Expense Transactions
                        </h2>


                        <p>
                            Complete history of recorded business expenses.
                        </p>

                    </div>


                    {/* SEARCH */}

                    <div className="accounts-view-expense-search">

                        <Search size={18} />


                        <input
                            type="text"
                            placeholder="Search expense, paid by or service..."
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(
                                    event.target.value
                                )
                            }
                        />

                    </div>

                </div>


                {/* ==================================================
                    DATE FILTERS
                ================================================== */}

                <div className="accounts-view-expense-filters">


                    <div className="accounts-view-expense-filter-label">

                        <Filter size={17} />

                        <span>
                            Filter by Date
                        </span>

                    </div>


                    <div className="accounts-view-expense-date-field">

                        <CalendarDays size={17} />

                        <input
                            type="date"
                            value={startDate}
                            onChange={(event) =>
                                setStartDate(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    <span className="accounts-view-expense-date-separator">
                        to
                    </span>


                    <div className="accounts-view-expense-date-field">

                        <CalendarDays size={17} />

                        <input
                            type="date"
                            value={endDate}
                            onChange={(event) =>
                                setEndDate(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    <button
                        type="button"
                        className="accounts-view-expense-reset-btn"
                        onClick={handleResetFilters}
                    >

                        Reset Filters

                    </button>

                </div>


                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (

                    <div className="accounts-view-expense-error">

                        <AlertCircle size={20} />


                        <span>
                            {error}
                        </span>


                        <button
                            type="button"
                            onClick={fetchExpenses}
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* ==================================================
                    LOADING
                ================================================== */}

                {loading ? (

                    <div className="accounts-view-expense-loading">

                        <RefreshCw
                            size={30}
                            className="accounts-view-expense-refresh-spin"
                        />


                        <p>
                            Loading expense transactions...
                        </p>

                    </div>

                ) : sortedExpenses.length === 0 ? (

                    /* ==================================================
                       EMPTY STATE
                    ================================================== */

                    <div className="accounts-view-expense-empty">

                        <div className="accounts-view-expense-empty-icon">

                            <Receipt size={30} />

                        </div>


                        <h3>
                            No Expenses Found
                        </h3>


                        <p>

                            {searchTerm ||
                            startDate ||
                            endDate

                                ? "No expenses match the selected filters."

                                : "No expense transactions have been recorded yet."
                            }

                        </p>

                    </div>

                ) : (

                    /* ==================================================
                       TABLE
                    ================================================== */

                    <div className="accounts-view-expense-table-wrapper">

                        <table className="accounts-view-expense-table">

                            <thead>

                                <tr>

                                    <th>
                                        #
                                    </th>

                                    <th>
                                        Expense
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                    <th>
                                        Amount
                                    </th>

                                    <th>
                                        Paid By
                                    </th>

                                    <th>
                                        Service
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {sortedExpenses.map(
                                    (expense, index) => (

                                        <tr
                                            key={expense.id}
                                        >

                                            {/* INDEX */}

                                            <td>

                                                <span className="accounts-view-expense-index">
                                                    {index + 1}
                                                </span>

                                            </td>


                                            {/* EXPENSE */}

                                            <td>

                                                <div className="accounts-view-expense-name">

                                                    <div className="accounts-view-expense-avatar">

                                                        <Receipt size={17} />

                                                    </div>


                                                    <div>

                                                        <strong>
                                                            {expense.expense ||
                                                                "Unnamed Expense"}
                                                        </strong>


                                                        <small>
                                                            Expense ID: #
                                                            {expense.id}
                                                        </small>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* DATE */}

                                            <td>

                                                <div className="accounts-view-expense-date">

                                                    <CalendarDays size={15} />


                                                    <span>
                                                        {formatDate(
                                                            expense.expenseDate
                                                        )}
                                                    </span>

                                                </div>

                                            </td>


                                            {/* AMOUNT */}

                                            <td>

                                                <strong className="accounts-view-expense-amount">

                                                    {formatCurrency(
                                                        Number(
                                                            expense.amount ?? 0
                                                        )
                                                    )}

                                                </strong>

                                            </td>


                                            {/* PAID BY */}

                                            <td>

                                                <span className="accounts-view-expense-paid-by">

                                                    {expense.paidBy ||
                                                        "Not specified"}

                                                </span>

                                            </td>


                                            {/* SERVICE */}

                                            <td>

                                                <span className="accounts-view-expense-service">

                                                    {expense.service ||
                                                        "—"}

                                                </span>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}


                {/* ==================================================
                    RESULT SUMMARY
                ================================================== */}

                {!loading &&
                    sortedExpenses.length > 0 && (

                        <div className="accounts-view-expense-result-summary">

                            <span>

                                Showing{" "}

                                <strong>
                                    {sortedExpenses.length}
                                </strong>

                                {" "}of{" "}

                                <strong>
                                    {expenses.length}
                                </strong>

                                {" "}expense transactions

                            </span>


                            <span>

                                Filtered Total:{" "}

                                <strong>
                                    {formatCurrency(
                                        totalExpense
                                    )}
                                </strong>

                            </span>

                        </div>

                    )}

            </div>

        </section>

    );

}

export default ViewExpenses;