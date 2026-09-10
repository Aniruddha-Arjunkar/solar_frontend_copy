import {useState} from "react";
import {
    X,
    User,
    Phone,
    Mail,
    MapPin,
    CalendarDays,
    Clock,
    ClipboardList,
    MessageSquare
} from "lucide-react";

import "./ScheduleForm.css";


function ScheduleForm({ lead, onClose }) {
    
        const [formData, setFormData] = useState({
        scheduleDate: "",
        scheduleTime: "",
        scheduleType: "",
        remarks: ""
    });

    const [loading, setLoading] = useState(false);

    if (!lead) {
        return null;
    }

    // ================= Handle Change =================

        const handleChange = (event) => {
        const { id, value } = event.target;
        setFormData((previousData) => ({
            ...previousData,
            [id]: value
        }));
    };

    // ================= Handle Submit =================
        const handleSubmit = async (event) => {

        event.preventDefault();
        setLoading(true);

        try {

            const response = await fetch(
                `http://localhost:8080/api/leads/${lead.id}/schedule`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        scheduleDate: formData.scheduleDate,
                        scheduleTime: formData.scheduleTime,
                        scheduleType: formData.scheduleType,
                        remarks: formData.remarks
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to schedule lead");
            }

            const updatedLead = await response.json();
            window.alert(
                "Lead scheduled successfully!"
            );

            onClose();

        } catch (error) {
            window.alert(
                "Failed to schedule lead. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };


    return (

        <div className="schedule-form-overlay">

            <div className="schedule-form-container">

                {/* ================= HEADER ================= */}

                <div className="schedule-form-header">

                    <div>

                        <h2>
                            Schedule Lead
                        </h2>

                        <p>
                            Schedule the next activity for this lead.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="schedule-form-close"
                        onClick={onClose}
                    >
                        <X size={22} />
                    </button>

                </div>


                {/* ================= CUSTOMER DETAILS ================= */}

                <div className="schedule-form-section">

                    <div className="schedule-form-section-title">

                        <User size={19} />

                        <h3>
                            Customer Details
                        </h3>

                    </div>


                    <div className="schedule-form-grid">

                        {/* Name */}

                        <div className="schedule-form-group">

                            <label>
                                Customer Name
                            </label>

                            <div className="schedule-readonly-field">

                                <User size={17} />

                                <span>
                                    {lead.name}
                                </span>

                            </div>

                        </div>


                        {/* Contact */}

                        <div className="schedule-form-group">

                            <label>
                                Contact Number
                            </label>

                            <div className="schedule-readonly-field">

                                <Phone size={17} />

                                <span>
                                    {lead.contact}
                                </span>

                            </div>

                        </div>


                        {/* Email */}

                        <div className="schedule-form-group">

                            <label>
                                Email
                            </label>

                            <div className="schedule-readonly-field">

                                <Mail size={17} />

                                <span>
                                    {lead.email || "Not provided"}
                                </span>

                            </div>

                        </div>


                        {/* Address */}

                        <div className="schedule-form-group">

                            <label>
                                Address
                            </label>

                            <div className="schedule-readonly-field">

                                <MapPin size={17} />

                                <span>
                                    {lead.address || "Not provided"}
                                </span>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ================= SCHEDULE DETAILS ================= */}

                <div className="schedule-form-section">

                    <div className="schedule-form-section-title">

                        <CalendarDays size={19} />

                        <h3>
                            Schedule Details
                        </h3>

                    </div>


                    <form onSubmit={handleSubmit}>
                        <div className="schedule-form-grid">

                            {/* Date */}
                            <div className="schedule-form-group">
                                <label htmlFor="schedule-date">
                                    Schedule Date
                                    <span>*</span>
                                </label>

                                <div className="schedule-input-wrapper">
                                    <CalendarDays size={17} />
                                    <input
                                       id="scheduleDate"
                                       type="date"
                                       value={formData.scheduleDate}
                                       onChange={handleChange}
                                       required/>
                                </div>
                            </div>

                            {/* Time */}

                            <div className="schedule-form-group">
                                <label htmlFor="schedule-time">
                                    Schedule Time
                                    <span>*</span>
                                </label>

                                <div className="schedule-input-wrapper">
                                    <Clock size={17} />
                                    <input
                                      id="scheduleTime"
                                      type="time"
                                      value={formData.scheduleTime}
                                      onChange={handleChange}
                                      required/>
                                </div>
                            </div>

                            {/* Schedule Type */}
                            <div className="schedule-form-group full-width">
                                <label htmlFor="schedule-type">
                                    Schedule Type
                                    <span>*</span>
                                </label>

                                <div className="schedule-input-wrapper">
                                    <ClipboardList size={17} />
                                    <select
                                       id="scheduleType"
                                       value={formData.scheduleType}
                                       onChange={handleChange}
                                       required>
                                
                                          <option value="">
                                              Select schedule type
                                          </option>

                                          <option value="followup">
                                               Follow-up
                                           </option>

                                           <option value="visit">
                                               Site Visit
                                           </option>

                                           <option value="service">
                                                Solar Service
                                           </option>

                                           <option value="quotation">
                                                Quotation Discussion
                                           </option>

                                           <option value="other">
                                               Other
                                           </option>
                                    </select>
                                </div>
                            </div>

                            {/* Remarks */}
                            <div className="schedule-form-group full-width">
                                <label htmlFor="schedule-remarks">
                                    Remarks
                                </label>

                                <div className="schedule-textarea-wrapper">
                                    <MessageSquare size={17} />
                                    <textarea
                                       id="remarks"
                                       placeholder="Enter schedule remarks..."
                                       value={formData.remarks}
                                       onChange={handleChange}
                                       rows="4"/>
                                </div>
                            </div>
                        </div>

                        {/* ================= FOOTER ================= */}
                        <div className="schedule-form-footer">

                            <button
                                type="button"
                                className="schedule-form-cancel"
                                onClick={onClose}>
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="schedule-form-save"
                                disabled={loading}>
                              <CalendarDays size={17} />
                               {loading ? "Scheduling..." : "Schedule Lead"}
                             </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}


export default ScheduleForm;