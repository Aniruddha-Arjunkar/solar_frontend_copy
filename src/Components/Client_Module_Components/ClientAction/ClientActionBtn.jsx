import {
    ChevronDown,
    Eye,
    Pencil,
    Trash2,
    FileText,
    RefreshCw,
    CheckCircle
} from "lucide-react";

import { useState } from "react";

import "./ClientActionBtn.css";


function ClientActionBtn({
    row,
    onAction,
    type = "view-client"
}) {

    const [open, setOpen] = useState(false);


    /* ====== ACTION HANDLER ======= */

    const handleAction = (action) => {

        console.log("Selected Action:", action);

        console.log("Selected Client:", row);

        // Close dropdown
        setOpen(false);

        // Send action + row to parent
        if (onAction) {
            onAction(action, row);
        }

    };

    /* ======= ACTION MENU ======== */

    const renderActions = () => {

        if (type === "view-client") {

            return (

                <>
                    {/* VIEW DETAIL */}
                    <button
                        type="button"
                        onClick={() =>
                            handleAction("view_detail")
                        }>

                        <Eye size={19} />
                        <span>
                            View Detail
                        </span>
                    </button>
                </>
            );
        }

        if (type === "gst-client") {

            return (

                <>

                    {/* VIEW DETAIL */}

                    <button
                        type="button"
                        onClick={() =>
                            handleAction("view_detail")
                        }>
                        <Eye size={19} />
                        <span>
                            View Detail
                        </span>
                    </button>

                    {/* GENERATE INVOICE */}

                    <button
                        type="button"
                        onClick={() =>
                            handleAction("generate_invoice")
                        }>
                        <FileText size={19} />
                        <span>
                            Generate Invoice
                        </span>
                    </button>
                </>
            );
        }

        /* =====================================
           PENDING WORK
           Update Work
           Mark Complete
           Delete
        ===================================== */

        if (type === "pending-work") {

            return (

                <>

                    {/* UPDATE WORK */}

                    <button
                        type="button"
                        onClick={() =>
                            handleAction("update_work")
                        }>
                        <Pencil size={19} />
                        <span>
                            Update Work
                        </span>
                    </button>

                    {/* MARK COMPLETE */}
                    <button
                        type="button"
                        onClick={() =>
                            handleAction("mark_complete")
                        }>
                        <CheckCircle size={19} />
                        <span>
                            Mark Complete
                        </span>
                    </button>

                    <div className="client-action-divider"></div>

                    {/* DELETE */}
                    <button
                        type="button"
                        className="client-action-delete"
                        onClick={() =>
                            handleAction("delete_work")
                        }
                    >
                        <Trash2 size={19} />
                        <span>
                            Delete
                        </span>
                    </button>
                </>
            );
        }
        return null;
    };


    return (

        <div className="client-action-btn-container">

            {/* ====== ACTION BUTTON ========= */}

            <button
                type="button"
                className="client-action-btn"
                onClick={() =>
                    setOpen(!open)
                }>

                <span>
                    Action
                </span>

                <ChevronDown
                    size={19}
                    className={
                        open
                            ? "client-action-arrow-open"
                            : ""}/>
            </button>


            {/* ========== ACTION MENU ============ */}
            {open && (
                <div className="client-action-btn-menu">
                    {renderActions()}
                </div>
            )}
        </div>
    );
}
export default ClientActionBtn;