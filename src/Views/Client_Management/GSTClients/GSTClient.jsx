import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
    FileText
} from "lucide-react";

import ClientHeader
    from "./../../../Components/Client_Module_Components/ClientHeader/ClientHeader.jsx";

import ClientStats
    from "./../../../Components/LeadStats/LeadStats.jsx";

import GSTClientTable
    from "./../../../Components/Client_Module_Components/ClientTable/ClientTable.jsx";

import ShowClientDetail from 
         "./../../../Components/Client_Module_Components/ShowClientsDetails/ShowClientDetail.jsx";    
import "./GSTClient.css";


function GSTClient() {

    const [GSTClientData, setGSTClientData] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [activeAction, setActiveAction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();


    // ====================================================
    // FETCH GST CLIENTS
    // ====================================================

    const fetchGSTClients = async () => {

        try {

            setLoading(true);

            setError(null);


            const response = await fetch(
                "http://localhost:8080/api/clients/gst"
            );


            // =================================================
            // CHECK RESPONSE
            // =================================================

            if (!response.ok) {

                throw new Error(
                    "Failed to fetch GST clients."
                );
            }


            // =================================================
            // GET BACKEND DATA
            // =================================================

            const data = await response.json();


            console.log(
                "GST Clients from Backend:",
                data
            );


            // =================================================
            // FORMAT DATA FOR CLIENT TABLE
            // =================================================

            const formattedClients = data.map((client) => ({

                id: client.id,

                name: client.custName,

                contact: client.custPhone,

                email: client.custEmail,

                address: client.custAddress,

                service: client.service,

                serviceDate: client.serviceDate,

                // Keep complete backend client object
                // for View Detail later.

                originalClient: client

            }));


            setGSTClientData(formattedClients);

        } catch (error) {

            console.error(
                "Error fetching GST clients:",
                error
            );

            setError(
                "Unable to load GST clients."
            );

        } finally {

            setLoading(false);
        }
    };


    // ====================================================
    // LOAD GST CLIENTS WHEN PAGE OPENS
    // ====================================================

    useEffect(() => {

        fetchGSTClients();

    }, []);


    // ====================================================
    // ACTION HANDLER
    // ====================================================

    const handleClientAction = (action, client) => {

        console.log(
            "Selected Action:",
            action
        );

        console.log(
            "Selected Client:",
            client
        );
         
        if (action === "generate_invoice") {
        navigate(
            `/dashboard/generate-invoice/${client.id}`
        );
        return;
      }

        setSelectedClient(client);

        setActiveAction(action);
    };


    // ====================================================
    // STATISTICS
    // ====================================================

    const Stats = [

        {
            title: "Total GST Clients",

            value: GSTClientData.length
        }

    ];


    // ====================================================
    // TABLE COLUMNS
    // ====================================================

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
            key: "service",
            label: "Service"
        },

        {
            key: "serviceDate",
            label: "Service Date"
        }

    ];


    // ====================================================
    // LOADING STATE
    // ====================================================

    if (loading) {

        return (

            <section className="gst-client-page">

                <ClientHeader
                    currectPage="GST Clients"
                    title="GST Client Management"
                    description="View and manage clients with GST information."
                    buttonType="view"
                    icon={FileText}
                />

                <div className="gst-client-loading">

                    Loading GST clients...

                </div>

            </section>

        );
    }


    // ====================================================
    // ERROR STATE
    // ====================================================

    if (error) {

        return (

            <section className="gst-client-page">

                <ClientHeader
                    currectPage="GST Clients"
                    title="GST Client Management"
                    description="View and manage clients with GST information."
                    buttonType="view"
                    icon={FileText}
                />

                <div className="gst-client-error">

                    {error}

                </div>

            </section>

        );
    }


    // ====================================================
    // PAGE
    // ====================================================

    return (

        <section className="gst-client-page">


            {/* =================================================
               PAGE HEADER
            ================================================= */}

            <ClientHeader
                currectPage="GST Clients"
                title="GST Client Management"
                description="View and manage clients with GST information."
                buttonType="view"
                icon={FileText}
            />


            {/* =================================================
               GST CLIENT STATS
            ================================================= */}

            <ClientStats
                stats={Stats}
            />


            {/* =================================================
               GST CLIENT TABLE
            ================================================= */}

            <GSTClientTable
                columns={Columns}

                data={GSTClientData}

                onAction={handleClientAction}

                type="gst-client"

                title="GST Clients"

                description="View and manage clients with GST information."
            />


         {/* =================================================
             CLIENT DETAILS
           ================================================= */}

        {activeAction === "view_detail" && selectedClient && (
           <ShowClientDetail
              client={selectedClient.originalClient}
              onClose={() => {
                 setSelectedClient(null);
                 setActiveAction(null);
        }} />
        )}
        </section>
    );
}


export default GSTClient;