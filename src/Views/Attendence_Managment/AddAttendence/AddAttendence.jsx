import {
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Save,
  UsersRound
} from "lucide-react";

import {
  useEffect,
  useState
} from "react";

import { useNavigate } from "react-router";

import "./AddAttendence.css";

function AddAttendence() {

  const navigate = useNavigate();

  // DEFAULT ATTENDANCE DATE

  const getTodayDate = () => {

    const today = new Date();
    const year = today.getFullYear();
    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };



  // EMPLOYEE STATE
  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] =useState(true);
  const [employeesError, setEmployeesError] =useState("");


  // ATTENDANCE STATE
  const [attendanceDate, setAttendanceDate] = useState(getTodayDate());
  const [attendanceStatus, setAttendanceStatus] = useState({});



  // FETCH EMPLOYEES

  useEffect(() => {

    const fetchEmployees = async () => {
      try {
        setEmployeesLoading(true);
        setEmployeesError("");

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
          "Employees for attendance:",
          data
        );

        setEmployees(data);

      } catch (error) {

        console.error(
          "Error fetching employees:",
          error
        );

        setEmployeesError(
          error.message ||
          "Unable to load employees."
        );

      } finally {
        setEmployeesLoading(false);
      }
    };

    fetchEmployees();

  }, []);

  // ATTENDANCE STATUS LIST
  const statusList = [
    "Present",
    "Absent",
    "Leave",
    "Half Day",
    "Holiday",
    "Week Off"
  ];

  // HANDLE STATUS CHANGE
  const handleStatusChange = (
    employeeId,
    status
  ) => {

    setAttendanceStatus(
      (previousData) => ({
        ...previousData,
        [employeeId]: status
      })
    );

  };


   // ============================================================
// SAVE ATTENDANCE
// ============================================================

