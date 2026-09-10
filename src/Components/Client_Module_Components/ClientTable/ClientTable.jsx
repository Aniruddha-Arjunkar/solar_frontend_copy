import ClientActionBtn from "./../ClientAction/ClientActionBtn.jsx";

import "./ClientTable.css";


function ClientTable({
    columns,
    data,
    onAction,
    type = "view-client",
    title = "All Clients",
    description = "Manage client information and details."
}) {
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


            {/* ================= RECORD COUNT ================= */}

                <span className="client-record-count">
                    {data.length} Records
                </span>
            </div>

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
                        {data.length > 0 ? (
                            data.map((client) => (
                                <tr key={client.id}>

                {/* ========== DYNAMIC COLUMNS =============== */}

                                    {columns.map((column) => (
                                        <td
                                            key={column.key}>
                                            {client[column.key] || "-"}
                                        </td>
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
export default ClientTable;