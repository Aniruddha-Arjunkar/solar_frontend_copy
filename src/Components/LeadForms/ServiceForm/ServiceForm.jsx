import {useState} from "react";
import {
    X,
    User,
    Phone,
    Mail,
    MapPin,
    Wrench,
    CalendarDays,
    Clock,
    MessageSquare
} from "lucide-react";

import "./ServiceForm.css";

function ServiceForm({ lead, onClose }) {
    
        const [formData, setFormData] = useState({
        serviceType: "",
        serviceDate: "",
        serviceTime: "",
        serviceRequirement: "",
        remarks: ""
    });

    const [loading, setLoading] = useState(false);

    if (!lead) {
        return null;
    }
     
    // ================= Handle Changes =================
        const handleChange = (event) => {
        const { id, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [id]: value
        }));
    };

    // ================= Submit Changes =================
        const handleSubmit = async (event) => {

        event.preventDefault();

        setLoading(true);

        try {

            const response = await fetch(
                `http://localhost:8080/api/leads/${lead.id}/service`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        serviceType: formData.serviceType,
                        serviceDate: formData.serviceDate,
                        serviceTime: formData.serviceTime,
                        serviceRequirement: formData.serviceRequirement,
                        remarks: formData.remarks
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to create service");
            }

            const updatedLead = await response.json();

            window.alert(
                "Service scheduled successfully!"
            );
            onClose();
        } catch (error) {
            window.alert(
                "Failed to schedule service. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="service-form-overlay">
            <div className="service-form-container">
                
                {/* ================= HEADER ================= */}
                <div className="service-form-header">
                    <div>
                        <h2>
                            Schedule Solar Service
                        </h2>
                        <p>
                            Create a service request for the selected lead.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="service-form-close"
                        onClick={onClose}>
                        <X size={22} />
                    </button>
                </div>

                {/* ================= CUSTOMER DETAILS ================= */}
                <div className="service-form-section">
                    <div className="service-form-section-title">
                        <User size={19} />
                        <h3>
                            Customer Details
                        </h3>
                    </div>
                    <div className="service-form-grid">

                        {/* Customer Name */}
                        <div className="service-form-group">
                            <label>
                                Customer Name
                            </label>
                            <div className="service-readonly-field">
                                <User size={17} />
                                <span>
                                    {lead.name}
                                </span>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="service-form-group">
                            <label>
                                Contact Number
                            </label>
                            <div className="service-readonly-field">
                                <Phone size={17} />
                                <span>
                                    {lead.contact}
                                </span>
                            </div>
                        </div>

                        {/* Email */}

                        <div className="service-form-group">
                            <label>
                                Email
                            </label>

                            <div className="service-readonly-field">
                                <Mail size={17} />
                                <span>
                                    {lead.email || "Not provided"}
                                </span>
                            </div>
                        </div>


                        {/* Address */}

                        <div className="service-form-group">
                            <label>
                                Address
                            </label>

                            <div className="service-readonly-field">
                                <MapPin size={17} />
                                <span>
                                    {lead.address || "Not provided"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= SERVICE DETAILS ================= */}

                <div className="service-form-section">
                    <div className="service-form-section-title">
                        <Wrench size={19} />
                        <h3>
                            Service Details
                        </h3>
                    </div>


                    <form onSubmit={handleSubmit}>

                        <div className="service-form-grid">

                            {/* Service Type */}

                            <div className="service-form-group">
                                <label htmlFor="service-type">
                                    Service Type
                                    <span>*</span>
                                </label>

                                <div className="service-input-wrapper">
                                    <Wrench size={17} />
                                <select
                                       id="serviceType"
                                       value={formData.serviceType}
                                       onChange={handleChange}
                                       required>

                                   <option value="">
                                       Select service
                                   </option>

                                   <option value="installation">
                                      Solar Panel Installation
                                   </option>

                                   <option value="maintenance">
                                      Solar System Maintenance
                                   </option>

                                   <option value="repair">
                                      Solar System Repair
                                   </option>

                                   <option value="inspection">
                                      Solar System Inspection
                                   </option>

                                   <option value="consultation">
                                      Solar Consultation
                                   </option>
                             </select>
                                </div>
                            </div>

                            {/* Preferred Date */}

                            <div className="service-form-group">
                                <label htmlFor="service-date">
                                    Service Date
                                    <span>*</span>
                                </label>

                                <div className="service-input-wrapper">
                                    <CalendarDays size={17} />
                                    <input
                                       id="serviceDate"
                                       type="date"
                                       value={formData.serviceDate}
                                       onChange={handleChange}
                                       required/>
                                </div>
                            </div>

                            {/* Preferred Time */}

                            <div className="service-form-group">
                                <label htmlFor="service-time">
                                    Preferred Time
                                </label>

                                <div className="service-input-wrapper">
                                    <Clock size={17} />
                                    <input
                                       id="serviceTime"
                                       type="time"
                                       value={formData.serviceTime}
                                       onChange={handleChange}/>
                                </div>
                            </div>

                            {/* Requirement */}

                            <div className="service-form-group">

                                <label htmlFor="service-requirement">

                                    Service Requirement
                                    <span>*</span>
                                </label>

                                <div className="service-input-wrapper">
                                    <MessageSquare size={17} />
                                        <input
                                           id="serviceRequirement"
                                           type="text"
                                           placeholder="Enter service requirement"
                                           value={formData.serviceRequirement}
                                           onChange={handleChange}
                                           required/>
                                </div>
                            </div>

                            {/* Remarks */}

                            <div className="service-form-group full-width">
                                <label htmlFor="service-remarks">
                                    Remarks
                                </label>

                                <div className="service-textarea-wrapper">
                                    <MessageSquare size={17} />
                                    <textarea
                                       id="remarks"
                                       placeholder="Enter service remarks..."
                                       value={formData.remarks}
                                       onChange={handleChange}
                                       rows="4"/>
                                </div>
                            </div>
                        </div>


                        {/* ================= FOOTER ================= */}
                        <div className="service-form-footer">

                            <button
                                type="button"
                                className="service-form-cancel"
                                onClick={onClose}>
                                Cancel
                            </button>

                            <button
                              type="submit"
                              className="service-form-save"
                              disabled={loading}>
                                <Wrench size={17} />
                                {loading
                                 ? "Scheduling..."
                                 : "Schedule Service"
                                 }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}


export default ServiceForm;