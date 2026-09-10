import { useEffect, useState } from "react";

import ModuleStats from "./../../../Components/LeadStats/LeadStats.jsx";
import ModuleHeader from "./../../../Components/ModulePageHeader/ModulePageHeader.jsx";
import ModuleTable from "./../../../Components/ModuleTable/ModuleTable.jsx";

import { FileText } from "lucide-react";

import "./Quotation.css";


function Quotation() {

    const [Data, setData] = useState([]);

    // FETCH QUOTATIONS
    
    useEffect(() => {

        fetch("http://localhost:8080/api/leads/quotations")

            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch quotations");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Quotation Data:", data);
                setData(data);
            })
            .catch((error) => {
                console.error(
                    "Error fetching quotations:",
                    error
                );
            });
    }, []);


    //  To Open the PDF
    const handleViewPdf = async (row) => {
    // console.log("Selected quotation lead:", row);
    try {

        // ROW ID IS THE LEAD ID
       
        const leadId = row.id;

        if (!leadId) {
            alert("Lead ID is not available.");
            return;
        }

        // FETCH QUOTATIONS FOR THIS LEAD

        const response = await fetch(
            `http://localhost:8080/api/quotations/lead/${leadId}`
        );

        if (!response.ok) {

            throw new Error(
                "Failed to fetch quotation for this lead."
            );
        }

        const quotations = await response.json();

        console.log(
            "Quotations for lead:",
            quotations
        );

        // CHECK QUOTATION EXISTS
        if (
            !quotations ||
            quotations.length === 0
        ) {

            alert(
                "No quotation found for this lead."
            );
            return;
        }

        // GET LATEST QUOTATION
        const quotation = [...quotations].sort(
            (a, b) => b.id - a.id
        )[0];

        const quotationId = quotation.id;

        console.log(
            "Selected quotation ID:",
            quotationId
        );

        // Open PDF
        const pdfUrl =
            `http://localhost:8080/api/quotations/${quotationId}/pdf`;

        window.open(
            pdfUrl,
            "_blank"         
        );

    } catch (error) {
        console.error(
            "View quotation PDF error:",
            error
        );

        alert(
            "Unable to open quotation PDF."
        );
    }

};


    // Stats 
    const Stats = [

        {
            title: "Total Quotation Sended",
            value: Data.length
        }

    ];


    // Table Columns

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
            key: "quotationDate",
            label: "Quotation Date"
        },
        {
              key: "pdf",
              label: "PDF",
              type: "pdf",
               onClick: handleViewPdf
        }
    ];


    return (

        <section className="quotation">


            {/* ================= HEADER ================= */}

            <ModuleHeader
                currectPage="Quotations"
                title="Quotation Management"
                description="View and manage quotations sent to customers."
                buttonType="view"
                icon={FileText}
            />


            {/* ================= STATS ================= */}

            <ModuleStats
                stats={Stats}
            />


            {/* ================= TABLE ================= */}

            <ModuleTable
                columns={Columns}
                data={Data}
                showAction={false}
                onPdf={handleViewPdf}
            />


        </section>

    );

}


export default Quotation;