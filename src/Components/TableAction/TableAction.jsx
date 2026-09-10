import {
    ChevronDown,
    RotateCcw,
    MapPin,
    Wrench,
    CalendarDays,
    FileText,
    Trash2,
    UserPlus,
    UserRoundPlus
} from "lucide-react";

import { useState } from "react";

import "./TableAction.css";


function TableAction({ row, onAction , showQuotation = false , 
          showMakeClient = false}) {

    const [open, setOpen] = useState(false);


    /* ================= ACTION ================= */

    const handleAction = (action) => {

        // console.log("Selected Action:", action);
        // console.log("Selected Row:", row);

        // Close dropdown
        setOpen(false);

        // Send action + selected lead to parent
        if (onAction) {
            onAction(action, row);
        }

    };


    return (

        <div className="table-action-container">


            {/* ================= ACTION BUTTON ================= */}

            <button
                type="button"
                className="table-action-button"
                onClick={() => setOpen(!open)}>

                <span>
                    Action
                </span>
                <ChevronDown
                    size={20}
                    className={
                        open
                            ? "action-arrow-open"
                            : ""
                    }/>
            </button>


            {/* ================= ACTION MENU ================= */}

            {open && (

                <div className="table-action-menu">

                    {/* ========== RE FOLLOWUP ========== */}

                    <button
                        type="button"
                        onClick={() =>
                            handleAction("refollowup")
                        }>
                        <RotateCcw size={20} />
                        <span>
                            Re Followup
                        </span>
                    </button>


                    {/* ========== VISIT ========== */}

                    <button
                        type="button"
                        onClick={() =>
                            handleAction("visit")
                        }>
                        <MapPin size={20} />
                        <span>
                            Visit
                        </span>
                    </button>


                    {/* ========== SERVICE ========== */}

                    <button
                        type="button"
                        onClick={() =>
                            handleAction("service")
                        }>
                        <Wrench size={20} />
                        <span>
                            Service
                        </span>
                    </button>


                    {/* ========== SCHEDULE ========== */}

                    <button
                        type="button"
                        onClick={() =>
                            handleAction("schedule")
                        }>

                        <CalendarDays size={20} />
                        <span>
                            Schedule
                        </span>
                    </button>

                    
                    <div className="table-action-divider"></div>

                    {/* ========== MAKE CLIENT ========== */}

                    {showMakeClient && (

                        <button
                            type="button"
                            onClick={() =>
                                handleAction("makeclient")
                            }>
                            <UserRoundPlus size={20} />
                            <span>
                                Make Client
                            </span>
                        </button>
                    )}


                    {/* ========== Send Quotation ========== */}
                {showQuotation && (
                    <button
                        type="button"
                        onClick={() =>
                            handleAction("quotation")
                        }>

                        <FileText size={20} />
                        <span>
                            Send Quotation
                        </span>
                    </button>
               )}

                    {/* ========== DELETE ========== */}

                    <button
                        type="button"
                        className="table-action-delete"
                        onClick={() =>
                            handleAction("delete")
                        }>

                        <Trash2 size={20} />
                        <span>
                            Delete
                        </span>
                    </button>

                </div>
            )}

        </div>
    );
}
export default TableAction;