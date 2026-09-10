import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import {
    WalletCards,
    UserRound,
    IndianRupee,
    CalendarDays,
    FileText,
    Save,
    RotateCcw,
    ArrowLeft,
    AlertCircle,
    CheckCircle2
} from "lucide-react";

import "./AddAdvance.css";

const API_BASE_URL = "http://localhost:8080/api";

function AddAdvance() {

    const navigate = useNavigate();

    // ============================================================
    // FORM STATE
    // ============================================================

    const getTodayDate = () => {
        return new Date().toISOString().split("T")[0];
    };

    const [employeeId, setEmployeeId] = useState("");
    const [advanceAmount, setAdvanceAmount] = useState("");
    const [advanceDate, setAdvanceDate] = useState(getTodayDate());
    const [remark, setRemark] = useState("");

    // ============================================================
    // EMPLOYEE STATE
    // ============================================================

    const [employees, setEmployees] = useState([]);
    const [loadingEmployees, setLoadingEmployees] = useState(true);

    // ============================================================
    // SUBMIT STATE
    // ============================================================

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ============================================================
    // FETCH EMPLOYEES
    // ============================================================

    useEffect(() => {

        const fetchEmployees = async () => {

            try {

                setLoadingEmployees(true);
                setError("");

                const response = await fetch(
                    `${API_BASE_URL}/employees`
                );

                if (!response.ok) {
                    throw new Error(
                        "Unable to fetch employees."
                    );
                }

                const data = await response.json();

                const sortedEmployees = [...data].sort(
                    (a, b) =>
                        (a.name || "").localeCompare(
                            b.name || ""
                        )
                );

                setEmployees(sortedEmployees);

            } catch (fetchError) {

                console.error(
                    "Employee Fetch Error:",
                    fetchError
                );

                setError(
                    "Unable to load employee list."
                );

            } finally {

                setLoadingEmployees(false);
            }
        };

        fetchEmployees();

    }, []);

    // ============================================================
    // RESET FORM
    // ============================================================

    const handleReset = () => {

        setEmployeeId("");
        setAdvanceAmount("");
        setAdvanceDate(getTodayDate());
        setRemark("");

        setError("");
        setSuccess("");
    };

    // ============================================================
    // ERROR MESSAGE HANDLER
    // ============================================================

    const getErrorMessage = async (response) => {

        try {

            const errorData = await response.json();

            return (
                errorData.message ||
                errorData.error ||
                "Unable to save advance."
            );

        } catch {

            return "Unable to save advance.";
        }
    };

    // ============================================================
    // SAVE ADVANCE
    // ============================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        // --------------------------------------------------------
        // VALIDATION
        // --------------------------------------------------------

        if (!employeeId) {

            setError("Please select an employee.");
            return;
        }

        const amount = Number(advanceAmount);

        if (!amount || amount <= 0) {

            setError(
                "Advance amount must be greater than zero."
            );

            return;
        }

        if (!advanceDate) {

            setError(
                "Please select advance date."
            );

            return;
        }

        try {

            setSaving(true);

            // ----------------------------------------------------
            // MONTH FROM ADVANCE DATE
            // Example:
            // 2026-09-07 → 2026-09
            // ----------------------------------------------------

            const month = advanceDate.substring(0, 7);

            // ----------------------------------------------------
            // CREATE ADVANCE
            //
            // Advance is stored as a Salary record with:
            // paymentType = ADVANCE
            // advance = advance amount
            // ----------------------------------------------------

            const response = await fetch(
                `${API_BASE_URL}/salaries/employee/${employeeId}`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        month: month,

                        // SalaryService calculates:
                        // amount = amount - advance + reimbursement
                        //
                        // Therefore sending the same amount here
                        // makes the stored salary amount 0.
                        amount: amount,

                        basic: 0,
                        hra: 0,
                        conveyance: 0,
                        foodAllowance: 0,
                        performanceIncentive: 0,

                        professionTax: 0,

                        advance: amount,

                        reimbursement: 0,

                        paymentType: "ADVANCE",

                        advanceDate: advanceDate,

                        perDayAmount: 0,

                        presentDays: 0,

                        remark: remark.trim()
                    })
                }
            );

            if (!response.ok) {

                const message =
                    await getErrorMessage(response);

                throw new Error(message);
            }

            await response.json();

            // ----------------------------------------------------
            // SUCCESS
            // ----------------------------------------------------

            setSuccess(
                "Employee advance added successfully."
            );

            // ----------------------------------------------------
            // REDIRECT TO VIEW ADVANCE
            // ----------------------------------------------------

            setTimeout(() => {

                navigate(
                    "/dashboard/view-advance"
                );

            }, 700);

        } catch (submitError) {

            console.error(
                "Add Advance Error:",
                submitError
            );

            setError(
                submitError.message ||
                "Unable to save advance."
            );

        } finally {

            setSaving(false);
        }
    };

    return (

        <section className="accounts-add-advance-page">

            {/* =====================================================
                HEADER
            ====================================================== */}

            <div className="accounts-add-advance-header">

                <div className="accounts-add-advance-header-left">

                    <div className="accounts-add-advance-header-icon">
                        <WalletCards size={28} />
                    </div>

                    <div>

                        <p className="accounts-add-advance-breadcrumb">
                            Dashboard / Accounts / Add Advance
                        </p>

                        <h1>
                            Add Employee Advance
                        </h1>

                        <p className="accounts-add-advance-subtitle">
                            Record an advance payment issued to an employee.
                        </p>

                    </div>

                </div>

                <button
                    type="button"
                    className="accounts-add-advance-back-btn"
                    onClick={() =>
                        navigate("/dashboard/view-advance")
                    }
                >
                    <ArrowLeft size={17} />
                    Back
                </button>

            </div>


            {/* =====================================================
                FORM CARD
            ====================================================== */}

            <div className="accounts-add-advance-card">

                <div className="accounts-add-advance-card-header">

                    <div>

                        <h2>
                            Advance Information
                        </h2>

                        <p>
                            Enter the employee advance details below.
                        </p>

                    </div>

                    <div className="accounts-add-advance-card-icon">
                        <IndianRupee size={22} />
                    </div>

                </div>


                {/* =================================================
                    SUCCESS MESSAGE
                ================================================== */}

                {success && (

                    <div className="accounts-add-advance-success">

                        <CheckCircle2 size={19} />

                        <span>
                            {success}
                        </span>

                    </div>

                )}


                {/* =================================================
                    ERROR MESSAGE
                ================================================== */}

                {error && (

                    <div className="accounts-add-advance-error">

                        <AlertCircle size={19} />

                        <span>
                            {error}
                        </span>

                    </div>

                )}


                {/* =================================================
                    FORM
                ================================================== */}

                <form
                    className="accounts-add-advance-form"
                    onSubmit={handleSubmit}
                >

                    {/* =================================================
                        EMPLOYEE
                    ================================================== */}

                    <div className="accounts-add-advance-field">

                        <label>
                            Employee
                            <span>*</span>
                        </label>

                        <div className="accounts-add-advance-input-wrapper">

                            <UserRound size={18} />

                            <select
                                value={employeeId}
                                onChange={(event) =>
                                    setEmployeeId(
                                        event.target.value
                                    )
                                }
                                disabled={loadingEmployees}
                            >

                                <option value="">
                                    {loadingEmployees
                                        ? "Loading employees..."
                                        : "Select Employee"
                                    }
                                </option>

                                {employees.map(
                                    (employee) => (

                                        <option
                                            key={employee.id}
                                            value={employee.id}
                                        >
                                            {employee.name}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                    </div>


                    {/* =================================================
                        ADVANCE AMOUNT
                    ================================================== */}

                    <div className="accounts-add-advance-field">

                        <label>
                            Advance Amount
                            <span>*</span>
                        </label>

                        <div className="accounts-add-advance-input-wrapper">

                            <IndianRupee size={18} />

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Enter advance amount"
                                value={advanceAmount}
                                onChange={(event) =>
                                    setAdvanceAmount(
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                    </div>


                    {/* =================================================
                        ADVANCE DATE
                    ================================================== */}

                    <div className="accounts-add-advance-field">

                        <label>
                            Advance Date
                            <span>*</span>
                        </label>

                        <div className="accounts-add-advance-input-wrapper">

                            <CalendarDays size={18} />

                            <input
                                type="date"
                                value={advanceDate}
                                onChange={(event) =>
                                    setAdvanceDate(
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                    </div>


                    {/* =================================================
                        REMARK
                    ================================================== */}

                    <div className="accounts-add-advance-field accounts-add-advance-full-field">

                        <label>
                            Remark
                        </label>

                        <div className="accounts-add-advance-textarea-wrapper">

                            <FileText size={18} />

                            <textarea
                                rows="4"
                                placeholder="Enter remark..."
                                value={remark}
                                onChange={(event) =>
                                    setRemark(
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                    </div>


                    {/* =================================================
                        BUTTONS
                    ================================================== */}

                    <div className="accounts-add-advance-actions">

                        <button
                            type="submit"
                            className="accounts-add-advance-save-btn"
                            disabled={saving}
                        >

                            <Save size={18} />

                            {saving
                                ? "Saving..."
                                : "Save Advance"
                            }

                        </button>


                        <button
                            type="button"
                            className="accounts-add-advance-reset-btn"
                            onClick={handleReset}
                            disabled={saving}
                        >

                            <RotateCcw size={17} />

                            Reset

                        </button>

                    </div>

                </form>

            </div>

        </section>
    );
}

export default AddAdvance;