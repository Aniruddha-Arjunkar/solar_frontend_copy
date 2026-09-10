import { useEffect, useState } from "react";

import {
    UsersRound,
    LoaderCircle
} from "lucide-react";

import VendorHeader
    from "./../../../Components/Vendor_Module_Components/VendorHeader/VendorHeader.jsx";

import VendorStats
    from "./../../../Components/LeadStats/LeadStats.jsx";

import VendorTable
    from "./../../../Components/Vendor_Module_Components/VendorTable/VendorTable.jsx";

import AddClient
    from "./../../../Components/VendorForms/Add_Clients/AddClient.jsx";

import ShowVendorDetail
    from "./../../../Components/VendorForms/ShowVendorDetail/ShowVendorDetail.jsx";

import "./ViewVendor.css";


function ViewVendor() {

    const [vendorData, setVendorData] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [selectedVendor, setSelectedVendor] = useState(null);

    const [activeAction, setActiveAction] = useState(null);

    const [clientData, setClientData] = useState([]);

    const [clientLoading, setClientLoading] = useState(false);

    const [clientError, setClientError] = useState("");


    // ============================================================
    // TABLE COLUMNS
    // ============================================================

    const Columns = [

        {
            key: "id",
            label: "ID"
        },

        {
            key: "vendorName",
            label: "Vendor Name"
        },

        {
            key: "phone",
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
            key: "remarks",
            label: "Additional Remarks"
        }

    ];


    // ============================================================
    // FETCH VENDORS
    // ============================================================

    const fetchVendors = async () => {

        try {

            setLoading(true);

            setError("");


            // ====================================================
            // GET VENDORS FROM BACKEND
            // ====================================================

            const response = await fetch(
                "http://localhost:8080/api/vendors"
            );


            // ====================================================
            // CHECK RESPONSE
            // ====================================================

            if (!response.ok) {

                throw new Error(
                    "Failed to fetch vendors."
                );

            }


            // ====================================================
            // CONVERT RESPONSE TO JSON
            // ====================================================

            const data = await response.json();


            console.log(
                "Vendors fetched successfully:",
                data
            );


            // ====================================================
            // STORE VENDORS
            // ====================================================

            setVendorData(data);


        } catch (error) {

            console.error(
                "Error fetching vendors:",
                error
            );


            setVendorData([]);

            setError(
                "Unable to load vendors."
            );


        } finally {

            setLoading(false);

        }

    };


    // ============================================================
    // LOAD VENDORS WHEN PAGE OPENS
    // ============================================================

    useEffect(() => {

        fetchVendors();

    }, []);


    // ============================================================
    // FETCH CLIENTS FOR SELECTED VENDOR
    // ============================================================

    const fetchVendorClients = async (vendorId) => {

        try {

            setClientLoading(true);

            setClientError("");

            setClientData([]);


            // ====================================================
            // GET CLIENTS OF SELECTED VENDOR
            // ====================================================

            const response = await fetch(
                `http://localhost:8080/api/clients/vendor/${vendorId}`
            );


            // ====================================================
            // CHECK RESPONSE
            // ====================================================

            if (!response.ok) {

                throw new Error(
                    "Failed to fetch vendor clients."
                );

            }


            // ====================================================
            // CONVERT RESPONSE TO JSON
            // ====================================================

            const data = await response.json();


            console.log(
                "Clients fetched for vendor:",
                vendorId,
                data
            );


            // ====================================================
            // STORE CLIENT DATA
            // ====================================================

            setClientData(data);


        } catch (error) {

            console.error(
                "Error fetching vendor clients:",
                error
            );


            setClientData([]);

            setClientError(
                "Unable to load clients for this vendor."
            );


        } finally {

            setClientLoading(false);

        }

    };


    // ============================================================
    // VENDOR ACTION HANDLER
    // ============================================================

    const handleVendorAction = (action, vendor) => {

        console.log(
            "Action:",
            action
        );

        console.log(
            "Selected Vendor:",
            vendor
        );


        // ========================================================
        // STORE SELECTED VENDOR
        // ========================================================

        setSelectedVendor(vendor);


        // ========================================================
        // ADD CLIENT
        // ========================================================

        if (action === "add_client") {

            setClientData([]);

            setClientError("");

            setActiveAction("add_client");

            return;

        }


        // ========================================================
        // SHOW VENDOR DETAILS
        // ========================================================

        if (action === "show_details") {

            setClientData([]);

            setClientError("");

            setActiveAction("show_details");


            // ====================================================
            // FETCH CLIENTS FROM BACKEND
            // ====================================================

            fetchVendorClients(vendor.id);

            return;

        }


        // ========================================================
        // DEFAULT ACTION
        // ========================================================

        setActiveAction(action);

    };


    // ============================================================
    // CLOSE ACTION
    // ============================================================

    const handleCloseAction = () => {

        setActiveAction(null);

        setSelectedVendor(null);

        setClientData([]);

        setClientError("");

    };


    // ============================================================
    // CLIENT ADDED
    // ============================================================

    const handleClientAdded = (client) => {

        console.log(
            "Client added successfully:",
            client
        );


        /*
         * Since the backend has already saved the client,
         * add the returned client to the current client list.
         */

        setClientData((previousClients) => [

            ...previousClients,

            client

        ]);


        setActiveAction(null);

        setSelectedVendor(null);

    };


    // ============================================================
    // STATS
    // ============================================================

    const Stats = [

        {
            title: "Total Vendors",
            value: vendorData.length
        }

    ];


    // ============================================================
    // LOADING UI
    // ============================================================

    if (loading) {

        return (

            <section className="view-vendor-page">


                {/* ==================================================
                    HEADER
                ================================================== */}

                <VendorHeader
                    currectPage="View Vendors"
                    title="Vendor Management"
                    description="View and manage all registered vendors."
                    buttonType="add"
                    icon={UsersRound}
                />


                {/* ==================================================
                    LOADING
                ================================================== */}

                <div className="vendor-loading">

                    <LoaderCircle
                        size={30}
                        className="vendor-loading-icon"
                    />

                    <span>
                        Loading vendors...
                    </span>

                </div>


            </section>

        );

    }


    // ============================================================
    // ERROR UI
    // ============================================================

    if (error) {

        return (

            <section className="view-vendor-page">


                {/* ==================================================
                    HEADER
                ================================================== */}

                <VendorHeader
                    currectPage="View Vendors"
                    title="Vendor Management"
                    description="View and manage all registered vendors."
                    buttonType="add"
                    icon={UsersRound}
                />


                {/* ==================================================
                    ERROR
                ================================================== */}

                <div className="vendor-error">

                    {error}

                </div>


            </section>

        );

    }


    // ============================================================
    // MAIN UI
    // ============================================================

    return (

        <section className="view-vendor-page">


            {/* ====================================================
                HEADER
            ==================================================== */}

            <VendorHeader
                currectPage="View Vendors"
                title="Vendor Management"
                description="View and manage all registered vendors."
                buttonType="add"
                icon={UsersRound}
            />


            {/* ====================================================
                STATS
            ==================================================== */}

            <VendorStats
                stats={Stats}
            />


            {/* ====================================================
                VENDOR TABLE
            ==================================================== */}

            <VendorTable
                columns={Columns}
                data={vendorData}
                onAction={handleVendorAction}
                showAction={true}
            />


            {/* ====================================================
                ADD CLIENT
            ==================================================== */}

            {activeAction === "add_client" && (

                <AddClient
                    vendor={selectedVendor}
                    onClientAdded={handleClientAdded}
                    onClose={handleCloseAction}
                />

            )}


            {/* ====================================================
                VIEW VENDOR DETAILS
            ==================================================== */}

            {activeAction === "show_details" && (

                <ShowVendorDetail
                    vendor={selectedVendor}
                    clients={clientData}
                    onClose={handleCloseAction}
                />

            )}


            {/* ====================================================
                CLIENT LOADING
            ==================================================== */}

            {activeAction === "show_details" &&
                clientLoading && (

                    <div className="vendor-client-loading">

                        <LoaderCircle
                            size={28}
                            className="vendor-loading-icon"
                        />

                        <span>
                            Loading clients...
                        </span>

                    </div>

                )}


            {/* ====================================================
                CLIENT ERROR
            ==================================================== */}

            {activeAction === "show_details" &&
                clientError && (

                    <div className="vendor-client-error">

                        {clientError}

                    </div>

                )}

        </section>

    );

}


export default ViewVendor;