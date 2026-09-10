import { useState } from "react";
import { useNavigate } from "react-router";

import {
    UserRoundPlus,
    User,
    Phone,
    Mail,
    MapPin,
    BriefcaseBusiness,
    MessageSquare,
    CalendarDays,
    Save,
    X
} from "lucide-react";

import MuduleHeader from "./../../../Components/ModulePageHeader/ModulePageHeader.jsx";

import "./AddInquiry.css";


function AddInquiry() {

    const navigate = useNavigate();

    // ================= FORM STATE =================

    const [formData, setFormData] = useState({
        name: "",
        contact: "",
        email: "",
        address: "",
        serviceType: "",
        inquiryDate: "",
        serviceRequirement: ""
    });


    // ================= HANDLE INPUT =================

    const handleChange = (event) => {
        const { id, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [id]: value
        }));
    };


    // ================= SUBMIT FORM =================

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            const response = await fetch(
                "http://localhost:8080/api/leads",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: formData.name,
                        contact: formData.contact,
                        email: formData.email,
                        address: formData.address,
                        serviceType: formData.serviceType,
                        inquiryDate:formData.inquiryDate,
                        message:
                            formData.serviceRequirement,

                        status: "NEW"
                    })
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to create inquiry"
                );
            }


            const savedLead = await response.json();

            // console.log("Inquiry created:", savedLead);


            alert("Inquiry added successfully!");


            // Redirect to View Inquiry

           navigate("/dashboard/view-inquiry");

        } catch (error) {

            console.error(
                "Error creating inquiry:",
                error
            );

            alert(
                "Failed to add inquiry. Please try again."
            );
        }
    };


    // ================= CANCEL =================

    const handleCancel = () => {

        setFormData({
            name: "",
            contact: "",
            email: "",
            address: "",
            serviceType: "",
            inquiryDate: "",
            serviceRequirement: ""
        });
    };


    return (

        <section className="add_inquiry">

            {/* ========== PAGE HEADER ========= */}

            <MuduleHeader
                currectPage="Add Inquiry"
                title="Add New Inquiry"
                description="Create a new Customer Inquiry and Keep track of the Lead Details."
                buttonType="view"
                icon={UserRoundPlus}
            />


            {/* ========== INQUIRY FORM ============ */}

            <div className="inquiry-form-card">

                <div className="form-card-header">

                    <div>

                        <h2>
                            Inquiry Information
                        </h2>

                        <p>
                            Enter the customer's information and inquiry details below.
                        </p>
                    </div>


                    <div className="form-required-text">
                        <span>*</span> Required fields
                    </div>
                </div>


                <form
                    className="inquiry-form"
                    onSubmit={handleSubmit}
                >


                    {/* ========== CUSTOMER DETAILS ======= */}

                    <div className="form-section">

                        <div className="form-section-title">
                            <User size={19} />
                            <h3>
                                Customer Details
                            </h3>
                        </div>


                        <div className="add-inquiry-form-grid">

                            {/* Customer Name */}

                            <div className="add-inquiry-form-group">
                                <label htmlFor="name">
                                    Customer Name <span>*</span>
                                </label>

                                <div className="add-inquiry-input-wrapper">
                                    <User size={18} />
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Enter customer name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required/>
                                </div>
                            </div>


                            {/* Mobile Number */}

                            <div className="add-inquiry-form-group">
                                <label htmlFor="contact">
                                    Mobile Number <span>*</span>
                                </label>

                                <div className="add-inquiry-input-wrapper">
                                    <Phone size={18} />
                                    <input
                                        id="contact"
                                        type="tel"
                                        placeholder="Enter mobile number"
                                        value={formData.contact}
                                        onChange={handleChange}
                                        required />
                                </div>
                            </div>

                            {/* Email */}

                            <div className="add-inquiry-form-group">
                                <label htmlFor="email">
                                    Email Address
                                </label>

                                <div className="add-inquiry-input-wrapper">
                                    <Mail size={18} />
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Enter email address"
                                        value={formData.email}
                                        onChange={handleChange}/>
                                </div>
                            </div>


                            {/* Location */}

                            <div className="add-inquiry-form-group">
                                <label htmlFor="address">
                                    Location <span>*</span>
                                </label>

                                <div className="add-inquiry-input-wrapper">
                                    <MapPin size={18} />
                                    <input
                                        id="address"
                                        type="text"
                                        placeholder="Enter customer location"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required/>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* ======== INQUIRY DETAILS ========= */}

                    <div className="form-section">
                        <div className="form-section-title">
                            <BriefcaseBusiness size={19} />
                            <h3>
                                Inquiry Details
                            </h3>
                        </div>
                        <div className="add-inquiry-form-grid">


                            {/* Service */}

                            <div className="add-inquiry-form-group">
                                <label htmlFor="serviceType">
                                    Solar Service Type
                                    <span>*</span>
                                </label>

                                <div className="add-inquiry-input-wrapper select-wrapper">
                                    <BriefcaseBusiness size={18} />
                                    <select
                                        id="serviceType"
                                        value={formData.serviceType}
                                        onChange={handleChange}
                                        required>

                                        <option value="">
                                            Select solar service
                                        </option>

                                        <option value="Solar Panel Installation">
                                            Solar Panel Installation
                                        </option>

                                        <option value="Solar Panel Maintenance">
                                            Solar Panel Maintenance
                                        </option>

                                        <option value="Solar Panel Repair">
                                            Solar Panel Repair
                                        </option>

                                        <option value="Solar Site Survey">
                                            Solar Site Survey
                                        </option>

                                        <option value="Solar Consultation">
                                            Solar Consultation
                                        </option>

                                        <option value="Solar System Upgrade">
                                            Solar System Upgrade
                                        </option>

                                        <option value="Other">
                                            Other
                                        </option>
                                    </select>
                                </div>
                            </div>


                            {/* Inquiry Date */}

                            <div className="add-inquiry-form-group">
                                <label htmlFor="inquiryDate">
                                    Inquiry Date
                                    <span>*</span>
                                </label>

                                <div className="add-inquiry-input-wrapper">
                                    <CalendarDays size={18} />
                                    <input
                                        id="inquiryDate"
                                        type="date"
                                        value={formData.inquiryDate}
                                        onChange={handleChange}
                                        required/>
                                </div>
                            </div>

                            {/* Requirement */}

                            <div className="add-inquiry-form-group form-group-full">
                                <label htmlFor="serviceRequirement">
                                    Customer Requirement
                                    <span>*</span>
                                </label>

                                <div className="textarea-wrapper">
                                    <MessageSquare size={18} />
                                    <textarea
                                        id="serviceRequirement"
                                        rows="4"
                                        placeholder="Describe the customer's requirement..."
                                        value={formData.serviceRequirement}
                                        onChange={handleChange}
                                        required/>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* ======= FORM FOOTER ========= */}

                    <div className="form-footer">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={handleCancel}>
                            <X size={18} />
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="save-button">

                            <Save size={18} />
                            Save Inquiry
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}


export default AddInquiry;