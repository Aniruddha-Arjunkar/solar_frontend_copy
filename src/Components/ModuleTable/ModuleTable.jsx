import TableAction from "./../TableAction/TableAction.jsx";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import "./ModuleTable.css";


function ModuleTable({
    columns,
    data,
    onAction,
    showAction = true,
    showMakeClient = false
}) {

    const [searchTerm, setSearchTerm] = useState("");
    const filteredData = useMemo(() => {

        if (!searchTerm.trim()) {
            return data;
        }

        const searchValue = searchTerm.toLowerCase();
        return data.filter((item) =>
            columns.some((column) =>
                String(item[column.key] ?? "")
                    .toLowerCase()
                    .includes(searchValue)
            )
        );

    }, [data, columns, searchTerm]);

    return (

        <div className="module-table-section">

            {/* =========== TABLE HEADER ============ */}
            {/* <div className="module-table-header">
                <div>
                    <h2>
                        All Records
                    </h2>
                    <p>
                        Manage lead information and details.
                    </p>
                </div>

                <span className="lead-record-count">
                    {data.length} Records
                </span>
            </div> */}
            <div className="module-table-header">

                <div>
                    <h2>
                        All Records
                    </h2>

                    <p>
                        Manage lead information and details.
                    </p>
                </div>

                <div className="module-table-header-right">

                    <div className="module-table-search">
                        <Search size={17} />
                        <input
                            type="text"
                            placeholder="Search name, contact or email..."
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                        />

                        {searchTerm && (
                            <button
                                type="button"
                                className="module-table-clear-search"
                                onClick={() => setSearchTerm("")}
                                aria-label="Clear search"
                            >
                                <X size={15} />
                            </button>
                        )}
                    </div>

                    <span className="lead-record-count">
                        {filteredData.length} Records
                    </span>
                </div>
            </div>

            {/* ================= TABLE ================= */}
            <div className="module-table-wrapper">

                <table className="module-data-table">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th key={column.key}>
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

                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <tr key={item.id}>
                                    {columns.map((column) => (
                                        // <td key={column.key}>

                                        //     {/* ================= PDF BUTTON ================= */}

                                        //     {column.type === "pdf" ? (

                                        //         <button
                                        //             type="button"
                                        //             className="module-table-pdf-btn"
                                        //             onClick={() =>
                                        //                 column.onClick(item)
                                        //             }>
                                        //             <span>
                                        //                 View PDF
                                        //             </span>

                                        //         </button>
                                        //     ) : (
                                        //         item[column.key]
                                        //     )}
                                        // </td>
                                        <td key={column.key}>

                                            {column.key === "id" ? (
                                                index + 1
                                            ) : column.key === "name" ? (

                                                <div className="module-table-user-cell">

                                                    <div className="module-table-avatar">
                                                        {item.name
                                                            ?.charAt(0)
                                                            .toUpperCase() || "L"}
                                                    </div>

                                                    <div className="module-table-user-info">
                                                        <strong>
                                                            {item.name}
                                                        </strong>
                                                    </div>
                                                </div>
                                                
                                            ) : column.type === "pdf" ? (

                                            //PDF Button 
                                            <button
                                                type="button"
                                                className="module-table-pdf-btn"
                                                onClick={() =>
                                                    column.onClick(item)
                                                }
                                            >
                                                <span>
                                                    View PDF
                                                </span>
                                            </button>

                                            ) : (

                                            item[column.key]

                                            )}

                                        </td>


                                    ))}

                                    {/* ================= ACTION ================= */}

                                    {showAction && (
                                        <td>
                                            <div className="module-table-action-btn">
                                                <TableAction
                                                    row={item}
                                                    onAction={onAction}
                                                    showMakeClient={showMakeClient}
                                                />
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={
                                        showAction
                                            ? columns.length + 1
                                            : columns.length
                                    }
                                    className="lead-no-data">
                                    No records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ModuleTable;