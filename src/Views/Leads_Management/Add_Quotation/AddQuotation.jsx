import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowBigLeft } from "lucide-react";

import "./AddQuotation.css";

function AddQuotation() {

    const { leadId } = useParams();
    const navigate = useNavigate();

    // ================= LEAD DATA =================

    const [lead, setLead] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);


    // ================= QUOTATION FORM =================

    const [formData, setFormData] = useState({

        quotationNo: "",
        quotationDate: "",

        clientName: "",
        clientPhone: "",
        clientAddress: "",
        phaseType: "",
        subject: "",

        pvPlantSize: "",
        gstIncluded:true,
        systemType: "",
        powerGenerationMonth: "",
        powerGenerationYear: "",
        totalSystemCost: "",
        minAnnualSaving: "",
        investmentRecoveryYears: "",

        supplyInstallation: "",
        commercialTotal: "",
        actualProjectCost: "",
        gstAmount: "",
        govtSubsidy: "",

        status: "DRAFT"
    });


    // ================= COMPONENT ITEMS =================

    const [items, setItems] = useState([
        {
            itemName: "Solar Panels",
            specification: "",
            make: "",
            quantity: ""
        },
        {
            itemName: "Inverter",
            specification: "",
            make: "",
            quantity: ""
        },
        {
            itemName: "Cables/Wires",
            specification: "",
            make: "",
            quantity: ""
        },
        {
            itemName: "Mounting Structure",
            specification: "",
            make: "",
            quantity: ""
        },
        {
            itemName: "DC Junction Box",
            specification: "",
            make: "",
            quantity: ""
        },
        {
            itemName: "AC Distribution Board",
            specification: "",
            make: "",
            quantity: ""
        },
        {
            itemName: "Earthing",
            specification: "",
            make: "",
            quantity: ""
        },
        {
            itemName: "Net Meter",
            specification: "",
            make: "",
            quantity: ""
        }
    ]);


    // ================= FETCH LEAD =================

    useEffect(() => {

        fetch(`http://localhost:8080/api/leads/${leadId}`)
            .then((response) => {

                if (!response.ok) {
                    throw new Error("Lead not found");
                }

                return response.json();
            })
            .then((data) => {

                setLead(data);

                setFormData((previousData) => ({
                    ...previousData,

                    clientName: data.name || "",
                    clientPhone: data.contact || "",
                    clientAddress: data.address || "",

                    quotationDate: data.quotationDate || ""
                }));
            })
            .catch((error) => {

                console.error("Error fetching lead:", error);

                alert("Unable to load lead information.");

            })
            .finally(() => {

                setLoading(false);
            });

    }, [leadId]);


    // ================= HANDLE INPUT =================

    const handleChange = (event) => {

        const { name, value, type, checked } = event.target;

        setFormData((previousData) => ({
            ...previousData,

            [name]: type === "checkbox" ? checked : value
        }));
    };


    // ================= HANDLE ITEM CHANGE =================

    const handleItemChange = (index, event) => {

        const { name, value } = event.target;

        setItems((previousItems) => {

            const updatedItems = [...previousItems];

            updatedItems[index] = {
                ...updatedItems[index],
                [name]: value
            };

            return updatedItems;
        });
    };


    // ================= ADD ITEM =================

    const addItem = () => {

        setItems((previousItems) => [
            ...previousItems,
            {
                itemName: "",
                specification: "",
                make: "",
                quantity: ""
            }
        ]);
    };


    // ================= REMOVE ITEM =================

    const removeItem = (index) => {

        setItems((previousItems) =>
            previousItems.filter(
                (_, itemIndex) => itemIndex !== index
            )
        );
    };


    // ================= SUBMIT =================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setSaving(true);

        const quotationData = {

            quotationNo: formData.quotationNo,
            quotationDate: formData.quotationDate,

            clientName: formData.clientName,
            clientPhone: formData.clientPhone,
            clientAddress: formData.clientAddress,
            phaseType: formData.phaseType,
            subject: formData.subject,

            pvPlantSize: formData.pvPlantSize
                ? Number(formData.pvPlantSize)
                : null,

            gstIncluded: formData.gstIncluded,

            systemType: formData.systemType,

            powerGenerationMonth: formData.powerGenerationMonth
                ? Number(formData.powerGenerationMonth)
                : null,

            powerGenerationYear: formData.powerGenerationYear
                ? Number(formData.powerGenerationYear)
                : null,

            totalSystemCost: formData.totalSystemCost
                ? Number(formData.totalSystemCost)
                : null,

            minAnnualSaving: formData.minAnnualSaving
                ? Number(formData.minAnnualSaving)
                : null,

            investmentRecoveryYears:
                formData.investmentRecoveryYears
                    ? Number(formData.investmentRecoveryYears)
                    : null,

            supplyInstallation:
                formData.supplyInstallation
                    ? Number(formData.supplyInstallation)
                    : null,

            commercialTotal:
                formData.commercialTotal
                    ? Number(formData.commercialTotal)
                    : null,

            actualProjectCost:
                formData.actualProjectCost
                    ? Number(formData.actualProjectCost)
                    : null,

            gstAmount:
                formData.gstAmount
                    ? Number(formData.gstAmount)
                    : null,

            govtSubsidy:
                formData.govtSubsidy
                    ? Number(formData.govtSubsidy)
                    : null,

            status: "DRAFT",

            items: items.filter(
                (item) => item.itemName.trim() !== ""
            )
        };


        try {

            const response = await fetch(
                `http://localhost:8080/api/quotations/lead/${leadId}`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(quotationData)
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to save quotation"
                );
            }


            const savedQuotation = await response.json();


            alert("Quotation saved successfully!");


            navigate("/dashboard/quotations");


        } catch (error) {


            alert(
                "Failed to save quotation. Please try again."
            );

        } finally {

            setSaving(false);
        }
    };


    // ================= LOADING =================

    if (loading) {

        return (
            <div className="add-quotationpage-loading">
                Loading customer information...
            </div>
        );
    }


    // ================= ERROR =================

    if (!lead) {

        return (
            <div className="add-quotationpage-error">

                <h2>
                    Lead not found
                </h2>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/dashboard/view-inquiry")
                    }
                >
                    Back to View Inquiry
                </button>

            </div>
        );
    }


    return (

        <section className="add-quotationpage-page">

            {/* ================= PAGE HEADER ================= */}

            <div className="add-quotationpage-header">

                <div>

                    <p className="add-quotationpage-breadcrumb">
                        Dashboard / Leads Management / Add Quotation
                    </p>

                    <h1>
                        Add Quotation
                    </h1>

                </div>


                <button
                    type="button"
                    className="add-quotationpage-back-button"
                    onClick={() =>
                        navigate("/dashboard/view-inquiry")
                    }
                >
                    <ArrowBigLeft size={20} />
                    Back
                </button>

            </div>


            <form
                className="add-quotationpage-form"
                onSubmit={handleSubmit}
            >

                {/* ================= QUOTATION INFO ================= */}

                <div className="add-quotationpage-section">

                    <div className="add-quotationpage-section-title">

                        <h2>
                            Quotation Info
                        </h2>

                    </div>


                    <div className="add-quotationpage-form-grid">

                        <div className="add-quotationpage-form-group">

                            <label>
                                Ref No
                            </label>

                            <input
                                type="text"
                                name="quotationNo"
                                value={formData.quotationNo}
                                onChange={handleChange}
                                placeholder="QT-001"
                                required
                            />

                        </div>


                        <div className="add-quotationpage-form-group">

                            <label>
                                Quotation Date
                            </label>

                            <input
                                type="date"
                                name="quotationDate"
                                value={formData.quotationDate}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>

                </div>


                {/* ================= CLIENT DETAILS ================= */}

                <div className="add-quotationpage-section">

                    <div className="add-quotationpage-section-title">

                        <h2>
                            Client Details
                        </h2>

                        <span>
                            Lead #{lead.id}
                        </span>

                    </div>


                    <div className="add-quotationpage-form-grid">

                        <div className="add-quotationpage-form-group">

                            <label>
                                Client Name
                            </label>

                            <input
                                type="text"
                                name="clientName"
                                value={formData.clientName}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="add-quotationpage-form-group">

                            <label>
                                Phone
                            </label>

                            <input
                                type="text"
                                name="clientPhone"
                                value={formData.clientPhone}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="add-quotationpage-form-group add-quotationpage-full-width">

                            <label>
                                Address
                            </label>

                            <textarea
                                name="clientAddress"
                                value={formData.clientAddress}
                                onChange={handleChange}
                                rows="3"
                                required
                            />

                        </div>


                        <div className="add-quotationpage-form-group">

                            <label>
                                Phase Type
                            </label>

                            <select
                                name="phaseType"
                                value={formData.phaseType}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select Phase
                                </option>

                                <option value="Residential - Single Phase">
                                    Residential - Single Phase
                                </option>

                                <option value="Residential - 3 Phase">
                                    Residential - 3 Phase
                                </option>

                                <option value="Commercial - Single Phase">
                                    Commercial - Single Phase
                                </option>

                                <option value="Commercial - 3 Phase">
                                    Commercial - 3 Phase
                                </option>

                            </select>

                        </div>


                        <div className="add-quotationpage-form-group">

                            <label>
                                Quotation Subject
                            </label>

                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Solar PV Installation"
                                required
                            />

                        </div>

                    </div>

                </div>


                {/* ================= SUMMARY OF PROPOSAL ================= */}

                <div className="add-quotationpage-section">

                    <div className="add-quotationpage-section-title">

                        <h2>
                            Summary of Proposal
                        </h2>

                    </div>


                    <div className="add-quotationpage-form-grid">

                        <div className="add-quotationpage-form-group">

                            <label>
                                Proposed PV Plant Size (KWp)
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                name="pvPlantSize"
                                value={formData.pvPlantSize}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="add-quotationpage-form-group">

                            <label>
                                GST
                            </label>

                            <input
                                type="text"
                                name="gstIncluded"
                                value="Included"
                                readOnly
                            />

                        </div>


                        <div className="add-quotationpage-form-group">

                            <label>
                                System Type
                            </label>

                            <select
                                name="systemType"
                                value={formData.systemType}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select System Type
                                </option>

                                <option value="On Grid">
                                    On Grid
                                </option>

                                <option value="Off Grid">
                                    Off Grid
                                </option>

                                <option value="Hybrid">
                                    Hybrid
                                </option>

                            </select>

                        </div>


                        <div className="add-quotationpage-form-group">

                            <label>
                                Power Generation / Month (kWh)
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                name="powerGenerationMonth"
                                value={formData.powerGenerationMonth}
                                onChange={handleChange}
                            />

                        </div>


                        <div className="add-quotationpage-form-group">

                            <label>
                                Power Generation / Year (kWh)
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                name="powerGenerationYear"
                                value={formData.powerGenerationYear}
                                onChange={handleChange}
                            />

                        </div>


                        <div className="add-quotationpage-form-group">

                            <label>
                                Min. Annual Saving (₹)
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                name="minAnnualSaving"
                                value={formData.minAnnualSaving}
                                onChange={handleChange}
                            />

                        </div>


                        <div className="add-quotationpage-form-group">

                            <label>
                                Total System Cost (₹)
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                name="totalSystemCost"
                                value={formData.totalSystemCost}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="add-quotationpage-form-group">

                            <label>
                                Investment Recovery (Years)
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                name="investmentRecoveryYears"
                                value={formData.investmentRecoveryYears}
                                onChange={handleChange}
                            />

                        </div>

                    </div>

                </div>


                {/* ================= COMPONENT DETAILS ================= */}

                <div className="add-quotationpage-section">

                    <div className="add-quotationpage-section-title">

                        <h2>
                            Component Details
                        </h2>

                        <button
                            type="button"
                            className="add-quotationpage-add-item-button"
                            onClick={addItem}
                        >
                            + Add Item
                        </button>

                    </div>


                    <div className="add-quotationpage-items-wrapper">

                        <table className="add-quotationpage-items-table">

                            <thead>

                                <tr>

                                    <th className="add-quotationpage-item-column">
                                        Item
                                    </th>

                                    <th className="add-quotationpage-specification-column">
                                        Specification
                                    </th>

                                    <th className="add-quotationpage-make-column">
                                        Make
                                    </th>

                                    <th className="add-quotationpage-quantity-standard-column">
                                        Quantity / Standard
                                    </th>

                                    <th className="add-quotationpage-action-column">
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {items.map((item, index) => (

                                    <tr key={index}>

                                        {/* ITEM */}

                                        <td>

                                            <input
                                                type="text"
                                                name="itemName"
                                                value={item.itemName}
                                                onChange={(event) =>
                                                    handleItemChange(
                                                        index,
                                                        event
                                                    )
                                                }
                                            />

                                        </td>


                                        {/* SPECIFICATION */}

                                        <td>

                                            <input
                                                type="text"
                                                name="specification"
                                                value={item.specification}
                                                onChange={(event) =>
                                                    handleItemChange(
                                                        index,
                                                        event
                                                    )
                                                }
                                                placeholder="Enter specification"
                                                className="add-quotationpage-specification-input"
                                            />

                                        </td>


                                        {/* MAKE */}

                                        <td>

                                            <input
                                                type="text"
                                                name="make"
                                                value={item.make}
                                                onChange={(event) =>
                                                    handleItemChange(
                                                        index,
                                                        event
                                                    )
                                                }
                                                placeholder="Make"
                                            />

                                        </td>


                                        {/* QUANTITY / STANDARD */}

                                        <td>

                                            <input
                                                type="text"
                                                name="quantity"
                                                value={item.quantity}
                                                onChange={(event) =>
                                                    handleItemChange(
                                                        index,
                                                        event
                                                    )
                                                }/>

                                        </td>


                                        {/* ACTION */}

                                        <td>

                                            <button
                                                type="button"
                                                className="add-quotationpage-remove-item-button"
                                                onClick={() =>
                                                    removeItem(index)
                                                }
                                            >
                                                Remove
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>


                {/* ================= COMMERCIAL ================= */}

                <div className="add-quotationpage-section">

                    <div className="add-quotationpage-section-title">

                        <h2>
                            Commercial
                        </h2>

                    </div>


                    <div className="add-quotationpage-form-grid">

                        <div className="add-quotationpage-form-group">

                            <label>
                                Supply / Installation (₹)
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                name="supplyInstallation"
                                value={formData.supplyInstallation}
                                onChange={handleChange}
                            />

                        </div>


                        <div className="add-quotationpage-form-group">

                            <label>
                                Commercial Total (₹)
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                name="commercialTotal"
                                value={formData.commercialTotal}
                                onChange={handleChange}
                            />

                        </div>


                        <div className="add-quotationpage-form-group">

                            <label>
                                Government Subsidy (₹)
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                name="govtSubsidy"
                                value={formData.govtSubsidy}
                                onChange={handleChange}
                            />

                        </div>


                        <div className="add-quotationpage-form-group">

                            <label>
                                GST @ 5% (₹)
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                name="gstAmount"
                                value={formData.gstAmount}
                                onChange={handleChange}
                            />

                        </div>


                        <div className="add-quotationpage-form-group">

                            <label>
                                Actual Project Cost (₹)
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                name="actualProjectCost"
                                value={formData.actualProjectCost}
                                onChange={handleChange}
                            />

                        </div>

                    </div>

                </div>


                {/* ================= SUBMIT ================= */}

                <div className="add-quotationpage-submit-section">

                    <button
                        type="button"
                        className="add-quotationpage-cancel-button"
                        onClick={() =>
                            navigate("/dashboard/view-inquiry")
                        }
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        className="add-quotationpage-save-quotation-button"
                        disabled={saving}
                    >

                        {saving
                            ? "Saving..."
                            : "Save Quotation"
                        }

                    </button>

                </div>

            </form>

        </section>
    );
}

export default AddQuotation;