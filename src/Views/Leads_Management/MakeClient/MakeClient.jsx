import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import {
    UserRoundPlus,
    ArrowLeft,
    Save
} from "lucide-react";

import "./MakeClient.css";



function MakeClient() {

    //====================================================
    // ROUTER
    //====================================================

    const { leadId } = useParams();
    const navigate = useNavigate();



    //====================================================
    // LEAD DATA
    //====================================================

    const [lead, setLead] = useState(null);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);



    //====================================================
    // CLIENT FORM DATA
    //====================================================

    const [formData, setFormData] = useState({

        service: "",
        serviceTermCondition: "",
        totalAmount: "",
        warranty: "",
        serviceCovered: "",
        serviceDate: "",

        applyGst: false,
        gstType: "exclusive",
        gstInvoiceNo: "",

        billingAddress: "",
        shippingAddress: "",

        documents: "",
        consumerNo: "",
        subdivision: "",
        technicalName: ""

    });



    //====================================================
    // GST VALUES
    //====================================================

    const [gstAmount, setGstAmount] = useState(0);

    const [finalAmount, setFinalAmount] = useState(0);



    //====================================================
    // FETCH LEAD
    //====================================================

    useEffect(() => {

        const fetchLead = async () => {

            try {

                setLoading(true);

                const response = await fetch(
                    `http://localhost:8080/api/leads/${leadId}`
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch lead information."
                    );
                }

                const data = await response.json();

                console.log(
                    "Make Client Lead:",
                    data
                );
                
                setLead(data);

                // AUTO-FILL FORM FROM LEAD
                setFormData((previous) => ({

                    ...previous,

                    service:
                        data.serviceType || "",

                    serviceCovered:
                        data.serviceRequirement || "",

                    serviceDate:
                        data.scheduleDate || "",

                    billingAddress:
                        data.address || "",

                    shippingAddress:
                        data.address || ""

                }));

            } catch (error) {

                console.error(
                    "Fetch Lead Error:",
                    error
                );

                window.alert(
                    "Unable to load lead information."
                );

            } finally {

                setLoading(false);
            }
        };

        if (leadId) {
            fetchLead();
        }
    }, [leadId]);


    // HANDLE INPUT CHANGE
    const handleChange = (event) => {

        const { name, value, type, checked } =
            event.target;

        setFormData((previous) => ({

            ...previous,

            [name]:
                type === "checkbox"
                    ? checked
                    : value

        }));
    };

    // GST CALCULATION
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


    //====================================================
    // FORMAT CURRENCY
    //====================================================

    const formatAmount = (amount) => {

        return Number(amount || 0).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
    };

    //====================================================
    // SAVE CLIENT
    //====================================================

    const handleSaveClient = async (event) => {

        event.preventDefault();

        //================================================
        // BASIC VALIDATION
        //================================================

        if (!formData.totalAmount) {

            window.alert(
                "Please enter the total amount."
            );
            return;
        }

        try {
            setSaving(true);

            //================================================
            // REQUEST BODY
            //
            // Lead information does NOT need to be sent
            // because backend already knows the Lead ID.
            //================================================

            const clientData = {

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

                applyGst:
                    formData.applyGst,

                gstType:
                    formData.gstType,

                gstInvoiceNo:
                    formData.gstInvoiceNo,

                billingAddress:
                    formData.billingAddress,

                shippingAddress:
                    formData.shippingAddress,

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
                "Convert Lead To Client:",
                clientData
            );

            //================================================
            // Convert Lead -> Client Very Imp
            //================================================

            const response = await fetch(
                `http://localhost:8080/api/clients/convert-from-lead/${leadId}`,
                {
                    method: "POST",
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
                    "Failed to create client."
                );
            }

            const savedClient =
                await response.json();

            console.log(
                "Client Created:",
                savedClient
            );

            // SUCCESS
            window.alert(
                "Client created successfully."
            );

            //================================================
            // REDIRECT
            //
            // GST Client → GST Client page
            // Non GST → View Client page
            //================================================
            if (savedClient.applyGst) {
                navigate(
                    "/dashboard/gst-client"
                );
            } else {
                navigate(
                    "/dashboard/view-client"
                );
            }
        } catch (error) {

            console.error(
                "Save Client Error:",
                error
            );

            window.alert(
                "Failed to create client. Please try again."
            );

        } finally {
            setSaving(false);
        }
    };

    // LOADING
    if (loading) {
        return (
            <section className="make-client">
                <div className="make-client-loading">
                    Loading lead information...
                </div>
            </section>
        );
    }

    // LEAD NOT FOUND
    if (!lead) {
        return (
            <section className="make-client">
                <div className="make-client-error">
                    <h2>
                        Lead not found
                    </h2>
                    <button
                        type="button"
                        onClick={() =>
                            navigate(-1)
                        }>
                        Go Back
                    </button>
                </div>
            </section>
        );
    }

    return (

        <section className="make-client">

            {/*========== PAGE HEADER ============*/}

            <div className="make-client-header">

                <div className="make-client-heading">
                    <p>
                        Dashboard / Schedule / Make Client
                    </p>
                    <h1>
                        <UserRoundPlus size={40} />
                        Make Client
                    </h1>
                    <span>
                        Complete customer information
                        and convert the scheduled lead
                        into a client.
                    </span>
                </div>

                <button
                    type="button"
                    className="make-client-back-btn"
                    onClick={() =>
                        navigate(-1)
                    }>
                    <ArrowLeft size={18} />
                    Back
                </button>
            </div>


            {/*====== FORM ===========*/}
            <form
                className="make-client-form"
                onSubmit={handleSaveClient}>

                {/*========== CUSTOMER INFORMATION ===============*/}
                <div className="make-client-card">
                    <div className="make-client-card-header">
                        <h2>
                            Customer Information
                        </h2>
                        <p>
                            Information fetched from
                            the scheduled lead.
                        </p>
                    </div>

                    <div className="make-client-grid">

                        <div className="form-group">
                            <label>
                                Customer Name
                            </label>
                            <input
                                type="text"
                                value={lead.name || ""}
                                readOnly
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Contact
                            </label>
                            <input
                                type="text"
                                value={lead.contact || ""}
                                readOnly
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Email
                            </label>
                            <input
                                type="email"
                                value={lead.email || ""}
                                readOnly
                            />
                        </div>


                        <div className="form-group">
                            <label>
                                Address
                            </label>
                            <input
                                type="text"
                                value={lead.address || ""}
                                readOnly
                            />
                        </div>

                        <div className="form-group form-group-full">
                            <label>
                                Lead Message
                            </label>
                            <textarea
                                value={lead.message || ""}
                                readOnly
                                rows="3"
                            />
                        </div>
                    </div>
                </div>

                {/*======= SERVICE INFORMATION ==============*/}

                <div className="make-client-card">

                    <div className="make-client-card-header">
                        <h2>
                            Service Information
                        </h2>
                        <p>
                            Complete the service details
                            for this client.
                        </p>
                    </div>

                    <div className="make-client-grid">

                        <div className="form-group">
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

                        <div className="form-group">
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

                        <div className="form-group form-group-full">
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


                        <div className="form-group form-group-full">
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

                        <div className="form-group">
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

                {/*================================================
                    PAYMENT INFORMATION
                =================================================*/}

                <div className="make-client-card">

                    <div className="make-client-card-header">

                        <h2>
                            Payment Information
                        </h2>

                        <p>
                            Enter the base service amount.
                        </p>
                    </div>


                    <div className="make-client-grid">

                        <div className="form-group">

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

                        {/*============= GST TOGGLE  ===============*/}

                        <div className="form-group">
                            <label>
                                Apply GST 18%
                            </label>
                            <label className="gst-toggle">
                                <input
                                    type="checkbox"
                                    name="applyGst"
                                    checked={formData.applyGst}
                                    onChange={handleChange}
                                />

                                <span className="gst-toggle-slider"></span>
                                <span className="gst-toggle-text">
                                    {formData.applyGst
                                        ? "GST Applied"
                                        : "GST Not Applied"}

                                </span>
                            </label>
                        </div>

                        {formData.applyGst && (

                            <div className="form-group">
                                <label>
                                    GST Type
                                </label>

                                <select
                                    name="gstType"
                                    value={formData.gstType}
                                    onChange={handleChange} >
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

                            <div className="form-group">

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


                    {/*============ AMOUNT SUMMARY ===============*/}

                    <div className="amount-summary">

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


                        <div className="final-amount">
                            <span>
                                Final Amount
                            </span>

                            <strong>
                                ₹ {formatAmount(finalAmount)}
                            </strong>
                      </div>
                    </div>
                </div>


                {/*=========== GST / BILLING INFORMATION ===============*/}

                <div className="make-client-card">

                    <div className="make-client-card-header">
                        <h2>
                            Billing & Customer Details
                        </h2>
                        <p>
                            Additional information for
                            client records.
                        </p>
                    </div>


                    <div className="make-client-grid">


                        <div className="form-group form-group-full">
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

                        <div className="form-group form-group-full">

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


                        <div className="form-group">
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

                        <div className="form-group">

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

                        <div className="form-group">

                            <label>
                                Subdivision
                            </label>
                            <input
                                type="text"
                                name="subdivision"
                                value={formData.subdivision}
                                onChange={handleChange}
                                placeholder="Enter subdivision"/>
                        </div>


                        <div className="form-group">

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


                {/*=========== SAVE BUTTON ==================*/}

                <div className="make-client-footer">

                    <button
                        type="button"
                        className="make-client-cancel-btn"
                        onClick={() =>
                            navigate(-1)
                        }>
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="make-client-save-btn"
                        disabled={saving}>
                        <Save size={18} />
                        {saving
                            ? "Saving..."
                            : "Save Client"}
                    </button>

                </div>
            </form>
        </section>
    );
}
export default MakeClient;