const handleSaveAttendance = async () => {

    // ============================================================
    // VALIDATE DATE
    // ============================================================

    if (!attendanceDate) {

        window.alert(
            "Please select attendance date."
        );

        return;
    }


    // ============================================================
    // CHECK ALL EMPLOYEES HAVE A STATUS
    // ============================================================

    const missingEmployee = employees.find(
        (employee) =>
            !attendanceStatus[employee.id]
    );


    if (missingEmployee) {

        window.alert(
            `Please select attendance status for ${missingEmployee.name}.`
        );

        return;
    }


    // ============================================================
    // CREATE ATTENDANCE ARRAY
    // ============================================================

    const attendance = employees.map(
        (employee) => ({

            employeeId: employee.id,

            status:
                attendanceStatus[employee.id],

            remark: ""
        })
    );


    // ============================================================
    // FINAL REQUEST BODY
    // ============================================================

    const attendanceData = {
        attendanceDate: attendanceDate,
        attendance: attendance
    };


    console.log(
        "Attendance data being sent:",
        attendanceData
    );


    // ============================================================
    // SEND DATA TO BACKEND
    // ============================================================

    try {

        const response = await fetch(
            "http://localhost:8080/api/attendance",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(
                    attendanceData
                )
            }
        );


        // ========================================================
        // HANDLE ERROR RESPONSE
        // ========================================================

        if (!response.ok) {

            let errorMessage =
                "Failed to save attendance.";

            try {

                const errorData =
                    await response.json();

                errorMessage =
                    errorData.message ||
                    errorData.error ||
                    errorMessage;

            } catch {

                // Backend did not return JSON.
            }


            throw new Error(
                errorMessage
            );
        }


        // ========================================================
        // READ SUCCESS RESPONSE
        // ========================================================

        const savedAttendance =
            await response.json();


        console.log(
            "Attendance saved successfully:",
            savedAttendance
        );


        // ========================================================
        // SUCCESS MESSAGE
        // ========================================================

        window.alert(
            "Attendance saved successfully."
        );


        // ========================================================
        // GO TO VIEW ATTENDANCE
        // ========================================================

        navigate(
            "/dashboard/view-attendence"
        );


    } catch (error) {

        console.error(
            "Error saving attendance:",
            error
        );


        window.alert(
            error.message ||
            "Unable to save attendance. Please try again."
        );
    }
};

  // COUNT SELECTED EMPLOYEES
  const selectedCount =
    Object.keys(attendanceStatus).length;


 
  // RENDER
  return (

    <section className="attendance-add-page">

      {/* ============  PAGE HEADER ==================== */}

      <div className="attendance-add-header">

        <div className="attendance-add-header-content">

          <div className="attendance-add-header-icon">

            <CalendarCheck
              size={21}/>
          </div>

          <div>
            <h1>
              Mark Employee Attendance
            </h1>
            <p>
              Record daily attendance for all employees.
            </p>
          </div>
        </div>
      </div>

      {/* ========  PAGE CONTENT ========== */}

      <div className="attendance-add-content">

        {/* ====  ATTENDANCE DATE SECTION ============ */}

        <div className="attendance-add-date-section">

          <div className="attendance-add-section-heading">

            <div className="attendance-add-heading-icon">

              <CalendarDays
                size={18} />
            </div>

            <div>

              <h2>
                Attendance Date
              </h2>

              <p>
                Select the date for which attendance should be marked.
              </p>

            </div>

          </div>


          <div className="attendance-add-date-field">

            <label htmlFor="attendanceDate">
              Attendance Date
            </label>


            <div className="attendance-add-input-wrapper">

              <CalendarDays
                size={18}
              />

              <input
                id="attendanceDate"
                type="date"
                value={attendanceDate}
                onChange={(e) =>
                  setAttendanceDate(
                    e.target.value
                  )
                }
                required
              />

            </div>

          </div>

        </div>


        {/* ==================================================
                    EMPLOYEE SUMMARY
                ================================================== */}

        <div className="attendance-add-summary">

          <div className="attendance-add-summary-item">

            <div className="attendance-add-summary-icon">

              <UsersRound
                size={18}
              />

            </div>


            <div>

              <span>
                Total Employees
              </span>

              <strong>
                {employees.length}
              </strong>

            </div>

          </div>


          <div className="attendance-add-summary-item">

            <div className="attendance-add-summary-icon">

              <CheckCircle2
                size={18}
              />

            </div>


            <div>

              <span>
                Attendance Marked
              </span>

              <strong>
                {selectedCount}
              </strong>

            </div>

          </div>

        </div>


        {/* ==================================================
                    EMPLOYEE TABLE
                ================================================== */}

        <form
          onSubmit={
            handleSaveAttendance
          }
        >

          <div className="attendance-add-table-container">

            {employeesLoading && (

              <div className="attendance-add-state">

                <UsersRound
                  size={22}
                />

                <p>
                  Loading employees...
                </p>

              </div>

            )}


            {employeesError && (

              <div className="attendance-add-error-state">

                <strong>
                  Unable to Load Employees
                </strong>

                <span>
                  {employeesError}
                </span>

              </div>

            )}


            {!employeesLoading &&
              !employeesError &&
              employees.length === 0 && (

                <div className="attendance-add-state">

                  <UsersRound
                    size={22}
                  />

                  <p>
                    No employees found.
                  </p>

                </div>

              )}


            {!employeesLoading &&
              !employeesError &&
              employees.length > 0 && (

                <div className="attendance-add-table-scroll">

                  <table className="attendance-add-table">

                    <thead>

                      <tr>

                        <th>
                          Employee Name
                        </th>

                        {statusList.map(
                          (status) => (

                            <th
                              key={status}
                            >
                              {status}
                            </th>

                          )
                        )}

                      </tr>

                    </thead>


                    <tbody>

                      {employees.map(
                        (employee) => (

                          <tr
                            key={
                              employee.id
                            }
                          >

                            {/* EMPLOYEE */}

                            <td className="attendance-add-employee-cell">

                              <div className="attendance-add-employee-info">

                                <div className="attendance-add-employee-avatar">

                                  {employee.name
                                    ?.charAt(0)
                                    ?.toUpperCase() ||
                                    "E"}

                                </div>


                                <div>

                                  <strong>
                                    {
                                      employee.name
                                    }
                                  </strong>

                                  <span>
                                    {
                                      employee.designation ||
                                      "Employee"
                                    }
                                  </span>

                                </div>

                              </div>

                            </td>


                            {/* STATUS OPTIONS */}

                            {statusList.map(
                              (status) => (

                                <td
                                  key={
                                    status
                                  }
                                  className={
                                    attendanceStatus[
                                      employee.id
                                    ] ===
                                      status
                                      ? `attendance-add-status-cell attendance-add-selected-${status
                                        .toLowerCase()
                                        .replace(
                                          " ",
                                          "-"
                                        )}`
                                      : "attendance-add-status-cell"
                                  }
                                >

                                  <label className="attendance-add-radio-label">

                                    <input
                                      type="radio"
                                      name={`attendance-${employee.id}`}
                                      value={
                                        status
                                      }
                                      checked={
                                        attendanceStatus[
                                        employee.id
                                        ] ===
                                        status
                                      }
                                      onChange={() =>
                                        handleStatusChange(
                                          employee.id,
                                          status
                                        )
                                      }
                                      required
                                    />
                                    <span className="attendance-add-custom-radio"></span>
                                  </label>
                                </td>
                              )
                            )}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
          </div>


          {/* ====  STATUS LEGEND =========== */}
          <div className="attendance-add-legend">
            <span className="attendance-add-legend-title">
              Attendance Status
            </span>

            <span className="attendance-add-legend-item attendance-add-legend-present">
              Present
            </span>

            <span className="attendance-add-legend-item attendance-add-legend-absent">
              Absent
            </span>

            <span className="attendance-add-legend-item attendance-add-legend-leave">
              Leave
            </span>

            <span className="attendance-add-legend-item attendance-add-legend-half-day">
              Half Day
            </span>

            <span className="attendance-add-legend-item attendance-add-legend-holiday">
              Holiday
            </span>

            <span className="attendance-add-legend-item attendance-add-legend-week-off">
              Week Off
            </span>
          </div>

          {/* ==================  FORM ACTION ========== */}

          <div className="attendance-add-actions">

            <button
              type="button"
              className="attendance-add-reset-btn"
              onClick={() =>
                setAttendanceStatus({})
              }>
              Reset
            </button>

            <button
              type="submit"
              className="attendance-add-save-btn"
              disabled={
                employeesLoading ||
                employees.length === 0
              }>
              <Save
                size={18}
              />
              Save Attendance
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
export default AddAttendence;