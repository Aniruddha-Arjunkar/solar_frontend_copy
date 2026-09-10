import { useState } from "react";

import VendorHeader
    from "./../../../Components/Vendor_Module_Components/VendorHeader/VendorHeader.jsx";

import {
    UserRoundPlus,
    User,
    Phone,
    Mail,
    MapPin,
    MessageSquare,
    Save,
    X,
    Store
} from "lucide-react";

import "./AddVendor.css";


function AddVendor() {


    // ============================================================
    // FORM DATA
    // ============================================================

    const [formData, setFormData] = useState({

        vendorName: "",
        phone: "",
        email: "",
        address: "",
        remarks: ""

    });


    // ============================================================
    // SUBMIT STATE
    // ============================================================

    const [saving, setSaving] = useState(false);


    // ============================================================
    // HANDLE INPUT CHANGE
    // ============================================================

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previousData) => ({

            ...previousData,

            [name]: value

        }));

    };


    // ============================================================
    // HANDLE FORM SUBMIT
    // ============================================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        try {

            setSaving(true);


            console.log(
                "Vendor Data:",
                formData
            );


            // ====================================================
            // CREATE VENDOR API
            // ====================================================

            const response = await fetch(
                "http://localhost:8080/api/vendors",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        vendorName: formData.vendorName,

                        phone: formData.phone,

                        email: formData.email,

                        address: formData.address,

                        remarks: formData.remarks

                    })
                }
            );


            // ====================================================
            // CHECK RESPONSE
            // ====================================================

            if (!response.ok) {

                throw new Error(
                    "Failed to create vendor."
                );

            }


            // ====================================================
            // GET SAVED VENDOR
            // ====================================================

            const savedVendor =
                await response.json();


            console.log(
                "Vendor Created Successfully:",
                savedVendor
            );


            // ====================================================
            // SUCCESS MESSAGE
            // ====================================================

            window.alert(
                "Vendor Added Successfully."
            );


            // ====================================================
            // RESET FORM
            // ====================================================

            setFormData({

                vendorName: "",
                phone: "",
                email: "",
                address: "",
                remarks: ""

            });


        } catch (error) {

            console.error(
                "Error creating vendor:",
                error
            );


            window.alert(
                "Unable to add vendor. Please try again."
            );


        } finally {

            setSaving(false);

        }

    };


    // ============================================================
    // HANDLE CANCEL
    // ============================================================

    const handleCancel = () => {

        setFormData({

            vendorName: "",
            phone: "",
            email: "",
            address: "",
            remarks: ""

        });

    };


    // ============================================================
    // UI
    // ============================================================

    return (

        <section className="add-vendor-page">


            {/* ====================================================
                PAGE HEADER
            ==================================================== */}

            <VendorHeader

                currectPage="Add Vendor"

                title="Add New Vendor"

                description="Create a new Vendor and Keep Track of it."

                buttonType="view"

                icon={UserRoundPlus}

            />


            {/* ====================================================
                VENDOR FORM CARD
            ==================================================== */}

            <div className="vendor-form-card">


                {/* ==================================================
                    CARD HEADER
                ================================================== */}

                <div className="vendor-form-card-header">

                    <div>

                        <h2>
                            Vendor Information
                        </h2>

                        <p>
                            Enter the vendor's information and details below.
                        </p>

                    </div>


                    <div className="vendor-form-required-text">

                        <span>*</span>

                        Required fields

                    </div>

                </div>


                {/* ==================================================
                    FORM
                ================================================== */}

                <form
                    className="vendor-form"
                    onSubmit={handleSubmit}
                >


                    {/* ==================================================
                        VENDOR DETAILS
                    ================================================== */}

                    <div className="vendor-form-section">


                        <div className="vendor-form-section-title">

                            <Store size={19} />

                            <h3>
                                Vendor Details
                            </h3>

                        </div>


                        <div className="vendor-form-grid">


                            {/* ==========================================
                                VENDOR NAME
                            ========================================== */}

                            <div className="vendor-form-group">

                                <label htmlFor="vendorName">

                                    Vendor Name

                                    <span>*</span>

                                </label>


                                <div className="vendor-input-wrapper">

                                    <User size={18} />

                                    <input

                                        id="vendorName"

                                        name="vendorName"

                                        type="text"

                                        placeholder="Enter vendor name"

                                        value={formData.vendorName}

                                        onChange={handleChange}

                                        required

                                    />

                                </div>

                            </div>


                            {/* ==========================================
                                CONTACT
                            ========================================== */}

                            <div className="vendor-form-group">

                                <label htmlFor="phone">

                                    Contact

                                    <span>*</span>

                                </label>


                                <div className="vendor-input-wrapper">

                                    <Phone size={18} />

                                    <input

                                        id="phone"

                                        name="phone"

                                        type="tel"

                                        placeholder="Enter contact number"

                                        value={formData.phone}

                                        onChange={handleChange}

                                        required

                                    />

                                </div>

                            </div>


                            {/* ==========================================
                                EMAIL
                            ========================================== */}

                            <div className="vendor-form-group">

                                <label htmlFor="email">

                                    Email Address

                                </label>


                                <div className="vendor-input-wrapper">

                                    <Mail size={18} />

                                    <input

                                        id="email"

                                        name="email"

                                        type="email"

                                        placeholder="Enter vendor email address"

                                        value={formData.email}

                                        onChange={handleChange}

                                    />

                                </div>

                            </div>


                            {/* ==========================================
                                ADDRESS
                            ========================================== */}

                            <div className="vendor-form-group">

                                <label htmlFor="address">

                                    Address

                                    <span>*</span>

                                </label>


                                <div className="vendor-input-wrapper">

                                    <MapPin size={18} />

                                    <input

                                        id="address"

                                        name="address"

                                        type="text"

                                        placeholder="Enter vendor address"

                                        value={formData.address}

                                        onChange={handleChange}

                                        required

                                    />

                                </div>

                            </div>


                        </div>

                    </div>


                    {/* ==================================================
                        ADDITIONAL INFORMATION
                    ================================================== */}

                    <div className="vendor-form-section">


                        <div className="vendor-form-section-title">

                            <MessageSquare size={19} />

                            <h3>
                                Additional Information
                            </h3>

                        </div>


                        <div className="vendor-form-grid">


                            {/* ==========================================
                                REMARKS
                            ========================================== */}

                            <div className="vendor-form-group vendor-form-group-full">

                                <label htmlFor="remarks">

                                    Additional Remarks

                                </label>


                                <div className="vendor-textarea-wrapper">

                                    <MessageSquare size={18} />

                                    <textarea

                                        id="remarks"

                                        name="remarks"

                                        rows="4"

                                        placeholder="Enter any additional remarks about the vendor..."

                                        value={formData.remarks}

                                        onChange={handleChange}

                                    />

                                </div>

                            </div>


                        </div>

                    </div>


                    {/* ==================================================
                        FORM FOOTER
                    ================================================== */}

                    <div className="vendor-form-footer">


                        {/* ==================================================
                            CANCEL BUTTON
                        ================================================== */}

                        <button

                            type="button"

                            className="vendor-cancel-button"

                            onClick={handleCancel}

                            disabled={saving}

                        >

                            <X size={18} />

                            Cancel

                        </button>


                        {/* ==================================================
                            SAVE BUTTON
                        ================================================== */}

                        <button

                            type="submit"

                            className="vendor-save-button"

                            disabled={saving}

                        >

                            <Save size={18} />

                            {saving
                                ? "Saving..."
                                : "Save Vendor"
                            }

                        </button>


                    </div>


                </form>

            </div>

        </section>

    );

}


export default AddVendor;