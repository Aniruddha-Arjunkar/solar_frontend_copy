import {
    ArrowLeft,
    Upload,
    IndianRupee,
    User,
    Phone,
    Mail,
    CalendarDays,
    MapPin,
    Heart,
    GraduationCap,
    BriefcaseBusiness,
    Building2,
    Landmark,
    CreditCard,
    ShieldCheck,
    FileText,
    UserRound,
    UsersRound,
    CalendarCheck
} from "lucide-react";

import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router";

import "./ViewEmployeeProfile.css";


function ViewEmployeeProfile() {

    const {employeeId} = useParams();
    const navigate = useNavigate();

    const [employee, setEmployee] =useState(null);
    const [loading, setLoading] =useState(true);
    const [error, setError] = useState("");
     
    const [showSalaryPopup, setShowSalaryPopup] = useState(false);
    const [salaryMonth, setSalaryMonth] = useState("");
    const [salary, setSalary] = useState(null);
    const [salaryLoading, setSalaryLoading] = useState(false);
    const [salaryError, setSalaryError] = useState("");

    useEffect(() => {

        const fetchEmployee = async () => {

            try {

                setLoading(true);

                setError("");


                const response = await fetch(
                    `http://localhost:8080/api/employees/${employeeId}`
                );


                if (!response.ok) {

                    if (response.status === 404) {

                        throw new Error(
                            "Employee not found."
                        );

                    }


                    throw new Error(
                        "Failed to fetch employee details."
                    );

                }


                const data =
                    await response.json();


                console.log(
                    "Employee profile fetched:",
                    data
                );


                setEmployee(data);


            } catch (error) {

                console.error(
                    "Error fetching employee profile:",
                    error
                );


                setError(
                    error.message ||
                    "Unable to load employee profile."
                );


            } finally {

                setLoading(false);

            }

        };


        if (employeeId) {

            fetchEmployee();

        }

    }, [employeeId]);

    // ============================================================
    // BACK TO VIEW EMPLOYEES
    // ============================================================

    const handleBack = () => {

        navigate(
            "/dashboard/view-employee"
        );

    };

    // ============================================================
// OPEN SALARY POPUP
// ============================================================

const handleOpenSalary = () => {

    setShowSalaryPopup(true);

    setSalary(null);

    setSalaryError("");

    setSalaryMonth("");

};


// ============================================================
// CLOSE SALARY POPUP
// ============================================================

const handleCloseSalary = () => {

    setShowSalaryPopup(false);

    setSalary(null);

    setSalaryError("");

    setSalaryMonth("");

};


// ============================================================
// VIEW SALARY
// ============================================================

const handleViewSalary = async () => {

    if (!salaryMonth) {

        window.alert(
            "Please select salary month."
        );
        return;
    }

    try {

        setSalaryLoading(true);

        setSalaryError("");

        setSalary(null);


        const response = await fetch(
            `http://localhost:8080/api/salaries/employee/${employeeId}/month/${salaryMonth}`
        );

        if (!response.ok) {
            if (response.status === 404) {

                throw new Error(
                    "Salary record not found for the selected month."
                );

            }
            throw new Error(
                "Failed to fetch salary details."
            );
        }

        const data = await response.json();

        console.log(
            "Salary details fetched:",
            data
        );

        setSalary(data);

    } catch (error) {
        console.error(
            "Error fetching salary:",
            error
        );
        setSalaryError(
            error.message ||
            "Unable to load salary details."
        );
    } finally {
        setSalaryLoading(false);
    }

};

        // ============================================================
    // LOADING STATE
    // ============================================================

    if (loading) {

        return (

            <section className="view-profile-page">

                <div className="view-profile-no-data">

                    <h2>
                        Loading Employee...
                    </h2>

                    <p>
                        Please wait while employee information is loaded.
                    </p>

                </div>

            </section>

        );

    }


    // ============================================================
    // ERROR STATE
    // ============================================================

    if (error) {

        return (

            <section className="view-profile-page">

                <div className="view-profile-no-data">

                    <UserRound size={45} />

                    <h2>
                        Unable to Load Employee
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={handleBack}
                        className="view-profile-back-btn"
                    >

                        <ArrowLeft size={18} />

                        Back

                    </button>

                </div>

            </section>

        );

    }

        // ============================================================
    // NO EMPLOYEE FOUND
    // ============================================================

    if (!employee) {

        return (

            <section className="view-profile-page">

                <div className="view-profile-no-data">

                    <UserRound size={45} />

                    <h2>
                        Employee Not Found
                    </h2>

                    <p>
                        No employee information is available.
                    </p>

                    <button
                        type="button"
                        onClick={handleBack}
                        className="view-profile-back-btn"
                    >

                        <ArrowLeft size={18} />

                        Back

                    </button>

                </div>

            </section>

        );

    }


    // ============================================================
    // DISPLAY HELPER
    // ============================================================

    const displayValue = (value) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "Not provided";
        }

        return value;
    };


    // ============================================================
    // MONEY FORMATTER
    // ============================================================

    const formatAmount = (value) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "Not provided";
        }

        return `₹ ${Number(value).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    return (

        <section className="view-profile-page">


            {/* ====================================================
                PROFILE HEADER
            ==================================================== */}

            <div className="view-profile-header">


                {/* ==================================================
                    LEFT SIDE
                ================================================== */}

                <div className="view-profile-header-left">


                    {/* PROFILE PHOTO */}
                    <div className="view-profile-photo">

                        {employee.profilePhoto ? (

                            <img
                                src={employee.profilePhoto}
                                alt={employee.name}
                            />

                        ) : (

                            <User size={42} />

                        )}

                    </div>


                    {/* EMPLOYEE BASIC INFORMATION */}

                    <div className="view-profile-basic-info">

                        <span className="view-profile-id">
                            Employee ID : #{displayValue(employee.id)}
                        </span>

                        <h1>
                            {displayValue(employee.name)}
                        </h1>

                        <div className="view-profile-designation">

                            <BriefcaseBusiness size={17} />

                            <span>
                                {displayValue(employee.designation)}
                            </span>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    RIGHT SIDE BUTTONS
                ================================================== */}

                <div className="view-profile-header-actions">


                    {/* BACK */}

                    <button
                        type="button"
                        className="view-profile-btn back"
                        onClick={handleBack}
                    >

                        <ArrowLeft size={17} />
                        Back
                    </button>

                </div>

            </div>


            {/* ====================================================
                PERSONAL DETAILS
            ==================================================== */}

            <div className="view-profile-section">


                <div className="view-profile-section-header personal">

                    <User size={19} />

                    <h2>
                        Personal Details
                    </h2>

                </div>


                <div className="view-profile-info-grid">


                    <ProfileItem
                        icon={<User size={17} />}
                        label="Title"
                        value={employee.title}
                    />

                    <ProfileItem
                        icon={<User size={17} />}
                        label="Employee Name"
                        value={employee.name}
                        highlight
                    />

                    <ProfileItem
                        icon={<Phone size={17} />}
                        label="Phone"
                        value={employee.phone}
                    />

                    <ProfileItem
                        icon={<CalendarDays size={17} />}
                        label="Date of Birth"
                        value={employee.dob}
                    />

                    <ProfileItem
                        icon={<UsersRound size={17} />}
                        label="Gender"
                        value={employee.gender}
                    />

                    <ProfileItem
                        icon={<Mail size={17} />}
                        label="Email Address"
                        value={employee.email}
                    />

                    <ProfileItem
                        icon={<Phone size={17} />}
                        label="Emergency Contact"
                        value={employee.emergencyContact || employee.altPhone}
                    />

                    <ProfileItem
                        icon={<Heart size={17} />}
                        label="Relationship"
                        value={employee.relationship}
                    />

                    <ProfileItem
                        icon={<User size={17} />}
                        label="Mother Name"
                        value={employee.motherName}
                    />

                    <ProfileItem
                        icon={<Heart size={17} />}
                        label="Marital Status"
                        value={employee.maritalStatus}
                    />

                </div>

            </div>


            {/* ====================================================
                ADDRESS DETAILS
            ==================================================== */}

            <div className="view-profile-section">


                <div className="view-profile-section-header address">

                    <MapPin size={19} />

                    <h2>
                        Address Details
                    </h2>

                </div>


                <div className="view-profile-address-grid">


                    <div className="view-profile-address-card">

                        <div className="view-profile-address-title">

                            <MapPin size={17} />

                            <span>
                                Current Address
                            </span>

                        </div>

                        <p>
                            {displayValue(employee.currentAddress)}
                        </p>

                    </div>


                    <div className="view-profile-address-card">

                        <div className="view-profile-address-title">

                            <MapPin size={17} />

                            <span>
                                Permanent Address
                            </span>

                        </div>

                        <p>
                            {displayValue(employee.permanentAddress)}
                        </p>

                    </div>

                </div>

            </div>


            {/* ====================================================
                EDUCATION DETAILS
            ==================================================== */}

            <div className="view-profile-section">


                <div className="view-profile-section-header education">

                    <GraduationCap size={19} />

                    <h2>
                        Education Details
                    </h2>

                </div>


                <div className="view-profile-info-grid">


                    <ProfileItem
                        label="10th"
                        value={employee.tenth}
                    />

                    <ProfileItem
                        label="12th"
                        value={employee.twelfth}
                    />

                    <ProfileItem
                        label="Graduation"
                        value={employee.graduation}
                    />

                    <ProfileItem
                        label="Post Graduation"
                        value={employee.postGraduation}
                    />

                </div>

            </div>


            {/* ====================================================
                EXPERIENCE DETAILS
            ==================================================== */}

            <div className="view-profile-section">


                <div className="view-profile-section-header experience">

                    <BriefcaseBusiness size={19} />

                    <h2>
                        Experience Details
                    </h2>

                </div>


                <div className="view-profile-info-grid">


                    <ProfileItem
                        label="Experience Type"
                        value={employee.experienceType}
                    />

                    <ProfileItem
                        label="Previous Experience"
                        value={employee.previousExperience}
                    />

                    <ProfileItem
                        label="Work Experience"
                        value={
                            employee.workExperienceYears !== undefined &&
                            employee.workExperienceYears !== ""
                                ? `${employee.workExperienceYears} Years`
                                : null
                        }
                    />

                    <ProfileItem
                        label="Previous Company"
                        value={employee.previousCompanyName}
                    />

                    <ProfileItem
                        label="Previous Designation"
                        value={employee.previousDesignation}
                    />

                    <ProfileItem
                        icon={<IndianRupee size={17} />}
                        label="Previous Salary"
                        value={formatAmount(employee.previousSalary)}
                    />

                </div>

            </div>


            {/* ====================================================
                EMPLOYEE DETAILS
            ==================================================== */}

            <div className="view-profile-section">


                <div className="view-profile-section-header employee">

                    <BriefcaseBusiness size={19} />

                    <h2>
                        Employee Details
                    </h2>

                </div>


                <div className="view-profile-info-grid">


                    <ProfileItem
                        label="Employee Type"
                        value={employee.employeeType}
                    />

                    <ProfileItem
                        icon={<Building2 size={17} />}
                        label="Department"
                        value={employee.department}
                    />

                    <ProfileItem
                        icon={<IndianRupee size={17} />}
                        label="Annual Package"
                        value={formatAmount(employee.packageAmount)}
                    />

                    <ProfileItem
                        icon={<CalendarDays size={17} />}
                        label="Joining Date"
                        value={employee.joiningDate}
                    />

                    <ProfileItem
                        icon={<BriefcaseBusiness size={17} />}
                        label="Designation"
                        value={employee.designation}
                        highlight
                    />

                </div>

            </div>


            {/* ====================================================
                BANK DETAILS
            ==================================================== */}

            <div className="view-profile-section">


                <div className="view-profile-section-header bank">

                    <Landmark size={19} />

                    <h2>
                        Bank Details
                    </h2>

                </div>


                <div className="view-profile-info-grid">


                    <ProfileItem
                        icon={<CreditCard size={17} />}
                        label="Account Number"
                        value={employee.accountNo}
                    />

                    <ProfileItem
                        icon={<Landmark size={17} />}
                        label="Bank Name"
                        value={employee.bankName}
                    />

                    <ProfileItem
                        icon={<Building2 size={17} />}
                        label="Branch Name"
                        value={employee.branchName}
                    />

                    <ProfileItem
                        label="IFSC Code"
                        value={employee.ifscCode}
                    />

                </div>

            </div>


            {/* ====================================================
                KYC DETAILS
            ==================================================== */}

            <div className="view-profile-section">


                <div className="view-profile-section-header kyc">

                    <ShieldCheck size={19} />

                    <h2>
                        KYC Details
                    </h2>

                </div>


                <div className="view-profile-info-grid">


                    <ProfileItem
                        label="Aadhar Number"
                        value={employee.aadharNo}
                    />

                    <ProfileItem
                        label="PAN Card Number"
                        value={employee.panNo}
                    />

                    <ProfileItem
                        label="Profile Photo"
                        value={
                            employee.profilePhoto
                                ? "Uploaded"
                                : "Not uploaded"
                        }
                    />

                </div>

            </div>


            {/* ====================================================
                PROVIDENT FUND & ESIC
            ==================================================== */}

            <div className="view-profile-section">


                <div className="view-profile-section-header pf">

                    <ShieldCheck size={19} />

                    <h2>
                        Provident Fund & ESIC
                    </h2>

                </div>


                <div className="view-profile-info-grid">


                    <ProfileItem
                        label="UAN Number"
                        value={employee.uanNo}
                    />

                    <ProfileItem
                        label="PF Number"
                        value={employee.pfNo}
                    />

                    <ProfileItem
                        label="ESIC Number"
                        value={employee.esicNo}
                    />

                </div>

            </div>


            {/* ====================================================
                DOCUMENTS
            ==================================================== */}

            <div className="view-profile-section">


                <div className="view-profile-section-header documents">

                    <FileText size={19} />

                    <h2>
                        Documents
                    </h2>

                </div>


                <div className="view-profile-document-area">


                    {employee.documents ? (

                        <div className="view-profile-document-card">

                            <FileText size={24} />

                            <div>

                                <strong>
                                    Employee Documents
                                </strong>

                                <span>
                                    Documents uploaded for this employee
                                </span>

                            </div>

                        </div>

                    ) : (

                        <div className="view-profile-no-document">

                            <FileText size={30} />

                            <div>

                                <strong>
                                    No Documents Uploaded
                                </strong>

                                <span>
                                    Upload employee documents using the button above.
                                </span>

                            </div>

                        </div>

                    )}

                </div>

            </div>


            {/* ====================================================
                BOTTOM ACTIONS
            ==================================================== */}

            <div className="view-profile-footer">


                <button
                    type="button"
                    className="view-profile-footer-back"
                    onClick={handleBack}
                >

                    <ArrowLeft size={18} />

                    Back to Employees

                </button>


                <div className="view-profile-footer-actions">

                    <button
                        type="button"
                        className="view-profile-footer-document"
                        onClick={() => { console.log(
                                        "Upload document for employee:",employee );
                                        }}>
                        <Upload size={18} />
                        Upload Document
                    </button>

                    <button
                      type="button"
                      className="view-profile-footer-salary"
                        onClick={handleOpenSalary}>
                        <IndianRupee size={18} />
                         Salary
                    </button>

                    <button
                        type="button"
                        className="view-profile-footer-attendence"
                        onClick={() => {console.log("Attendence for employee:",employee);
                        }}>
                        <CalendarCheck size={18} />
                        Attendence
                    </button>
                </div>
            </div>


        {/* ============================================================
    SALARY POPUP
============================================================ */}

{showSalaryPopup && (

    <div className="employee-salary-overlay">

        <div className="employee-salary-modal">


            {/* ==================================================
                POPUP HEADER
            ================================================== */}

            <div className="employee-salary-modal-header">

                <div>

                    <div className="employee-salary-modal-title">

                        <IndianRupee size={20} />

                        <h2>
                            View Salary Detail
                        </h2>

                    </div>

                    <p>
                        View monthly salary information for this employee.
                    </p>

                </div>


                <button
                    type="button"
                    className="employee-salary-close-btn"
                    onClick={handleCloseSalary}
                >

                    ×

                </button>

            </div>


            {/* ==================================================
                EMPLOYEE + MONTH
            ================================================== */}

            <div className="employee-salary-form">


                {/* EMPLOYEE NAME */}

                <div className="employee-salary-form-group">

                    <label>
                        Employee Name
                    </label>

                    <div className="employee-salary-input">

                        <User size={17} />

                        <input
                            type="text"
                            value={employee.name || ""}
                            readOnly
                        />

                    </div>

                </div>


                {/* SALARY MONTH */}

                <div className="employee-salary-form-group">

                    <label>
                        Month - Year
                    </label>

                    <div className="employee-salary-input">

                        <CalendarDays size={17} />

                        <input
                            type="month"
                            value={salaryMonth}
                            onChange={(e) =>
                                setSalaryMonth(e.target.value)
                            }
                        />

                    </div>

                </div>


                {/* VIEW BUTTON */}

                <button
                    type="button"
                    className="employee-salary-view-btn"
                    onClick={handleViewSalary}
                    disabled={salaryLoading}
                >

                    <IndianRupee size={17} />

                    {salaryLoading
                        ? "Loading..."
                        : "View Salary"
                    }

                </button>

            </div>


            {/* ==================================================
                SALARY ERROR
            ================================================== */}

            {salaryError && (

                <div className="employee-salary-error">

                    <strong>
                        Unable to Load Salary
                    </strong>

                    <span>
                        {salaryError}
                    </span>

                </div>

            )}


            {/* ==================================================
                SALARY DETAILS
            ================================================== */}

            {salary && (

                <div className="employee-salary-details">


                    <div className="employee-salary-details-header">

                        <h3>
                            Salary Details
                        </h3>

                        <span>
                            {salary.month}
                        </span>

                    </div>


                    <div className="employee-salary-details-grid">


                        {/* NET SALARY */}

                        <div className="employee-salary-detail-item">

                            <span>
                                Net Salary
                            </span>

                            <strong>
                                {formatAmount(salary.amount)}
                            </strong>

                        </div>


                        {/* BASIC */}

                        <div className="employee-salary-detail-item">

                            <span>
                                Basic
                            </span>

                            <strong>
                                {formatAmount(salary.basic)}
                            </strong>

                        </div>


                        {/* HRA */}

                        <div className="employee-salary-detail-item">

                            <span>
                                HRA
                            </span>

                            <strong>
                                {formatAmount(salary.hra)}
                            </strong>

                        </div>


                        {/* CONVEYANCE */}

                        <div className="employee-salary-detail-item">

                            <span>
                                Conveyance
                            </span>

                            <strong>
                                {formatAmount(salary.conveyance)}
                            </strong>

                        </div>


                        {/* FOOD ALLOWANCE */}

                        <div className="employee-salary-detail-item">

                            <span>
                                Food Allowance
                            </span>

                            <strong>
                                {formatAmount(salary.foodAllowance)}
                            </strong>

                        </div>


                        {/* PERFORMANCE INCENTIVE */}

                        <div className="employee-salary-detail-item">

                            <span>
                                Performance Incentive
                            </span>

                            <strong>
                                {formatAmount(
                                    salary.performanceIncentive
                                )}
                            </strong>

                        </div>


                        {/* ADVANCE DEDUCTION */}

                        <div className="employee-salary-detail-item">

                            <span>
                                Advance Deduction
                            </span>

                            <strong>
                                {formatAmount(salary.advance)}
                            </strong>

                        </div>


                        {/* REIMBURSEMENT */}

                        <div className="employee-salary-detail-item">

                            <span>
                                Reimbursement
                            </span>

                            <strong>
                                {formatAmount(
                                    salary.reimbursement
                                )}
                            </strong>

                        </div>


                        {/* PROFESSION TAX */}

                        <div className="employee-salary-detail-item">

                            <span>
                                Profession Tax
                            </span>

                            <strong>
                                {formatAmount(
                                    salary.professionTax
                                )}
                            </strong>

                        </div>


                        {/* REMARK */}
                        <div className="employee-salary-detail-item employee-salary-remark">
                            <span>
                                Remark
                            </span>
                            <strong>
                                {salary.remark || "Not provided"}
                            </strong>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
)}
        </section>
    );
}


// ================================================================
// REUSABLE PROFILE ITEM
// ================================================================

function ProfileItem({
    icon,
    label,
    value,
    highlight = false
}) {

    return (

        <div
            className={
                highlight
                    ? "view-profile-info-item highlight"
                    : "view-profile-info-item"
            }
        >

            <div className="view-profile-info-label">

                {icon}

                <span>
                    {label}
                </span>

            </div>

            <strong>
                {
                    value === null ||
                    value === undefined ||
                    value === ""
                        ? "Not provided"
                        : value
                }
            </strong>

        </div>
    );
}


export default ViewEmployeeProfile;