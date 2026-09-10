import {
    UserPlus,
    User,
    Phone,
    CalendarDays,
    Mail,
    MapPin,
    GraduationCap,
    BriefcaseBusiness,
    Building2,
    IndianRupee,
    Landmark,
    CreditCard,
    ShieldCheck,
    FileText,
    Save,
    X
} from "lucide-react";

import {
    useState,
    useEffect
} from "react";

import {
    useNavigate
} from "react-router";

import EmployeeHeader from "../../../Components/EmployeeManagementComponents/EmployeeModuleHeader/EmployeeHeader.jsx";

import "./AddEmployee.css";


function AddEmployee() {

    const navigate = useNavigate();

    const [sameAsCurrentAddress, setSameAsCurrentAddress] = useState(false);
    const [formData, setFormData] = useState({

        title: "Mr.",
        name: "",
        phone: "",
        dob: "",
        gender: "Male",
        email: "",
        relationship: "",
        emergencyContact: "",
        motherName: "",
        maritalStatus: "",
        currentAddress: "",
        permanentAddress: "",


        // ========================================================
        // EDUCATION DETAILS
        // ========================================================

        tenth: "",
        twelfth: "",
        graduation: "",
        postGraduation: "",


        // ========================================================
        // EXPERIENCE DETAILS
        // ========================================================

        experienceType: "Fresher",
        previousExperience: "",
        workExperienceYears: "",
        previousCompanyName: "",
        previousDesignation: "",
        previousSalary: "",


        // ========================================================
        // EMPLOYEE DETAILS
        // ========================================================

        employeeType: "",
        department: "",
        packageAmount: "",
        joiningDate: "",
        designation: "",


        // ========================================================
        // BANK DETAILS
        // ========================================================

        accountNo: "",
        bankName: "",
        branchName: "",
        ifscCode: "",


        // ========================================================
        // KYC DETAILS
        // ========================================================

        aadharNo: "",
        panNo: "",


        // ========================================================
        // PROVIDENT FUND & ESIC
        // ========================================================

        uanNo: "",
        pfNo: "",
        esicNo: "",
    });
     
    // ============================================================
// SYNC PERMANENT ADDRESS WITH CURRENT ADDRESS
// ============================================================

useEffect(() => {
    if (sameAsCurrentAddress) {
        setFormData((previousData) => ({
            ...previousData,
            permanentAddress: previousData.currentAddress
        }));
    }
    }, [sameAsCurrentAddress,formData.currentAddress]);

    // ============================================================
    // HANDLE INPUT CHANGE
    // ============================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFormData((previousData) => ({

            ...previousData,

            [name]: value

        }));

    };


    // ============================================================
    // HANDLE FILE CHANGE
    // ============================================================

    const handleFileChange = (e) => {

        const {
            name,
            files
        } = e.target;


        setFormData((previousData) => ({

            ...previousData,

            [name]: files[0] || null

        }));

    };


     // ============================================================
// HANDLE FORM SUBMIT
// ============================================================

