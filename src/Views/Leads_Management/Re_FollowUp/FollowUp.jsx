import { useState , useEffect} from "react";
import ModuleHeader from "./../../../Components/ModulePageHeader/ModulePageHeader.jsx";
import ModuleStats from "./../../../Components/LeadStats/LeadStats.jsx";
import ModuleTable from "./../../../Components/ModuleTable/ModuleTable.jsx";
import { PhoneCall } from "lucide-react";

//============== Action Button Forms ==================
import VisitForm from "./../../../Components/LeadForms/VitisForm/VisitForm.jsx";
import ScheduleForm from "../../../Components/LeadForms/ScheduleForm/ScheduleForm.jsx";
import ServiceForm from "../../../Components/LeadForms/ServiceForm/ServiceForm.jsx";
import ReFollowUpForm from "../../../Components/LeadForms/ReFollowupForm/ReFollowupForm.jsx";


import "./FollowUp.css";

function FollowUp(){

     const [LeadData, setLeadData] = useState([]);
     const [selectedLead, setSelectedLead] = useState(null);
     const[activeAction , setActiveAction] = useState(null);
    
     //Fetch Follow-ups from API
        const fetchFollowUps = () => {
    fetch("http://localhost:8080/api/leads/status/FOLLOW_UP")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch follow-ups");
            }
            return response.json();
        })
        .then((data) => {
            console.log("Follow-up Data:", data);
            setLeadData(data);
        })
        .catch((error) => {
            console.error(
                "Fetch Follow-up Error:",
                error
            );
        });
};

    //============== call Fetch Follow-ups ==============
     useEffect(() => { 
        fetchFollowUps(); 
    }, []);
    
    
    //======= Delete Lead ============
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

        fetchFollowUps();

    } catch (error) {

        console.error("Delete Lead Error:", error);

        window.alert(
            "Failed to delete lead. Please try again."
        );
    }
};

     //============== ACTION HANDLER ==============

     const handleACtion = async(action , lead) =>{

        // console.log("Action:", action);
        // console.log("Select Lead:", lead);
        if (action === "delete") {
        await handleDeleteLead(lead);
        return;
        }

        setSelectedLead(lead);
        setActiveAction(action);

     }

     const Stats = [
        {
            title: "Pending Follow-ups",
            value: 1
        },
        {
            title: "Today's Follow-ups",
            value: 1
        },
        {
            title: "Total Follow-ups",
            value: LeadData.length
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
            label: "Remarks"
        },
        {
            key: "followUpDate",
            label: "Follow-up Date"
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

    //============== Close Form ==============
      const handleCloseForm = () =>{
          setActiveAction(null);
          setSelectedLead(null);
      }

    return (
        <section className="follow_up">
            {/* ================= HEADER ================= */}
            <ModuleHeader
                currectPage="Follow-up"
                title="Follow-up Management"
                description="Track and manage customer follow-ups."
                buttonType="view"
                icon={PhoneCall}/>

            {/* ================= STATS ================= */}
            <ModuleStats
                stats={Stats}
            />

            {/* ================= TABLE ================= */}
            <ModuleTable columns={Columns} 
              data={LeadData}
              onAction={handleACtion}/>

            {/* ========= RE-FollowUp Form ============= */}
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
export default FollowUp;