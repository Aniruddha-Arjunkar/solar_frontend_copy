import { useEffect, useState } from "react";

import {
    Clock,
    LoaderCircle
} from "lucide-react";

import ClientHeader
    from "./../../../Components/Client_Module_Components/ClientHeader/ClientHeader.jsx";

import ClientStats
    from "./../../../Components/LeadStats/LeadStats.jsx";

import PendingClientTable
    from "./../../../Components/Client_Module_Components/ClientTable/ClientTable.jsx";

import EditPendingWork
    from "./../../../Components/Client_Module_Components/EditPendingWork/EditPendingWork.jsx";

import "./PendingWork.css";


function PendingWork() {

    // ============================================================
    // STATE
    // ============================================================

    const [pendingWorkData, setPendingWorkData] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [selectedWork, setSelectedWork] = useState(null);

    const [activeAction, setActiveAction] = useState(null);


    // ============================================================
    // TABLE COLUMNS
    // ============================================================

    const Columns = [

        {
            key: "id",
            label: "ID"
        },

        {
            key: "clientName",
            label: "Client Name"
        },

        {
            key: "workDescription",
            label: "Work Description"
        },

        {
            key: "assignedTo",
            label: "Assign To"
        },

        {
            key: "dueDate",
            label: "Due Date"
        },

        {
            key: "status",
            label: "Status"
        }

    ];


    // ============================================================
    // FETCH PENDING WORK
    // ============================================================

    const fetchPendingWork = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await fetch(
                "http://localhost:8080/api/pending-work/pending-with-client"
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to fetch pending work"
                );

            }


            const data = await response.json();


            /*
             * Backend returns PendingWorkResponse:
             *
             * id
             * clientId
             * clientName
             * workDescription
             * assignedTo
             * dueDate
             * status
             *
             * The DTO already contains the client name.
             */

            setPendingWorkData(data);

        } catch (error) {

            console.error(
                "Error fetching pending work:",
                error
            );

            setPendingWorkData([]);

            setError(
                "Unable to load pending work."
            );

        } finally {

            setLoading(false);

        }

    };


    // ============================================================
    // LOAD DATA
    // ============================================================

    useEffect(() => {

        fetchPendingWork();

    }, []);


    // ============================================================
    // STATS
    // ============================================================

    const Stats = [

        {
            title: "Total Pending Work",

            value: pendingWorkData.filter(
                (work) =>
                    work.status?.toLowerCase() !== "completed"
            ).length
        }

    ];


    // ============================================================
    // MARK WORK AS COMPLETE
    // ============================================================

    const handleMarkComplete = async (work) => {

        if (!work?.id) {

            console.error(
                "Pending work ID is missing."
            );

            return;

        }


        try {

            console.log(
                "Marking work as complete:",
                work
            );


            const response = await fetch(
                `http://localhost:8080/api/pending-work/${work.id}/complete`,
                {
                    method: "PUT"
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to mark pending work as complete."
                );

            }


            const completedWork =
                await response.json();


            console.log(
                "Pending Work Completed:",
                completedWork
            );


            // Refresh table
            await fetchPendingWork();


        } catch (error) {

            console.error(
                "Error marking pending work as complete:",
                error
            );

        }

    };


    // ============================================================
    // DELETE PENDING WORK
    // ============================================================

    const handleDeleteWork = async (work) => {

        if (!work?.id) {

            console.error(
                "Pending work ID is missing."
            );

            return;

        }


        try {

            console.log(
                "Deleting pending work:",
                work
            );


            const response = await fetch(
                `http://localhost:8080/api/pending-work/${work.id}`,
                {
                    method: "DELETE"
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to delete pending work."
                );

            }


            console.log(
                "Pending Work Deleted:",
                work.id
            );


            // Refresh table
            await fetchPendingWork();


        } catch (error) {

            console.error(
                "Error deleting pending work:",
                error
            );

        }

    };


    // ============================================================
    // ACTION HANDLER
    // ============================================================

    const handleWorkAction = (action, work) => {

        console.log(
            "Selected Action:",
            action
        );

        console.log(
            "Selected Work:",
            work
        );


        // ========================================================
        // UPDATE WORK
        // ========================================================

        if (action === "update_work") {

            setSelectedWork(work);

            setActiveAction("update_work");

            return;

        }


        // ========================================================
        // MARK COMPLETE
        // ========================================================

        if (action === "mark_complete") {

            handleMarkComplete(work);

            return;

        }


        // ========================================================
        // DELETE WORK
        // ========================================================

        if (action === "delete_work") {
             const confirmDelete = window.confirm(
             `Are you sure you want to delete this pending work for "${work.clientName}"?`
                );

            if (!confirmDelete) {
                    return;
                }

            handleDeleteWork(work);

            return;

           }

    };


    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {

        return (

            <section className="pending-work-page">

                <ClientHeader
                    currectPage="Pending Work"
                    title="Pending Client Work"
                    description="Track and manage pending work for clients."
                    buttonType="view"
                    icon={Clock}
                />

                <div className="pending-work-loading">

                    <LoaderCircle
                        size={30}
                        className="pending-work-loader"
                    />

                    <span>
                        Loading pending work...
                    </span>

                </div>

            </section>

        );

    }


    // ============================================================
    // ERROR
    // ============================================================

    if (error) {

        return (

            <section className="pending-work-page">

                <ClientHeader
                    currectPage="Pending Work"
                    title="Pending Client Work"
                    description="Track and manage pending work for clients."
                    buttonType="view"
                    icon={Clock}
                />

                <div className="pending-work-error">

                    {error}

                </div>

            </section>

        );

    }


    // ============================================================
    // MAIN UI
    // ============================================================

    return (

        <section className="pending-work-page">


            {/* ====================================================
                HEADER
            ==================================================== */}

            <ClientHeader
                currectPage="Pending Work"
                title="Pending Client Work"
                description="Track and manage pending work for clients."
                buttonType="view"
                icon={Clock}
            />


            {/* ====================================================
                STATS
            ==================================================== */}

            <ClientStats
                stats={Stats}
            />


            {/* ====================================================
                PENDING WORK TABLE
            ==================================================== */}

            <PendingClientTable
                columns={Columns}
                data={pendingWorkData}
                onAction={handleWorkAction}
                type="pending-work"
                title="Pending Client Work"
                description="Track and manage pending work for clients."
            />


            {/* ====================================================
                UPDATE PENDING WORK
            ==================================================== */}

            {activeAction === "update_work" &&
                selectedWork && (

                    <EditPendingWork

                        work={selectedWork}

                        onClose={() => {

                            setSelectedWork(null);

                            setActiveAction(null);

                        }}

                        onUpdated={() => {

                            fetchPendingWork();

                        }}

                    />

                )}

        </section>

    );

}


export default PendingWork;