const handleSubmit = async (e) => {

    e.preventDefault();


    // ========================================================
    // PREPARE EMPLOYEE DATA
    // ========================================================

    const employeeData = {

        // ====================================================
        // PERSONAL DETAILS
        // ====================================================

        title: formData.title,
        name: formData.name,
        phone: formData.phone,

        dob:
            formData.dob === ""
                ? null
                : formData.dob,

        gender: formData.gender,
        email: formData.email,
        relationship: formData.relationship,
        emergencyContact: formData.emergencyContact,
        motherName: formData.motherName,
        maritalStatus: formData.maritalStatus,

        currentAddress: formData.currentAddress,
        permanentAddress: formData.permanentAddress,


        // ====================================================
        // EDUCATION DETAILS
        // ====================================================

        tenth: formData.tenth,
        twelfth: formData.twelfth,
        graduation: formData.graduation,
        postGraduation: formData.postGraduation,


        // ====================================================
        // EXPERIENCE DETAILS
        // ====================================================

        experienceType: formData.experienceType,
        previousExperience: formData.previousExperience,

        workExperienceYears:
            formData.workExperienceYears === ""
                ? null
                : Number(formData.workExperienceYears),

        previousCompanyName: formData.previousCompanyName,
        previousDesignation: formData.previousDesignation,

        previousSalary:
            formData.previousSalary === ""
                ? null
                : Number(formData.previousSalary),


        // ====================================================
        // EMPLOYEE DETAILS
        // ====================================================

        employeeType: formData.employeeType,
        department: formData.department,

        packageAmount:
            formData.packageAmount === ""
                ? null
                : Number(formData.packageAmount),

        joiningDate:
            formData.joiningDate === ""
                ? null
                : formData.joiningDate,

        designation: formData.designation,


        // ====================================================
        // BANK DETAILS
        // ====================================================

        accountNo: formData.accountNo,
        bankName: formData.bankName,
        branchName: formData.branchName,
        ifscCode: formData.ifscCode,


        // ====================================================
        // KYC DETAILS
        // ====================================================

        aadharNo: formData.aadharNo,
        panNo: formData.panNo,


        // ====================================================
        // PROVIDENT FUND & ESIC
        // ====================================================

        uanNo: formData.uanNo,
        pfNo: formData.pfNo,
        esicNo: formData.esicNo

    };


    // ========================================================
    // CHECK DATA BEFORE SENDING
    // ========================================================

    console.log(
        "Employee Data Sending To Backend:",
        employeeData
    );

    try {

        const response = await fetch(
            "http://localhost:8080/api/employees",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(employeeData)
            }
        );


        // ====================================================
        // HANDLE BACKEND ERROR
        // ====================================================

        if (!response.ok) {

            let errorMessage =
                "Failed to create employee.";

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


        // ====================================================
        // GET SAVED EMPLOYEE
        // ====================================================

        const savedEmployee =
            await response.json();


        console.log(
            "Employee Created Successfully:",
            savedEmployee
        );


        // ====================================================
        // SUCCESS MESSAGE
        // ====================================================

        window.alert(
            "Employee added successfully."
        );


        // ====================================================
        // GO TO VIEW EMPLOYEE
        // ====================================================

        navigate(
            "/dashboard/view-employee"
        );

    } catch (error) {

        // ====================================================
        // HANDLE API / NETWORK ERROR
        // ====================================================

        console.error(
            "Error creating employee:",
            error
        );


        window.alert(
            error.message ||
            "Unable to add employee. Please try again."
        );

    }

};

    


    // ============================================================
    // CANCEL
    // ============================================================

    const handleCancel = () => {

        navigate("/dashboard/view-employee");

    };


    return (

        <section className="add-employee-page">


            {/* ====================================================
                PAGE HEADER
            ==================================================== */}

            <EmployeeHeader
                currectPage="Add Employee"
                title="Employee Management"
                description="Add a new employee and maintain complete employee information."
                buttonType="view"
                icon={UserPlus}
            />


            {/* ====================================================
                EMPLOYEE FORM
            ==================================================== */}

            <form
                className="add-employee-form"
                onSubmit={handleSubmit}
            >


                {/* ==================================================
                    PERSONAL DETAILS
                ================================================== */}

                <div className="employee-form-section">


                    <div className="employee-form-section-header personal">

                        <User size={18} />

                        <h3>
                            Personal Details
                        </h3>

                    </div>


                    <div className="employee-form-grid">


                        {/* TITLE */}

                        <div className="employee-form-group">

                            <label>
                                Title
                            </label>

                            <select
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                            >

                                <option value="Mr.">
                                    Mr.
                                </option>

                                <option value="Mrs.">
                                    Mrs.
                                </option>

                                <option value="Ms.">
                                    Ms.
                                </option>

                                <option value="Dr.">
                                    Dr.
                                </option>

                            </select>

                        </div>


                        {/* NAME */}

                        <div className="employee-form-group">

                            <label>
                                Employee Name
                            </label>

                            <div className="employee-input-with-icon">

                                <User size={16} />

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Employee Name"
                                    required
                                />

                            </div>

                        </div>


                        {/* PHONE */}

                        <div className="employee-form-group">

                            <label>
                                Phone
                            </label>

                            <div className="employee-input-with-icon">

                                <Phone size={16} />

                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Phone Number"
                                />

                            </div>

                        </div>


                        {/* DOB */}

                        <div className="employee-form-group">

                            <label>
                                Date of Birth
                            </label>

                            <div className="employee-input-with-icon">

                                <CalendarDays size={16} />

                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>


                        {/* GENDER */}

                        <div className="employee-form-group">

                            <label>
                                Gender
                            </label>

                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >

                                <option value="Male">
                                    Male
                                </option>

                                <option value="Female">
                                    Female
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>


                        {/* EMAIL */}

                        <div className="employee-form-group">

                            <label>
                                Email Address
                            </label>

                            <div className="employee-input-with-icon">

                                <Mail size={16} />

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email Address"
                                />

                            </div>

                        </div>

                        {/* Emergency Contact */}

                        <div className="employee-form-group">
                            <label>
                                Emergency Contact
                            </label>
                            <div className="employee-input-with-icon">
                                <Phone size={16} />
                                <input
                                    type="tel"
                                    name="emergencyContact"
                                    value={formData.emergencyContact}
                                    onChange={handleChange}
                                    placeholder="Emergency Contact"
                                />
                            </div>
                        </div>

                        {/* RELATIONSHIP */}

                        <div className="employee-form-group">

                            <label>
                                Relationship
                            </label>

                            <input
                                type="text"
                                name="relationship"
                                value={formData.relationship}
                                onChange={handleChange}
                                placeholder="Relationship"
                            />
                        </div>


                        {/* MOTHER NAME */}

                        <div className="employee-form-group">

                            <label>
                                Mother Name
                            </label>

                            <input
                                type="text"
                                name="motherName"
                                value={formData.motherName}
                                onChange={handleChange}
                                placeholder="Mother Name"
                            />

                        </div>


                        {/* MARITAL STATUS */}

                        <div className="employee-form-group">

                            <label>
                                Marital Status
                            </label>

                            <select
                                name="maritalStatus"
                                value={formData.maritalStatus}
                                onChange={handleChange}
                            >

                                <option value="">
                                    Select
                                </option>

                                <option value="Single">
                                    Single
                                </option>

                                <option value="Married">
                                    Married
                                </option>

                                <option value="Divorced">
                                    Divorced
                                </option>

                                <option value="Widowed">
                                    Widowed
                                </option>

                            </select>

                        </div>


                        {/* CURRENT ADDRESS */}

                        <div className="employee-form-group employee-full-width">

                            <label>
                                Current Address
                            </label>

                            <div className="employee-input-with-icon">

                                <MapPin size={16} />

                                <textarea
                                    name="currentAddress"
                                    value={formData.currentAddress}
                                    onChange={handleChange}
                                    placeholder="Current Address"
                                    rows="2"
                                />

                            </div>

                        </div>


                        {/* PERMANENT ADDRESS */}

<div className="employee-form-group employee-full-width">

    {/* ========================================================
        PERMANENT ADDRESS LABEL
    ======================================================== */}

    <div className="employee-permanent-address-header">

        <label>
            Permanent Address
        </label>


        {/* ====================================================
            SAME AS CURRENT ADDRESS CHECKBOX
        ==================================================== */}

        <label className="employee-same-address-checkbox">

            <input
                type="checkbox"
                checked={sameAsCurrentAddress}
                onChange={(e) =>
                    setSameAsCurrentAddress(e.target.checked)
                }
            />

            <span>
                Same as Current Address
            </span>

        </label>

    </div>


    {/* ========================================================
        PERMANENT ADDRESS INPUT
    ======================================================== */}

    <div className="employee-input-with-icon">

        <MapPin size={16} />

        <textarea
            name="permanentAddress"
            value={formData.permanentAddress}
            onChange={handleChange}
            placeholder="Permanent Address"
            rows="2"
            disabled={sameAsCurrentAddress}
        />

    </div>

</div>

                    </div>

                </div>


                {/* ==================================================
                    EDUCATION DETAILS
                ================================================== */}

                <div className="employee-form-section">

                    <div className="employee-form-section-header education">

                        <GraduationCap size={18} />

                        <h3>
                            Education Details
                        </h3>

                    </div>


                    <div className="employee-form-grid">


                        <div className="employee-form-group">

                            <label>
                                10th
                            </label>

                            <input
                                type="text"
                                name="tenth"
                                value={formData.tenth}
                                onChange={handleChange}
                                placeholder="10th Qualification"
                            />

                        </div>


                        <div className="employee-form-group">

                            <label>
                                12th
                            </label>

                            <input
                                type="text"
                                name="twelfth"
                                value={formData.twelfth}
                                onChange={handleChange}
                                placeholder="12th Qualification"
                            />

                        </div>


                        <div className="employee-form-group">

                            <label>
                                Graduation
                            </label>

                            <input
                                type="text"
                                name="graduation"
                                value={formData.graduation}
                                onChange={handleChange}
                                placeholder="Graduation"
                            />

                        </div>


                        <div className="employee-form-group">

                            <label>
                                Post Graduation
                            </label>

                            <input
                                type="text"
                                name="postGraduation"
                                value={formData.postGraduation}
                                onChange={handleChange}
                                placeholder="Post Graduation"
                            />

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    EXPERIENCE DETAILS
                ================================================== */}

                <div className="employee-form-section">

                    <div className="employee-form-section-header experience">

                        <BriefcaseBusiness size={18} />

                        <h3>
                            Experience Details
                        </h3>

                    </div>


                    <div className="employee-form-grid">


                        {/* EXPERIENCE TYPE */}

                        <div className="employee-form-group">

                            <label>
                                Experience Type
                            </label>

                            <select
                                name="experienceType"
                                value={formData.experienceType}
                                onChange={handleChange}
                            >

                                <option value="Fresher">
                                    Fresher
                                </option>

                                <option value="Experienced">
                                    Experienced
                                </option>

                            </select>

                        </div>


                        {/* PREVIOUS EXPERIENCE */}

                        <div className="employee-form-group">

                            <label>
                                Previous Experience
                            </label>

                            <input
                                type="text"
                                name="previousExperience"
                                value={formData.previousExperience}
                                onChange={handleChange}
                                placeholder="Previous Experience"
                            />

                        </div>


                        {/* EXPERIENCE YEARS */}

                        <div className="employee-form-group">

                            <label>
                                Work Experience Years
                            </label>

                            <input
                                type="number"
                                min="0"
                                step="0.1"
                                name="workExperienceYears"
                                value={formData.workExperienceYears}
                                onChange={handleChange}
                                placeholder="Years"
                            />

                        </div>


                        {/* PREVIOUS COMPANY */}

                        <div className="employee-form-group">

                            <label>
                                Previous Company Name
                            </label>

                            <input
                                type="text"
                                name="previousCompanyName"
                                value={formData.previousCompanyName}
                                onChange={handleChange}
                                placeholder="Previous Company"
                            />

                        </div>


                        {/* PREVIOUS DESIGNATION */}

                        <div className="employee-form-group">

                            <label>
                                Previous Designation
                            </label>

                            <input
                                type="text"
                                name="previousDesignation"
                                value={formData.previousDesignation}
                                onChange={handleChange}
                                placeholder="Previous Designation"
                            />

                        </div>


                        {/* PREVIOUS SALARY */}

                        <div className="employee-form-group">

                            <label>
                                Previous Salary
                            </label>

                            <div className="employee-input-with-icon">

                                <IndianRupee size={16} />

                                <input
                                    type="number"
                                    min="0"
                                    name="previousSalary"
                                    value={formData.previousSalary}
                                    onChange={handleChange}
                                    placeholder="Previous Salary"
                                />

                            </div>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    EMPLOYEE DETAILS
                ================================================== */}

                <div className="employee-form-section">

                    <div className="employee-form-section-header employee">

                        <BriefcaseBusiness size={18} />

                        <h3>
                            Employee Details
                        </h3>

                    </div>


                    <div className="employee-form-grid">


                        {/* EMPLOYEE TYPE */}

                        <div className="employee-form-group">

                            <label>
                                Employee Type
                            </label>

                            <select
                                name="employeeType"
                                value={formData.employeeType}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select
                                </option>

                                <option value="Full Time">
                                    Full Time
                                </option>

                                <option value="Part Time">
                                    Part Time
                                </option>

                                <option value="Contract">
                                    Contract
                                </option>

                                <option value="Intern">
                                    Intern
                                </option>

                            </select>

                        </div>


                        {/* DEPARTMENT */}

                        <div className="employee-form-group">

                            <label>
                                Department
                            </label>
                            <input
                              type="text"
                              name="department"
                              value={formData.department}
                              onChange={handleChange}
                              placeholder="Department"/>
                        </div>


                        {/* PACKAGE */}

                        <div className="employee-form-group">

                            <label>
                                Package
                            </label>

                            <div className="employee-input-with-icon">

                                <IndianRupee size={16} />

                                <input
                                    type="number"
                                    min="0"
                                    name="packageAmount"
                                    value={formData.packageAmount}
                                    onChange={handleChange}
                                    placeholder="Annual Package"
                                />

                            </div>

                        </div>


                        {/* JOINING DATE */}

                        <div className="employee-form-group">

                            <label>
                                Joining Date
                            </label>

                            <div className="employee-input-with-icon">

                                <CalendarDays size={16} />

                                <input
                                    type="date"
                                    name="joiningDate"
                                    value={formData.joiningDate}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>


                        {/* DESIGNATION */}

                        <div className="employee-form-group">

                            <label>
                                Designation
                            </label>

                            <input
                                type="text"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                placeholder="Designation"
                            />

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    BANK DETAILS
                ================================================== */}

                <div className="employee-form-section">

                    <div className="employee-form-section-header bank">

                        <Landmark size={18} />

                        <h3>
                            Bank Details
                        </h3>

                    </div>


                    <div className="employee-form-grid">


                        {/* ACCOUNT NUMBER */}

                        <div className="employee-form-group">

                            <label>
                                Account Number
                            </label>

                            <div className="employee-input-with-icon">

                                <CreditCard size={16} />

                                <input
                                    type="text"
                                    name="accountNo"
                                    value={formData.accountNo}
                                    onChange={handleChange}
                                    placeholder="Account Number"
                                />

                            </div>

                        </div>


                        {/* BANK NAME */}

                        <div className="employee-form-group">

                            <label>
                                Bank Name
                            </label>

                            <input
                                type="text"
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleChange}
                                placeholder="Bank Name"
                            />

                        </div>


                        {/* BRANCH NAME */}

                        <div className="employee-form-group">

                            <label>
                                Branch Name
                            </label>

                            <input
                                type="text"
                                name="branchName"
                                value={formData.branchName}
                                onChange={handleChange}
                                placeholder="Branch Name"
                            />

                        </div>


                        {/* IFSC */}

                        <div className="employee-form-group">

                            <label>
                                IFSC Code
                            </label>

                            <input
                                type="text"
                                name="ifscCode"
                                value={formData.ifscCode}
                                onChange={handleChange}
                                placeholder="IFSC Code"
                            />

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    KYC DETAILS
                ================================================== */}

                <div className="employee-form-section">

                    <div className="employee-form-section-header kyc">

                        <ShieldCheck size={18} />

                        <h3>
                            KYC Details
                        </h3>

                    </div>


                    <div className="employee-form-grid">


                        {/* AADHAR */}

                        <div className="employee-form-group">

                            <label>
                                Aadhar Number
                            </label>

                            <input
                                type="text"
                                name="aadharNo"
                                value={formData.aadharNo}
                                onChange={handleChange}
                                placeholder="Aadhar Number"
                            />

                        </div>


                        {/* PAN */}

                        <div className="employee-form-group">

                            <label>
                                PAN Card Number
                            </label>

                            <input
                                type="text"
                                name="panNo"
                                value={formData.panNo}
                                onChange={handleChange}
                                placeholder="PAN Number"
                            />

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    PROVIDENT FUND & ESIC
                ================================================== */}

                <div className="employee-form-section">

                    <div className="employee-form-section-header pf">

                        <ShieldCheck size={18} />

                        <h3>
                            Provident Fund & ESIC
                        </h3>

                    </div>


                    <div className="employee-form-grid">


                        {/* UAN */}

                        <div className="employee-form-group">

                            <label>
                                UAN Number
                            </label>

                            <input
                                type="text"
                                name="uanNo"
                                value={formData.uanNo}
                                onChange={handleChange}
                                placeholder="UAN Number"
                            />

                        </div>


                        {/* PF */}

                        <div className="employee-form-group">

                            <label>
                                PF Number
                            </label>

                            <input
                                type="text"
                                name="pfNo"
                                value={formData.pfNo}
                                onChange={handleChange}
                                placeholder="PF Number"
                            />

                        </div>


                        {/* ESIC */}

                        <div className="employee-form-group">

                            <label>
                                ESIC Number
                            </label>

                            <input
                                type="text"
                                name="esicNo"
                                value={formData.esicNo}
                                onChange={handleChange}
                                placeholder="ESIC Number"
                            />

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    FORM ACTIONS
                ================================================== */}

                <div className="employee-form-actions">


                    <button
                        type="button"
                        className="employee-cancel-btn"
                        onClick={handleCancel}
                    >

                        <X size={17} />

                        Cancel

                    </button>


                    <button
                        type="submit"
                        className="employee-save-btn"
                    >

                        <Save size={17} />

                        Save Employee

                    </button>

                </div>


            </form>

        </section>

    );

}


export default AddEmployee;