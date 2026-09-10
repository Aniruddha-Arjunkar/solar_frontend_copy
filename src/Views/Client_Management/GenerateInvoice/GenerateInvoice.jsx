import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import {
    FileText,
    Plus,
    Trash2,
    ArrowLeft,
    Save,
    Eye,
    CheckCircle
} from "lucide-react";

import "./GenerateInvoice.css";


function GenerateInvoice() {

 

    const { clientId } = useParams();
    const navigate = useNavigate();


    const [client, setClient] = useState(null);
    const [loadingClient, setLoadingClient] = useState(true);
    const [error, setError] = useState(null);

    const [invoice, setInvoice] = useState({

        gstInvoiceNo: "",

        invoiceDate: new Date()
            .toISOString()
            .split("T")[0],

        dueDate: "",

        notes: "",

        items: [
            {
                itemName: "",
                hsn: "",
                qty: 1,
                rate: "",
                cgstPer: 9,
                sgstPer: 9
            }
        ]
    });



    const [saving, setSaving] = useState(false);

    const [createdInvoice, setCreatedInvoice] = useState(null);



    // FETCH CLIENT

    const fetchClient = async () => {

        try {

            setLoadingClient(true);

            setError(null);


            const response = await fetch(
                `http://localhost:8080/api/clients/${clientId}`
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to fetch client."
                );
            }


            const data = await response.json();


            console.log(
                "GST Client for Invoice:",
                data
            );


            // ====================================================
            // SAFETY CHECK
            // ====================================================

            if (!data.applyGst) {

                throw new Error(
                    "This client is not a GST client."
                );
            }


            setClient(data);


        } catch (error) {

            console.error(
                "Error fetching client:",
                error
            );

            setError(
                error.message ||
                "Unable to load client."
            );


        } finally {

            setLoadingClient(false);

        }
    };


    // ============================================================
    // LOAD CLIENT
    // ============================================================

    useEffect(() => {

        if (clientId) {

            fetchClient();

        }

    }, [clientId]);
    
    // ============================================================
// VIEW INVOICE PDF
// ============================================================

