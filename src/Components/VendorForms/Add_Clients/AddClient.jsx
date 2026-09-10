import {
    X,
    User,
    Phone,
    Mail,
    MapPin,
    IndianRupee,
    Wrench,
    Save
} from "lucide-react";

import { useState } from "react";

import "./AddClient.css";


function AddClient({ vendor, onClientAdded, onClose }) {

    /* =====================================================
       FORM DATA
    ===================================================== */

    const [formData, setFormData] = useState({
        name: "",
        contact: "",
        email: "",
        address: "",
        totalAmount: "",
        service: ""
    });


    /* =====================================================
       HANDLE INPUT CHANGE
    ===================================================== */

    const handleChange = (e) => {

        const { id, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [id]: value
        }));
    };


   /* =====================================================
   HANDLE FORM SUBMIT
===================================================== */

const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        const clientData = {
            custName: formData.name,
            custPhone: formData.contact,
            custEmail: formData.email,
            custAddress: formData.address,
            service: formData.service,
            totalAmount: Number(formData.totalAmount),
            applyGst: false
        };


        console.log("Sending Client Data:", clientData);


        /* =================================================
           SEND CLIENT TO BACKEND
        ================================================= */

        const response = await fetch(
            `http://localhost:8080/api/clients/vendor/${vendor.id}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(clientData)
            }
        );

        /* =================================================
           HANDLE BACKEND ERROR
        ================================================= */

        if (!response.ok) {
            throw new Error(
                "Failed to add client"
            );
        }


        /* =================================================
           GET SAVED CLIENT
        ================================================= */

        const savedClient =
            await response.json();


        console.log(
            "Client Saved Successfully:",
            savedClient
        );


        /* =================================================
           SEND SAVED CLIENT TO PARENT
        ================================================= */

        if (onClientAdded) {
            onClientAdded(savedClient);
        }

        /* =================================================
           SUCCESS MESSAGE
        ================================================= */

        window.alert(
            "Client Added Successfully."
        );

        } catch (error) {
              console.error(
                "Error adding client:",error);

        window.alert(
            "Failed to add client. Please try again."
        );
      }
    };

    return (

        <div className="client-form-overlay">

            {/* =================================================
                CLIENT FORM CONTAINER
            ================================================= */}

            <div className="add-client-form-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="client-form-header">

                    <div>

                        <h2>
                            Add Client
                        </h2>

                        <p>
                            Enter the client's information and details below.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="client-form-close"
                        onClick={onClose}
                    >
                        <X size={22} />
                    </button>

                </div>


                {/* =================================================
                    CLIENT DETAILS
                ================================================= */}

                <div className="client-form-section">


                    {/* =================================================
                        SECTION TITLE
                    ================================================= */}

                    <div className="client-form-section-title">

                        <User size={19} />

                        <h3>
                            Client Details
                        </h3>

                    </div>


                    {/* =================================================
                        FORM
                    ================================================= */}

                    <form
                        className="client-form"
                        onSubmit={handleSubmit}
                    >


                        <div className="client-form-grid">


                            {/* =================================================
                                CLIENT NAME
                            ================================================= */}

                            <div className="client-form-group">

                                <label htmlFor="name">

                                    Client Name

                                    <span>*</span>

                                </label>


                                <div className="client-input-wrapper">

                                    <User size={18} />

                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Enter client name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>


                            {/* =================================================
                                CONTACT
                            ================================================= */}

                            <div className="client-form-group">

                                <label htmlFor="contact">

                                    Contact Number

                                    <span>*</span>

                                </label>


                                <div className="client-input-wrapper">

                                    <Phone size={18} />

                                    <input
                                        id="contact"
                                        type="tel"
                                        placeholder="Enter contact number"
                                        value={formData.contact}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>


                            {/* =================================================
                                EMAIL
                            ================================================= */}

                            <div className="client-form-group">

                                <label htmlFor="email">

                                    Email Address

                                </label>


                                <div className="client-input-wrapper">

                                    <Mail size={18} />

                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Enter email address"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />

                                </div>

                            </div>


                            {/* =================================================
                                ADDRESS
                            ================================================= */}

                            <div className="client-form-group">

                                <label htmlFor="address">

                                    Address

                                    <span>*</span>

                                </label>


                                <div className="client-input-wrapper">

                                    <MapPin size={18} />

                                    <input
                                        id="address"
                                        type="text"
                                        placeholder="Enter client address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>


                            {/* =================================================
                                TOTAL AMOUNT
                            ================================================= */}

                            <div className="client-form-group">

                                <label htmlFor="totalAmount">

                                    Total Amount

                                    <span>*</span>

                                </label>


                                <div className="client-input-wrapper">

                                    <IndianRupee size={18} />

                                    <input
                                        id="totalAmount"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="Enter total amount"
                                        value={formData.totalAmount}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>


                            {/* =================================================
                                SERVICE
                            ================================================= */}

                            <div className="client-form-group">

                                <label htmlFor="service">

                                    Service

                                    <span>*</span>

                                </label>


                                <div className="client-input-wrapper">

                                    <Wrench size={18} />

                                    <select
                                        id="service"
                                        value={formData.service}
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="">
                                            Select service
                                        </option>

                                        <option value="Solar Installation">
                                            Solar Installation
                                        </option>

                                        <option value="Solar Maintenance">
                                            Solar Maintenance
                                        </option>

                                        <option value="Solar Repair">
                                            Solar Repair
                                        </option>

                                        <option value="Solar Site Survey">
                                            Solar Site Survey
                                        </option>

                                        <option value="Solar Consultation">
                                            Solar Consultation
                                        </option>

                                        <option value="Solar System Upgrade">
                                            Solar System Upgrade
                                        </option>

                                        <option value="Other">
                                            Other
                                        </option>

                                    </select>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            FORM FOOTER
                        ================================================= */}

                        <div className="client-form-footer">


                            {/* =================================================
                                CANCEL
                            ================================================= */}

                            <button
                                type="button"
                                className="client-form-cancel"
                                onClick={onClose}
                            >

                                <X size={18} />

                                Cancel

                            </button>


                            {/* =================================================
                                SAVE CLIENT
                            ================================================= */}

                            <button
                                type="submit"
                                className="client-form-save"
                            >

                                <Save size={18} />

                                Save Client

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
}


export default AddClient;