import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

import {
    Search,
    RefreshCw,
    CreditCard,
    IndianRupee,
    Users,
    Clock3,
    ArrowRight,
    AlertCircle
} from "lucide-react";

import "./DuePayment.css";


// ============================================================
// API BASE URL
// ============================================================

const API_BASE_URL = "http://localhost:8080/api";


// ============================================================
// DUE PAYMENTS COMPONENT
// ============================================================

function DuePayment() {

    const navigate = useNavigate();


    // ========================================================
    // STATE
    // ========================================================

    const [clients, setClients] = useState([]);

    const [duePayments, setDuePayments] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ========================================================
    // FETCH CLIENTS AND PAYMENTS
    // ========================================================

    const fetchDuePayments = async () => {

        try {

            setLoading(true);
            setError("");


            // ------------------------------------------------
            // GET ALL CLIENTS
            // ------------------------------------------------

            const clientResponse = await fetch(
                `${API_BASE_URL}/clients`
            );


            if (!clientResponse.ok) {

                throw new Error(
                    "Unable to fetch clients."
                );
            }


            const clientData =
                await clientResponse.json();


            setClients(clientData);


            // ------------------------------------------------
            // GET PAYMENT HISTORY FOR EACH CLIENT
            // ------------------------------------------------

            const clientPaymentData =
                await Promise.all(

                    clientData.map(async (client) => {

                        try {

                            const paymentResponse =
                                await fetch(
                                    `${API_BASE_URL}/payments/client/${client.id}`
                                );


                            if (!paymentResponse.ok) {

                                throw new Error(
                                    `Unable to fetch payments for client ${client.id}`
                                );
                            }


                            const payments =
                                await paymentResponse.json();


                            return {
                                client,
                                payments
                            };

                        } catch (paymentError) {

                            console.error(
                                paymentError
                            );


                            return {
                                client,
                                payments: []
                            };
                        }
                    })
                );


            // ------------------------------------------------
            // CALCULATE DUE PAYMENT INFORMATION
            // ------------------------------------------------

            const calculatedDuePayments =
                clientPaymentData
                    .map(({ client, payments }) => {


                        // ------------------------------------
                        // CLIENT PAYABLE AMOUNT
                        // ------------------------------------
                        /*
                         * finalAmount already includes GST
                         * when GST is applied.
                         *
                         * If finalAmount is unavailable,
                         * use totalAmount.
                         */

                        const payableAmount =
                            Number(
                                client.finalAmount ??
                                client.totalAmount ??
                                0
                            );


                        // ------------------------------------
                        // TOTAL PAID
                        // ------------------------------------

                        const totalPaid =
                            payments.reduce(
                                (
                                    total,
                                    payment
                                ) => {

                                    return (
                                        total +
                                        Number(
                                            payment.paidAmount ??
                                            0
                                        )
                                    );

                                },
                                0
                            );


                        // ------------------------------------
                        // REMAINING DUE
                        // ------------------------------------

                        const dueAmount =
                            Math.max(
                                payableAmount -
                                totalPaid,
                                0
                            );


                        // ------------------------------------
                        // LATEST PAYMENT
                        // ------------------------------------

                        const sortedPayments =
                            [...payments].sort(
                                (a, b) => {

                                    const dateA =
                                        new Date(
                                            a.paymentDate ||
                                            a.createdAt ||
                                            0
                                        );

                                    const dateB =
                                        new Date(
                                            b.paymentDate ||
                                            b.createdAt ||
                                            0
                                        );

                                    return (
                                        dateB - dateA
                                    );
                                }
                            );


                        const latestPayment =
                            sortedPayments[0] || null;


                        return {

                            client,

                            payments,

                            payableAmount,

                            totalPaid,

                            dueAmount,

                            dueDate:
                                latestPayment?.dueDate ||
                                null

                        };

                    })

                    // ----------------------------------------
                    // SHOW ONLY CLIENTS WITH DUE AMOUNT
                    // ----------------------------------------

                    .filter(
                        item =>
                            item.dueAmount > 0
                    );


            setDuePayments(
                calculatedDuePayments
            );

        } catch (fetchError) {

            console.error(
                "Due Payments Error:",
                fetchError
            );


            setError(
                "Unable to load due payment information."
            );

        } finally {

            setLoading(false);

        }
    };


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        fetchDuePayments();

    }, []);


    // ========================================================
    // SEARCH FILTER
    // ========================================================

    const filteredDuePayments =
        useMemo(() => {

            const search =
                searchTerm
                    .trim()
                    .toLowerCase();


            if (!search) {

                return duePayments;

            }


            return duePayments.filter(
                item => {

                    const client =
                        item.client;


                    return (

                        client.custName
                            ?.toLowerCase()
                            .includes(search)

                        ||

                        client.custPhone
                            ?.toLowerCase()
                            .includes(search)

                        ||

                        client.custEmail
                            ?.toLowerCase()
                            .includes(search)

                        ||

                        client.service
                            ?.toLowerCase()
                            .includes(search)

                    );

                }
            );

        }, [
            duePayments,
            searchTerm
        ]);


    // ========================================================
    // STATISTICS
    // ========================================================

    const totalDue =
        duePayments.reduce(
            (
                total,
                item
            ) =>
                total +
                item.dueAmount,
            0
        );


    const totalReceived =
        duePayments.reduce(
            (
                total,
                item
            ) =>
                total +
                item.totalPaid,
            0
        );


    const clientsWithDue =
        duePayments.length;


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
    // ADD PAYMENT
    // ========================================================

    const handleAddPayment = (clientId) => {

        /*
         * Add Payment page will be created next.
         *
         * Route:
         *
         * /dashboard/add-payment/:clientId
         */

        navigate(
            `/dashboard/add-payment/${clientId}`
        );

    };


    // ========================================================
    // RENDER
    // ========================================================

    return (

        <section className="accounts-due-page">


            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div className="accounts-due-header">

                <div className="accounts-due-header-left">

                    <div className="accounts-due-header-icon">

                        <CreditCard
                            size={28}
                        />

                    </div>


                    <div>

                        <p className="accounts-due-breadcrumb">
                            Dashboard / Accounts / Due Payments
                        </p>

                        <h1>
                            Due Payments
                        </h1>

                        <p className="accounts-due-subtitle">
                            Track outstanding client payments
                            and collect pending amounts.
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    className="accounts-due-refresh-btn"
                    onClick={fetchDuePayments}
                    disabled={loading}
                >

                    <RefreshCw
                        size={17}
                        className={
                            loading
                                ? "accounts-due-refresh-spin"
                                : ""
                        }
                    />

                    Refresh

                </button>

            </div>


            {/* ==================================================
                STATISTICS
            ================================================== */}

            <div className="accounts-due-stats">


                {/* TOTAL DUE */}

                <div className="accounts-due-stat-card">

                    <div className="accounts-due-stat-icon accounts-due-stat-danger">

                        <IndianRupee
                            size={22}
                        />

                    </div>

                    <div>

                        <span>
                            Total Due
                        </span>

                        <strong>
                            {formatCurrency(totalDue)}
                        </strong>

                    </div>

                </div>


                {/* CLIENTS WITH DUE */}

                <div className="accounts-due-stat-card">

                    <div className="accounts-due-stat-icon accounts-due-stat-warning">

                        <Users
                            size={22}
                        />

                    </div>

                    <div>

                        <span>
                            Clients With Due
                        </span>

                        <strong>
                            {clientsWithDue}
                        </strong>

                    </div>

                </div>


                {/* TOTAL RECEIVED */}

                <div className="accounts-due-stat-card">

                    <div className="accounts-due-stat-icon accounts-due-stat-success">

                        <CreditCard
                            size={22}
                        />

                    </div>

                    <div>

                        <span>
                            Total Received
                        </span>

                        <strong>
                            {formatCurrency(totalReceived)}
                        </strong>

                    </div>

                </div>


            </div>


            {/* ==================================================
                MAIN CONTENT
            ================================================== */}

            <div className="accounts-due-content">


                {/* ==================================================
                    TABLE HEADER
                ================================================== */}

                <div className="accounts-due-table-top">

                    <div>

                        <h2>
                            Outstanding Payments
                        </h2>

                        <p>
                            Clients with pending payment amounts
                        </p>

                    </div>


                    <div className="accounts-due-search">

                        <Search
                            size={18}
                        />

                        <input
                            type="text"
                            placeholder="Search client, phone or service..."
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
                    ERROR
                ================================================== */}

                {error && (

                    <div className="accounts-due-error">

                        <AlertCircle
                            size={20}
                        />

                        <span>
                            {error}
                        </span>

                        <button
                            type="button"
                            onClick={fetchDuePayments}
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* ==================================================
                    LOADING
                ================================================== */}

                {loading ? (

                    <div className="accounts-due-loading">

                        <RefreshCw
                            size={30}
                            className="accounts-due-refresh-spin"
                        />

                        <p>
                            Loading due payments...
                        </p>

                    </div>

                ) : filteredDuePayments.length === 0 ? (

                    /* ==================================================
                       EMPTY STATE
                    ================================================== */

                    <div className="accounts-due-empty">

                        <div className="accounts-due-empty-icon">

                            <CreditCard
                                size={30}
                            />

                        </div>

                        <h3>
                            No Due Payments
                        </h3>

                        <p>
                            {searchTerm
                                ? "No clients match your search."
                                : "All client payments are currently up to date."
                            }
                        </p>

                    </div>

                ) : (

                    /* ==================================================
                       TABLE
                    ================================================== */

                    <div className="accounts-due-table-wrapper">

                        <table className="accounts-due-table">

                            <thead>

                                <tr>

                                    <th>
                                        #
                                    </th>

                                    <th>
                                        Client
                                    </th>

                                    <th>
                                        Contact
                                    </th>

                                    <th>
                                        Service
                                    </th>

                                    <th>
                                        Total Amount
                                    </th>

                                    <th>
                                        Total Paid
                                    </th>

                                    <th>
                                        Due Amount
                                    </th>

                                    <th>
                                        Due Date
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredDuePayments.map(
                                    (
                                        item,
                                        index
                                    ) => {

                                        const client =
                                            item.client;


                                        return (

                                            <tr
                                                key={
                                                    client.id
                                                }
                                            >

                                                {/* INDEX */}

                                                <td>

                                                    <span className="accounts-due-index">

                                                        {index + 1}

                                                    </span>

                                                </td>


                                                {/* CLIENT */}

                                                <td>

                                                    <div className="accounts-due-client">

                                                        <div className="accounts-due-avatar">

                                                            {client.custName
                                                                ?.charAt(0)
                                                                ?.toUpperCase() ||
                                                                "C"}

                                                        </div>


                                                        <div>

                                                            <strong>
                                                                {client.custName ||
                                                                    "Unnamed Client"}
                                                            </strong>

                                                            <small>
                                                                Client ID: #{client.id}
                                                            </small>

                                                        </div>

                                                    </div>

                                                </td>


                                                {/* CONTACT */}

                                                <td>

                                                    <div className="accounts-due-contact">

                                                        <span>
                                                            {client.custPhone ||
                                                                "—"}
                                                        </span>

                                                        <small>
                                                            {client.custEmail ||
                                                                "No email"}
                                                        </small>

                                                    </div>

                                                </td>


                                                {/* SERVICE */}

                                                <td>

                                                    <span className="accounts-due-service">

                                                        {client.service ||
                                                            "—"}

                                                    </span>

                                                </td>


                                                {/* TOTAL */}

                                                <td>

                                                    <strong className="accounts-due-total">

                                                        {formatCurrency(
                                                            item.payableAmount
                                                        )}

                                                    </strong>

                                                </td>


                                                {/* PAID */}

                                                <td>

                                                    <span className="accounts-due-paid">

                                                        {formatCurrency(
                                                            item.totalPaid
                                                        )}

                                                    </span>

                                                </td>


                                                {/* DUE */}

                                                <td>

                                                    <span className="accounts-due-amount">

                                                        {formatCurrency(
                                                            item.dueAmount
                                                        )}

                                                    </span>

                                                </td>


                                                {/* DUE DATE */}

                                                <td>

                                                    <div className="accounts-due-date">

                                                        <Clock3
                                                            size={15}
                                                        />

                                                        <span>
                                                            {formatDate(
                                                                item.dueDate
                                                            )}
                                                        </span>

                                                    </div>

                                                </td>


                                                {/* ACTION */}

                                                <td>

                                                    <button
                                                        type="button"
                                                        className="accounts-due-payment-btn"
                                                        onClick={() =>
                                                            handleAddPayment(
                                                                client.id
                                                            )
                                                        }
                                                    >

                                                        <CreditCard
                                                            size={16}
                                                        />

                                                        Add Payment

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

export default DuePayment;