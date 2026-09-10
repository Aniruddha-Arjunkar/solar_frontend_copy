import { useEffect, useState } from "react";

import {
    Clock3,
    Plus,
    Pencil,
    CheckCircle,
    Trash2,
    X
} from "lucide-react";

import "./PendingWorkSection.css";


function PendingWorkSection({ clientId }) {

    const [workList, setWorkList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingWork, setEditingWork] = useState(null);

    const [formData, setFormData] = useState({
        workDescription: "",
        assignedTo: "",
        dueDate: "",
        status: "Pending"
    });


    
    // FETCH CLIENT PENDING WORK

    const fetchPendingWork = async () => {

        try {

            setLoading(true);

            const response = await fetch(
                `http://localhost:8080/api/pending-work/client/${clientId}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch pending work");
            }

            const data = await response.json();

            setWorkList(data);

        } catch (error) {
            console.error(
                "Error fetching pending work:",
                error
            );
        } finally {

            setLoading(false);

        }
    };



    // LOAD WORK WHEN CLIENT ID CHANGES

    useEffect(() => {

        if (clientId) {
            fetchPendingWork();
        }

    }, [clientId]);


    // HANDLE INPUT

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    // OPEN ADD FORM

    const handleAddWork = () => {
        
        setSaving(false);
        setEditingWork(null);

        setFormData({
            workDescription: "",
            assignedTo: "",
            dueDate: "",
            status: "Pending"
        });

        setShowForm(true);

    };


  
    // OPEN EDIT FORM

    const handleEditWork = (work) => {

        setEditingWork(work);

        setFormData({
            workDescription: work.workDescription || "",
            assignedTo: work.assignedTo || "",
            dueDate: work.dueDate || "",
            status: work.status || "Pending"
        });

        setShowForm(true);

    };


    // CLOSE FORM
    const handleCloseForm = () => {
        setShowForm(false);
        setEditingWork(null);
    };


  
    // SAVE / UPDATE WORK

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!formData.workDescription.trim()) {

            alert("Please enter work description.");

            return;
        }

        setSaving(true);  //Make User Unable to Click ADD WORK
        setShowForm(false);  //And Close the Add Pending Work Form
        setEditingWork(null);

        try {

            let response;

            // UPDATE EXISTING WORK
    
            if (editingWork) {

                response = await fetch(
                    `http://localhost:8080/api/pending-work/${editingWork.id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(formData)
                    }
                );

            }

        
            // CREATE NEW WORK

            else {

                response = await fetch(
                    `http://localhost:8080/api/pending-work/client/${clientId}`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(formData)
                    }
                );

            }


            if (!response.ok) {

                throw new Error(
                    "Failed to save pending work"
                );

            }

            await fetchPendingWork();


        } catch (error) {

            console.error(
                "Error saving pending work:",
                error
            );

            alert(
                "Unable to save pending work."
            );

        }

    };


    // MARK COMPLETE

    const handleCompleteWork = async (work) => {

        const confirmed = window.confirm(
            `Mark "${work.workDescription}" as completed?`
        );

        if (!confirmed) {
            return;
        }


        try {

            const response = await fetch(
                `http://localhost:8080/api/pending-work/${work.id}/complete`,
                {
                    method: "PUT"
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to complete work"
                );

            }


            await fetchPendingWork();


        } catch (error) {

            console.error(
                "Error completing work:",
                error
            );

            alert(
                "Unable to mark work as completed."
            );

        }

    };


    // DELETE WORK
   
    const handleDeleteWork = async (work) => {

        const confirmed = window.confirm(
            `Delete "${work.workDescription}"?`
        );

        if (!confirmed) {
            return;
        }


        try {

            const response = await fetch(
                `http://localhost:8080/api/pending-work/${work.id}`,
                {
                    method: "DELETE"
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to delete pending work"
                );

            }


            await fetchPendingWork();


        } catch (error) {

            console.error(
                "Error deleting pending work:",
                error
            );

            alert(
                "Unable to delete pending work."
            );

        }

    };


    // FORMAT DATE

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

    };



    return (

        <section className="pending-work-section">

            {/* =================================================
               HEADER
            ================================================= */}

            <div className="pending-work-header">

                <div className="pending-work-title">

                    <Clock3 size={19} />

                    <h3>
                        Pending Work
                    </h3>

                </div>

            </div>


            {/* =================================================
               BODY
            ================================================= */}

            <div className="pending-work-body">

                <button
                    type="button"
                    className="add-pending-work-btn"
                    onClick={handleAddWork}
                >
                    <Plus size={16} />
                    Add Pending Work
                </button>


                {/* =================================================
                   TABLE
                ================================================= */}

                <div className="pending-work-table-wrapper">

                    <table className="pending-work-table">

                        <thead>

                            <tr>

                                <th>ID</th>

                                <th>
                                    Work Description
                                </th>

                                <th>
                                    Assigned To
                                </th>

                                <th>
                                    Due Date
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="pending-work-empty"
                                    >
                                        Loading...
                                    </td>

                                </tr>

                            ) : workList.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="pending-work-empty"
                                    >
                                        No Pending Work Found
                                    </td>

                                </tr>

                            ) : (

                                workList.map((work, index) => (

                                    <tr key={work.id}>

                                        <td>
                                            {index + 1}
                                        </td>

                                        <td className="work-description">
                                            {work.workDescription}
                                        </td>

                                        <td>
                                            {work.assignedTo || "-"}
                                        </td>

                                        <td>
                                            {formatDate(work.dueDate)}
                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    work.status === "Completed"
                                                        ? "work-status completed"
                                                        : "work-status pending"
                                                }
                                            >
                                                {work.status}
                                            </span>

                                        </td>

                                        <td>

                                            <div className="work-actions">

                                                {work.status !== "Completed" && (

                                                    <>
                                                        <button
                                                            type="button"
                                                            title="Update Work"
                                                            className="work-edit-btn"
                                                            onClick={() =>
                                                                handleEditWork(work)
                                                            }
                                                        >
                                                            <Pencil size={14} />
                                                        </button>


                                                        <button
                                                            type="button"
                                                            title="Mark Complete"
                                                            className="work-complete-btn"
                                                            onClick={() =>
                                                                handleCompleteWork(work)
                                                            }
                                                        >
                                                            <CheckCircle size={14} />
                                                        </button>
                                                    </>

                                                )}


                                                <button
                                                    type="button"
                                                    title="Delete Work"
                                                    className="work-delete-btn"
                                                    onClick={() =>
                                                        handleDeleteWork(work)
                                                    }
                                                >
                                                    <Trash2 size={14} />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* =================================================
               ADD / EDIT MODAL
            ================================================= */}

            {showForm && (

                <div className="pending-work-form-overlay">

                    <div className="pending-work-form-modal">

                        {/* =================================================
                           FORM HEADER
                        ================================================= */}

                        <div className="pending-work-form-header">

                            <div>

                                <h3>
                                    {editingWork
                                        ? "Update Pending Work"
                                        : "Add Pending Work"
                                    }
                                </h3>

                                <p>
                                    {editingWork
                                        ? "Update work information."
                                        : "Add new work for this client."
                                    }
                                </p>

                            </div>


                            <button
                                type="button"
                                className="pending-work-form-close"
                                onClick={handleCloseForm}
                            >
                                <X size={19} />
                            </button>

                        </div>


                        {/* =================================================
                           FORM
                        ================================================= */}

                        <form
                            className="pending-work-form"
                            onSubmit={handleSubmit}
                        >

                            <div className="pending-work-form-group">

                                <label>
                                    Work Description
                                    <span>*</span>
                                </label>

                                <textarea
                                    name="workDescription"
                                    value={formData.workDescription}
                                    onChange={handleChange}
                                    placeholder="Enter work description"
                                    rows="4"
                                />

                            </div>


                            <div className="pending-work-form-group">

                                <label>
                                    Assigned To
                                </label>

                                <input
                                    type="text"
                                    name="assignedTo"
                                    value={formData.assignedTo}
                                    onChange={handleChange}
                                    placeholder="Enter employee name"
                                />

                            </div>


                            <div className="pending-work-form-group">

                                <label>
                                    Due Date
                                </label>

                                <input
                                    type="date"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleChange}
                                />

                            </div>


                            {editingWork && (

                                <div className="pending-work-form-group">

                                    <label>
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={formData.status}
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

                            )}


                            <div className="pending-work-form-footer">

                                <button
                                    type="button"
                                    className="pending-work-cancel-btn"
                                    onClick={handleCloseForm}>
                                    Cancel
                                </button>


                                <button
                                  type="submit"
                                  className="pending-work-save-btn"
                                  disabled={saving}>
                                   {saving
                                      ? "Saving..."
                                      : editingWork
                                         ? "Update Work"
                                         : "Add Work"
                                    }
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </section>

    );

}

export default PendingWorkSection;