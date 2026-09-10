import { useState } from "react";
import { useNavigate } from "react-router";

import {
    Receipt,
    CalendarDays,
    IndianRupee,
    WalletCards,
    FileText,
    Save,
    ArrowLeft,
    AlertCircle,
    CheckCircle2
} from "lucide-react";

import "./AddExpenses.css";


// ============================================================
// API BASE URL
// ============================================================

const API_BASE_URL = "http://localhost:8080/api";


// ============================================================
// GET TODAY'S DATE
// ============================================================

const getTodayDate = () => {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
};


// ============================================================
// ADD EXPENSE COMPONENT
// ============================================================

function AddExpenses() {

    const navigate = useNavigate();


    // ========================================================
    // FORM STATE
    // ========================================================

    const [expense, setExpense] = useState("");

    const [expenseDate, setExpenseDate] =
        useState(getTodayDate());

    const [amount, setAmount] = useState("");

    const [paidBy, setPaidBy] = useState("");

    const [service, setService] = useState("");


    // ========================================================
    // UI STATE
    // ========================================================

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // ========================================================
    // FORM SUBMIT
    // ========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        // ----------------------------------------------------
        // BASIC VALIDATION
        // ----------------------------------------------------

        if (!expense.trim()) {

            setError(
                "Please enter the expense name."
            );

            return;
        }


        if (!expenseDate) {

            setError(
                "Please select the expense date."
            );

            return;
        }


        const numericAmount =
            Number(amount);


        if (
            !amount ||
            Number.isNaN(numericAmount) ||
            numericAmount <= 0
        ) {

            setError(
                "Please enter a valid expense amount greater than zero."
            );

            return;
        }


        if (!paidBy) {

            setError(
                "Please select who paid for this expense."
            );

            return;
        }


        // ----------------------------------------------------
        // START SAVING
        // ----------------------------------------------------

        try {

            setLoading(true);


            // ------------------------------------------------
            // CREATE EXPENSE
            // ------------------------------------------------

            const response = await fetch(
                `${API_BASE_URL}/expenses`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        expense:
                            expense.trim(),

                        expenseDate,

                        amount:
                            numericAmount,

                        paidBy,

                        service:
                            service.trim() || null
                    })
                }
            );


            // ------------------------------------------------
            // READ RESPONSE
            // ------------------------------------------------

            const responseData =
                await response.json()
                    .catch(() => null);


            if (!response.ok) {

                throw new Error(
                    responseData?.message ||
                    responseData?.error ||
                    "Unable to add expense."
                );
            }


            // ------------------------------------------------
            // SUCCESS
            // ------------------------------------------------

            setSuccess(
                "Expense added successfully."
            );


            // ------------------------------------------------
            // REDIRECT TO VIEW EXPENSES
            // ------------------------------------------------

            setTimeout(() => {

                navigate(
                    "/dashboard/view-expenses"
                );

            }, 700);


        } catch (submitError) {

            console.error(
                "Add Expense Error:",
                submitError
            );


            setError(
                submitError.message ||
                "Unable to add expense."
            );


        } finally {

            setLoading(false);

        }
    };


    // ========================================================
    // BACK BUTTON
    // ========================================================

    const handleBack = () => {

        navigate(
            "/dashboard/view-expenses"
        );
    };


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <section className="accounts-add-expense-page">


            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div className="accounts-add-expense-header">

                <div className="accounts-add-expense-header-left">

                    <div className="accounts-add-expense-header-icon">

                        <Receipt
                            size={28}
                        />

                    </div>


                    <div>

                        <p className="accounts-add-expense-breadcrumb">

                            Dashboard / Accounts / Add Expense

                        </p>


                        <h1>
                            Add Expense
                        </h1>


                        <p className="accounts-add-expense-subtitle">

                            Record a new business expense
                            for your solar services operations.

                        </p>

                    </div>

                </div>

            </div>


            {/* ==================================================
                FORM CONTENT
            ================================================== */}

            <div className="accounts-add-expense-content">


                {/* ==================================================
                    FORM HEADER
                ================================================== */}

                <div className="accounts-add-expense-form-header">

                    <div>

                        <h2>
                            Expense Information
                        </h2>

                        <p>
                            Enter the details of the expense
                            transaction below.
                        </p>

                    </div>

                </div>


                {/* ==================================================
                    ERROR MESSAGE
                ================================================== */}

                {error && (

                    <div className="accounts-add-expense-message accounts-add-expense-error">

                        <AlertCircle
                            size={20}
                        />

                        <span>
                            {error}
                        </span>

                    </div>

                )}


                {/* ==================================================
                    SUCCESS MESSAGE
                ================================================== */}

                {success && (

                    <div className="accounts-add-expense-message accounts-add-expense-success">

                        <CheckCircle2
                            size={20}
                        />

                        <span>
                            {success}
                        </span>

                    </div>

                )}


                {/* ==================================================
                    FORM
                ================================================== */}

                <form
                    className="accounts-add-expense-form"
                    onSubmit={handleSubmit}
                >


                    {/* ==================================================
                        EXPENSE NAME
                    ================================================== */}

                    <div className="accounts-add-expense-field">

                        <label htmlFor="expense">

                            Expense Name

                            <span>
                                *
                            </span>

                        </label>


                        <div className="accounts-add-expense-input-wrapper">

                            <FileText
                                size={19}
                            />

                            <input
                                id="expense"
                                type="text"
                                placeholder="Enter expense name"
                                value={expense}
                                onChange={(event) =>
                                    setExpense(
                                        event.target.value
                                    )
                                }
                                disabled={loading}
                            />

                        </div>

                    </div>


                    {/* ==================================================
                        EXPENSE DATE
                    ================================================== */}

                    <div className="accounts-add-expense-field">

                        <label htmlFor="expenseDate">

                            Expense Date

                            <span>
                                *
                            </span>

                        </label>


                        <div className="accounts-add-expense-input-wrapper">

                            <CalendarDays
                                size={19}
                            />

                            <input
                                id="expenseDate"
                                type="date"
                                value={expenseDate}
                                onChange={(event) =>
                                    setExpenseDate(
                                        event.target.value
                                    )
                                }
                                disabled={loading}
                            />

                        </div>

                    </div>


                    {/* ==================================================
                        AMOUNT
                    ================================================== */}

                    <div className="accounts-add-expense-field">

                        <label htmlFor="amount">

                            Amount

                            <span>
                                *
                            </span>

                        </label>


                        <div className="accounts-add-expense-input-wrapper">

                            <IndianRupee
                                size={19}
                            />

                            <input
                                id="amount"
                                type="number"
                                min="0.01"
                                step="0.01"
                                placeholder="Enter expense amount"
                                value={amount}
                                onChange={(event) =>
                                    setAmount(
                                        event.target.value
                                    )
                                }
                                disabled={loading}
                            />

                        </div>

                    </div>


                    {/* ==================================================
                        PAID BY
                    ================================================== */}

                    <div className="accounts-add-expense-field">

                        <label htmlFor="paidBy">

                            Paid By

                            <span>
                                *
                            </span>

                        </label>


                        <div className="accounts-add-expense-input-wrapper">

                            <WalletCards
                                size={19}
                            />

                            <select
                                id="paidBy"
                                value={paidBy}
                                onChange={(event) =>
                                    setPaidBy(
                                        event.target.value
                                    )
                                }
                                disabled={loading}
                            >

                                <option value="">
                                    Select payment method
                                </option>

                                <option value="Cash">
                                    Cash
                                </option>

                                <option value="Bank Transfer">
                                    Bank Transfer
                                </option>

                                <option value="Google Pay">
                                    Google Pay
                                </option>

                                <option value="PhonePe">
                                    PhonePe
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* ==================================================
                        RELATED SERVICE
                    ================================================== */}

                    <div className="accounts-add-expense-field accounts-add-expense-field-full">

                        <label htmlFor="service">

                            Related Service

                            <small>
                                Optional
                            </small>

                        </label>


                        <div className="accounts-add-expense-input-wrapper">

                            <Receipt
                                size={19}
                            />

                            <input
                                id="service"
                                type="text"
                                placeholder="Enter related service"
                                value={service}
                                onChange={(event) =>
                                    setService(
                                        event.target.value
                                    )
                                }
                                disabled={loading}
                            />

                        </div>

                    </div>


                    {/* ==================================================
                        ACTION BUTTONS
                    ================================================== */}

                    <div className="accounts-add-expense-actions">


                        <button
                            type="button"
                            className="accounts-add-expense-back-btn"
                            onClick={handleBack}
                            disabled={loading}
                        >

                            <ArrowLeft
                                size={17}
                            />

                            Back

                        </button>


                        <button
                            type="submit"
                            className="accounts-add-expense-save-btn"
                            disabled={loading}
                        >

                            {loading ? (

                                <>
                                    <span className="accounts-add-expense-spinner"></span>

                                    Saving...
                                </>

                            ) : (

                                <>
                                    <Save
                                        size={17}
                                    />

                                    Add Expense
                                </>

                            )}

                        </button>

                    </div>

                </form>

            </div>

        </section>
    );
}

export default AddExpenses;