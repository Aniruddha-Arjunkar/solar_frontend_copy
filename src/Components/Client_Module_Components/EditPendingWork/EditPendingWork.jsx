import { useEffect, useState } from "react";
import {
    X,
    Save,
    LoaderCircle
} from "lucide-react";

import "./EditPendingWork.css";


function EditPendingWork({
    work,
    onClose,
    onUpdated
}) {

    // ============================================================
    // STATE
    // ============================================================

    const [formData, setFormData] = useState({
        workDescription: "",
        assignedTo: "",
        dueDate: "",
        status: "Pending"
    });

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");


    // ============================================================
    // LOAD SELECTED WORK INTO FORM
    // ============================================================

    useEffect(() => {

        if (!work) {
            return;
        }

        setFormData({
            workDescription: work.workDescription || "",
            assignedTo: work.assignedTo || "",
            dueDate: work.dueDate || "",
            status: work.status || "Pending"
        });

        setError("");

    }, [work]);


    // ============================================================
    // INPUT CHANGE
    // ============================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));

    };


    // ============================================================
    // UPDATE PENDING WORK
    // ============================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!work?.id) {
            setError("Pending work ID is missing.");
            return;
        }

        try {

            setSaving(true);
            setError("");

            const response = await fetch(
                `http://localhost:8080/api/pending-work/${work.id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        workDescription:
                            formData.workDescription,

                        assignedTo:
                            formData.assignedTo,

                        dueDate:
                            formData.dueDate,

                        status:
                            formData.status
                    })
                }
            );

            if (!response.ok) {

                throw new Error(
                    "Failed to update pending work."
                );

            }

            const updatedWork =
                await response.json();

            console.log(
                "Updated Pending Work:",
                updatedWork
            );

            // Notify parent
            if (onUpdated) {
                onUpdated(updatedWork);
            }

            // Close modal
            if (onClose) {
                onClose();
            }

        } catch (error) {

            console.error(
                "Error updating pending work:",
                error
            );

            setError(
                "Unable to update pending work."
            );

        } finally {

            setSaving(false);

        }
    };


    // ============================================================
    // RENDER
    // ============================================================

    if (!work) {
        return null;
    }


    return (

        <div className="edit-pendingwork-page-overlay">

            {/* ====================================================
                MODAL
            ==================================================== */}

            <div className="edit-pendingwork-page-modal">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="edit-pendingwork-page-header">

                    <div>
                        <h2>
                            Update Pending Work
                        </h2>

                        <p>
                            Update the selected pending work.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="edit-pendingwork-page-close"
                        onClick={onClose}
                        disabled={saving}
                    >
                        <X size={22} />
                    </button>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    className="edit-pendingwork-page-form"
                    onSubmit={handleSubmit}
                >

                    {/* =================================================
                        CLIENT NAME
                    ================================================= */}

                    <div className="edit-pendingwork-page-field">

                        <label>
                            Client Name
                        </label>

                        <input
                            type="text"
                            value={work.clientName || ""}
                            readOnly
                            className="edit-pendingwork-page-readonly"
                        />

                    </div>


                    {/* =================================================
                        WORK DESCRIPTION
                    ================================================= */}

                    <div className="edit-pendingwork-page-field">

                        <label htmlFor="edit-pendingwork-page-work-description">
                            Work Description
                        </label>

                        <textarea
                            id="edit-pendingwork-page-work-description"
                            name="workDescription"
                            value={
                                formData.workDescription
                            }
                            onChange={handleChange}
                            placeholder="Enter work description"
                            rows="4"
                            required
                        />

                    </div>


                    {/* =================================================
                        ASSIGNED TO
                    ================================================= */}

                    <div className="edit-pendingwork-page-field">

                        <label htmlFor="edit-pendingwork-page-assigned-to">
                            Assign To
                        </label>

                        <input
                            id="edit-pendingwork-page-assigned-to"
                            type="text"
                            name="assignedTo"
                            value={
                                formData.assignedTo
                            }
                            onChange={handleChange}
                            placeholder="Enter employee name"
                        />

                    </div>


                    {/* =================================================
                        DUE DATE
                    ================================================= */}

                    <div className="edit-pendingwork-page-field">

                        <label htmlFor="edit-pendingwork-page-due-date">
                            Due Date
                        </label>

                        <input
                            id="edit-pendingwork-page-due-date"
                            type="date"
                            name="dueDate"
                            value={
                                formData.dueDate
                            }
                            onChange={handleChange}
                        />

                    </div>


                    {/* =================================================
                        STATUS
                    ================================================= */}

                    <div className="edit-pendingwork-page-field">

                        <label htmlFor="edit-pendingwork-page-status">
                            Status
                        </label>

                        <select
                            id="edit-pendingwork-page-status"
                            name="status"
                            value={
                                formData.status
                            }
                            onChange={handleChange}
                        >
                            <option value="Pending">
                                Pending
                            </option>

                            <option value="In Progress">
                                In Progress
                            </option>

                            <option value="Completed">
                                Completed
                            </option>
                        </select>

                    </div>


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div className="edit-pendingwork-page-error">
                            {error}
                        </div>

                    )}


                    {/* =================================================
                        ACTION BUTTONS
                    ================================================= */}

                    <div className="edit-pendingwork-page-actions">

                        <button
                            type="button"
                            className="edit-pendingwork-page-cancel"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="edit-pendingwork-page-save"
                            disabled={saving}
                        >

                            {saving ? (

                                <>
                                    <LoaderCircle
                                        size={18}
                                        className="edit-pendingwork-page-loader"
                                    />

                                    <span>
                                        Updating...
                                    </span>
                                </>

                            ) : (

                                <>
                                    <Save size={18} />

                                    <span>
                                        Update Work
                                    </span>
                                </>

                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default EditPendingWork;