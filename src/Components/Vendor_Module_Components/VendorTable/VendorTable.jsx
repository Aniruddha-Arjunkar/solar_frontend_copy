import VendorAction from "./../VendorAction/VendorAction.jsx";

import { useMemo, useState } from "react";

import { Search, X } from "lucide-react";

import "./VendorTable.css";

function VendorTable({
    columns,
    data,
    onAction,
    showAction = true
}) {

    const [searchTerm, setSearchTerm] = useState("");

    const filteredData = useMemo(() => {

        if (!searchTerm.trim()) {
            return data;
        }

        const searchValue =
            searchTerm.trim().toLowerCase();

        return data.filter((vendor) =>
            columns.some((column) =>
                String(
                    vendor[column.key] ?? ""
                )
                    .toLowerCase()
                    .includes(searchValue)
            )
        );

    }, [data, columns, searchTerm]);

    return (
        <div className="vendor-table-section">
            {/* ================= TABLE HEADER ================= */}
            {/* <div className="vendor-table-header">
                <div>
                    <h2>All Vendors</h2>
                    <p>Manage vendor information and details.</p>
                </div>


                <span className="vendor-record-count">
                    {data.length} Records
                </span>

            </div> */}
            <div className="vendor-table-header">
                <div>
                    <h2>
                        All Vendors
                    </h2>
                    <p>
                        Manage vendor information and details.
                    </p>
                </div>

                <div className="vendor-table-header-right">

                    {/* ================= SEARCH ================= */}

                    <div className="vendor-table-search">
                        <Search size={17} />
                        <input
                            type="text"
                            placeholder="Search vendor, contact or email..."
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                        />

                        {searchTerm && (
                            <button
                                type="button"
                                className="vendor-table-clear-search"
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

                    <span className="vendor-record-count">
                        {filteredData.length} Records
                    </span>

                </div>

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
                                <th>Action</th>
                            )}
                        </tr>
                    </thead>


                    {/* ================= TABLE BODY ================= */}

                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((vendor, index) => (
                                <tr key={vendor.id}>
                                    {columns.map((column) => (
                                        // <td key={column.key}>
                                        //     {vendor[column.key] || "-"}
                                        // </td>
                                        <td key={column.key}>

                                            {column.key === "id" ? (

                                                index + 1

                                            ) : column.key === "vendorName" ? (

                                                <div className="vendor-table-user-cell">

                                                    <div className="vendor-table-avatar">

                                                        {vendor.vendorName
                                                            ?.charAt(0)
                                                            .toUpperCase() || "V"}

                                                    </div>

                                                    <div className="vendor-table-user-info">
                                                        <strong>
                                                            {vendor.vendorName || "-"}
                                                        </strong>
                                                    </div>
                                                </div>
                                            ) : (vendor[column.key] || "-")}
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
                                    className="vendor-no-data">
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

