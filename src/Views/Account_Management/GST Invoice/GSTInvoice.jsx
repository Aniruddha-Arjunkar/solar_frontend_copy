import { useEffect, useMemo, useState } from "react";
import {
   FileText,
   Search,
   RefreshCw,
   CalendarDays,
   Eye,
   FileDown,
   ReceiptText,
   X
} from "lucide-react";

import "./GSTInvoice.css";


function GSTInvoice() {

   // ============================================================
   // STATE
   // ============================================================

   const [invoices, setInvoices] = useState([]);

   const [searchTerm, setSearchTerm] = useState("");

   const [startDate, setStartDate] = useState("");
   const [endDate, setEndDate] = useState("");

   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");


   // ============================================================
   // API
   // ============================================================

   const API_BASE_URL = "http://localhost:8080/api";


   // ============================================================
   // FETCH ALL GST INVOICES
   // ============================================================

   const fetchInvoices = async () => {

      try {

         setLoading(true);
         setError("");

         const response = await fetch(
            `${API_BASE_URL}/invoices`
         );

         if (!response.ok) {
            throw new Error("Failed to fetch GST invoices.");
         }

         const data = await response.json();

         /*
          * The backend already returns InvoiceResponse.
          * We only need invoices where GST invoice number exists.
          */

         const gstInvoices = Array.isArray(data)
            ? data.filter(
               (invoice) =>
                  invoice.gstInvoiceNo &&
                  invoice.gstInvoiceNo.trim() !== ""
            )
            : [];

         setInvoices(gstInvoices);

      } catch (err) {

         console.error("GST Invoice fetch error:", err);

         setError(
            err.message ||
            "Unable to load GST invoices."
         );

      } finally {

         setLoading(false);

      }
   };


   // ============================================================
   // INITIAL LOAD
   // ============================================================

   useEffect(() => {

      fetchInvoices();

   }, []);


   // ============================================================
   // FILTER INVOICES
   // ============================================================

   const filteredInvoices = useMemo(() => {

      const search = searchTerm
         .trim()
         .toLowerCase();

      return invoices.filter((invoice) => {

         // ----------------------------------------------------
         // SEARCH FILTER
         // ----------------------------------------------------

         const matchesSearch =
            !search ||
            String(invoice.gstInvoiceNo || "")
               .toLowerCase()
               .includes(search) ||

            String(invoice.custName || "")
               .toLowerCase()
               .includes(search) ||

            String(invoice.custPhone || "")
               .toLowerCase()
               .includes(search);


         // ----------------------------------------------------
         // START DATE FILTER
         // ----------------------------------------------------

         const invoiceDate =
            invoice.invoiceDate || "";

         const matchesStartDate =
            !startDate ||
            invoiceDate >= startDate;


         // ----------------------------------------------------
         // END DATE FILTER
         // ----------------------------------------------------

         const matchesEndDate =
            !endDate ||
            invoiceDate <= endDate;


         return (
            matchesSearch &&
            matchesStartDate &&
            matchesEndDate
         );

      });

   }, [
      invoices,
      searchTerm,
      startDate,
      endDate
   ]);


   // ============================================================
   // CURRENT MONTH INVOICES
   // ============================================================

   const currentMonthInvoices = useMemo(() => {

      const currentMonth =
         new Date()
            .toISOString()
            .slice(0, 7);

      return invoices.filter(
         (invoice) =>
            invoice.invoiceDate?.startsWith(
               currentMonth
            )
      ).length;

   }, [invoices]);


   // ============================================================
   // RESET FILTERS
   // ============================================================

   const handleResetFilters = () => {

      setSearchTerm("");
      setStartDate("");
      setEndDate("");

   };


   // ============================================================
   // VIEW PDF
   // ============================================================

   const handleViewPdf = (invoiceId) => {

      if (!invoiceId) {
         return;
      }

      const pdfUrl =
         `${API_BASE_URL}/invoices/${invoiceId}/pdf`;

      window.open(
         pdfUrl,
         "_blank",
         "noopener,noreferrer"
      );
   };


   // ============================================================
   // FORMAT DATE
   // ============================================================

   const formatDate = (dateString) => {

      if (!dateString) {
         return "-";
      }

      const date = new Date(dateString);

      if (Number.isNaN(date.getTime())) {
         return dateString;
      }

      return date.toLocaleDateString(
         "en-IN",
         {
            day: "2-digit",
            month: "short",
            year: "numeric"
         }
      );
   };


   // ============================================================
   // RENDER
   // ============================================================

   return (

      <section className="accounts-gst-invoice-page">

         {/* ==================================================
                PAGE HEADER
            ================================================== */}

         <div className="accounts-gst-invoice-header">

            <div className="accounts-gst-invoice-header-left">

               <div className="accounts-gst-invoice-header-icon">
                  <ReceiptText size={28} />
               </div>

               <div>

                  <div className="accounts-gst-invoice-breadcrumb">
                     Dashboard / Accounts / GST Invoice
                  </div>

                  <h1>
                     GST Invoices
                  </h1>

                  <p>
                     View and manage generated GST invoices
                  </p>

               </div>

            </div>


            <button
               type="button"
               className="accounts-gst-invoice-refresh-btn"
               onClick={fetchInvoices}
               disabled={loading}
            >

               <RefreshCw
                  size={17}
                  className={
                     loading
                        ? "accounts-gst-invoice-spin"
                        : ""
                  }
               />

               Refresh

            </button>

         </div>


         {/* ==================================================
                STATISTICS
            ================================================== */}

         <div className="accounts-gst-invoice-stats">

            <div className="accounts-gst-invoice-stat-card">

               <div className="accounts-gst-invoice-stat-icon">
                  <FileText size={22} />
               </div>

               <div>

                  <span>
                     Total GST Invoices
                  </span>

                  <strong>
                     {invoices.length}
                  </strong>

               </div>

            </div>


            <div className="accounts-gst-invoice-stat-card">

               <div className="accounts-gst-invoice-stat-icon">
                  <CalendarDays size={22} />
               </div>

               <div>

                  <span>
                     This Month
                  </span>

                  <strong>
                     {currentMonthInvoices}
                  </strong>

               </div>

            </div>


            <div className="accounts-gst-invoice-stat-card">

               <div className="accounts-gst-invoice-stat-icon">
                  <ReceiptText size={22} />
               </div>

               <div>

                  <span>
                     Showing
                  </span>

                  <strong>
                     {filteredInvoices.length}
                  </strong>

               </div>

            </div>

         </div>


         {/* ==================================================
                FILTER SECTION
            ================================================== */}

         <div className="accounts-gst-invoice-filter-card">

            <div className="accounts-gst-invoice-filter-header">

               <div>

                  <h3>
                     Invoice Search & Filters
                  </h3>

                  <p>
                     Search and filter generated GST invoices
                  </p>

               </div>


               {(searchTerm || startDate || endDate) && (

                  <button
                     type="button"
                     className="accounts-gst-invoice-reset-btn"
                     onClick={handleResetFilters}
                  >

                     <X size={16} />

                     Reset Filters

                  </button>

               )}

            </div>


            <div className="accounts-gst-invoice-filter-row">

               {/* SEARCH */}

               <div className="accounts-gst-invoice-input-group accounts-gst-invoice-search-group">

                  <label>
                     Search
                  </label>

                  <div className="accounts-gst-invoice-input-wrapper">

                     <Search size={18} />

                     <input
                        type="text"
                        placeholder="Invoice no, client name or phone..."
                        value={searchTerm}
                        onChange={(event) =>
                           setSearchTerm(
                              event.target.value
                           )
                        }
                     />

                  </div>

               </div>


               {/* START DATE */}

               <div className="accounts-gst-invoice-input-group">

                  <label>
                     Start Date
                  </label>

                  <div className="accounts-gst-invoice-input-wrapper">

                     <CalendarDays size={18} />

                     <input
                        type="date"
                        value={startDate}
                        onChange={(event) =>
                           setStartDate(
                              event.target.value
                           )
                        }
                     />

                  </div>

               </div>


               {/* END DATE */}

               <div className="accounts-gst-invoice-input-group">

                  <label>
                     End Date
                  </label>

                  <div className="accounts-gst-invoice-input-wrapper">

                     <CalendarDays size={18} />

                     <input
                        type="date"
                        value={endDate}
                        onChange={(event) =>
                           setEndDate(
                              event.target.value
                           )
                        }
                     />

                  </div>

               </div>

            </div>

         </div>


         {/* ==================================================
                ERROR
            ================================================== */}

         {error && (

            <div className="accounts-gst-invoice-error">

               <FileText size={20} />

               <span>
                  {error}
               </span>

               <button
                  type="button"
                  onClick={fetchInvoices}
               >
                  Try Again
               </button>

            </div>

         )}


         {/* ==================================================
                TABLE CARD
            ================================================== */}

         <div className="accounts-gst-invoice-table-card">

            <div className="accounts-gst-invoice-table-header">

               <div>

                  <h2>
                     Generated GST Invoices
                  </h2>

                  <p>
                     {filteredInvoices.length} invoice
                     {filteredInvoices.length !== 1
                        ? "s"
                        : ""
                     } found
                  </p>

               </div>

            </div>


            {/* ==================================================
                    LOADING
                ================================================== */}

            {loading ? (

               <div className="accounts-gst-invoice-loading">

                  <RefreshCw
                     size={30}
                     className="accounts-gst-invoice-spin"
                  />

                  <p>
                     Loading GST invoices...
                  </p>

               </div>

            ) : filteredInvoices.length === 0 ? (

               /* ==================================================
                   EMPTY STATE
               ================================================== */

               <div className="accounts-gst-invoice-empty">

                  <div className="accounts-gst-invoice-empty-icon">
                     <FileText size={34} />
                  </div>

                  <h3>
                     No GST invoices found
                  </h3>

                  <p>
                     {searchTerm ||
                        startDate ||
                        endDate
                        ? "Try changing your search or filter criteria."
                        : "No GST invoices have been generated yet."
                     }
                  </p>

                  {(searchTerm ||
                     startDate ||
                     endDate) && (

                        <button
                           type="button"
                           onClick={handleResetFilters}
                        >
                           Clear Filters
                        </button>

                     )}

               </div>

            ) : (

               /* ==================================================
                   TABLE
               ================================================== */

               <div className="accounts-gst-invoice-table-wrapper">

                  <table className="accounts-gst-invoice-table">

                     <thead>

                        <tr>

                           <th>
                              #
                           </th>

                           <th>
                              Invoice No
                           </th>

                           <th>
                              Client
                           </th>

                           <th>
                              Phone
                           </th>

                           <th>
                              Invoice Date
                           </th>

                           <th>
                              Action
                           </th>

                        </tr>

                     </thead>


                     <tbody>

                        {filteredInvoices.map(
                           (invoice, index) => (

                              <tr key={invoice.id}>

                                 {/* SERIAL NUMBER */}

                                 <td>
                                    <span className="accounts-gst-invoice-serial">
                                       {index + 1}
                                    </span>
                                 </td>


                                 {/* INVOICE NUMBER */}

                                 <td>

                                    <div className="accounts-gst-invoice-number">

                                       <div className="accounts-gst-invoice-number-icon">
                                          <FileText size={16} />
                                       </div>

                                       <span>
                                          {invoice.gstInvoiceNo}
                                       </span>

                                    </div>

                                 </td>


                                 {/* CLIENT */}

                                 <td>

                                    <div className="accounts-gst-invoice-client">

                                       <strong>
                                          {invoice.custName || "-"}
                                       </strong>

                                       {invoice.custEmail && (

                                          <small>
                                             {invoice.custEmail}
                                          </small>

                                       )}

                                    </div>

                                 </td>


                                 {/* PHONE */}

                                 <td>
                                    {invoice.custPhone || "-"}
                                 </td>


                                 {/* DATE */}

                                 <td>

                                    <div className="accounts-gst-invoice-date">

                                       <CalendarDays size={16} />

                                       {formatDate(
                                          invoice.invoiceDate
                                       )}

                                    </div>

                                 </td>


                                 {/* ACTION */}

                                 <td>

                                    <button
                                       type="button"
                                       className="accounts-gst-invoice-view-btn"
                                       onClick={() =>
                                          handleViewPdf(
                                             invoice.id
                                          )
                                       }
                                    >

                                       <Eye size={16} />

                                       View PDF

                                       <FileDown size={15} />

                                    </button>

                                 </td>

                              </tr>

                           )
                        )}

                     </tbody>

                  </table>

               </div>

            )}

         </div>

      </section>
   );
}


export default GSTInvoice;