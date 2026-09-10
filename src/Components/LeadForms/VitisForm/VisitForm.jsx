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

import "./VisitForm.css";


function VisitForm({ lead, onClose }) {

    const [formData, setFormData] = useState({
        visitDate: "",
        visitTime: "",
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

    // ================= HANDLE SUBMIT =================

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!formData.visitDate) {
            window.alert("Please select visit date.");
            return;
        }

        if (!formData.visitTime) {
            window.alert("Please select visit time.");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:8080/api/leads/${lead.id}/visit`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        visitDate: formData.visitDate,
                        visitTime: formData.visitTime,
                        remarks: formData.remarks
                    })
                }
            );

            if (!response.ok) {

                throw new Error(
                    "Failed to schedule visit"
                );
            }

            const updatedLead = await response.json();

            window.alert(
                "Visit scheduled successfully!"
            );
            // Close form after successful API call
            onClose();

        } catch (error) {
            window.alert(
                "Failed to schedule visit. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="lead-form-overlay">

            <div className="visit-form-container">
                {/* ================= HEADER ================= */}
                <div className="lead-form-header">
                    <div>
                        <h2>
                            Schedule Visit
                        </h2>
                        <p>
                            Schedule a visit for the selected lead.
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

                        {/* Customer Name */}
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

                {/* ================= VISIT DETAILS ================= */}
                <div className="lead-form-section">
                    <div className="lead-form-section-title">
                        <CalendarDays size={19} />
                        <h3>
                            Visit Details
                        </h3>
                    </div>

                    {/* ================= FORM ================= */}
                    <form onSubmit={handleSubmit}>
                        <div className="lead-form-grid">

                            {/* ================= DATE ================= */}
                            <div className="lead-form-group">
                                <label htmlFor="visitDate">
                                    Visit Date
                                    <span>*</span>
                                </label>

                                <div className="lead-input-wrapper">
                                    <CalendarDays size={17} />
                                    <input
                                        id="visitDate"
                                        type="date"
                                        value={formData.visitDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* ================= TIME ================= */}
                            <div className="lead-form-group">
                                <label htmlFor="visitTime">
                                    Visit Time
                                    <span>*</span>
                                </label>

                                <div className="lead-input-wrapper">
                                    <Clock size={17} />
                                    <input
                                        id="visitTime"
                                        type="time"
                                        value={formData.visitTime}
                                        onChange={handleChange}
                                        required/>
                                </div>
                            </div>

                            {/* ================= LOCATION ================= */}
                            <div className="lead-form-group full-width">
                                <label htmlFor="visitLocation">
                                    Visit Location
                                    <span>*</span>
                                </label>

                                <div className="lead-input-wrapper">
                                    <MapPin size={17} />
                                    <input
                                        id="visitLocation"
                                        type="text"
                                        placeholder="Enter visit location"
                                        defaultValue={
                                            lead.address || ""
                                        }
                                        required/>
                                </div>
                            </div>

                            {/* ================= REMARKS ================= */}
                            <div className="lead-form-group full-width">
                                <label htmlFor="remarks">
                                    Remarks
                                </label>

                                <div className="lead-textarea-wrapper">
                                    <MessageSquare size={17} />
                                    <textarea
                                        id="remarks"
                                        placeholder="Enter visit remarks..."
                                        value={formData.remarks}
                                        onChange={handleChange}
                                        rows="4"/>
                                </div>
                            </div>
                        </div>

                        {/* ================= FOOTER ================= */}
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
                                disabled={loading}>
                                <CalendarDays size={18} />
                                {loading
                                    ? "Saving..."
                                    : "Schedule Visit"
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default VisitForm;