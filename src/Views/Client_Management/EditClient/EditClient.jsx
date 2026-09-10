import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import {
    UserRoundPlus,
    ArrowLeft,
    Save
} from "lucide-react";

import "./EditClient.css";




function EditClient() {


    const { clientId } = useParams();

    const navigate = useNavigate();

    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    
    const [formData, setFormData] = useState({

        // Customer Information
        custName: "",
        custPhone: "",
        custEmail: "",
        custAddress: "",

        // Service Information
        service: "",
        serviceTermCondition: "",
        totalAmount: "",
        warranty: "",
        serviceCovered: "",
        serviceDate: "",

        // GST Information
        applyGst: false,
        gstType: "exclusive",
        gstInvoiceNo: "",

        // Address Information
        billingAddress: "",
        shippingAddress: "",

        // Additional Information
        documents: "",
        consumerNo: "",
        subdivision: "",
        technicalName: ""

    });


    // =====================================================
    // GST VALUES
    // =====================================================

    const [gstAmount, setGstAmount] = useState(0);

    const [finalAmount, setFinalAmount] = useState(0);


    // =====================================================
    // FETCH CLIENT
    // =====================================================

    useEffect(() => {

        const fetchClient = async () => {

            try {

                setLoading(true);

                const response = await fetch(
                    `http://localhost:8080/api/clients/${clientId}`
                );

                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch client information."
                    );

                }

                const data = await response.json();

                console.log(
                    "Edit Client Data:",
                    data
                );


                setClient(data);


                // =================================================
                // FILL FORM WITH EXISTING CLIENT DATA
                // =================================================

                setFormData({

                    // Customer Information

                    custName:
                        data.custName || "",

                    custPhone:
                        data.custPhone || "",

                    custEmail:
                        data.custEmail || "",

                    custAddress:
                        data.custAddress || "",


                    // Service Information

                    service:
                        data.service || "",

                    serviceTermCondition:
                        data.serviceTermCondition || "",

                    totalAmount:
                        data.totalAmount ?? "",

                    warranty:
                        data.warranty || "",

                    serviceCovered:
                        data.serviceCovered || "",

                    serviceDate:
                        data.serviceDate || "",


                    // GST Information

                    applyGst:
                        Boolean(data.applyGst),

                    gstType:
                        data.gstType || "exclusive",

                    gstInvoiceNo:
                        data.gstInvoiceNo || "",


                    // Address Information

                    billingAddress:
                        data.billingAddress || "",

                    shippingAddress:
                        data.shippingAddress || "",


                    // Additional Information

                    documents:
                        data.documents || "",

                    consumerNo:
                        data.consumerNo || "",

                    subdivision:
                        data.subdivision || "",

                    technicalName:
                        data.technicalName || ""

                });


            } catch (error) {

                console.error(
                    "Fetch Client Error:",
                    error
                );

                window.alert(
                    "Unable to load client information."
                );

            } finally {

                setLoading(false);

            }

        };


        if (clientId) {

            fetchClient();

        }

    }, [clientId]);


    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value,
            type,
            checked
        } = event.target;


        setFormData((previous) => ({

            ...previous,

            [name]:
                type === "checkbox"
                    ? checked
                    : value

        }));

    };


    // =====================================================
    // GST CALCULATION
    // =====================================================

    useEffect(() => {

        const amount =
            Number(formData.totalAmount) || 0;


        if (formData.applyGst) {

            const gst =
                amount * 0.18;


            setGstAmount(gst);


            setFinalAmount(
                amount + gst
            );

        } else {

            setGstAmount(0);

            setFinalAmount(amount);

        }

    }, [
        formData.totalAmount,
        formData.applyGst
    ]);


    // =====================================================
    // FORMAT CURRENCY
    // =====================================================

    const formatAmount = (amount) => {

        return Number(amount || 0).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    };


    // =====================================================
    // UPDATE CLIENT
    // =====================================================

    const handleUpdateClient = async (event) => {

        event.preventDefault();


        // =================================================
        // BASIC VALIDATION
        // =================================================

        if (!formData.custName.trim()) {

            window.alert(
                "Please enter customer name."
            );

            return;
        }


        if (!formData.custPhone.trim()) {

            window.alert(
                "Please enter customer contact."
            );

            return;
        }


        if (!formData.totalAmount) {

            window.alert(
                "Please enter the total amount."
            );

            return;
        }


        try {

            setSaving(true);


            // =================================================
            // REQUEST BODY
            // =================================================

            const clientData = {

                // Customer Information

                custName:
                    formData.custName,

                custPhone:
                    formData.custPhone,

                custEmail:
                    formData.custEmail,

                custAddress:
                    formData.custAddress,


                // Service Information

                service:
                    formData.service,

                serviceTermCondition:
                    formData.serviceTermCondition,

                totalAmount:
                    Number(formData.totalAmount),

                warranty:
                    formData.warranty,

                serviceCovered:
                    formData.serviceCovered,

                serviceDate:
                    formData.serviceDate || null,


                // GST Information

                applyGst:
                    formData.applyGst,

                gstType:
                    formData.gstType,

                gstInvoiceNo:
                    formData.gstInvoiceNo,


                // Address Information

                billingAddress:
                    formData.billingAddress,

                shippingAddress:
                    formData.shippingAddress,


                // Additional Information

                documents:
                    formData.documents,

                consumerNo:
                    formData.consumerNo,

                subdivision:
                    formData.subdivision,

                technicalName:
                    formData.technicalName

            };


            console.log(
                "Updating Client:",
                clientData
            );


            // =================================================
            // PUT REQUEST
            // =================================================

            const response = await fetch(
                `http://localhost:8080/api/clients/${clientId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(clientData)

                }
            );


            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Failed to update client."
                );

            }


            const updatedClient =
                await response.json();


            console.log(
                "Client Updated:",
                updatedClient
            );


            // =================================================
            // SUCCESS
            // =================================================

            window.alert(
                "Client updated successfully."
            );


            // =================================================
            // REDIRECT
            // =================================================

            navigate(
                "/dashboard/view-client"
            );


        } catch (error) {

            console.error(
                "Update Client Error:",
                error
            );

            window.alert(
                "Failed to update client. Please try again."
            );

        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <section className="edit-client-page">

                <div className="edit-client-loading">

                    Loading client information...

                </div>

            </section>

        );

    }


    // =====================================================
    // CLIENT NOT FOUND
    // =====================================================

    if (!client) {

        return (

            <section className="edit-client-page">

                <div className="edit-client-error">

                    <h2>
                        Client not found
                    </h2>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(-1)
                        }
                    >
                        Go Back
                    </button>

                </div>

            </section>

        );

    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <section className="edit-client-page">


            {/* =================================================
               PAGE HEADER
            ================================================= */}

            <div className="edit-client-page-header">

                <div className="edit-client-page-heading">

                    <p>
                        Dashboard / Client Management / Edit Client
                    </p>

                    <h1>

                        <UserRoundPlus size={40} />

                        Edit Client

                    </h1>

                    <span>
                        Update complete customer,
                        service and billing information.
                    </span>

                </div>


                <button
                    type="button"
                    className="edit-client-back-btn"
                    onClick={() =>
                        navigate(-1)
                    }
                >

                    <ArrowLeft size={18} />

                    Back

                </button>

            </div>



            {/* =================================================
               FORM
            ================================================= */}

            <form
                className="edit-client-form"
                onSubmit={handleUpdateClient}
            >


                {/* =================================================
                   CUSTOMER INFORMATION
                ================================================= */}

                <div className="edit-client-card">

                    <div className="edit-client-card-header">

                        <h2>
                            Customer Information
                        </h2>

                        <p>
                            Update the customer's basic information.
                        </p>

                    </div>


                    <div className="edit-client-grid">


                        <div className="edit-client-form-group">

                            <label>
                                Customer Name
                            </label>

                            <input
                                type="text"
                                name="custName"
                                value={formData.custName}
                                onChange={handleChange}
                                placeholder="Enter customer name"
                                required
                            />

                        </div>


                        <div className="edit-client-form-group">

                            <label>
                                Contact
                            </label>

                            <input
                                type="text"
                                name="custPhone"
                                value={formData.custPhone}
                                onChange={handleChange}
                                placeholder="Enter contact number"
                                required
                            />

                        </div>


                        <div className="edit-client-form-group">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                name="custEmail"
                                value={formData.custEmail}
                                onChange={handleChange}
                                placeholder="Enter email address"
                            />

                        </div>


                        <div className="edit-client-form-group">

                            <label>
                                Address
                            </label>

                            <input
                                type="text"
                                name="custAddress"
                                value={formData.custAddress}
                                onChange={handleChange}
                                placeholder="Enter customer address"
                            />

                        </div>


                    </div>

                </div>



                {/* =================================================
                   SERVICE INFORMATION
                ================================================= */}

                <div className="edit-client-card">

                    <div className="edit-client-card-header">

                        <h2>
                            Service Information
                        </h2>

                        <p>
                            Update the service details for this client.
                        </p>

                    </div>


                    <div className="edit-client-grid">


                        <div className="edit-client-form-group">

                            <label>
                                Service
                            </label>

                            <input
                                type="text"
                                name="service"
                                value={formData.service}
                                onChange={handleChange}
                                placeholder="Enter service"
                                required
                            />

                        </div>


                        <div className="edit-client-form-group">

                            <label>
                                Service Date
                            </label>

                            <input
                                type="date"
                                name="serviceDate"
                                value={formData.serviceDate}
                                onChange={handleChange}
                            />

                        </div>


                        <div className="edit-client-form-group edit-client-form-group-full">

                            <label>
                                Service Terms & Conditions
                            </label>

                            <textarea
                                name="serviceTermCondition"
                                value={
                                    formData.serviceTermCondition
                                }
                                onChange={handleChange}
                                placeholder="Enter service terms and conditions"
                                rows="3"
                            />

                        </div>


                        <div className="edit-client-form-group edit-client-form-group-full">

                            <label>
                                Service Covered
                            </label>

                            <textarea
                                name="serviceCovered"
                                value={formData.serviceCovered}
                                onChange={handleChange}
                                placeholder="Enter services covered"
                                rows="3"
                            />

                        </div>


                        <div className="edit-client-form-group">

                            <label>
                                Warranty
                            </label>

                            <input
                                type="text"
                                name="warranty"
                                value={formData.warranty}
                                onChange={handleChange}
                                placeholder="Example: 5 Years"
                            />

                        </div>


                    </div>

                </div>



                {/* =================================================
                   PAYMENT INFORMATION
                ================================================= */}

                <div className="edit-client-card">

                    <div className="edit-client-card-header">

                        <h2>
                            Payment Information
                        </h2>

                        <p>
                            Update the base service amount and GST.
                        </p>

                    </div>


                    <div className="edit-client-grid">


                        <div className="edit-client-form-group">

                            <label>
                                Total Amount
                            </label>

                            <input
                                type="number"
                                name="totalAmount"
                                value={formData.totalAmount}
                                onChange={handleChange}
                                placeholder="Enter amount"
                                min="0"
                                step="0.01"
                                required
                            />

                        </div>



                        {/* GST TOGGLE */}

                        <div className="edit-client-form-group">

                            <label>
                                Apply GST 18%
                            </label>

                            <label className="edit-client-gst-toggle">

                                <input
                                    type="checkbox"
                                    name="applyGst"
                                    checked={formData.applyGst}
                                    onChange={handleChange}
                                />

                                <span className="edit-client-gst-slider">
                                </span>

                                <span className="edit-client-gst-text">

                                    {formData.applyGst
                                        ? "GST Applied"
                                        : "GST Not Applied"}

                                </span>

                            </label>

                        </div>



                        {formData.applyGst && (

                            <div className="edit-client-form-group">

                                <label>
                                    GST Type
                                </label>

                                <select
                                    name="gstType"
                                    value={formData.gstType}
                                    onChange={handleChange}
                                >

                                    <option value="exclusive">
                                        Exclusive
                                    </option>

                                    <option value="inclusive">
                                        Inclusive
                                    </option>

                                </select>

                            </div>

                        )}



                        {formData.applyGst && (

                            <div className="edit-client-form-group">

                                <label>
                                    GST Invoice Number
                                </label>

                                <input
                                    type="text"
                                    name="gstInvoiceNo"
                                    value={formData.gstInvoiceNo}
                                    onChange={handleChange}
                                    placeholder="Enter GST invoice number"
                                />

                            </div>

                        )}

                    </div>



                    {/* =================================================
                       AMOUNT SUMMARY
                    ================================================= */}

                    <div className="edit-client-amount-summary">

                        <div>

                            <span>
                                Base Amount
                            </span>

                            <strong>
                                ₹ {formatAmount(formData.totalAmount)}
                            </strong>

                        </div>


                        <div>

                            <span>
                                GST (18%)
                            </span>

                            <strong>
                                ₹ {formatAmount(gstAmount)}
                            </strong>

                        </div>


                        <div className="edit-client-final-amount">

                            <span>
                                Final Amount
                            </span>

                            <strong>
                                ₹ {formatAmount(finalAmount)}
                            </strong>

                        </div>

                    </div>

                </div>



                {/* =================================================
                   BILLING & CUSTOMER DETAILS
                ================================================= */}

                <div className="edit-client-card">

                    <div className="edit-client-card-header">

                        <h2>
                            Billing & Customer Details
                        </h2>

                        <p>
                            Update billing and additional client information.
                        </p>

                    </div>


                    <div className="edit-client-grid">


                        <div className="edit-client-form-group edit-client-form-group-full">

                            <label>
                                Billing Address
                            </label>

                            <textarea
                                name="billingAddress"
                                value={formData.billingAddress}
                                onChange={handleChange}
                                placeholder="Enter billing address"
                                rows="3"
                            />

                        </div>


                        <div className="edit-client-form-group edit-client-form-group-full">

                            <label>
                                Shipping Address
                            </label>

                            <textarea
                                name="shippingAddress"
                                value={formData.shippingAddress}
                                onChange={handleChange}
                                placeholder="Enter shipping address"
                                rows="3"
                            />

                        </div>


                        <div className="edit-client-form-group">

                            <label>
                               Required Documents
                            </label>

                            <input
                                type="text"
                                name="documents"
                                value={formData.documents}
                                onChange={handleChange}
                                placeholder="Example: Aadhar, PAN"
                            />

                        </div>


                        <div className="edit-client-form-group">

                            <label>
                                Consumer Number
                            </label>

                            <input
                                type="text"
                                name="consumerNo"
                                value={formData.consumerNo}
                                onChange={handleChange}
                                placeholder="Enter consumer number"
                            />

                        </div>


                        <div className="edit-client-form-group">

                            <label>
                                Subdivision
                            </label>

                            <input
                                type="text"
                                name="subdivision"
                                value={formData.subdivision}
                                onChange={handleChange}
                                placeholder="Enter subdivision"
                            />

                        </div>


                        <div className="edit-client-form-group">

                            <label>
                                Technical Name
                            </label>

                            <input
                                type="text"
                                name="technicalName"
                                value={formData.technicalName}
                                onChange={handleChange}
                                placeholder="Enter technical person name"
                            />

                        </div>


                    </div>

                </div>



                {/* =================================================
                   FOOTER
                ================================================= */}

                <div className="edit-client-footer">

                    <button
                        type="button"
                        className="edit-client-cancel-btn"
                        onClick={() =>
                            navigate(-1)
                        }
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        className="edit-client-save-btn"
                        disabled={saving}
                    >

                        <Save size={18} />

                        {saving
                            ? "Updating..."
                            : "Update Client"}

                    </button>

                </div>


            </form>

        </section>

    );

}


export default EditClient;