const handleViewPdf = () => {

    if (!createdInvoice?.id) {
        alert("Invoice ID not found.");
        return;
    }

    window.open(
        `http://localhost:8080/api/invoices/${createdInvoice.id}/pdf`,
        "_blank",
        "noopener,noreferrer"
    );
};

    // ============================================================
    // HANDLE INVOICE FIELD
    // ============================================================

    const handleInvoiceChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setInvoice((previous) => ({

            ...previous,

            [name]: value

        }));
    };


    // ============================================================
    // HANDLE ITEM CHANGE
    // ============================================================

    const handleItemChange = (
        index,
        event
    ) => {

        const {
            name,
            value
        } = event.target;


        setInvoice((previous) => {

            const updatedItems = [
                ...previous.items
            ];


            updatedItems[index] = {

                ...updatedItems[index],

                [name]: value

            };


            return {

                ...previous,

                items: updatedItems

            };
        });
    };


    // ============================================================
    // ADD ITEM
    // ============================================================

    const addItem = () => {

        setInvoice((previous) => ({

            ...previous,

            items: [

                ...previous.items,

                {
                    itemName: "",
                    hsn: "",
                    qty: 1,
                    rate: "",
                    cgstPer: 9,
                    sgstPer: 9
                }

            ]

        }));
    };


    // ============================================================
    // REMOVE ITEM
    // ============================================================

    const removeItem = (index) => {

        setInvoice((previous) => {

            if (previous.items.length === 1) {

                return previous;

            }


            return {

                ...previous,

                items:
                    previous.items.filter(
                        (_, itemIndex) =>
                            itemIndex !== index
                    )

            };

        });
    };


    // ============================================================
    // CALCULATE ITEM
    // ============================================================

    const calculateItem = (item) => {

        const qty =
            Number(item.qty) || 0;

        const rate =
            Number(item.rate) || 0;

        const cgstPer =
            Number(item.cgstPer) || 0;

        const sgstPer =
            Number(item.sgstPer) || 0;


        const baseAmount =
            qty * rate;


        const cgst =
            baseAmount *
            cgstPer /
            100;


        const sgst =
            baseAmount *
            sgstPer /
            100;


        const total =
            baseAmount +
            cgst +
            sgst;


        return {

            baseAmount,

            cgst,

            sgst,

            total

        };
    };


    // ============================================================
    // CALCULATE TOTALS
    // ============================================================

    const calculateTotals = () => {

        let subtotal = 0;

        let totalCgst = 0;

        let totalSgst = 0;


        invoice.items.forEach((item) => {

            const calculated =
                calculateItem(item);


            subtotal +=
                calculated.baseAmount;


            totalCgst +=
                calculated.cgst;


            totalSgst +=
                calculated.sgst;

        });


        return {

            subtotal,

            totalCgst,

            totalSgst,

            grandTotal:
                subtotal +
                totalCgst +
                totalSgst

        };
    };


    const totals =
        calculateTotals();


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
        ).format(amount || 0);

    };


    // ============================================================
    // CREATE INVOICE
    // ============================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!invoice.gstInvoiceNo.trim()) {
            alert(
                "Please enter GST Invoice Number."
            );
            return;
        }


        if (!invoice.dueDate) {

            alert(
                "Please select Due Date."
            );

            return;
        }


        for (const item of invoice.items) {

            if (!item.itemName.trim()) {

                alert(
                    "Please enter Item / Service name."
                );

                return;
            }


            if (
                !item.rate ||
                Number(item.rate) <= 0
            ) {

                alert(
                    "Please enter a valid rate."
                );

                return;
            }

        }


        // ========================================================
        // PREVENT DOUBLE SUBMIT
        // ========================================================

        if (saving) {

            return;

        }


        try {

            setSaving(true);


            // ====================================================
            // PREPARE REQUEST
            // ====================================================

            const requestBody = {

                gstInvoiceNo:
                    invoice.gstInvoiceNo,

                invoiceDate:
                    invoice.invoiceDate,

                dueDate:
                    invoice.dueDate,

                notes:
                    invoice.notes,

                items:
                    invoice.items.map((item) => ({

                        itemName:
                            item.itemName,

                        hsn:
                            item.hsn,

                        qty:
                            Number(item.qty) || 1,

                        rate:
                            Number(item.rate) || 0,

                        cgstPer:
                            Number(item.cgstPer) || 0,

                        sgstPer:
                            Number(item.sgstPer) || 0

                    }))

            };


            console.log(
                "Invoice Request:",
                requestBody
            );


            // ====================================================
            // CREATE INVOICE API
            // ====================================================

            const response = await fetch(

                `http://localhost:8080/api/invoices/client/${clientId}`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            requestBody
                        )

                }

            );


            // ====================================================
            // HANDLE ERROR
            // ====================================================

            if (!response.ok) {

                const errorText =
                    await response.text();


                throw new Error(
                    errorText ||
                    "Failed to create invoice."
                );

            }


            // ====================================================
            // GET CREATED INVOICE
            // ====================================================

            const createdInvoice =
                await response.json();


            console.log(
                "Created Invoice:",
                createdInvoice
            );


          
        // SHOW SUCCESS SCREEN

         setCreatedInvoice(createdInvoice);


        } catch (error) {

            console.error(
                "Invoice creation error:",
                error
            );


            alert(
                error.message ||
                "Unable to create invoice."
            );


        } finally {

            setSaving(false);

        }
    };

    // ============================================================
// SUCCESS SCREEN
// ============================================================

