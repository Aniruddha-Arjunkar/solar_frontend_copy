import VendorAction from "../VendorAction/VendorAction.jsx";

import "./VendorTable.css";

function VendorTable({
    columns,
    data,
    onAction,
    showAction = true
}) {

    return (

        <div className="vendor-table-section">


            {/* ================= TABLE HEADER ================= */}

            <div className="vendor-table-header">

                <div>

                    <h2>
                        All Vendors
                    </h2>

                    <p>
                        Manage vendor information and details.
                    </p>

                </div>


                <span className="vendor-record-count">

                    {data.length} Records

                </span>

            </div>


            {/* ================= TABLE ================= */}

            <div className="vendor-table-wrapper">

                <table className="vendor-data-table">


                    {/* ================= TABLE HEAD ================= */}

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


                    {/* ================= TABLE BODY ================= */}

                    <tbody>

                        {data.length > 0 ? (

                            data.map((vendor) => (

                                <tr key={vendor.id}>


                                    {columns.map((column) => (

                                        <td key={column.key}>

                                            {vendor[column.key] || "-"}

                                        </td>

                                    ))}


                                    {/* ================= ACTION ================= */}

                                    {showAction && (

                                        <td>

                                            <div className="vendor-table-action-btn">

                                                <VendorAction
                                                    row={vendor}
                                                    onAction={onAction}
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
                                    className="vendor-no-data"
                                >

                                    No vendors found.

                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );

}


export default VendorTable;

