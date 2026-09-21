import ClientActionBtn from "./../ClientAction/ClientActionBtn.jsx";

import "./ClientTable.css";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";


function ClientTable({
    columns,
    data,
    onAction,
    type = "view-client",
    title = "All Clients",
    description = "Manage client information and details."
}) {

    // ================= SEARCH =================

    const [searchTerm, setSearchTerm] = useState("");

    const filteredClients = useMemo(() => {

        if (!searchTerm.trim()) {
            return data;
        }

        const searchValue =
            searchTerm.trim().toLowerCase();

        return data.filter((client) =>
            columns.some((column) =>
                String(
                    client[column.key] ?? ""
                )
                    .toLowerCase()
                    .includes(searchValue)
            )
        );

    }, [data, columns, searchTerm]);

    return (
        <div className="client-table-section">

            {/* =========== TABLE HEADER ============== */}

            <div className="client-table-header">

                <div>
                    <h2>
                        {title}
                    </h2>

                    <p>
                        {description}
                    </p>
                </div>


                <div className="client-table-header-right">

                    {/* ================= SEARCH ================= */}

                    <div className="client-table-search">

                        <Search size={17} />

                        <input
                            type="text"
                            placeholder="Search client, contact or email..."
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                        />

                        {searchTerm && (
                            <button
                                type="button"
                                className="client-table-clear-search"
                                onClick={() =>
                                    setSearchTerm("")
                                }
                                aria-label="Clear search"
                            >
                                <X size={15} />
                            </button>
                        )}

                    </div>


                    {/* ================= RECORD COUNT ================= */}

                    <span className="client-record-count">
                        {filteredClients.length} Records
                    </span>

                </div>

            </div>

            {/* <div className="client-table-header">
                <div>
                    <h2>
                        {title}
                    </h2>
                    <p>
                        {description}
                    </p>
                </div>

                <span className="client-record-count">
                    {data.length} Records
                </span>
            </div> */}

            {/* =================== TABLE WRAPPER ============ */}

            <div className="client-table-wrapper">

                <table className="client-data-table">

                    {/* =================== TABLE HEAD ================ */}

                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th key={column.key}>
                                    {column.label}
                                </th>
                            ))}

                            {/* ACTION COLUMN */}
                            <th>
                                Action
                            </th>
                        </tr>
                    </thead>


                    {/* =============== TABLE BODY ============ */}

                    <tbody>
                        {filteredClients.length > 0 ? (
                            filteredClients.map((client , index) => (
                                <tr key={client.id}>

                                    {/* ========== DYNAMIC COLUMNS =============== */}

                                    {columns.map((column) => (
                                        <td key={column.key}>
                                            {column.key === "id" ? (
                                                index + 1
                                            ) : column.key === "name" ? (
                                                <div className="client-table-user-cell">
                                                    <div className="client-table-avatar">
                                                        {client.name
                                                            ?.charAt(0)
                                                            .toUpperCase() || "C"}

                                                    </div>
                                                    <div className="client-table-user-info">
                                                        <strong>
                                                            {client.name || "-"}
                                                        </strong>
                                                    </div>
                                                </div>
                                            ) : (
                                                client[column.key] || "-"
                                            )}
                                        </td>
                                        // <td
                                        //     key={column.key}>
                                        //     {client[column.key] || "-"}
                                        // </td>
                                    ))}
                                    {/* ===================== ACTION =============== */}
                                    <td>
                                        <div className="client-table-action">
                                            <ClientActionBtn
                                                row={client}
                                                onAction={onAction}
                                                type={type}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (

                            /* ============ NO DATA ============= */

                            <tr>
                                <td
                                    colSpan={
                                        columns.length + 1
                                    }
                                    className="client-no-data">
                                    {searchTerm
                                        ? "No clients found matching your search."
                                        : "No records found."
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
export default ClientTable;