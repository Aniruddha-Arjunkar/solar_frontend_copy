import { useNavigate } from "react-router";
import {
    X,
    UserRound,
    Phone,
    Mail,
    MapPin,
    Wrench,
    CalendarDays,
    IndianRupee,
    FileText,
    ShieldCheck,
    ClipboardList,
    MapPinned,
    UserCog,
    BriefcaseBusiness,
    Edit
} from "lucide-react";

import InvoiceSection from "./../../../Components/Client_Module_Components/InvoiceSection/InvoiceSection.jsx";
import PendingWorkSection from "./../PendingWorkSection/PendingWorkSection.jsx";
import ClientDocumentSection from "../ClientDocumentSection/ClientDocumentsSection.jsx";
import "./ShowClientDetail.css";


function ShowClientDetail({ client, onClose }) {

   const navigate = useNavigate();

    if (!client) {
        return null;
    }


//=========== EDIT CLIENT ===============

const handleClientEdit = () => {

    navigate(
        `/dashboard/edit-client/${client.id}`
    );

};

    /* =====================================================
       CLIENT DATA
    ===================================================== */

    const {
        custName,
        custPhone,
        custEmail,
        custAddress,

        service,
        serviceTermCondition,
        totalAmount,
        gstAmount,
        finalAmount,
        warranty,
        serviceCovered,
        serviceDate,

        applyGst,
        gstType,
        gstInvoiceNo,

        billingAddress,
        shippingAddress,

        documents,
        consumerNo,
        subdivision,
        technicalName,

        addedBy,
        vendorId,

        inquiryId
    } = client;


    /* =====================================================
       FORMAT AMOUNT
    ===================================================== */

    const formatAmount = (amount) => {

        if (
            amount === null ||
            amount === undefined ||
            amount === ""
        ) {
            return "₹0";
        }

        return `₹${Number(amount).toLocaleString("en-IN")}`;

    };


    /* =====================================================
       FORMAT DATE
    ===================================================== */

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        const dateObject = new Date(date);

        return dateObject.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });

    };


    return (

        <div className="client-detail-overlay">

            <div className="client-detail-modal">


                {/* =================================================
                   HEADER
                ================================================= */}

                <div className="client-detail-header">

                    <div className="client-detail-heading">

                        <div className="client-detail-icon">
                            <UserRound size={25} />
                        </div>

                        <div>
                            <h2>Client Details</h2>

                            <p>
                                Complete information about the client
                            </p>
                        </div>

                    </div>


                    <button
                        type="button"
                        className="client-detail-close"
                        onClick={onClose}
                    >
                        <X size={22} />
                    </button>

                </div>


                {/* =================================================
                   CONTENT
                ================================================= */}

                <div className="client-detail-content">


                    {/* =================================================
                       CUSTOMER INFORMATION
                    ================================================= */}

                    <section className="client-detail-section">

                        <div className="client-detail-section-title">

                            <UserRound size={20} />

                            <h3>
                                Customer Information
                            </h3>

                        </div>


                        <div className="client-detail-grid">

                            <div className="client-detail-field">

                                <span>
                                    Name
                                </span>

                                <strong>
                                    {custName || "-"}
                                </strong>

                            </div>


                            <div className="client-detail-field">

                                <span>
                                    Contact
                                </span>

                                <strong className="detail-with-icon">

                                    <Phone size={17} />

                                    {custPhone || "-"}

                                </strong>

                            </div>


                            <div className="client-detail-field">

                                <span>
                                    Email
                                </span>

                                <strong className="detail-with-icon">

                                    <Mail size={17} />

                                    {custEmail || "-"}

                                </strong>

                            </div>


                            <div className="client-detail-field">

                                <span>
                                    Inquiry ID
                                </span>

                                <strong>
                                    #{inquiryId || "-"}
                                </strong>

                            </div>


                            <div className="client-detail-field full-width">

                                <span>
                                    Address
                                </span>

                                <strong className="detail-with-icon">

                                    <MapPin size={17} />

                                    {custAddress || "-"}

                                </strong>

                            </div>

                        </div>

                    </section>



                    {/* =================================================
                       SERVICE INFORMATION
                    ================================================= */}

                    <section className="client-detail-section">

                        <div className="client-detail-section-title">

                            <Wrench size={20} />

                            <h3>
                                Service Information
                            </h3>

                        </div>


                        <div className="client-detail-grid">

                            <div className="client-detail-field">

                                <span>
                                    Service
                                </span>

                                <strong>
                                    {service || "-"}
                                </strong>

                            </div>


                            <div className="client-detail-field">

                                <span>
                                    Service Date
                                </span>

                                <strong className="detail-with-icon">

                                    <CalendarDays size={17} />

                                    {formatDate(serviceDate)}

                                </strong>

                            </div>


                            <div className="client-detail-field full-width">

                                <span>
                                    Service Covered
                                </span>

                                <strong>
                                    {serviceCovered || "-"}
                                </strong>

                            </div>


                            <div className="client-detail-field full-width">

                                <span>
                                    Terms & Conditions
                                </span>

                                <strong>
                                    {serviceTermCondition || "-"}
                                </strong>

                            </div>


                            <div className="client-detail-field">

                                <span>
                                    Warranty
                                </span>

                                <strong className="detail-with-icon">
                                    <ShieldCheck size={17} />
                                    {warranty || "-"}
                                </strong>

                            </div>

                        </div>

                    </section>



                    {/* =================================================
                       PAYMENT / GST INFORMATION
                    ================================================= */}

                    <section className="client-detail-section">

                        <div className="client-detail-section-title">

                            <IndianRupee size={20} />

                            <h3>
                                Amount & GST Information
                            </h3>

                        </div>


                        <div className="client-detail-amount-grid">


                            <div className="client-amount-card">

                                <span>
                                    Total Amount
                                </span>

                                <strong>
                                    {formatAmount(totalAmount)}
                                </strong>

                            </div>


                            <div className="client-amount-card">

                                <span>
                                    GST
                                </span>

                                <strong>
                                    {applyGst
                                        ? formatAmount(gstAmount)
                                        : "₹0"
                                    }
                                </strong>

                            </div>


                            <div className="client-amount-card final">

                                <span>
                                    Final Amount
                                </span>

                                <strong>
                                    {formatAmount(finalAmount)}
                                </strong>

                            </div>


                        </div>


                        <div className="client-detail-grid">


                            <div className="client-detail-field">

                                <span>
                                    GST Status
                                </span>

                                <strong>

                                    <span
                                        className={
                                            applyGst
                                                ? "gst-status active"
                                                : "gst-status inactive"
                                        }
                                    >
                                        {applyGst
                                            ? "GST Applied"
                                            : "GST Not Applied"
                                        }
                                    </span>

                                </strong>

                            </div>


                            <div className="client-detail-field">

                                <span>
                                    GST Type
                                </span>

                                <strong>
                                    {gstType || "-"}
                                </strong>

                            </div>


                            <div className="client-detail-field">

                                <span>
                                    GST Invoice No.
                                </span>

                                <strong>
                                    {gstInvoiceNo || "-"}
                                </strong>

                            </div>

                        </div>

                    </section>



                    {/* =================================================
                       ADDRESS INFORMATION
                    ================================================= */}

                    <section className="client-detail-section">

                        <div className="client-detail-section-title">

                            <MapPinned size={20} />

                            <h3>
                                Address Information
                            </h3>

                        </div>


                        <div className="client-detail-grid">

                            <div className="client-detail-field full-width">

                                <span>
                                    Billing Address
                                </span>

                                <strong>
                                    {billingAddress || "-"}
                                </strong>

                            </div>


                            <div className="client-detail-field full-width">

                                <span>
                                    Shipping Address
                                </span>

                                <strong>
                                    {shippingAddress || "-"}
                                </strong>

                            </div>

                        </div>

                    </section>



                    {/* =================================================
                       ADDITIONAL INFORMATION
                    ================================================= */}

                    <section className="client-detail-section">

                        <div className="client-detail-section-title">

                            <ClipboardList size={20} />

                            <h3>
                                Additional Information
                            </h3>

                        </div>


                        <div className="client-detail-grid">

                            <div className="client-detail-field">

                                <span>
                                   Required Documents
                                </span>

                                <strong className="detail-with-icon">

                                    <FileText size={17} />

                                    {documents || "-"}

                                </strong>

                            </div>


                            <div className="client-detail-field">

                                <span>
                                    Consumer No.
                                </span>

                                <strong>
                                    {consumerNo || "-"}
                                </strong>

                            </div>


                            <div className="client-detail-field">

                                <span>
                                    Subdivision
                                </span>

                                <strong>
                                    {subdivision || "-"}
                                </strong>

                            </div>


                            <div className="client-detail-field">

                                <span>
                                    Technical Person
                                </span>

                                <strong className="detail-with-icon">

                                    <UserCog size={17} />

                                    {technicalName || "-"}

                                </strong>

                            </div>


                            <div className="client-detail-field">

                                <span>
                                    Added By
                                </span>

                                <strong className="detail-with-icon">

                                    <BriefcaseBusiness size={16} />

                                    {addedBy || "-"}

                                </strong>

                            </div>


                            <div className="client-detail-field">

                                <span>
                                    Vendor ID
                                </span>

                                <strong>
                                    {vendorId || "-"}
                                </strong>

                            </div>

                        </div>

                    </section>
            
            {/* ========= Client Document Section ========== */}

            <ClientDocumentSection clientId={client.id}/>

            {/* ======== Invoice Section ============== */}

             <InvoiceSection  clientId={client.id}/>
             
            {/* ========= Pending Work Component Mount ========== */}

                 <PendingWorkSection clientId={client.id}/>

             </div>


                {/* =================================================
                   FOOTER
                ================================================= */}

                <div className="client-detail-footer">

                    <button
                       type="button"
                       className="client-detail-edit-btn"
                       onClick={handleClientEdit}>
                       <Edit size={17}/>
                       Edit Client
                    </button>
                    
                    <button
                        type="button"
                        className="client-detail-close-btn"
                        onClick={onClose}
                    >
                        Close
                    </button>

                </div>


            </div>

        </div>
    );
}
export default ShowClientDetail;