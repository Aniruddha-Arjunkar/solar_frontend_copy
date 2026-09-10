
import {
    ChevronDown,
    Eye,
    UserPlus,
    Trash2
} from "lucide-react";

import { useState } from "react";

import "./VendorAction.css";

function VendorAction({
    row,
    onAction
}) {

    const [open, setOpen] = useState(false);


    /* =========================================
       ACTION HANDLER
    ========================================= */
    const handleAction = (action) => {

        console.log("Selected Action:", action);

        console.log("Selected Vendor:", row);


        // Close dropdown
        setOpen(false);


        // Send action + selected vendor to parent
        if (onAction) {

            onAction(action, row);

        }

    };


    return (

        <div className="vendor-action-container">


            {/* ================= ACTION BUTTON ================= */}

            <button
                type="button"
                className="vendor-action-button"
                onClick={() => setOpen(!open)}
            >

                <span>
                    Action
                </span>

                <ChevronDown
                    size={20}
                    className={
                        open
                            ? "vendor-action-arrow-open"
                            : ""
                    }
                />

            </button>


            {/* ================= ACTION MENU ================= */}

            {open && (

                <div className="vendor-action-menu">

                    {/* ================= VIEW ================= */}
                    <button
                        type="button"
                        onClick={() =>
                            handleAction("add_client")
                        }>

                        <UserPlus size={19} />

                        <span>
                           Add Client
                        </span>

                    </button>


                    {/* ================= EDIT ================= */}

                    <button
                        type="button"
                        onClick={() =>
                            handleAction("show_details")
                        }>
                    
                        <Eye size={19} />
                        <span>
                            View Details
                        </span>

                    </button>


                </div>

            )}

        </div>

    );

}


export default VendorAction;