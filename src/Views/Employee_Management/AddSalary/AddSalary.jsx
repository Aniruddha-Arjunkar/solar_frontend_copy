import {
    WalletCards,
    UserRound,
    CalendarDays,
    IndianRupee,
    ReceiptIndianRupee,
    Utensils,
    Gift,
    MinusCircle,
    HandCoins,
    FileText,
    Save,
    X
} from "lucide-react";

import {
    useEffect,
    useState
} from "react";

import EmployeeHeader
    from "../../../Components/EmployeeManagementComponents/EmployeeModuleHeader/EmployeeHeader.jsx";

import "./AddSalary.css";


function AddSalary() {


    const [formData, setFormData] = useState({

        employeeId: "",
        salaryMonth: "",

        netSalary: "",
        professionTax: "0",

        basic: "0.00",
        hra: "0.00",
        conveyance: "0.00",

        foodAllowance: "0.00",
        performanceIncentive: "0.00",

        advanceDeduction: "0",

        reimbursement: "0",

        remark: ""
    });


    const [employees, setEmployees] = useState([]);
    const [employeesLoading, setEmployeesLoading] = useState(true);
    const [employeesError, setEmployeesError] = useState("");

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

                const data = await response.json();

                console.log(
                    "Employees for salary:",
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
    // HANDLE INPUT CHANGE
    // ============================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        // --------------------------------------------------------
        // NET SALARY
        // --------------------------------------------------------

        if (name === "netSalary") {

            const salary = Number(value) || 0;


            const basic =
                salary * 0.50;

            const hra =
                salary * 0.20;

            const conveyance =
                salary * 0.10;

            const foodAllowance =
                salary * 0.10;

            const performanceIncentive =
                salary * 0.10;


            setFormData((previousData) => ({

                ...previousData,

                netSalary: value,

                basic: basic.toFixed(2),

                hra: hra.toFixed(2),

                conveyance: conveyance.toFixed(2),

                foodAllowance:
                    foodAllowance.toFixed(2),

                performanceIncentive:
                    performanceIncentive.toFixed(2)

            }));


            return;

        }


        // --------------------------------------------------------
        // OTHER INPUTS
        // --------------------------------------------------------

        setFormData((previousData) => ({

            ...previousData,

            [name]: value

        }));

    };


    // ============================================================
// FORM SUBMIT
// ============================================================

const handleSubmit = async (e) => {

    e.preventDefault();

    // VALIDATE EMPLOYEE

    if (!formData.employeeId) {

        window.alert(
            "Please select an employee."
        );

        return;

    }

    // PREPARE SALARY DATA

    const salaryData = {

        month: formData.salaryMonth,

        amount:
            formData.netSalary === ""
                ? null
                : Number(formData.netSalary),

        basic:
            formData.basic === ""
                ? null
                : Number(formData.basic),

        hra:
            formData.hra === ""
                ? null
                : Number(formData.hra),

        conveyance:
            formData.conveyance === ""
                ? null
                : Number(formData.conveyance),

        foodAllowance:
            formData.foodAllowance === ""
                ? null
                : Number(formData.foodAllowance),

        performanceIncentive:
            formData.performanceIncentive === ""
                ? null
                : Number(formData.performanceIncentive),

        professionTax:
            formData.professionTax === ""
                ? null
                : Number(formData.professionTax),

        advance:
            formData.advanceDeduction === ""
                ? null
                : Number(formData.advanceDeduction),

        reimbursement:
            formData.reimbursement === ""
                ? null
                : Number(formData.reimbursement),

        remark: formData.remark

    };


    console.log(
        "Salary data being sent:",
        salaryData
    );


    // SAVE SALARY

    try {

        const response = await fetch(
            `http://localhost:8080/api/salaries/employee/${formData.employeeId}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(salaryData)
            }
        );


        // ----------------------------------------------------
        // HANDLE BACKEND ERROR
        // ----------------------------------------------------

        if (!response.ok) {

            let errorMessage =
                "Failed to save salary.";

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
            throw new Error(errorMessage);
        }

        // SUCCESS
    
        const savedSalary =
            await response.json();

        console.log(
            "Salary saved successfully:",
            savedSalary
        );
        window.alert(
            "Salary saved successfully."
        );

        window.location.reload();

    } catch (error) {
        console.error(
            "Error saving salary:",
            error
        );
        window.alert(
            error.message ||
            "Unable to save salary. Please try again."
        );
    }
};


    // ============================================================
    // CANCEL
    // ============================================================

    const handleCancel = () => {

        window.history.back();

    };


    return (

        <section className="salary-add-page">


            {/* ====================================================
                PAGE HEADER
            ==================================================== */}

            <EmployeeHeader
                currectPage="Add Salary"
                title="Add Employee Salary"
                description="Record monthly salary details and manage employee salary calculations."
                buttonType="view"
                icon={WalletCards} />


            {/* ====================================================
                SALARY FORM
            ==================================================== */}

            <form
                className="salary-add-form"
                onSubmit={handleSubmit}
            >


                {/* ==================================================
                    SALARY BASIC INFORMATION
                ================================================== */}

                <div className="salary-form-section">


                    <div className="salary-section-header">

                        <WalletCards size={19} />

                        <div>

                            <h3>
                                Salary Information
                            </h3>

                            <p>
                                Select employee and salary month.
                            </p>

                        </div>

                    </div>


                    <div className="salary-form-grid salary-two-column">


                        {/* EMPLOYEE */}

                        <div className="salary-form-group">

                            <label>
                                Select Employee
                            </label>

                            <div className="salary-input-with-icon">

                                <UserRound size={17} />

                                <select
                                    name="employeeId"
                                    value={formData.employeeId}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        {employeesLoading
                                            ? "Loading Employees..."
                                            : employeesError
                                                ? "Unable to Load Employees"
                                                : "Select Employee"
                                        }
                                    </option>

                                    {employees.map((employee) => (

                                        <option
                                            key={employee.id}
                                            value={employee.id}
                                        >

                                            {employee.name}
                                            {" — "}
                                            {employee.designation}

                                        </option>

                                    ))}

                                </select>

                            </div>

                        </div>


                        {/* SALARY MONTH */}

                        <div className="salary-form-group">

                            <label>
                                Salary Month
                            </label>

                            <div className="salary-input-with-icon">

                                <CalendarDays size={17} />

                                <input
                                    type="month"
                                    name="salaryMonth"
                                    value={formData.salaryMonth}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    SALARY CALCULATION
                ================================================== */}

                <div className="salary-form-section">


                    <div className="salary-section-header">

                        <IndianRupee size={19} />

                        <div>

                            <h3>
                                Salary Calculation
                            </h3>

                            <p>
                                Enter net salary to calculate
                                the salary components automatically.
                            </p>

                        </div>

                    </div>


                    <div className="salary-form-grid salary-two-column">


                        {/* NET SALARY */}

                        <div className="salary-form-group">

                            <label>
                                Net Salary
                            </label>

                            <div className="salary-input-with-icon">

                                <IndianRupee size={17} />

                                <input
                                    type="number"
                                    min="0"
                                    name="netSalary"
                                    value={formData.netSalary}
                                    onChange={handleChange}
                                    placeholder="Enter Net Salary"
                                    required
                                />

                            </div>

                        </div>


                        {/* PROFESSION TAX */}

                        <div className="salary-form-group">

                            <label>
                                Profession Tax
                            </label>

                            <div className="salary-input-with-icon">

                                <ReceiptIndianRupee size={17} />

                                <input
                                    type="number"
                                    min="0"
                                    name="professionTax"
                                    value={formData.professionTax}
                                    onChange={handleChange}
                                    placeholder="0"
                                />

                            </div>

                        </div>

                    </div>


                    {/* ==================================================
                        AUTO CALCULATED COMPONENTS
                    ================================================== */}

                    <div className="salary-component-grid">


                        {/* BASIC */}

                        <div className="salary-form-group">

                            <label>
                                Basic
                                <span>
                                    50%
                                </span>
                            </label>

                            <div className="salary-input-with-icon">

                                <IndianRupee size={16} />

                                <input
                                    type="number"
                                    value={formData.basic}
                                    readOnly
                                />

                            </div>

                        </div>


                        {/* HRA */}

                        <div className="salary-form-group">

                            <label>
                                HRA
                                <span>
                                    20%
                                </span>
                            </label>

                            <div className="salary-input-with-icon">

                                <IndianRupee size={16} />

                                <input
                                    type="number"
                                    value={formData.hra}
                                    readOnly
                                />

                            </div>

                        </div>


                        {/* CONVEYANCE */}

                        <div className="salary-form-group">

                            <label>
                                Conveyance
                                <span>
                                    10%
                                </span>
                            </label>

                            <div className="salary-input-with-icon">

                                <IndianRupee size={16} />

                                <input
                                    type="number"
                                    value={formData.conveyance}
                                    readOnly
                                />

                            </div>

                        </div>


                        {/* FOOD ALLOWANCE */}

                        <div className="salary-form-group">

                            <label>
                                Food Allowance
                                <span>
                                    10%
                                </span>
                            </label>

                            <div className="salary-input-with-icon">

                                <Utensils size={16} />

                                <input
                                    type="number"
                                    value={formData.foodAllowance}
                                    readOnly
                                />

                            </div>

                        </div>


                        {/* PERFORMANCE INCENTIVE */}

                        <div className="salary-form-group">

                            <label>
                                Performance Incentive
                                <span>
                                    10%
                                </span>
                            </label>

                            <div className="salary-input-with-icon">

                                <Gift size={16} />

                                <input
                                    type="number"
                                    value={
                                        formData.performanceIncentive
                                    }
                                    readOnly
                                />

                            </div>

                        </div>


                        {/* ADVANCE DEDUCTION */}

                        <div className="salary-form-group">

                            <label>
                                Advance Deduction
                            </label>

                            <div className="salary-input-with-icon">

                                <MinusCircle size={16} />

                                <input
                                    type="number"
                                    min="0"
                                    name="advanceDeduction"
                                    value={
                                        formData.advanceDeduction
                                    }
                                    onChange={handleChange}
                                    placeholder="0"
                                />

                            </div>

                        </div>

                    </div>


                    {/* ==================================================
                        REIMBURSEMENT + REMARK
                    ================================================== */}

                    <div className="salary-form-grid salary-two-column">


                        {/* REIMBURSEMENT */}

                        <div className="salary-form-group">

                            <label>
                                Reimbursement
                            </label>

                            <div className="salary-input-with-icon">

                                <HandCoins size={17} />

                                <input
                                    type="number"
                                    min="0"
                                    name="reimbursement"
                                    value={
                                        formData.reimbursement
                                    }
                                    onChange={handleChange}
                                    placeholder="0"
                                />

                            </div>

                        </div>


                        {/* REMARK */}

                        <div className="salary-form-group">

                            <label>
                                Remark
                            </label>

                            <div className="salary-input-with-icon">

                                <FileText size={17} />

                                <input
                                    type="text"
                                    name="remark"
                                    value={formData.remark}
                                    onChange={handleChange}
                                    placeholder="Add a remark"
                                />

                            </div>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    SALARY SUMMARY
                ================================================== */}

                <div className="salary-summary-card">

                    <div>

                        <span>
                            Salary Structure
                        </span>

                        <strong>
                            100%
                        </strong>

                    </div>


                    <p>
                        Basic 50% + HRA 20% + Conveyance 10%
                        + Food Allowance 10% + Performance
                        Incentive 10%
                    </p>

                </div>


                {/* ==================================================
                    FORM ACTIONS
                ================================================== */}

                <div className="salary-form-actions">


                    <button
                        type="button"
                        className="salary-cancel-btn"
                        onClick={handleCancel}
                    >

                        <X size={17} />

                        Cancel

                    </button>


                    <button
                        type="submit"
                        className="salary-save-btn"
                    >

                        <Save size={17} />

                        Save Salary

                    </button>

                </div>


            </form>

        </section>

    );

}


export default AddSalary;