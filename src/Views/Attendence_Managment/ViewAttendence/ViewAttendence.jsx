import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Search,
  UsersRound,
  RotateCcw
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState
} from "react";

import "./ViewAttendence.css";


function ViewAttendence() {


  // CURRENT DATE

  const getCurrentMonth = () => {
    const today = new Date();
    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");

    return `${year}-${month}`;
  };


  // ============================================================
  // EMPLOYEE STATE
  // ============================================================

  const [employees, setEmployees] = useState([]);

  const [employeesLoading, setEmployeesLoading] =
    useState(true);

  const [employeesError, setEmployeesError] =
    useState("");


  // ============================================================
  // FILTER STATE
  // ============================================================

  const [selectedMonth, setSelectedMonth] =
    useState(getCurrentMonth());

  const [searchEmployee, setSearchEmployee] =
    useState("");


  // ============================================================
  // REPORT STATE
  // ============================================================

  const [viewMonth, setViewMonth] =
    useState(getCurrentMonth());


  // ============================================================
  // ATTENDANCE DATA
  // ============================================================

  /*
      Attendance backend will be connected later.

      Future data will look approximately like:

      [
          {
              employeeId: 1,
              attendanceDate: "2026-09-01",
              status: "Present"
          },
          {
              employeeId: 1,
              attendanceDate: "2026-09-02",
              status: "Absent"
          }
      ]

      For now this remains empty, so the calendar
      displays "-" for days without attendance data.
  */

   const [attendanceRecords, setAttendanceRecords] =
  useState([]);

  const [attendanceLoading, setAttendanceLoading] =
  useState(true);

  const [attendanceError, setAttendanceError] =
  useState("");


  // ============================================================
  // FETCH EMPLOYEES
  // ============================================================

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
          "Employees for attendance report:",
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

    // ============================================================
// FETCH MONTHLY ATTENDANCE
// ============================================================

useEffect(() => {

  const fetchAttendance = async () => {

    try {

      setAttendanceLoading(true);

      setAttendanceError("");


      const response = await fetch(
        `http://localhost:8080/api/attendance/month/${viewMonth}`
      );


      if (!response.ok) {

        throw new Error(
          "Failed to fetch attendance records."
        );

      }


      const data =
        await response.json();


      console.log(
        "Attendance records for report:",
        data
      );


      setAttendanceRecords(data);


    } catch (error) {

      console.error(
        "Error fetching attendance:",
        error
      );


      setAttendanceError(
        error.message ||
        "Unable to load attendance records."
      );


      setAttendanceRecords([]);


    } finally {

      setAttendanceLoading(false);

    }
  };

  if (viewMonth) {
    fetchAttendance();
  }

}, [viewMonth]);


  // ============================================================
  // GET MONTH INFORMATION
  // ============================================================

  const monthInformation = useMemo(() => {

    const [year, month] =
      viewMonth.split("-").map(Number);


    const daysInMonth =
      new Date(
        year,
        month,
        0
      ).getDate();


    const days = [];


    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {

      const date =
        new Date(
          year,
          month - 1,
          day
        );


      const dateString =
        `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


      days.push({

        day,

        date: dateString,

        weekday:
          date.toLocaleDateString(
            "en-US",
            {
              weekday: "short"
            }
          )

      });

    }


    return {
      year,
      month,
      days
    };

  }, [viewMonth]);


  // ============================================================
  // FILTER EMPLOYEES
  // ============================================================

  const filteredEmployees =
    useMemo(() => {

      const search =
        searchEmployee
          .trim()
          .toLowerCase();


      if (!search) {
        return employees;
      }


      return employees.filter(
        (employee) =>
          employee.name
            ?.toLowerCase()
            .includes(search)
      );

    }, [
      employees,
      searchEmployee
    ]);


  // ============================================================
  // GET ATTENDANCE STATUS
  // ============================================================

  const getAttendanceStatus = (
    employeeId,
    date
  ) => {

    const record =
      attendanceRecords.find(
        (attendance) =>
          Number(
            attendance.employeeId
          ) === Number(employeeId)
          &&
          attendance.attendanceDate ===
          date
      );


    return record?.status || "";

  };


  // ============================================================
  // SHORT STATUS LABEL
  // ============================================================

  const getStatusLabel = (status) => {

    switch (status) {

      case "Present":
        return "Pr";

      case "Absent":
        return "Ab";

      case "Leave":
        return "Le";

      case "Half Day":
        return "HD";

      case "Holiday":
        return "Ho";

      case "Week Off":
        return "WO";

      default:
        return "-";

    }

  };


  // ============================================================
  // STATUS CSS CLASS
  // ============================================================

  const getStatusClass = (status) => {

    switch (status) {

      case "Present":
        return "attendance-view-status-present";

      case "Absent":
        return "attendance-view-status-absent";

      case "Leave":
        return "attendance-view-status-leave";

      case "Half Day":
        return "attendance-view-status-half-day";

      case "Holiday":
        return "attendance-view-status-holiday";

      case "Week Off":
        return "attendance-view-status-week-off";

      default:
        return "attendance-view-status-empty";

    }

  };


  // ============================================================
  // VIEW REPORT
  // ============================================================

  const handleViewReport = (e) => {

    e.preventDefault();

    setViewMonth(selectedMonth);

  };


  // ============================================================
  // PREVIOUS MONTH
  // ============================================================

  const handlePreviousMonth = () => {

    const [year, month] =
      viewMonth.split("-").map(Number);


    const previousDate =
      new Date(
        year,
        month - 2,
        1
      );


    const previousYear =
      previousDate.getFullYear();


    const previousMonth =
      String(
        previousDate.getMonth() + 1
      ).padStart(2, "0");


    const previousValue =
      `${previousYear}-${previousMonth}`;


    setSelectedMonth(previousValue);

    setViewMonth(previousValue);

  };


  // ============================================================
  // NEXT MONTH
  // ============================================================

  const handleNextMonth = () => {

    const [year, month] =
      viewMonth.split("-").map(Number);


    const nextDate =
      new Date(
        year,
        month,
        1
      );


    const nextYear =
      nextDate.getFullYear();


    const nextMonth =
      String(
        nextDate.getMonth() + 1
      ).padStart(2, "0");


    const nextValue =
      `${nextYear}-${nextMonth}`;


    setSelectedMonth(nextValue);

    setViewMonth(nextValue);

  };


  // ============================================================
  // RESET FILTERS
  // ============================================================

  const handleReset = () => {

    const currentMonth =
      getCurrentMonth();


    setSelectedMonth(
      currentMonth
    );

    setViewMonth(
      currentMonth
    );

    setSearchEmployee("");

  };


  // ============================================================
  // FORMAT MONTH TITLE
  // ============================================================

  const formattedMonth =
    new Date(
      monthInformation.year,
      monthInformation.month - 1,
      1
    ).toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric"
      }
    );


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <section className="attendance-view-page">


      {/* ====================================================
                PAGE HEADER
            ==================================================== */}

      <div className="attendance-view-header">

        <div className="attendance-view-header-content">

          <div className="attendance-view-header-icon">

            <CalendarDays
              size={21}
            />

          </div>


          <div>

            <h1>
              Employee Attendance Report
            </h1>

            <p>
              View monthly attendance records for all employees.
            </p>

          </div>

        </div>

      </div>


      {/* ====================================================
                PAGE CONTENT
            ==================================================== */}

      <div className="attendance-view-content">


        {/* ==================================================
                    FILTER CARD
                ================================================== */}

        <form
          className="attendance-view-filter-card"
          onSubmit={handleViewReport}
        >


          {/* SEARCH EMPLOYEE */}

          <div className="attendance-view-filter-group">

            <label htmlFor="attendanceEmployeeSearch">

              Search Employee

            </label>


            <div className="attendance-view-input-wrapper">

              <Search
                size={17}
              />

              <input
                id="attendanceEmployeeSearch"
                type="text"
                placeholder="Search employee..."
                value={searchEmployee}
                onChange={(e) =>
                  setSearchEmployee(
                    e.target.value
                  )
                }
              />

            </div>

          </div>


          {/* SELECT MONTH */}

          <div className="attendance-view-filter-group">

            <label htmlFor="attendanceViewMonth">

              Select Month

            </label>


            <div className="attendance-view-input-wrapper">

              <CalendarDays
                size={17}
              />

              <input
                id="attendanceViewMonth"
                type="month"
                value={selectedMonth}
                onChange={(e) =>
                  setSelectedMonth(
                    e.target.value
                  )
                }
              />

            </div>

          </div>


          {/* VIEW BUTTON */}

          <button
            type="submit"
            className="attendance-view-report-btn"
          >

            <Search
              size={17}
            />

            View Report

          </button>


          {/* RESET */}

          <button
            type="button"
            className="attendance-view-reset-btn"
            onClick={handleReset}
            title="Reset filters"
          >

            <RotateCcw
              size={17}
            />

          </button>

        </form>


        {/* ==================================================
                    REPORT TOOLBAR
                ================================================== */}

        <div className="attendance-view-toolbar">


          <div className="attendance-view-month-navigation">


            <button
              type="button"
              className="attendance-view-month-btn"
              onClick={
                handlePreviousMonth
              }
              title="Previous month"
            >

              <ChevronLeft
                size={18}
              />

            </button>


            <div className="attendance-view-current-month">

              <CalendarDays
                size={18}
              />

              <strong>
                {formattedMonth}
              </strong>

            </div>


            <button
              type="button"
              className="attendance-view-month-btn"
              onClick={
                handleNextMonth
              }
              title="Next month"
            >

              <ChevronRight
                size={18}
              />

            </button>

          </div>


          <div className="attendance-view-employee-count">

            <UsersRound
              size={16}
            />

            <span>
              {filteredEmployees.length}
              {" "}
              Employee
              {filteredEmployees.length !== 1
                ? "s"
                : ""
              }
            </span>

          </div>

        </div>


        {/* ==================================================
                    STATUS LEGEND
                ================================================== */}

        <div className="attendance-view-legend">

          <span className="attendance-view-legend-title">
            Status:
          </span>


          <span className="attendance-view-legend-item attendance-view-legend-present">
            <b>Pr</b>
            Present
          </span>


          <span className="attendance-view-legend-item attendance-view-legend-absent">
            <b>Ab</b>
            Absent
          </span>


          <span className="attendance-view-legend-item attendance-view-legend-leave">
            <b>Le</b>
            Leave
          </span>


          <span className="attendance-view-legend-item attendance-view-legend-half-day">
            <b>HD</b>
            Half Day
          </span>


          <span className="attendance-view-legend-item attendance-view-legend-holiday">
            <b>Ho</b>
            Holiday
          </span>


          <span className="attendance-view-legend-item attendance-view-legend-week-off">
            <b>WO</b>
            Week Off
          </span>

        </div>


        {/* ==================================================
                    ATTENDANCE TABLE
                ================================================== */}

        <div className="attendance-view-table-card">


          {employeesLoading && (

            <div className="attendance-view-state">

              <UsersRound
                size={24}
              />

              <p>
                Loading employees...
              </p>

            </div>

          )}


          {employeesError && (

            <div className="attendance-view-error">

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
            filteredEmployees.length === 0 && (

              <div className="attendance-view-state">

                <UsersRound
                  size={24}
                />

                <p>
                  No employees found.
                </p>

              </div>

            )}


          { !employeesLoading &&
            !employeesError &&
            !attendanceLoading &&
            !attendanceError &&
            filteredEmployees.length > 0 && (

              <div className="attendance-view-table-scroll">

                <table className="attendance-view-table">

                  <thead>

                    <tr>

                      <th className="attendance-view-number-column">
                        No.
                      </th>

                      <th className="attendance-view-employee-column">
                        Employee
                      </th>


                      {monthInformation.days.map(
                        (day) => (

                          <th
                            key={
                              day.date
                            }
                            className={
                              day.weekday ===
                                "Sat" ||
                                day.weekday ===
                                "Sun"
                                ? "attendance-view-weekend-header"
                                : ""
                            }
                          >

                            <span>
                              {day.day}
                            </span>

                            <small>
                              {day.weekday}
                            </small>

                          </th>

                        )
                      )}

                    </tr>

                  </thead>


                  <tbody>

                    {filteredEmployees.map(
                      (
                        employee,
                        employeeIndex
                      ) => (

                        <tr
                          key={
                            employee.id
                          }
                        >

                          {/* NUMBER */}

                          <td className="attendance-view-number-cell">

                            {
                              employeeIndex +
                              1
                            }

                          </td>


                          {/* EMPLOYEE */}

                          <td className="attendance-view-employee-cell">

                            <div className="attendance-view-employee-info">

                              <div className="attendance-view-avatar">

                                {employee.name
                                  ?.charAt(
                                    0
                                  )
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


                          {/* DAYS */}

                          {monthInformation.days.map(
                            (
                              day
                            ) => {

                              const status =
                                getAttendanceStatus(
                                  employee.id,
                                  day.date
                                );


                              return (

                                <td
                                  key={
                                    day.date
                                  }
                                  className={`
                                                                        attendance-view-day-cell
                                                                        ${getStatusClass(
                                    status
                                  )}
                                                                    `}
                                  title={
                                    status
                                      ? `${employee.name} - ${day.date} - ${status}`
                                      : `${employee.name} - ${day.date} - No attendance`
                                  }
                                >

                                  <span>
                                    {
                                      getStatusLabel(
                                        status
                                      )
                                    }
                                  </span>

                                </td>

                              );

                            }
                          )}

                        </tr>

                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
        </div> 
      </div>
    </section>
  );
}
export default ViewAttendence;