import {
    ChevronDown,
    Eye,
    Pencil
} from "lucide-react";

import {
    useState
} from "react";

import "./EmployeeAction.css";


function EmployeeAction({
    row,
    onAction
}) {

    const [open, setOpen] = useState(false);


    // ============================================================
    // HANDLE ACTION
    // ============================================================

    const handleAction = (action) => {

        setOpen(false);

        if (onAction) {

            onAction(
                action,
                row
            );

        }

    };


    return (

        <div className="employee-action-container">


            {/* ====================================================
                ACTION BUTTON
            ==================================================== */}

            <button
                type="button"
                className="employee-action-button"
                onClick={() =>
                    setOpen(!open)
                }
            >

                <span>
                    Action
                </span>

                <ChevronDown
                    size={19}
                    className={
                        open
                            ? "employee-action-arrow-open"
                            : ""
                    }
                />

            </button>


            {/* ====================================================
                ACTION MENU
            ==================================================== */}

            {open && (

                <div className="employee-action-menu">


                    {/* ==================================================
                        VIEW PROFILE
                    ================================================== */}

                    <button
                        type="button"
                        onClick={() =>
                            handleAction("view_profile")
                        }
                    >

                        <Eye size={18} />

                        <span>
                            View Profile
                        </span>

                    </button>


                    {/* ==================================================
                        UPDATE EMPLOYEE
                    ================================================== */}

                    <button
                        type="button"
                        onClick={() =>
                            handleAction("update_employee")
                        }
                    >

                        <Pencil size={18} />

                        <span>
                            Update Employee
                        </span>

                    </button>


                </div>

            )}

        </div>

    );

}


export default EmployeeAction;