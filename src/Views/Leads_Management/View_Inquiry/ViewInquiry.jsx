import { useState, useEffect } from "react";

import ModuleHeader from "./../../../Components/ModulePageHeader/ModulePageHeader.jsx";
import ModuleStats from "./../../../Components/LeadStats/LeadStats.jsx";
import ModuleTable from "./../../../Components/ModuleTable/ModuleTable.jsx";

//====== ACTION BUTTON FORMS ===============
import VisitForm from "./../../../Components/LeadForms/VitisForm/VisitForm.jsx";
import ReFollowUpForm from "./../../../Components/LeadForms/ReFollowupForm/ReFollowupForm.jsx";
import ServiceForm from "./../../../Components/LeadForms/ServiceForm/ServiceForm.jsx"
import ScheduleForm from "./../../../Components/LeadForms/ScheduleForm/ScheduleForm.jsx";

import API_BASE_URL from "./../../../config/api.js";

import { Users } from "lucide-react";

import "./ViewInquiry.css";
import { useNavigate } from "react-router";


function ViewInquiry() {

    const [selectedLead, setSelectedLead] = useState(null);
    const [activeAction, setActiveAction] = useState(null);
    const [LeadData, setLeadData] = useState([]);

    const navigate = useNavigate();

    // Fetch All Leads from API

    const fetchLeads = () => {
        fetch(`${API_BASE_URL}/leads/status/NEW`)
        .then((responce) => {
            if(!responce.ok){
                throw new Error("Failed to Fetch Leads")
            }
            return responce.json();
        })
        .then((data) => {
            setLeadData(data);
        })
        .catch((error) => {
            window.alert("Fail to Fetch Leads",error);
        })
    }
    // const fetchLeads = () => {

    //     Promise.all([
    //         fetch(`${API_BASE_URL}/leads/status/NEW`),
    //         fetch(`${API_BASE_URL}/leads/status/QUOTATION`)
    //     ])
    //         .then(async ([newResponse, quotationResponse]) => {

    //             if (!newResponse.ok || !quotationResponse.ok) {
    //                 throw new Error("Failed to Fetch Leads");
    //             }

    //             const newLeads = await newResponse.json();
    //             const quotationLeads = await quotationResponse.json();
    //             return [
    //                 ...newLeads,
    //                 ...quotationLeads
    //             ];
    //         })
    //         .then((data) => {
    //             setLeadData(data);
    //         })
    //         .catch((error) => {
    //             console.error(
    //                 "Fetch Leads Error:",
    //                 error
    //             );
    //             window.alert(
    //                 "Failed to Fetch Leads. Please try again."
    //             );
    //         });
    // };

    useEffect(() => {
        fetchLeads();
    }, []);


    /* ================= ACTION HANDLER ================= */

    const handleAction = async (action, lead) => {

        // console.log("Action:", action);
        // console.log("Selected Lead:", lead);

        if (action === "quotation") {

            navigate(
                `/dashboard/add-quotation/${lead.id}`
            );
            return;
        }

        if (action === "delete") {
            await handleDeleteLead(lead)
            return;
        }

        setSelectedLead(lead);
        setActiveAction(action);

    };

    /* ================= DELETE LEAD ================= */
    const handleDeleteLead = async (lead) => {
        //confirm Delete
        const confirmed = window.confirm(
            `Are you sure you want to delete ${lead.name}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            //Delete Request
            const response = await fetch(
                `${API_BASE_URL}/leads/${lead.id}`,
                {
                    method: "DELETE"
                }
            );

            //Check Response
            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Failed to delete lead."
                );
            }

            //Success
            window.alert(
                `${lead.name} deleted successfully.`
            );

            //Refresh Table
            fetchLeads();
        }
        catch (error) {
            console.error(
                "Delete Lead Error:",
                error
            );

            window.alert(
                "Failed to delete lead. Please try again."
            );
        }
    };


    /* ================= STATS ================= */

    // const stats = [

    //     {
    //         title: "Total Inquiry",
    //         value: LeadData.length
    //     },

    //     {
    //         title: "Today's Inquiry",
    //         value: 0
    //     },

    //     {
    //         title: "Pending Inquiry",
    //         value: LeadData.length
    //     }

    // ];


    /* ================= TABLE COLUMNS ================= */

    const columns = [

        {
            key: "id",
            label: "ID"
        },

        {
            key: "name",
            label: "Name"
        },

        {
            key: "contact",
            label: "Contact"
        },

        {
            key: "email",
            label: "Email"
        },

        {
            key: "address",
            label: "Address"
        },
        {
            key: "serviceType",
            label: "Interested Servive"
        },
        {
            key: "message",
            label: "Message"
        },
        // {
        //     key:"status",
        //     label:"Status"
        // },
        {
            key: "inquiryDate",
            label: "Date"
        }

    ];


    /* ================= CLOSE FORM ================= */
    const handleCloseForm = () => {
        setActiveAction(null);
        setSelectedLead(null);
    };


    return (

        <section className="view_inquiry-page">

            {/* ================= HEADER ================= */}

            <ModuleHeader
                currectPage="View Inquiry"
                title="Inquiry Management"
                description="View and manage customer inquiries."
                buttonType="add"
                icon={Users}
            />


            {/* ================= STATS ================= */}

            {/* <ModuleStats
                stats={stats}
            /> */}

            {/* ================= TABLE ================= */}

            <ModuleTable
                columns={columns}
                data={LeadData}
                onAction={handleAction}
            />


            {/* ================= RE-FOLLOWUP FORM ================= */}
            {activeAction === "refollowup" && (
                <ReFollowUpForm
                    lead={selectedLead}
                    onClose={handleCloseForm} />
            )}

            {/* ================= VISIT FORM ================= */}
            {activeAction === "visit" && (
                <VisitForm
                    lead={selectedLead}
                    onClose={handleCloseForm} />
            )}

            {/* ================= SERVICE FORM ================= */}
            {activeAction === "service" && (
                <ServiceForm
                    lead={selectedLead}
                    onClose={handleCloseForm} />
            )}


            {/* ================= SCHEDULE FORM ================= */}
            {activeAction === "schedule" && (
                <ScheduleForm
                    lead={selectedLead}
                    onClose={handleCloseForm} />
            )}

        </section>

    );
}


export default ViewInquiry;