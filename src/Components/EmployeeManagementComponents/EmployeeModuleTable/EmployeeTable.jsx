import { Search } from "lucide-react";

import EmployeeAction
    from "./../EmployeeModuleActionBtn/EmployeeAction.jsx";

import { useMemo, useState } from "react";

import "./EmployeeTable.css";


function EmployeeTable({
    columns,
    data,
    onAction,
    showAction = true
}) {

    // ============================================================
    // SEARCH STATE
    // ============================================================

    const [searchTerm, setSearchTerm] = useState("");


    // ============================================================
    // FILTER EMPLOYEES
    // ============================================================

    const filteredEmployees = useMemo(() => {

        const search = searchTerm.trim().toLowerCase();

        if (!search) {
            return data;
        }

        return data.filter((employee) => {

            // Search through all configured table columns
            return columns.some((column) => {

                const value = employee[column.key];

                return value !== null &&
                    value !== undefined &&
                    String(value)
                        .toLowerCase()
                        .includes(search);

            });

        });

    }, [data, columns, searchTerm]);


    return (

        <div className="employee-table-section">


            {/* ====================================================
                TABLE HEADER
            ==================================================== */}

            <div className="employee-table-header">

                <div className="employee-table-heading">

                    <h2>
                        All Employees
                    </h2>

                    <p>
                        Manage employee information and details.
                    </p>

                </div>


                {/* ====================================================
                    TABLE CONTROLS
                ==================================================== */}

                <div className="employee-table-controls">


                    {/* ================= SEARCH ================= */}

                    <div className="employee-search-box">

                        <Search
                            size={18}
                            strokeWidth={2}
                        />

                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                        />

                    </div>


                    {/* ================= RECORD COUNT ================= */}

                    <span className="employee-record-count">

                        {filteredEmployees.length} Records

                    </span>

                </div>

            </div>


            {/* ====================================================
                TABLE WRAPPER
            ==================================================== */}

            <div className="employee-table-wrapper">


                <table className="employee-data-table">


                    {/* ==================================================
                        TABLE HEAD
                    ================================================== */}

                    <thead>

                        <tr>

                            {columns.map((column) => (

                                <th
                                    key={column.key}
                                >

                                    {column.label}

                                </th>

                            ))}


                            {showAction && (

                                <th>
                                    Action
                                </th>

                            )}

                        </tr>

                    </thead>


                    {/* ==================================================
                        TABLE BODY
                    ================================================== */}

                    <tbody>


                        {filteredEmployees.length > 0 ? (

                            filteredEmployees.map((employee) => (

                                <tr
                                    key={employee.id}
                                >


                                    {/* ==================================================
                                        TABLE COLUMNS
                                    ================================================== */}

                                    {columns.map((column) => (

                                        <td
                                            key={column.key}
                                        >


                                            {/* ==========================================
                                                EMPLOYEE ID
                                            ========================================== */}

                                            {column.key === "id" ? (

                                                employee.id

                                            ) : column.key === "name" ? (


                                                /* ==========================================
                                                    EMPLOYEE NAME
                                                ========================================== */

                                                <div className="employee-name-cell">

                                                    <strong>
                                                        {employee.name}
                                                    </strong>

                                                </div>


                                            ) : column.key === "phone" ? (


                                                /* ==========================================
                                                    PHONE
                                                ========================================== */

                                                <span className="employee-phone">

                                                    {employee.phone || "N/A"}

                                                </span>


                                            ) : column.key === "designation" ? (


                                                /* ==========================================
                                                    DESIGNATION
                                                ========================================== */

                                                <span
                                                    className={
                                                        employee.designation
                                                            ? "employee-designation"
                                                            : "employee-na"
                                                    }
                                                >

                                                    {employee.designation || "N/A"}

                                                </span>


                                            ) : column.key === "department" ? (


                                                /* ==========================================
                                                    DEPARTMENT
                                                ========================================== */

                                                <span
                                                    className={
                                                        employee.department
                                                            ? "employee-department"
                                                            : "employee-na"
                                                    }
                                                >

                                                    {employee.department || "N/A"}

                                                </span>


                                            ) : (


                                                /* ==========================================
                                                    DEFAULT COLUMN
                                                ========================================== */

                                                employee[column.key] || "N/A"

                                            )}

                                        </td>

                                    ))}


                                    {/* ==================================================
                                        ACTION
                                    ================================================== */}

                                    {showAction && (

                                        <td>

                                            <div className="employee-table-action-btn">

                                                <EmployeeAction
                                                    row={employee}
                                                    onAction={onAction}
                                                />

                                            </div>

                                        </td>

                                    )}

                                </tr>

                            ))

                        ) : (


                            /* ==================================================
                                NO DATA
                            ================================================== */

                            <tr>

                                <td
                                    colSpan={
                                        showAction
                                            ? columns.length + 1
                                            : columns.length
                                    }
                                    className="employee-no-data"
                                >

                                    {searchTerm
                                        ? "No employees found matching your search."
                                        : "No employees found."
                                    }

                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );

}


export default EmployeeTable;