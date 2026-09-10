import { useEffect, useMemo, useState } from "react";

import {
    Search,
    RefreshCw,
    CreditCard,
    IndianRupee,
    Receipt,
    Users,
    CalendarDays,
    Eye,
    AlertCircle
} from "lucide-react";

import "./ViewPayment.css";


// ============================================================
// API BASE URL
// ============================================================

const API_BASE_URL = "http://localhost:8080/api";


// ============================================================
// VIEW PAYMENT COMPONENT
// ============================================================

function ViewPayment() {


    // ============================================================
    // STATE
    // ============================================================

    const [payments, setPayments] = useState([]);

    const [clients, setClients] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // ============================================================
    // FETCH PAYMENTS AND CLIENTS
    // ============================================================

    const fetchPayments = async () => {

        try {

            setLoading(true);

            setError("");


            // ====================================================
            // GET ALL CLIENTS
            // ====================================================

            const clientResponse = await fetch(
                `${API_BASE_URL}/clients`
            );


            if (!clientResponse.ok) {

                throw new Error(
                    "Unable to fetch client information."
                );

            }


            const clientData =
                await clientResponse.json();


            const validClients =
                Array.isArray(clientData)
                    ? clientData
                    : [];


            setClients(validClients);


            // ====================================================
            // GET PAYMENT HISTORY FOR EACH CLIENT
            // ====================================================

            const clientPaymentData =
                await Promise.all(

                    validClients.map(
                        async (client) => {

                            try {

                                const paymentResponse =
                                    await fetch(
                                        `${API_BASE_URL}/payments/client/${client.id}`
                                    );


                                if (!paymentResponse.ok) {

                                    throw new Error(
                                        `Unable to fetch payments for client ${client.id}.`
                                    );

                                }


                                const paymentData =
                                    await paymentResponse.json();


                                return {

                                    client,

                                    payments:
                                        Array.isArray(
                                            paymentData
                                        )
                                            ? paymentData
                                            : []

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

                        }
                    )

                );


            // ====================================================
            // COMBINE CLIENT + PAYMENT
            // ====================================================
            /*
             *
             * Instead of expecting:
             *
             * payment.clientId
             *
             * we already know which client the payment belongs to
             * because we fetched:
             *
             * /payments/client/{client.id}
             *
             */

            const combinedPayments = [];


            clientPaymentData.forEach(
                ({ client, payments: clientPayments }) => {

                    clientPayments.forEach(
                        (payment) => {

                            combinedPayments.push({

                                payment,

                                client

                            });

                        }
                    );

                }
            );


            setPayments(
                combinedPayments
            );


        } catch (fetchError) {

            console.error(
                "View Payments Error:",
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

        fetchPayments();

    }, []);


    // ============================================================
    // SEARCH FILTER
    // ============================================================

    const filteredPayments =
        useMemo(() => {

            const search =
                searchTerm
                    .trim()
                    .toLowerCase();


            if (!search) {

                return payments;

            }


            return payments.filter(
                ({ payment, client }) => {

                    return (

                        client?.custName
                            ?.toLowerCase()
                            .includes(search)

                        ||

                        client?.custPhone
                            ?.toLowerCase()
                            .includes(search)

                        ||

                        client?.custEmail
                            ?.toLowerCase()
                            .includes(search)

                        ||

                        client?.service
                            ?.toLowerCase()
                            .includes(search)

                        ||

                        payment?.paymentGateway
                            ?.toLowerCase()
                            .includes(search)

                    );

                }
            );

        }, [
            payments,
            searchTerm
        ]);


    // ============================================================
    // TOTAL RECEIVED
    // ============================================================

    const totalReceived =
        payments.reduce(
            (
                total,
                { payment }
            ) => {

                return (
                    total +
                    Number(
                        payment?.paidAmount ?? 0
                    )
                );

            },
            0
        );


    // ============================================================
    // TOTAL TRANSACTIONS
    // ============================================================

    const totalTransactions =
        payments.length;


    // ============================================================
    // UNIQUE CLIENTS WHO HAVE PAID
    // ============================================================

    const uniqueClients =
        new Set(
            payments
                .map(
                    ({ client }) =>
                        client?.id
                )
                .filter(
                    Boolean
                )
        ).size;


    // ============================================================
    // TOTAL OUTSTANDING
    // ============================================================
    /*
     *
     * IMPORTANT:
     *
     * We do NOT simply add payment.dueAmount here.
     *
     * Example:
     *
     * Payment 1 → Due ₹2,30,000
     * Payment 2 → Due ₹2,00,000
     *
     * Adding both would incorrectly show:
     *
     * ₹4,30,000
     *
     * Instead, calculate the current due for each client:
     *
     * Client payable amount
     * -
     * total payments made by that client
     *
     */

    const totalOutstanding =
        useMemo(() => {

            const clientPaymentMap =
                new Map();


            // ----------------------------------------------------
            // GROUP PAYMENTS BY CLIENT
            // ----------------------------------------------------

            payments.forEach(
                ({ payment, client }) => {

                    if (!client?.id) {
                        return;
                    }


                    const clientId =
                        Number(
                            client.id
                        );


                    if (
                        !clientPaymentMap.has(
                            clientId
                        )
                    ) {

                        clientPaymentMap.set(
                            clientId,
                            {
                                client,
                                totalPaid: 0
                            }
                        );

                    }


                    const clientData =
                        clientPaymentMap.get(
                            clientId
                        );


                    clientData.totalPaid +=
                        Number(
                            payment?.paidAmount ?? 0
                        );

                }
            );


            // ----------------------------------------------------
            // CALCULATE CURRENT OUTSTANDING
            // ----------------------------------------------------

            let outstanding = 0;


            clientPaymentMap.forEach(
                ({ client, totalPaid }) => {

                    const payableAmount =
                        Number(
                            client?.finalAmount ??
                            client?.totalAmount ??
                            0
                        );


                    const dueAmount =
                        Math.max(
                            payableAmount -
                            totalPaid,
                            0
                        );


                    outstanding +=
                        dueAmount;

                }
            );


            return outstanding;

        }, [payments]);


    // ============================================================
    // FORMAT CURRENCY
    // ============================================================

    const formatCurrency = (
        amount
    ) => {

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

    const formatDate = (
        date
    ) => {

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


    // ============================================================
    // PAYMENT METHOD
    // ============================================================

    const getPaymentMethod = (
        payment
    ) => {

        return (
            payment?.paymentGateway ||
            "Not specified"
        );

    };


    // ============================================================
    // VIEW PAYMENT
    // ============================================================

    const handleViewPayment = (
        payment,
        client
    ) => {

        console.log(
            "View Payment:",
            payment
        );

        console.log(
            "Client:",
            client
        );

    };


    // ============================================================
    // RENDER
    // ============================================================

    return (

        <section className="accounts-view-payment-page">


            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div className="accounts-view-payment-header">

                <div className="accounts-view-payment-header-left">


                    <div className="accounts-view-payment-header-icon">

                        <Receipt
                            size={28}
                        />

                    </div>


                    <div>

                        <p className="accounts-view-payment-breadcrumb">

                            Dashboard / Accounts / View Payments

                        </p>


                        <h1>

                            View Payments

                        </h1>


                        <p className="accounts-view-payment-subtitle">

                            View and track all client payment transactions.

                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    className="accounts-view-payment-refresh-btn"
                    onClick={fetchPayments}
                    disabled={loading}
                >

                    <RefreshCw
                        size={17}
                        className={
                            loading
                                ? "accounts-view-payment-refresh-spin"
                                : ""
                        }
                    />

                    Refresh

                </button>

            </div>



            {/* ==================================================
                STATISTICS
            ================================================== */}

            <div className="accounts-view-payment-stats">


                {/* ==================================================
                    TOTAL RECEIVED
                ================================================== */}

                <div className="accounts-view-payment-stat-card">

                    <div className="accounts-view-payment-stat-icon">

                        <IndianRupee
                            size={22}
                        />

                    </div>


                    <div>

                        <span>
                            Total Received
                        </span>


                        <strong>

                            {formatCurrency(
                                totalReceived
                            )}

                        </strong>

                    </div>

                </div>



                {/* ==================================================
                    TRANSACTIONS
                ================================================== */}

                <div className="accounts-view-payment-stat-card">

                    <div className="accounts-view-payment-stat-icon">

                        <CreditCard
                            size={22}
                        />

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



                {/* ==================================================
                    CLIENTS PAID
                ================================================== */}

                <div className="accounts-view-payment-stat-card">

                    <div className="accounts-view-payment-stat-icon">

                        <Users
                            size={22}
                        />

                    </div>


                    <div>

                        <span>
                            Clients Paid
                        </span>


                        <strong>

                            {uniqueClients}

                        </strong>

                    </div>

                </div>



                {/* ==================================================
                    OUTSTANDING
                ================================================== */}

                <div className="accounts-view-payment-stat-card accounts-view-payment-stat-due">

                    <div className="accounts-view-payment-stat-icon">

                        <Receipt
                            size={22}
                        />

                    </div>


                    <div>

                        <span>
                            Outstanding
                        </span>


                        <strong>

                            {formatCurrency(
                                totalOutstanding
                            )}

                        </strong>

                    </div>

                </div>


            </div>



            {/* ==================================================
                MAIN CONTENT
            ================================================== */}

            <div className="accounts-view-payment-content">


                {/* ==================================================
                    TABLE HEADER
                ================================================== */}

                <div className="accounts-view-payment-table-top">


                    <div>

                        <h2>
                            Payment Transactions
                        </h2>


                        <p>
                            Complete payment history of all clients.
                        </p>

                    </div>



                    {/* ==================================================
                        SEARCH
                    ================================================== */}

                    <div className="accounts-view-payment-search">

                        <Search
                            size={18}
                        />


                        <input
                            type="text"
                            placeholder="Search client, service or payment method..."
                            value={searchTerm}
                            onChange={
                                (event) =>
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

                    <div className="accounts-view-payment-error">

                        <AlertCircle
                            size={20}
                        />


                        <span>

                            {error}

                        </span>


                        <button
                            type="button"
                            onClick={fetchPayments}
                        >

                            Try Again

                        </button>

                    </div>

                )}



                {/* ==================================================
                    LOADING
                ================================================== */}

                {loading ? (

                    <div className="accounts-view-payment-loading">

                        <RefreshCw
                            size={30}
                            className="accounts-view-payment-refresh-spin"
                        />


                        <p>

                            Loading payment transactions...

                        </p>

                    </div>

                ) : filteredPayments.length === 0 ? (


                    /* ==================================================
                       EMPTY STATE
                    ================================================== */

                    <div className="accounts-view-payment-empty">


                        <div className="accounts-view-payment-empty-icon">

                            <Receipt
                                size={30}
                            />

                        </div>


                        <h3>

                            No Payments Found

                        </h3>


                        <p>

                            {searchTerm
                                ? "No payment transactions match your search."
                                : "No payment transactions have been recorded yet."
                            }

                        </p>

                    </div>

                ) : (


                    /* ==================================================
                       PAYMENT TABLE
                    ================================================== */

                    <div className="accounts-view-payment-table-wrapper">


                        <table className="accounts-view-payment-table">


                            <thead>

                                <tr>

                                    <th>
                                        #
                                    </th>

                                    <th>
                                        Client
                                    </th>

                                    <th>
                                        Service
                                    </th>

                                    <th>
                                        Payment Date
                                    </th>

                                    <th>
                                        Total Amount
                                    </th>

                                    <th>
                                        Paid Amount
                                    </th>

                                    <th>
                                        Due Amount
                                    </th>

                                    <th>
                                        Payment Method
                                    </th>

                                    {/* <th>
                                        Action
                                    </th> */}

                                </tr>

                            </thead>


                            <tbody>


                                {filteredPayments.map(
                                    (
                                        {
                                            payment,
                                            client
                                        },
                                        index
                                    ) => {


                                        const paymentTotal =
                                            Number(
                                                payment?.totalAmount ??
                                                client?.finalAmount ??
                                                client?.totalAmount ??
                                                0
                                            );


                                        const paidAmount =
                                            Number(
                                                payment?.paidAmount ??
                                                0
                                            );


                                        const dueAmount =
                                            Number(
                                                payment?.dueAmount ??
                                                0
                                            );


                                        return (

                                            <tr
                                                key={
                                                    payment.id
                                                }
                                            >


                                                {/* ==================================================
                                                    INDEX
                                                ================================================== */}

                                                <td>

                                                    <span className="accounts-view-payment-index">

                                                        {index + 1}

                                                    </span>

                                                </td>



                                                {/* ==================================================
                                                    CLIENT
                                                ================================================== */}

                                                <td>

                                                    <div className="accounts-view-payment-client">


                                                        <div className="accounts-view-payment-avatar">

                                                            {client?.custName
                                                                ?.charAt(0)
                                                                ?.toUpperCase() ||
                                                                "C"}

                                                        </div>


                                                        <div>

                                                            <strong>

                                                                {client?.custName ||
                                                                    "Unknown Client"}

                                                            </strong>


                                                            <small>

                                                                Client ID: #
                                                                {client?.id ||
                                                                    "—"}

                                                            </small>

                                                        </div>

                                                    </div>

                                                </td>



                                                {/* ==================================================
                                                    SERVICE
                                                ================================================== */}

                                                <td>

                                                    <span className="accounts-view-payment-service">

                                                        {client?.service ||
                                                            "—"}

                                                    </span>

                                                </td>



                                                {/* ==================================================
                                                    PAYMENT DATE
                                                ================================================== */}

                                                <td>

                                                    <div className="accounts-view-payment-date">

                                                        <CalendarDays
                                                            size={15}
                                                        />


                                                        <span>

                                                            {formatDate(
                                                                payment?.paymentDate
                                                            )}

                                                        </span>

                                                    </div>

                                                </td>



                                                {/* ==================================================
                                                    TOTAL AMOUNT
                                                ================================================== */}

                                                <td>

                                                    <strong className="accounts-view-payment-total">

                                                        {formatCurrency(
                                                            paymentTotal
                                                        )}

                                                    </strong>

                                                </td>



                                                {/* ==================================================
                                                    PAID AMOUNT
                                                ================================================== */}

                                                <td>

                                                    <span className="accounts-view-payment-paid">

                                                        {formatCurrency(
                                                            paidAmount
                                                        )}

                                                    </span>

                                                </td>



                                                {/* ==================================================
                                                    DUE AMOUNT
                                                ================================================== */}

                                                <td>

                                                    <span
                                                        className={
                                                            dueAmount > 0
                                                                ? "accounts-view-payment-due"
                                                                : "accounts-view-payment-cleared"
                                                        }
                                                    >

                                                        {formatCurrency(
                                                            dueAmount
                                                        )}

                                                    </span>

                                                </td>



                                                {/* ==================================================
                                                    PAYMENT METHOD
                                                ================================================== */}

                                                <td>

                                                    <span className="accounts-view-payment-method">

                                                        {getPaymentMethod(
                                                            payment
                                                        )}

                                                    </span>

                                                </td>



                                                {/*
                                                <td>

                                                    <button
                                                        type="button"
                                                        className="accounts-view-payment-view-btn"
                                                        onClick={() =>
                                                            handleViewPayment(
                                                                payment,
                                                                client
                                                            )
                                                        }
                                                    >

                                                        <Eye
                                                            size={16}
                                                        />

                                                        View

                                                    </button>

                                                </td> */}


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


export default ViewPayment;