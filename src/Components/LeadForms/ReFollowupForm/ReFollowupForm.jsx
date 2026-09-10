import { useState } from "react";

import {
    X,
    User,
    Phone,
    Mail,
    MapPin,
    CalendarDays,
    Clock,
    MessageSquare
} from "lucide-react";

import "./ReFollowUpForm.css";

function ReFollowUpForm({ lead, onClose }) {

    const [formData, setFormData] = useState({
        followUpDate: "",
        followUpTime: "",
        remarks: ""
    });

    const [loading, setLoading] = useState(false);

    if (!lead) {
        return null;
    }

    // ================= HANDLE CHANGE =================
    const handleChange = (event) => {
        const { id, value } = event.target;
        setFormData((previousData) => ({
            ...previousData,
            [id]: value
        }));
    };

    // ================= SUBMIT =================

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!formData.followUpDate) {
            window.alert("Please select follow-up date.");
            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                `http://localhost:8080/api/leads/${lead.id}/refollowup`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        followUpDate: formData.followUpDate,
                        remarks: formData.remarks
                    })
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to create re-follow-up"
                );
            }

            const updatedLead = await response.json();

            window.alert(
                "Re-Follow-up created successfully!"
            );

            // Close the form
            onClose();

        } catch (error) {
            window.alert(
                "Failed to create re-follow-up. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="lead-form-overlay">
            <div className="refollowup-form-container">
                {/* ================= HEADER ================= */}

                <div className="lead-form-header">
                    <div>
                        <h2>
                            Re-Follow-up
                        </h2>
                        <p>
                            Schedule a follow-up for this customer.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="lead-form-close"
                        onClick={onClose}>
                        <X size={22} />
                    </button>
                </div>

                {/* ================= CUSTOMER DETAILS ================= */}

                <div className="lead-form-section">
                    <div className="lead-form-section-title">
                        <User size={19} />
                        <h3>
                            Customer Details
                        </h3>
                    </div>

                    <div className="lead-form-grid">
                        {/*Customer Name */}
                        <div className="lead-form-group">
                            <label>
                                Customer Name
                            </label>
                            <div className="lead-readonly-field">
                                <User size={17} />
                                <span>
                                    {lead.name}
                                </span>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="lead-form-group">
                            <label>
                                Contact Number
                            </label>
                            <div className="lead-readonly-field">
                                <Phone size={17} />
                                <span>
                                    {lead.contact}
                                </span>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="lead-form-group">
                            <label>
                                Email
                            </label>
                            <div className="lead-readonly-field">
                                <Mail size={17} />
                                <span>
                                    {lead.email || "Not provided"}
                                </span>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="lead-form-group">
                            <label>
                                Address
                            </label>
                            <div className="lead-readonly-field">
                                <MapPin size={17} />
                                <span>
                                    {lead.address || "Not provided"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= FOLLOW-UP DETAILS ================= */}
                <div className="lead-form-section">
                    <div className="lead-form-section-title">
                        <CalendarDays size={19} />
                        <h3>
                            Follow-up Details
                        </h3>
                    </div>

                    {/* ================= FORM ================= */}

                    <form onSubmit={handleSubmit}>
                        <div className="lead-form-grid">

                          {/*========= Date ===========*/}
                            <div className="lead-form-group">
                                <label htmlFor="followUpDate">
                                    Follow-up Date
                                    <span>*</span>
                                </label>

                                <div className="lead-input-wrapper">
                                    <CalendarDays size={17} />
                                    <input
                                        id="followUpDate"
                                        type="date"
                                        value={formData.followUpDate}
                                        onChange={handleChange}
                                        required/>
                                </div>
                            </div>

                            {/*==== Time ======*/}
                            <div className="lead-form-group">
                                <label htmlFor="followUpTime">
                                    Follow-up Time
                                </label>
                                <div className="lead-input-wrapper">
                                    <Clock size={17} />
                                    <input
                                        id="followUpTime"
                                        type="time"
                                        value={formData.followUpTime}
                                        onChange={handleChange}/>
                                </div>
                            </div>

                            {/*===== Remarks ============*/}
                            <div className="lead-form-group full-width">
                                <label htmlFor="remarks">
                                    Remarks
                                </label>

                                <div className="lead-textarea-wrapper">
                                    <MessageSquare size={17} />
                                    <textarea
                                        id="remarks"
                                        value={formData.remarks}
                                        onChange={handleChange}
                                        placeholder="Enter follow-up remarks..."
                                        rows="4"/>
                                </div>
                            </div>
                        </div>

                        {/* ================= BUTTONS ================= */}

                        <div className="lead-form-footer">

                            <button
                                type="button"
                                className="lead-form-cancel"
                                onClick={onClose}
                                disabled={loading}>
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="lead-form-save"
                                disabled={loading}
                            >
                                {loading
                                    ? "Saving..."
                                    : "Schedule Follow-up"
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default ReFollowUpForm;