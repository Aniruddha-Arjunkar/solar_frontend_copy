import {
    X,
    User,
    Phone,
    Mail,
    MapPin,
    MessageSquare,
    UsersRound,
    IndianRupee
} from "lucide-react";

import "./ShowVendorDetail.css";


function ShowVendorDetail({
    vendor,
    clients = [],
    onClose
}) {

    /* =====================================================
       NO VENDOR SELECTED
    ===================================================== */

    if (!vendor) {
        return null;
    }


    return (

        <div className="vendor-details-overlay">

            {/* =================================================
                DETAILS CONTAINER
            ================================================= */}

            <div className="show-vendor-details-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="show-vendor-details-header">

                    <div>

                        <h2>
                            Vendor Details
                        </h2>

                        <p>
                            View vendor information and associated clients.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="show-vendor-details-close"
                        onClick={onClose}
                    >
                        <X size={22} />
                    </button>

                </div>


                {/* =================================================
                    VENDOR INFORMATION
                ================================================= */}

                <div className="show-vendor-details-section">

                    <div className="show-vendor-section-title">

                        <User size={19} />

                        <h3>
                            Vendor Information
                        </h3>

                    </div>


                    <div className="show-vendor-info-grid">


                        {/* =================================================
                            VENDOR NAME
                        ================================================= */}

                        <div className="show-vendor-info-group">

                            <label>
                                Vendor Name
                            </label>

                            <div className="show-vendor-readonly-field">

                                <User size={17} />

                                <span>
                                    {vendor.vendorName || "Not provided"}
                                </span>

                            </div>

                        </div>


                        {/* =================================================
                            CONTACT
                        ================================================= */}

                        <div className="show-vendor-info-group">

                            <label>
                                Contact Number
                            </label>

                            <div className="show-vendor-readonly-field">

                                <Phone size={17} />

                                <span>
                                    {vendor.phone || "Not provided"}
                                </span>

                            </div>

                        </div>


                        {/* =================================================
                            EMAIL
                        ================================================= */}

                        <div className="show-vendor-info-group">

                            <label>
                                Email Address
                            </label>

                            <div className="show-vendor-readonly-field">

                                <Mail size={17} />

                                <span>
                                    {vendor.email || "Not provided"}
                                </span>

                            </div>

                        </div>


                        {/* =================================================
                            ADDRESS
                        ================================================= */}

                        <div className="show-vendor-info-group">

                            <label>
                                Address
                            </label>

                            <div className="show-vendor-readonly-field">

                                <MapPin size={17} />

                                <span>
                                    {vendor.address || "Not provided"}
                                </span>

                            </div>

                        </div>


                        {/* =================================================
                            REMARKS
                        ================================================= */}

                        <div className="show-vendor-info-group show-vendor-full-width">

                            <label>
                                Additional Remarks
                            </label>

                            <div className="show-vendor-remarks-field">

                                <MessageSquare size={17} />

                                <span>
                                    {vendor.remarks || "No remarks provided"}
                                </span>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    CLIENT SECTION
                ================================================= */}

                <div className="show-vendor-details-section">


                    {/* =================================================
                        CLIENT SECTION TITLE
                    ================================================= */}

                    <div className="show-vendor-section-title">

                        <UsersRound size={19} />

                        <h3>
                            Clients Added by This Vendor
                        </h3>

                        <span className="show-vendor-client-count">
                            {clients.length}
                        </span>

                    </div>


                    {/* =================================================
                        NO CLIENT
                    ================================================= */}

                    {clients.length === 0 ? (

                        <div className="show-vendor-no-client">

                            <UsersRound size={35} />

                            <h4>
                                No Clients Added
                            </h4>

                            <p>
                                This vendor has not added any clients yet.
                            </p>

                        </div>

                    ) : (

                        /* =================================================
                           CLIENT TABLE
                        ================================================= */

                        <div className="show-vendor-client-table-wrapper">

                            <table className="show-vendor-client-table">


                                {/* =================================================
                                    TABLE HEADER
                                ================================================= */}

                                <thead>

                                    <tr>

                                        <th>
                                            Client Name
                                        </th>

                                        <th>
                                            Contact
                                        </th>

                                        <th>
                                            Service
                                        </th>

                                        <th>
                                            Final Amount
                                        </th>

                                    </tr>

                                </thead>


                                {/* =================================================
                                    TABLE BODY
                                ================================================= */}

                                <tbody>

                                    {clients.map((client) => (

                                        <tr key={client.id}>


                                            {/* =====================================
                                                CLIENT NAME
                                            ====================================== */}

                                            <td>

                                                <div className="show-vendor-client-name">

                                                    <div className="show-vendor-client-icon">

                                                        <User size={20} />

                                                    </div>

                                                    <div>

                                                        <h4>
                                                            {client.custName || "Not provided"}
                                                        </h4>

                                                        <span>
                                                            Client #{client.id}
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* =====================================
                                                CONTACT
                                            ====================================== */}

                                            <td>

                                                <div className="show-vendor-client-contact">

                                                    <Phone size={18} />

                                                    <span>
                                                        {client.custPhone || "Not provided"}
                                                    </span>

                                                </div>

                                            </td>


                                            {/* =====================================
                                                SERVICE
                                            ====================================== */}

                                            <td>

                                                <span className="show-vendor-service">

                                                    {client.service || "Not provided"}

                                                </span>

                                            </td>


                                            {/* =====================================
                                                FINAL AMOUNT
                                            ====================================== */}

                                            <td>

                                                <div className="show-vendor-final-amount">

                                                    <IndianRupee size={17} />

                                                    <span>
                                                        {client.finalAmount !== null &&
                                                        client.finalAmount !== undefined
                                                            ? Number(client.finalAmount).toLocaleString(
                                                                "en-IN",
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2
                                                                }
                                                            )
                                                            : "0.00"
                                                        }
                                                    </span>

                                                </div>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="show-vendor-details-footer">

                    <button
                        type="button"
                        className="show-vendor-details-close-btn"
                        onClick={onClose}
                    >

                        <X size={22} />

                        Close

                    </button>

                </div>

            </div>

        </div>
    );
}


export default ShowVendorDetail;