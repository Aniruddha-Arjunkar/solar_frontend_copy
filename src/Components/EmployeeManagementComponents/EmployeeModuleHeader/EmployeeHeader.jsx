import {
    Plus,
    List
} from "lucide-react";

import { useNavigate } from "react-router";

import "./EmployeeHeader.css";


function EmployeeHeader({
    currectPage,
    title,
    description,
    buttonType,
    icon: Icon
}) {

    const navigate = useNavigate();


    // ============================================================
    // BUTTON NAVIGATION
    // ============================================================

    const handleButtonClick = () => {

        if (buttonType === "add") {

            // From View Employee → Add Employee
            navigate("/dashboard/add-employee");

        } else {

            // From Add Employee → View Employee
            navigate("/dashboard/view-employee");

        }

    };


    return (

        <div className="employee-module-header">


            {/* ====================================================
                LEFT : PAGE INFORMATION
            ==================================================== */}

            <div className="employee-module-heading">


                {/* =================================================
                    BREADCRUMB
                ================================================= */}

                <div className="employee-current-page-location">

                    Dashboard

                    <span>
                        /
                    </span>

                    {currectPage}

                </div>


                {/* =================================================
                    TITLE
                ================================================= */}

                <h1>

                    {
                        Icon && (
                            <Icon
                                size={35}
                                strokeWidth={1.8}
                            />
                        )
                    }

                    {title}

                </h1>


                {/* =================================================
                    DESCRIPTION
                ================================================= */}

                <p>
                    {description}
                </p>

            </div>


            {/* ====================================================
                RIGHT : ACTION BUTTON
            ==================================================== */}

            <div className="employee-module-header-button">

                {
                    buttonType === "add" ? (

                        <button
                            type="button"
                            className="employee-module-header-btn"
                            onClick={handleButtonClick}
                        >

                            <Plus size={19} />

                            Add Employee

                        </button>

                    ) : (

                        <button
                            type="button"
                            className="employee-module-header-btn"
                            onClick={handleButtonClick}
                        >

                            <List size={19} />

                            View Employees

                        </button>

                    )
                }

            </div>

        </div>

    );

}


export default EmployeeHeader;