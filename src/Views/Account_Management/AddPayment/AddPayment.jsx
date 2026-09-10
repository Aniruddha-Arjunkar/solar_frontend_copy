import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    CreditCard,
    IndianRupee,
    LoaderCircle,
    UserRound,
    WalletCards,
    AlertCircle
} from "lucide-react";

import "./AddPayment.css";

const API_BASE_URL = "http://localhost:8080/api";

function AddPayment() {

    // ============================================================
    // ROUTER
    // ============================================================

    const { clientId } = useParams();
    const navigate = useNavigate();


    // ============================================================
    // STATE
    // ============================================================

    const [client, setClient] = useState(null);
    const [payments, setPayments] = useState([]);

    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentDate, setPaymentDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [dueDate, setDueDate] = useState("");
    const [paymentGateway, setPaymentGateway] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // ============================================================
    // FETCH CLIENT + PAYMENT HISTORY
    // ============================================================

    const fetchPaymentData = async () => {

        try {

            setLoading(true);
            setError("");

            // ----------------------------------------------------
            // FETCH CLIENT
            // ----------------------------------------------------

            const clientResponse = await fetch(
                `${API_BASE_URL}/clients/${clientId}`
            );

            if (!clientResponse.ok) {
                throw new Error(
                    "Unable to fetch client information."
                );
            }

            const clientData = await clientResponse.json();

            setClient(clientData);


            // ----------------------------------------------------
            // FETCH PAYMENT HISTORY
            // ----------------------------------------------------

            const paymentResponse = await fetch(
                `${API_BASE_URL}/payments/client/${clientId}`
            );

            if (!paymentResponse.ok) {
                throw new Error(
                    "Unable to fetch payment history."
                );
            }

            const paymentData = await paymentResponse.json();

            setPayments(paymentData);

        } catch (fetchError) {

            console.error(
                "Add Payment Error:",
                fetchError
            );

            setError(
                fetchError.message ||
                "Unable to load payment information."
            );

        } finally {

            setLoading(false);
        }
    };


    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {

        if (clientId) {
            fetchPaymentData();
        }

    }, [clientId]);


    // ============================================================
    // PAYMENT CALCULATIONS
    // ============================================================

    const payableAmount = Number(
        client?.finalAmount ??
        client?.totalAmount ??
        0
    );

    const totalPaid = payments.reduce(
        (total, payment) => {

            return (
                total +
                Number(payment.paidAmount ?? 0)
            );

        },
        0
    );

    const currentDue = Math.max(
        payableAmount - totalPaid,
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
        ).format(amount);

    };


    // ============================================================
    // FORMAT DATE
    // ============================================================

    const formatDate = (date) => {

        if (!date) {
            return "Not set";
        }

        const parsedDate = new Date(
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


    // ============================================================
    // HANDLE PAYMENT SUBMIT
    // ============================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        // --------------------------------------------------------
        // VALIDATE PAYMENT AMOUNT
        // --------------------------------------------------------

        const amount = Number(paymentAmount);

        if (!paymentAmount || Number.isNaN(amount)) {

            setError(
                "Please enter a valid payment amount."
            );

            return;
        }

        if (amount <= 0) {

            setError(
                "Payment amount must be greater than zero."
            );

            return;
        }

        if (amount > currentDue) {

            setError(
                "Payment amount cannot be greater than the current due amount."
            );

            return;
        }


        // --------------------------------------------------------
        // VALIDATE PAYMENT DATE
        // --------------------------------------------------------

        if (!paymentDate) {

            setError(
                "Please select the payment date."
            );

            return;
        }


        // --------------------------------------------------------
        // VALIDATE PAYMENT GATEWAY
        // --------------------------------------------------------

        if (!paymentGateway) {

            setError(
                "Please select a payment method."
            );

            return;
        }


        // --------------------------------------------------------
        // SUBMIT PAYMENT
        // --------------------------------------------------------

        try {

            setSaving(true);

            const response = await fetch(
                `${API_BASE_URL}/payments/client/${clientId}`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        paidAmount: amount,
                        paymentDate: paymentDate,
                        dueDate: dueDate || null,
                        paymentGateway: paymentGateway
                    })
                }
            );


            // ----------------------------------------------------
            // READ RESPONSE
            // ----------------------------------------------------

            let responseData = null;

            try {
                responseData = await response.json();
            } catch {
                responseData = null;
            }


            // ----------------------------------------------------
            // HANDLE BACKEND ERROR
            // ----------------------------------------------------

            if (!response.ok) {

                const backendMessage =
                    responseData?.message ||
                    responseData?.error ||
                    "Unable to save payment.";

                throw new Error(
                    backendMessage
                );
            }


            // ----------------------------------------------------
            // SUCCESS
            // ----------------------------------------------------

            setSuccess(
                "Payment added successfully."
            );


            // ----------------------------------------------------
            // GO BACK TO DUE PAYMENTS
            // ----------------------------------------------------

            setTimeout(() => {

                navigate(
                    "/dashboard/due-payment"
                );

            }, 800);

        } catch (submitError) {

            console.error(
                "Payment Save Error:",
                submitError
            );

            setError(
                submitError.message ||
                "Unable to save payment."
            );

        } finally {

            setSaving(false);
        }
    };


    // ============================================================
    // LOADING STATE
    // ============================================================

    if (loading) {

        return (
            <section className="accounts-add-payment-page">

                <div className="accounts-add-payment-loading">

                    <LoaderCircle
                        size={32}
                        className="accounts-add-payment-loading-spin"
                    />

                    <p>
                        Loading payment information...
                    </p>

                </div>

            </section>
        );
    }


    // ============================================================
    // CLIENT NOT FOUND
    // ============================================================

    if (!client) {

        return (
            <section className="accounts-add-payment-page">

                <div className="accounts-add-payment-error-page">

                    <div className="accounts-add-payment-error-icon">
                        <AlertCircle size={30} />
                    </div>

                    <h2>
                        Client Not Found
                    </h2>

                    <p>
                        Unable to find the selected client.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/dashboard/due-payments"
                            )
                        }
                        className="accounts-add-payment-back-btn"
                    >
                        <ArrowLeft size={17} />
                        Back to Due Payments
                    </button>

                </div>

            </section>
        );
    }


    // ============================================================
    // MAIN UI
    // ============================================================

    return (
        <section className="accounts-add-payment-page">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="accounts-add-payment-header">

                <div className="accounts-add-payment-header-left">

                    <div className="accounts-add-payment-header-icon">
                        <CreditCard size={28} />
                    </div>

                    <div>

                        <p className="accounts-add-payment-breadcrumb">
                            Dashboard / Accounts / Due Payments / Add Payment
                        </p>

                        <h1>
                            Add Payment
                        </h1>

                        <p className="accounts-add-payment-subtitle">
                            Record a payment received from the client.
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    className="accounts-add-payment-back-btn"
                    onClick={() =>
                        navigate(
                            "/dashboard/due-payment"
                        )
                    }
                >
                    <ArrowLeft size={17} />
                    Back
                </button>

            </div>


            {/* ==================================================
                CLIENT INFORMATION
            ================================================== */}

            <div className="accounts-add-payment-client-card">

                <div className="accounts-add-payment-client-icon">
                    <UserRound size={24} />
                </div>

                <div className="accounts-add-payment-client-info">

                    <span>
                        Client
                    </span>

                    <strong>
                        {client.custName || "Unnamed Client"}
                    </strong>

                    <small>
                        {client.custPhone || "No contact number"}
                        {" • "}
                        {client.service || "No service"}
                    </small>

                </div>

                <div className="accounts-add-payment-client-id">
                    Client ID: #{client.id}
                </div>

            </div>


            {/* ==================================================
                PAYMENT SUMMARY
            ================================================== */}

            <div className="accounts-add-payment-stats">

                <div className="accounts-add-payment-stat-card">

                    <div className="accounts-add-payment-stat-icon">
                        <WalletCards size={21} />
                    </div>

                    <div>

                        <span>
                            Total Amount
                        </span>

                        <strong>
                            {formatCurrency(
                                payableAmount
                            )}
                        </strong>

                    </div>

                </div>


                <div className="accounts-add-payment-stat-card">

                    <div className="accounts-add-payment-stat-icon">
                        <CheckCircle2 size={21} />
                    </div>

                    <div>

                        <span>
                            Total Paid
                        </span>

                        <strong>
                            {formatCurrency(
                                totalPaid
                            )}
                        </strong>

                    </div>

                </div>


                <div className="accounts-add-payment-stat-card accounts-add-payment-due-card">

                    <div className="accounts-add-payment-stat-icon">
                        <IndianRupee size={21} />
                    </div>

                    <div>

                        <span>
                            Current Due
                        </span>

                        <strong>
                            {formatCurrency(
                                currentDue
                            )}
                        </strong>

                    </div>

                </div>

            </div>


            {/* ==================================================
                PAYMENT FORM
            ================================================== */}

            <div className="accounts-add-payment-content">

                <div className="accounts-add-payment-form-header">

                    <div>

                        <h2>
                            Payment Details
                        </h2>

                        <p>
                            Enter the amount and payment information below.
                        </p>

                    </div>

                </div>


                {/* ==================================================
                    ERROR MESSAGE
                ================================================== */}

                {error && (

                    <div className="accounts-add-payment-alert accounts-add-payment-alert-error">

                        <AlertCircle size={20} />

                        <span>
                            {error}
                        </span>

                    </div>

                )}


                {/* ==================================================
                    SUCCESS MESSAGE
                ================================================== */}

                {success && (

                    <div className="accounts-add-payment-alert accounts-add-payment-alert-success">

                        <CheckCircle2 size={20} />

                        <span>
                            {success}
                        </span>

                    </div>

                )}


                <form
                    className="accounts-add-payment-form"
                    onSubmit={handleSubmit}
                >

                    {/* ==================================================
                        PAYMENT AMOUNT
                    ================================================== */}

                    <div className="accounts-add-payment-field accounts-add-payment-field-full">

                        <label>
                            Payment Amount
                            <span>*</span>
                        </label>

                        <div className="accounts-add-payment-input-wrapper">

                            <IndianRupee size={18} />

                            <input
                                type="number"
                                min="0.01"
                                step="0.01"
                                placeholder="Enter payment amount"
                                value={paymentAmount}
                                onChange={(event) =>
                                    setPaymentAmount(
                                        event.target.value
                                    )
                                }
                                disabled={
                                    saving ||
                                    currentDue <= 0
                                }
                            />

                        </div>

                        <small>
                            Maximum payable amount:
                            {" "}
                            {formatCurrency(currentDue)}
                        </small>

                    </div>


                    {/* ==================================================
                        PAYMENT DATE
                    ================================================== */}

                    <div className="accounts-add-payment-field">

                        <label>
                            Payment Date
                            <span>*</span>
                        </label>

                        <div className="accounts-add-payment-input-wrapper">

                            <CalendarDays size={18} />

                            <input
                                type="date"
                                value={paymentDate}
                                onChange={(event) =>
                                    setPaymentDate(
                                        event.target.value
                                    )
                                }
                                disabled={saving}
                            />

                        </div>

                    </div>


                    {/* ==================================================
                        NEXT DUE DATE
                    ================================================== */}

                    <div className="accounts-add-payment-field">

                        <label>
                            Next Due Date
                            <small>
                                Optional
                            </small>
                        </label>

                        <div className="accounts-add-payment-input-wrapper">

                            <CalendarDays size={18} />

                            <input
                                type="date"
                                value={dueDate}
                                onChange={(event) =>
                                    setDueDate(
                                        event.target.value
                                    )
                                }
                                disabled={saving}
                            />

                        </div>

                    </div>


                    {/* ==================================================
                        PAYMENT METHOD
                    ================================================== */}

                    <div className="accounts-add-payment-field accounts-add-payment-field-full">

                        <label>
                            Payment Method
                            <span>*</span>
                        </label>

                        <div className="accounts-add-payment-input-wrapper">

                            <CreditCard size={18} />

                            <select
                                value={paymentGateway}
                                onChange={(event) =>
                                    setPaymentGateway(
                                        event.target.value
                                    )
                                }
                                disabled={saving}
                            >

                                <option value="">
                                    Select payment method
                                </option>

                                <option value="Cash">
                                    Cash
                                </option>

                                <option value="Google Pay">
                                    Google Pay
                                </option>

                                <option value="PhonePe">
                                    PhonePe
                                </option>

                                <option value="Bank Transfer">
                                    Bank Transfer
                                </option>

                                <option value="Cheque">
                                    Cheque
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* ==================================================
                        PAYMENT PREVIEW
                    ================================================== */}

                    <div className="accounts-add-payment-preview">

                        <div>

                            <span>
                                Current Due
                            </span>

                            <strong>
                                {formatCurrency(
                                    currentDue
                                )}
                            </strong>

                        </div>

                        <div className="accounts-add-payment-preview-arrow">
                            →
                        </div>

                        <div>

                            <span>
                                Remaining After Payment
                            </span>

                            <strong>
                                {formatCurrency(
                                    Math.max(
                                        currentDue -
                                        (Number(paymentAmount) || 0),
                                        0
                                    )
                                )}
                            </strong>

                        </div>

                    </div>


                    {/* ==================================================
                        FORM ACTIONS
                    ================================================== */}

                    <div className="accounts-add-payment-form-actions">

                        <button
                            type="button"
                            className="accounts-add-payment-cancel-btn"
                            onClick={() =>
                                navigate(
                                    "/dashboard/due-payments"
                                )
                            }
                            disabled={saving}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="accounts-add-payment-submit-btn"
                            disabled={
                                saving ||
                                currentDue <= 0
                            }
                        >

                            {saving ? (

                                <>
                                    <LoaderCircle
                                        size={18}
                                        className="accounts-add-payment-loading-spin"
                                    />

                                    Saving Payment...
                                </>

                            ) : (

                                <>
                                    <CreditCard size={18} />

                                    Save Payment
                                </>

                            )}

                        </button>

                    </div>

                </form>

            </div>


            {/* ==================================================
                PAYMENT HISTORY
            ================================================== */}

            {payments.length > 0 && (

                <div className="accounts-add-payment-history">

                    <div className="accounts-add-payment-history-header">

                        <div>

                            <h2>
                                Payment History
                            </h2>

                            <p>
                                Previous payments recorded for this client.
                            </p>

                        </div>

                        <span>
                            {payments.length} payment
                            {payments.length !== 1 ? "s" : ""}
                        </span>

                    </div>


                    <div className="accounts-add-payment-history-table-wrapper">

                        <table className="accounts-add-payment-history-table">

                            <thead>

                                <tr>
                                    <th>#</th>
                                    <th>Payment Date</th>
                                    <th>Payment Method</th>
                                    <th>Paid Amount</th>
                                    <th>Due After Payment</th>
                                </tr>

                            </thead>

                            <tbody>

                                {[...payments]
                                    .sort((a, b) => {

                                        const dateA = new Date(
                                            a.paymentDate ||
                                            a.createdAt ||
                                            0
                                        );

                                        const dateB = new Date(
                                            b.paymentDate ||
                                            b.createdAt ||
                                            0
                                        );

                                        return dateB - dateA;

                                    })
                                    .map((payment, index) => (

                                        <tr key={payment.id}>

                                            <td>
                                                <span className="accounts-add-payment-history-index">
                                                    {index + 1}
                                                </span>
                                            </td>

                                            <td>
                                                {formatDate(
                                                    payment.paymentDate
                                                )}
                                            </td>

                                            <td>
                                                <span className="accounts-add-payment-history-method">
                                                    {payment.paymentGateway ||
                                                        "—"}
                                                </span>
                                            </td>

                                            <td>
                                                <strong className="accounts-add-payment-history-paid">
                                                    {formatCurrency(
                                                        Number(
                                                            payment.paidAmount ||
                                                            0
                                                        )
                                                    )}
                                                </strong>
                                            </td>

                                            <td>
                                                <span className="accounts-add-payment-history-due">
                                                    {formatCurrency(
                                                        Number(
                                                            payment.dueAmount ||
                                                            0
                                                        )
                                                    )}
                                                </span>
                                            </td>

                                        </tr>

                                    ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            )}

        </section>
    );
}

export default AddPayment;