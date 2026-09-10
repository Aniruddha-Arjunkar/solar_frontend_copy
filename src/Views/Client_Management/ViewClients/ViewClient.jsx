import { useState, useEffect } from "react";
import {
    UsersRound
} from "lucide-react";

import ClientHeader
    from "./../../../Components/Client_Module_Components/ClientHeader/ClientHeader.jsx";

import ClientStats
    from "./../../../Components/LeadStats/LeadStats.jsx";

import ViewClientTable
    from "../../../Components/Client_Module_Components/ClientTable/ClientTable.jsx";

import ShowClientDetails 
       from  "./../../../Components/Client_Module_Components/ShowClientsDetails/ShowClientDetail.jsx";

import "./ViewClient.css";


function ViewClient() {

    /* =====================================================
       STATE
    ===================================================== */

    const [clientData, setClientData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedClient, setSelectedClient] = useState(null);
    const [activeAction, setActiveAction] = useState(null);


    /* =====================================================
       FETCH NON-GST CLIENTS
    ===================================================== */

    const fetchClients = async () => {

        try {

            setLoading(true);

            const response = await fetch(
                "http://localhost:8080/api/clients/non-gst"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch clients");
            }

            const data = await response.json();

            console.log("Non-GST Clients:", data);

            setClientData(data);

        } catch (error) {

            console.error("Error fetching clients:", error);

        } finally {

            setLoading(false);

        }
    };


    /* =====================================================
       FETCH CLIENTS WHEN PAGE LOADS
    ===================================================== */

    useEffect(() => {

        fetchClients();

    }, []);


    /* =====================================================
       ACTION HANDLER
    ===================================================== */

    const handleClientAction = (action, client) => {

        // console.log("Selected Action:", action);
        // console.log("Selected Client:", client);

        setSelectedClient(client);
        setActiveAction(action);

    };


    /* =====================================================
       TABLE COLUMNS
    ===================================================== */

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
            key: "amount",
            label: "Amount"
        },

        {
            key: "addedBy",
            label: "Added By"
        },

        {
            key: "vendor",
            label: "Vendor"
        }

    ];


    /* =====================================================
       CONVERT BACKEND DATA
       INTO TABLE DATA
    ===================================================== */

    const tableData = clientData.map((client) => ({

        id: client.id,

        name: client.custName || "-",

        contact: client.custPhone || "-",

        email: client.custEmail || "-",

        address: client.custAddress || "-",

        service: client.service || "-",

        amount:
            client.totalAmount !== null &&
            client.totalAmount !== undefined
                ? `₹${Number(client.totalAmount).toLocaleString("en-IN")}`
                : "₹0",

        addedBy:
            client.addedBy === "ADMIN"
                ? "Admin"
                : client.addedBy || "-",

        /*
         * Currently Client contains vendorId.
         * Later we can fetch vendor name from Vendor API.
         */
        vendor: client.vendorId
            ? client.vendorId
            : "-",

        /*
         * Keep original client object.
         * Useful when we implement View Details/Edit/Delete.
         */
        originalClient: client

    }));


    /* =====================================================
       STATISTICS
    ===================================================== */

    const Stats = [

        {
            title: "Total Clients",
            value: clientData.length
        }

    ];


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <section className="view-client-page">

            {/* ================= HEADER ================= */}

            <ClientHeader
                currectPage="View Clients"
                title="Client Management"
                description="View and manage all NON-GST registered clients."
                buttonType="gst"
                icon={UsersRound}
            />


            {/* ================= STATS ================= */}

            <ClientStats
                stats={Stats}
            />


            {/* ================= CLIENT TABLE ================= */}

            {loading ? (

                <div className="client-loading">
                    Loading clients...
                </div>

            ) : (

                <ViewClientTable
                    columns={Columns}
                    data={tableData}
                    onAction={handleClientAction}
                    type="view-client"
                    title="All Clients"
                    description="View and manage all registered clients."
                />
            )}

        {/* =============VIEW CLIENT DETAILS  =========== */}

           {activeAction === "view_detail" && selectedClient && (
              <ShowClientDetails
                client={selectedClient.originalClient}
                onClose={() => {
              setActiveAction(null);
              setSelectedClient(null);
        }}
       />
)}
        </section>
    );
}
export default ViewClient;