if (createdInvoice) {

    return (

        <section className="generate-invoice-page">

            <div className="invoice-success-card">

                <div className="invoice-success-icon">

                    <CheckCircle size={52} />

                </div>


                <h1>
                    Invoice Created Successfully
                </h1>


                <p>
                    Invoice{" "}
                    <strong>
                        {createdInvoice.gstInvoiceNo}
                    </strong>{" "}
                    has been created successfully.
                </p>


                <div className="invoice-success-details">

                    <div>
                        <span>Invoice ID</span>

                        <strong>
                            #{createdInvoice.id}
                        </strong>
                    </div>


                    <div>
                        <span>Customer</span>

                        <strong>
                            {createdInvoice.custName}
                        </strong>
                    </div>


                    <div>
                        <span>Grand Total</span>

                        <strong>
                            {formatCurrency(
                                Number(
                                    createdInvoice.grandTotal
                                ) || 0
                            )}
                        </strong>
                    </div>

                </div>


                <div className="invoice-success-actions">

                    <button
                        type="button"
                        className="invoice-view-pdf-btn"
                        onClick={handleViewPdf}
                    >

                        <Eye size={19} />

                        View Invoice PDF

                    </button>


                    <button
                        type="button"
                        className="invoice-success-back-btn"
                        onClick={() =>
                            navigate(
                                "/dashboard/gst-client"
                            )
                        }
                    >

                        <ArrowLeft size={18} />

                        Back to GST Clients

                    </button>

                </div>

            </div>

        </section>

    );
}
    // ============================================================
    // LOADING
    // ============================================================

    if (loadingClient) {

        return (

            <section className="generate-invoice-page">

                <div className="generate-invoice-loading">

                    Loading client information...

                </div>

            </section>

        );
    }


    // ============================================================
    // ERROR
    // ============================================================

    if (error) {

        return (

            <section className="generate-invoice-page">

                <div className="generate-invoice-error">

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/dashboard/gst-client"
                            )
                        }
                    >
                        <ArrowLeft size={18} />

                        Back to GST Clients

                    </button>

                </div>

            </section>

        );
    }


    // ============================================================
    // PAGE
    // ============================================================

    return (

        <section className="generate-invoice-page">


            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div className="generate-invoice-header">

                <div className="generate-invoice-heading">

                    <div className="generate-invoice-icon">

                        <FileText size={28} />

                    </div>

                    <div>

                        <p>
                            GST Clients / Generate Invoice
                        </p>

                        <h1>
                            Generate Invoice
                        </h1>

                    </div>

                </div>


                <button
                    type="button"
                    className="generate-invoice-back"
                    onClick={() =>
                        navigate(
                            "/dashboard/gst-client"
                        )
                    }
                >

                    <ArrowLeft size={18} />

                    Back

                </button>

            </div>


            <form
                className="generate-invoice-form"
                onSubmit={handleSubmit}
            >


                {/* ==================================================
                    CUSTOMER INFORMATION
                ================================================== */}

                <div className="invoice-section">

                    <div className="invoice-section-header">

                        <FileText size={20} />

                        <h2>
                            Customer Information
                        </h2>

                    </div>


                    <div className="invoice-customer-grid">

                        <div className="invoice-field">

                            <label>
                                Customer Name
                            </label>

                            <input
                                type="text"
                                value={
                                    client?.custName || ""
                                }
                                readOnly
                            />

                        </div>


                        <div className="invoice-field">

                            <label>
                                Phone
                            </label>

                            <input
                                type="text"
                                value={
                                    client?.custPhone || ""
                                }
                                readOnly
                            />

                        </div>


                        <div className="invoice-field">

                            <label>
                                Email
                            </label>

                            <input
                                type="text"
                                value={
                                    client?.custEmail || ""
                                }
                                readOnly
                            />

                        </div>


                        <div className="invoice-field">

                            <label>
                                Billing Address
                            </label>

                            <textarea
                                value={
                                    client?.billingAddress ||
                                    client?.custAddress ||
                                    ""
                                }
                                readOnly
                            />

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    INVOICE INFORMATION
                ================================================== */}

                <div className="invoice-section">

                    <div className="invoice-section-header">

                        <FileText size={20} />

                        <h2>
                            Invoice Information
                        </h2>

                    </div>


                    <div className="invoice-info-grid">

                        <div className="invoice-field">

                            <label>
                                GST Invoice No
                            </label>

                            <input
                                type="text"
                                name="gstInvoiceNo"
                                value={
                                    invoice.gstInvoiceNo
                                }
                                onChange={
                                    handleInvoiceChange
                                }
                                placeholder="GST-INV-004"
                            />

                        </div>


                        <div className="invoice-field">

                            <label>
                                Invoice Date
                            </label>

                            <input
                                type="date"
                                name="invoiceDate"
                                value={
                                    invoice.invoiceDate
                                }
                                onChange={
                                    handleInvoiceChange
                                }
                            />

                        </div>


                        <div className="invoice-field">

                            <label>
                                Due Date
                            </label>

                            <input
                                type="date"
                                name="dueDate"
                                value={
                                    invoice.dueDate
                                }
                                onChange={
                                    handleInvoiceChange
                                }
                            />

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    ITEMS
                ================================================== */}

                <div className="invoice-section">

                    <div className="invoice-section-header invoice-items-heading">

                        <div>

                            <h2>
                                Invoice Items
                            </h2>

                            <p>
                                Add services or products included in this invoice.
                            </p>

                        </div>


                        <button
                            type="button"
                            className="invoice-add-item-btn"
                            onClick={addItem}
                        >

                            <Plus size={18} />

                            Add Item

                        </button>

                    </div>


                    <div className="invoice-items-wrapper">

                        {invoice.items.map(
                            (item, index) => {

                                const calculated =
                                    calculateItem(item);


                                return (

                                    <div
                                        className="invoice-item-card"
                                        key={index}
                                    >

                                        <div className="invoice-item-number">

                                            Item {index + 1}

                                        </div>


                                        <div className="invoice-item-grid">


                                            <div className="invoice-field invoice-item-name">

                                                <label>
                                                    Item / Service
                                                </label>

                                                <input
                                                    type="text"
                                                    name="itemName"
                                                    value={
                                                        item.itemName
                                                    }
                                                    onChange={
                                                        (event) =>
                                                            handleItemChange(
                                                                index,
                                                                event
                                                            )
                                                    }
                                                    placeholder="Solar Panel Installation"
                                                />

                                            </div>


                                            <div className="invoice-field">

                                                <label>
                                                    HSN
                                                </label>

                                                <input
                                                    type="text"
                                                    name="hsn"
                                                    value={
                                                        item.hsn
                                                    }
                                                    onChange={
                                                        (event) =>
                                                            handleItemChange(
                                                                index,
                                                                event
                                                            )
                                                    }
                                                    placeholder="85414011"
                                                />

                                            </div>


                                            <div className="invoice-field">

                                                <label>
                                                    Quantity
                                                </label>

                                                <input
                                                    type="number"
                                                    name="qty"
                                                    min="1"
                                                    step="1"
                                                    value={
                                                        item.qty
                                                    }
                                                    onChange={
                                                        (event) =>
                                                            handleItemChange(
                                                                index,
                                                                event
                                                            )
                                                    }
                                                />

                                            </div>


                                            <div className="invoice-field">

                                                <label>
                                                    Rate
                                                </label>

                                                <input
                                                    type="number"
                                                    name="rate"
                                                    min="0"
                                                    step="0.01"
                                                    value={
                                                        item.rate
                                                    }
                                                    onChange={
                                                        (event) =>
                                                            handleItemChange(
                                                                index,
                                                                event
                                                            )
                                                    }
                                                    placeholder="100000"
                                                />

                                            </div>


                                            <div className="invoice-field">

                                                <label>
                                                    CGST %
                                                </label>

                                                <input
                                                    type="number"
                                                    name="cgstPer"
                                                    min="0"
                                                    step="0.01"
                                                    value={
                                                        item.cgstPer
                                                    }
                                                    onChange={
                                                        (event) =>
                                                            handleItemChange(
                                                                index,
                                                                event
                                                            )
                                                    }
                                                />

                                            </div>


                                            <div className="invoice-field">

                                                <label>
                                                    SGST %
                                                </label>

                                                <input
                                                    type="number"
                                                    name="sgstPer"
                                                    min="0"
                                                    step="0.01"
                                                    value={
                                                        item.sgstPer
                                                    }
                                                    onChange={
                                                        (event) =>
                                                            handleItemChange(
                                                                index,
                                                                event
                                                            )
                                                    }
                                                />

                                            </div>


                                            <div className="invoice-item-calculation">

                                                <span>
                                                    Item Total
                                                </span>

                                                <strong>
                                                    {
                                                        formatCurrency(
                                                            calculated.total
                                                        )
                                                    }
                                                </strong>

                                            </div>


                                            {invoice.items.length > 1 && (

                                                <button
                                                    type="button"
                                                    className="invoice-remove-item"
                                                    onClick={() =>
                                                        removeItem(
                                                            index
                                                        )
                                                    }
                                                >

                                                    <Trash2 size={18} />

                                                    Remove

                                                </button>

                                            )}

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                </div>


                {/* ==================================================
                    NOTES
                ================================================== */}

                <div className="invoice-section">

                    <div className="invoice-section-header">

                        <FileText size={20} />

                        <h2>
                            Notes
                        </h2>

                    </div>


                    <div className="invoice-field">

                        <textarea
                            name="notes"
                            value={
                                invoice.notes
                            }
                            onChange={
                                handleInvoiceChange
                            }
                            placeholder="Enter invoice notes..."
                            rows="4"
                        />

                    </div>

                </div>


                {/* ==================================================
                    TOTAL SUMMARY
                ================================================== */}

                <div className="invoice-total-section">

                    <div className="invoice-total-row">

                        <span>
                            Subtotal
                        </span>

                        <strong>
                            {
                                formatCurrency(
                                    totals.subtotal
                                )
                            }
                        </strong>

                    </div>


                    <div className="invoice-total-row">

                        <span>
                            Total CGST
                        </span>

                        <strong>
                            {
                                formatCurrency(
                                    totals.totalCgst
                                )
                            }
                        </strong>
                    </div>

                    <div className="invoice-total-row">
                        <span>
                            Total SGST
                        </span>

                        <strong>
                            {
                                formatCurrency(
                                    totals.totalSgst
                                )
                            }
                        </strong>
                    </div>


                    <div className="invoice-grand-total">
                        <span>
                            Grand Total
                        </span>
                        <strong>
                            {
                                formatCurrency(
                                    totals.grandTotal
                                )
                            }
                        </strong>
                    </div>
                </div>


                {/* ==================================================
                    FORM ACTIONS
                ================================================== */}

                <div className="invoice-form-actions">

                    <button
                        type="button"
                        className="invoice-cancel-btn"
                        onClick={() =>
                            navigate(
                                "/dashboard/gst-client"
                            )
                        }>
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="invoice-save-btn"
                        disabled={saving}>

                        <Save size={18} />

                        {saving
                            ? "Creating Invoice..."
                            : "Create Invoice"
                        }
                    </button>
                </div>
            </form>
        </section>
    );
}
export default GenerateInvoice;