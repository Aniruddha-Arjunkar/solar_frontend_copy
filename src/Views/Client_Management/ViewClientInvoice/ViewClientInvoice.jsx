import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
    ArrowLeft,
    CalendarDays,
    FileText,
    Mail,
    MapPin,
    Phone,
    Printer,
    LoaderCircle,
    IndianRupee
} from "lucide-react";

import "./ViewClientInvoice.css";

function ViewClientInvoice() {

    // ============================================================
    // URL PARAMETER
    // ============================================================

    const { invoiceId } = useParams();

    const navigate = useNavigate();


    // ============================================================
    // STATE
    // ============================================================

    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ============================================================
    // FETCH INVOICE
    // ============================================================

    useEffect(() => {

        const fetchInvoice = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await fetch(
                    `http://localhost:8080/api/invoices/${invoiceId}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch invoice");
                }

                const data = await response.json();

                setInvoice(data);

            } catch (error) {

                console.error(
                    "Error fetching invoice:",
                    error
                );

                setError("Unable to load invoice.");

            } finally {

                setLoading(false);

            }
        };

        if (invoiceId) {
            fetchInvoice();
        }

    }, [invoiceId]);


    // ============================================================
    // VIEW PDF
    // ============================================================

    const handleViewPdf = () => {

        window.open(
            `http://localhost:8080/api/invoices/${invoiceId}/pdf`,
            "_blank",
            "noopener,noreferrer"
        );

    };


    // ============================================================
    // FORMAT CURRENCY
    // ============================================================

    const formatAmount = (amount) => {

        return Number(amount || 0).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    };


    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {

        return (
            <div className="view-client-invoice-page">

                <div className="invoice-page-loading">

                    <LoaderCircle
                        size={32}
                        className="invoice-page-loader"
                    />

                    <p>
                        Loading invoice...
                    </p>

                </div>

            </div>
        );

    }


    // ============================================================
    // ERROR
    // ============================================================

    if (error || !invoice) {

        return (
            <div className="view-client-invoice-page">

                <div className="invoice-page-error">

                    <FileText size={42} />

                    <h2>
                        Invoice Not Found
                    </h2>

                    <p>
                        {error || "The requested invoice could not be found."}
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>

                </div>

            </div>
        );

    }


    // ============================================================
    // MAIN UI
    // ============================================================

    return (
        <div className="view-client-invoice-page">

            {/* ====================================================
                PAGE HEADER
            ==================================================== */}

            <div className="view-invoice-page-header">

                <div>

                    <div className="view-invoice-breadcrumb">
                        Dashboard / Client / Invoice
                    </div>

                    <h1>
                        <FileText size={32} />
                        View Invoice
                    </h1>

                </div>

                <div className="view-invoice-header-actions">

                    <button
                        type="button"
                        className="invoice-back-button"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>

                    <button
                        type="button"
                        className="invoice-pdf-button"
                        onClick={handleViewPdf}
                    >
                        <Printer size={18} />
                        View PDF
                    </button>

                </div>

            </div>


            {/* ====================================================
                INVOICE CARD
            ==================================================== */}

            <div className="client-invoice-card">

                {/* =================================================
                    INVOICE TOP SECTION
                    ================================================= */}

                <div className="client-invoice-top">

                    <div className="invoice-title-block">

                        <div className="invoice-icon">
                            <FileText size={28} />
                        </div>

                        <div>

                            <h2>
                                TAX INVOICE
                            </h2>

                            <p>
                                Invoice #{invoice.gstInvoiceNo}
                            </p>

                        </div>

                    </div>


                    <div className="invoice-number-block">

                        <span>
                            GST Invoice No.
                        </span>

                        <strong>
                            {invoice.gstInvoiceNo}
                        </strong>

                    </div>

                </div>


                {/* =================================================
                    CUSTOMER + INVOICE INFORMATION
                    ================================================= */}

                <div className="invoice-information-grid">

                    {/* CUSTOMER INFORMATION */}

                    <div className="invoice-info-section">

                        <h3>
                            Customer Information
                        </h3>

                        <div className="invoice-info-item">

                            <Phone size={17} />

                            <div>
                                <span>Phone</span>
                                <strong>
                                    {invoice.custPhone || "-"}
                                </strong>
                            </div>

                        </div>

                        <div className="invoice-info-item">

                            <Mail size={17} />

                            <div>
                                <span>Email</span>
                                <strong>
                                    {invoice.custEmail || "-"}
                                </strong>
                            </div>

                        </div>

                        <div className="invoice-info-item">

                            <MapPin size={17} />

                            <div>
                                <span>Billing Address</span>
                                <strong>
                                    {invoice.billingAddress || "-"}
                                </strong>
                            </div>

                        </div>

                    </div>


                    {/* INVOICE INFORMATION */}

                    <div className="invoice-info-section">

                        <h3>
                            Invoice Information
                        </h3>

                        <div className="invoice-info-item">

                            <FileText size={17} />

                            <div>
                                <span>Invoice Number</span>
                                <strong>
                                    {invoice.gstInvoiceNo}
                                </strong>
                            </div>

                        </div>

                        <div className="invoice-info-item">

                            <CalendarDays size={17} />

                            <div>
                                <span>Invoice Date</span>
                                <strong>
                                    {invoice.invoiceDate || "-"}
                                </strong>
                            </div>

                        </div>

                        <div className="invoice-info-item">

                            <CalendarDays size={17} />

                            <div>
                                <span>Due Date</span>
                                <strong>
                                    {invoice.dueDate || "-"}
                                </strong>
                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    SHIPPING ADDRESS
                    ================================================= */}

                {invoice.shippingAddress && (

                    <div className="invoice-address-section">

                        <MapPin size={18} />

                        <div>

                            <span>
                                Shipping Address
                            </span>

                            <strong>
                                {invoice.shippingAddress}
                            </strong>

                        </div>

                    </div>

                )}


                {/* =================================================
                    ITEMS TABLE
                    ================================================= */}

                <div className="invoice-items-section">

                    <div className="invoice-section-title">

                        <h3>
                            Invoice Items
                        </h3>

                    </div>

                    <div className="invoice-items-table-wrapper">

                        <table className="invoice-items-table">

                            <thead>

                                <tr>

                                    <th>
                                        #
                                    </th>

                                    <th>
                                        Item / Service
                                    </th>

                                    <th>
                                        HSN
                                    </th>

                                    <th>
                                        Qty
                                    </th>

                                    <th>
                                        Rate
                                    </th>

                                    <th>
                                        CGST %
                                    </th>

                                    <th>
                                        SGST %
                                    </th>

                                    <th>
                                        Total
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {invoice.items?.map(
                                    (item, index) => (

                                        <tr key={item.id || index}>

                                            <td>
                                                {index + 1}
                                            </td>

                                            <td>
                                                <strong>
                                                    {item.itemName}
                                                </strong>
                                            </td>

                                            <td>
                                                {item.hsn || "-"}
                                            </td>

                                            <td>
                                                {item.qty}
                                            </td>

                                            <td>
                                                ₹{formatAmount(item.rate)}
                                            </td>

                                            <td>
                                                {item.cgstPer || 0}%
                                            </td>

                                            <td>
                                                {item.sgstPer || 0}%
                                            </td>

                                            <td>
                                                <strong>
                                                    ₹{formatAmount(item.itemTotal)}
                                                </strong>
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>


                {/* =================================================
                    TOTALS
                    ================================================= */}

                <div className="invoice-summary-container">

                    <div className="invoice-summary">

                        <div className="invoice-summary-row">

                            <span>
                                Subtotal
                            </span>

                            <strong>
                                ₹{formatAmount(invoice.subtotal)}
                            </strong>

                        </div>

                        <div className="invoice-summary-row">

                            <span>
                                CGST
                            </span>

                            <strong>
                                ₹{formatAmount(invoice.totalCgst)}
                            </strong>

                        </div>

                        <div className="invoice-summary-row">

                            <span>
                                SGST
                            </span>

                            <strong>
                                ₹{formatAmount(invoice.totalSgst)}
                            </strong>

                        </div>

                        <div className="invoice-summary-divider"></div>

                        <div className="invoice-grand-total">

                            <span>
                                Grand Total
                            </span>

                            <strong>
                                <IndianRupee size={20} />
                                {formatAmount(invoice.grandTotal)}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    NOTES
                    ================================================= */}

                {invoice.notes && (

                    <div className="invoice-notes">

                        <h3>
                            Notes
                        </h3>

                        <p>
                            {invoice.notes}
                        </p>

                    </div>

                )}


                {/* =================================================
                    FOOTER
                    ================================================= */}

                <div className="invoice-card-footer">

                    <span>
                        Invoice ID: {invoice.id}
                    </span>

                    <button
                        type="button"
                        onClick={handleViewPdf}
                    >
                        <FileText size={17} />
                        View Invoice PDF
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ViewClientInvoice;