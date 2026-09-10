import TableAction from "./../TableAction/TableAction.jsx";

import "./ModuleTable.css";


function ModuleTable({
    columns,
    data,
    onAction,
    showAction = true,
    showQuotation = false,
    showMakeClient = false
}) {

    return (

        <div className="module-table-section">

            {/* =========== TABLE HEADER ============ */}
            <div className="module-table-header">
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
                        {data.length > 0 ? (
                            data.map((item) => (
                                <tr key={item.id}>
                                    {columns.map((column) => (
                                        <td key={column.key}>

                                            {/* ================= PDF BUTTON ================= */}

                                            {column.type === "pdf" ? (

                                                <button
                                                    type="button"
                                                    className="module-table-pdf-btn"
                                                    onClick={() =>
                                                        column.onClick(item)
                                                    }>
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
                                                    showQuotation={showQuotation}
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