import {
    UsersRound,
    Search,
    RotateCcw
} from "lucide-react";

import {
    useEffect,
    useState
} from "react";

import { useNavigate } from "react-router";

import EmployeeHeader
    from "../../../Components/EmployeeManagementComponents/EmployeeModuleHeader/EmployeeHeader.jsx";

import EmployeeStat
    from "../../../Components/EmployeeManagementComponents/EmployeeModuleStats/EmployeeStat.jsx";

import EmployeeTable
    from "../../../Components/EmployeeManagementComponents/EmployeeModuleTable/EmployeeTable.jsx";


import UpdateEmployee
    from "../UpdateEmployee/UpdateEmployee.jsx";

import "./ViewEmployee.css";


function ViewEmployee() {

    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const [selectedEmployee, setSelectedEmployee] =
        useState(null);

    const [activeAction, setActiveAction] =
        useState(null);


    // ============================================================
    // EMPLOYEE DATA
    // ============================================================
    /*
     * Employee data now comes from the Spring Boot backend.
     *
     * Backend API:
     *
     * GET http://localhost:8080/api/employees
     */

    const [employeeData, setEmployeeData] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        const fetchEmployees = async () => {

            try {

                setLoading(true);

                setError("");


                const response = await fetch(
                    "http://localhost:8080/api/employees"
                );


                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch employees."
                    );

                }


                const data =
                    await response.json();


                console.log(
                    "Employees fetched successfully:",
                    data
                );


                setEmployeeData(data);


            } catch (error) {

                console.error(
                    "Error fetching employees:",
                    error
                );


                setError(
                    error.message ||
                    "Unable to load employees."
                );


            } finally {

                setLoading(false);

            }

        };


        fetchEmployees();

    }, []);


    // ============================================================
    // TABLE COLUMNS
    // ============================================================

    const columns = [

        {
            key: "id",
            label: "Employee Id"
        },

        {
            key: "name",
            label: "Name"
        },

        {
            key: "phone",
            label: "Contact"
        },

        {
            key: "designation",
            label: "Designation"
        },

        {
            key: "department",
            label: "Department"
        }

    ];


    // ============================================================
    // SEARCH FILTER
    // ============================================================

    const filteredEmployees =
        employeeData.filter(
            (employee) => {

                const search =
                    searchTerm
                        .toLowerCase()
                        .trim();


                if (!search) {

                    return true;

                }


                return (

                    employee.name
                        ?.toLowerCase()
                        .includes(search)

                    ||

                    employee.phone
                        ?.toLowerCase()
                        .includes(search)

                    ||

                    employee.department
                        ?.toLowerCase()
                        .includes(search)

                );

            }
        );


    // ============================================================
// EMPLOYEE ACTION HANDLER
// ============================================================

const handleEmployeeAction =
    (action, employee) => {

        console.log(
            "Employee Action:",
            action
        );

        console.log(
            "Selected Employee:",
            employee
        );


        // ========================================================
        // VIEW PROFILE
        // ========================================================

        if (action === "view_profile") {

            navigate(
                `/dashboard/view-employee/profile/${employee.id}`
            );

            return;

        }


        // ========================================================
        // UPDATE EMPLOYEE
        // ========================================================

        if (action === "update_employee") {

            navigate(
                `/dashboard/update-employee/${employee.id}`
            );

            return;

        }

    };


    // ============================================================
    // RESET SEARCH
    // ============================================================

    const handleReset = () => {

        setSearchTerm("");

    };


    // ============================================================
    // STATISTICS
    // ============================================================

    const stats = [

        {
            title: "Total Employees",
            value: employeeData.length
        },


        {
            title: "Full Time",
            value:
                employeeData.filter(
                    employee =>
                        employee.employeeType ===
                        "Full Time"
                ).length
        },


        {
            title: "Part Time",
            value:
                employeeData.filter(
                    employee =>
                        employee.employeeType ===
                        "Part Time"
                ).length
        }

    ];


    // ============================================================
    // RENDER
    // ============================================================

    return (

        <section className="view-employee-page">


            {/* ====================================================
                PAGE HEADER
            ==================================================== */}

            <EmployeeHeader
                currectPage="View Employees"
                title="Employee Management"
                description="View and manage all registered employees."
                buttonType="add"
                icon={UsersRound}
            />


            {/* ====================================================
                EMPLOYEE STATISTICS
            ==================================================== */}

            <EmployeeStat
                stats={stats}
            />


           


            {/* ====================================================
                LOADING STATE
            ==================================================== */}

            {loading && (
                <div className="employee-loading-message">
                    Loading employees...
                </div>
            )}


            {/* ====================================================
                ERROR STATE
            ==================================================== */}

            {!loading && error && (

                <div className="employee-error-message">
                    {error}
                </div>
            )}
        
 {/* ====================================================
    EMPLOYEE TABLE
==================================================== */}

{!loading && !error && (

    <EmployeeTable
        columns={columns}
        data={filteredEmployees}
        onAction={handleEmployeeAction}
        showAction={true}
    />)}   
        </section>
    );
}
export default ViewEmployee;