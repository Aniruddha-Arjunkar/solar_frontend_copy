import { useState , useEffect} from "react";

import ModuleHeader from "./../../../Components/ModulePageHeader/ModulePageHeader.jsx";
import ModuleStats from "./../../../Components/LeadStats/LeadStats.jsx";
import ModuleTable from "./../../../Components/ModuleTable/ModuleTable.jsx";

import {MapPinHouse} from "lucide-react";
//========== Action Button Form ==================
import VisitForm from "./../../../Components/LeadForms/VitisForm/VisitForm.jsx";
import ReFollowUpForm from "./../../../Components/LeadForms/ReFollowupForm/ReFollowupForm.jsx";
import ServiceForm from "./../../../Components/LeadForms/ServiceForm/ServiceForm.jsx"
import ScheduleForm from "./../../../Components/LeadForms/ScheduleForm/ScheduleForm.jsx";


import "./Visit.css";

function Visit(){

    const [LeadData, setLeadData] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);
    const [activeAction, setActiveAction] = useState(null);

     
      const fetchVisitLeads = () => {

    fetch("http://localhost:8080/api/leads/status/VISIT")
        .then((response) => {

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch scheduled leads"
                );
            }

            return response.json();
        })

        .then((data) => {

            console.log(
                "Schedule Data:",
                data
            );

            setLeadData(data);

        })

        .catch((error) => {

            console.error(
                "Schedule Fetch Error:",
                error
            );

        });
};

// === Call Fetch fetchVisitLeads======
    useEffect(() => {
    fetchVisitLeads();
      }, []);

    //========== Delete Lead =============
    const handleDeleteLead = async (lead) => {

    const confirmed = window.confirm(
        `Are you sure you want to delete ${lead.name}?`
    );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:8080/api/leads/${lead.id}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            const errorText = await response.text();

            throw new Error(
                errorText || "Failed to delete lead."
            );
        }

        window.alert(
            `${lead.name} deleted successfully.`
        );

        fetchVisitLeads();

    } catch (error) {

        console.error("Delete Lead Error:", error);

        window.alert(
            "Failed to delete lead. Please try again."
        );
    }
};



    /* ================= ACTION HANDLER ================= */

    const handleAction = async (action, lead) => {

        // console.log("Action:", action);
        // console.log("Selected Lead:", lead);

        if (action === "delete") {
        await handleDeleteLead(lead);
        return;
        }

        setSelectedLead(lead);
        setActiveAction(action);

    };

    const Stats = [

        {
            title: "Total Visits",
            value: LeadData.length
        },

        {
            title: "Today's Visits",
            value: 0
        }
    ];


    const Columns = [
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
            key: "message",
            label: "Remark"
        },
        {
            key: "visitDate",
            label: "Visit Date"
        }
    ];


    // const Data = [

    //     {
    //         id: 1,
    //         name: "Sumit",
    //         contact: "7889455612",
    //         email: "sumit@gmail.com",
    //         address: "Pune",
    //         message: "Solar panel installation",
    //         date: "24 Aug 2026"
    //     },
    //     {
    //         id: 2,
    //         name: "Aniket Warhate",
    //         contact: "7845269856",
    //         email: "aniket@gmail.com",
    //         address: "Pune",
    //         message: "Solar consultation",
    //         date: "24 Aug 2026"
    //     },
    //     {
    //         id: 3,
    //         name: "Uday",
    //         contact: "7128316701",
    //         email: "uday@gmail.com",
    //         address: "Mumbai",
    //         message: "Solar maintenance",
    //         date: "23 Aug 2026"
    //     }

    // ];

     /* ================= CLOSE FORM ================= */

    const handleCloseForm = () => {
        setActiveAction(null);
        setSelectedLead(null);
    };

    return (
        <section className="visit">
            {/* ================= HEADER ================= */}
            <ModuleHeader
                currectPage="Visit"
                title="Visit Mangement"
                description="Keep Tract of all Visits."
                buttonType="view"
                icon={MapPinHouse}/>

            {/* ================= STATS ================= */}
            <ModuleStats
                stats={Stats}
            />

            {/* ================= TABLE ================= */}
            <ModuleTable columns={Columns} 
            data={LeadData} 
            onAction={handleAction}/>

            {/* ================= RE-FOLLOWUP FORM ================= */}
              {activeAction === "refollowup" && (
                <ReFollowUpForm
                    lead={selectedLead}
                    onClose={handleCloseForm}/>
              )}

            {/* ================= VISIT FORM ================= */}
              {activeAction === "visit" && (
                <VisitForm
                lead={selectedLead}
                onClose={handleCloseForm}/>
                )}

            {/* ================= SERVICE FORM ================= */}
               {activeAction === "service" && (
                 <ServiceForm
                  lead={selectedLead}
                  onClose={handleCloseForm}/>
             )}


        {/* ================= SCHEDULE FORM ================= */}
            {activeAction === "schedule" && (
              <ScheduleForm
              lead={selectedLead}
              onClose={handleCloseForm}/>
       )}
        </section>
    )
}
export default Visit;