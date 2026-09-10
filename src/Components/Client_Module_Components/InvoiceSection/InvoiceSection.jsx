import { useEffect, useState } from "react";
import { Eye, FileText, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router";

import "./InvoiceSection.css";

function InvoiceSection({ clientId }) {

    // ============================================================
    // STATE
    // ============================================================

    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    // ============================================================
    // FETCH CLIENT INVOICES
    // ============================================================

    useEffect(() => {

        if (!clientId) {
            setLoading(false);
            return;
        }

        const fetchInvoices = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await fetch(
                    `http://localhost:8080/api/invoices/client/${clientId}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch invoices");
                }

                const data = await response.json();

                setInvoices(data);

            } catch (error) {

                console.error("Error fetching invoices:", error);

                setError("Unable to load invoices.");

            } finally {

                setLoading(false);

            }
        };

        fetchInvoices();

    }, [clientId]);


    // ============================================================
    // VIEW INVOICE
    // ============================================================

    const handleViewInvoice = (invoiceId) => {

        navigate(`/dashboard/view-client-invoice/${invoiceId}`);

    };


    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <section className="invoice-section">

                <div className="invoice-section-header">
                    <div>
                        <h3>
                            <FileText size={22} />
                            Invoice History
                        </h3>

                        <p>
                            Invoices generated for this client
                        </p>
                    </div>
                </div>

                <div className="invoice-loading">
                    <LoaderCircle size={24} className="invoice-loader" />
                    <span>Loading invoices...</span>
                </div>

            </section>
        );
    }


    // ============================================================
    // ERROR
    // ============================================================

    if (error) {
        return (
            <section className="invoice-section">

                <div className="invoice-section-header">
                    <div>
                        <h3>
                            <FileText size={22} />
                            Invoice History
                        </h3>
                    </div>
                </div>

                <div className="invoice-error">
                    {error}
                </div>

            </section>
        );
    }


    // ============================================================
    // MAIN UI
    // ============================================================

    return (
        <section className="invoice-section">

            {/* ====================================================
                HEADER
            ==================================================== */}

            <div className="invoice-section-header">

                <div>

                    <h3>
                        <FileText size={22} />
                        Invoice History
                    </h3>

                    <p>
                        Invoices generated for this client
                    </p>

                </div>

                <span className="invoice-count">
                    {invoices.length} Invoice
                    {invoices.length !== 1 ? "s" : ""}
                </span>

            </div>


            {/* ====================================================
                EMPTY STATE
            ==================================================== */}

            {invoices.length === 0 ? (

                <div className="invoice-empty">

                    <FileText size={40} />

                    <h4>No invoices found</h4>

                    <p>
                        No invoice has been generated for this client yet.
                    </p>

                </div>

            ) : (

                /* =================================================
                   INVOICE TABLE
                   ================================================= */

                <div className="invoice-table-wrapper">

                    <table className="invoice-table">

                        <thead>

                            <tr>

                                <th>ID</th>

                                <th>Invoice No.</th>

                                <th>Invoice Date</th>

                                <th>Due Date</th>

                                <th>Subtotal</th>

                                <th>GST</th>

                                <th>Grand Total</th>

                                <th>Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {invoices.map((invoice) => (

                                <tr key={invoice.id}>

                                    <td>
                                        {invoice.id}
                                    </td>

                                    <td>
                                        <span className="invoice-number">
                                            {invoice.gstInvoiceNo}
                                        </span>
                                    </td>

                                    <td>
                                        {invoice.invoiceDate}
                                    </td>

                                    <td>
                                        {invoice.dueDate}
                                    </td>

                                    <td>
                                        ₹{Number(invoice.subtotal || 0).toLocaleString("en-IN")}
                                    </td>

                                    <td>
                                        ₹{(
                                            Number(invoice.totalCgst || 0) +
                                            Number(invoice.totalSgst || 0)
                                        ).toLocaleString("en-IN")}
                                    </td>

                                    <td>
                                        <strong>
                                            ₹{Number(invoice.grandTotal || 0).toLocaleString("en-IN")}
                                        </strong>
                                    </td>

                                    <td>

                                        <button
                                            type="button"
                                            className="invoice-view-button"
                                            onClick={() =>
                                                handleViewInvoice(invoice.id)
                                            }
                                        >
                                            <Eye size={17} />
                                            View Invoice
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </section>
    );
}

export default InvoiceSection;