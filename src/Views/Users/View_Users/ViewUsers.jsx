import {
    UserRoundPlus,
    Users,
    X,
    Search,
    RefreshCw,
    Pencil,
    Trash2,
    UserPlus,
    UserRound,
    Mail,
    Phone
} from "lucide-react";

import axios from "axios";

import { useState, useEffect } from "react";

import "./ViewUsers.css";


function ViewUsers() {

    // ============================================================
    // STATE
    // ============================================================

    const [showForm, setShowForm] = useState(false);

    const [users, setUsers] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");

    const [editingUserId, setEditingUserId] = useState(null);

    const [loading, setLoading] = useState(true);

    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");


    const [formData, setFormData] = useState({
        name: "",
        contact: "",
        email: "",
        password: ""
    });


    // ============================================================
    // API BASE URL
    // ============================================================

    const API_BASE_URL = "http://localhost:8080/api";


    // ============================================================
    // RESET FORM
    // ============================================================

    const resetForm = () => {

        setFormData({
            name: "",
            contact: "",
            email: "",
            password: ""
        });

        setEditingUserId(null);

        setShowForm(false);

    };


    // ============================================================
    // FETCH ALL USERS
    // ============================================================

    const fetchUsers = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API_BASE_URL}/users`
            );

            setUsers(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Error fetching users:",
                error
            );

            setError(
                "Unable to load users. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {

        fetchUsers();

    }, []);


    // ============================================================
    // INPUT CHANGE
    // ============================================================

    const handleInputChange = (event) => {

        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });

    };


    // ============================================================
    // OPEN ADD USER FORM
    // ============================================================

    const handleAddUser = () => {

        setEditingUserId(null);

        setFormData({
            name: "",
            contact: "",
            email: "",
            password: ""
        });

        setShowForm(true);

    };


    // ============================================================
    // CREATE / UPDATE USER
    // ============================================================

    const handleSubmitUser = async (event) => {

        event.preventDefault();

        try {

            setSubmitting(true);

            setError("");


            // ----------------------------------------------------
            // UPDATE USER
            // ----------------------------------------------------

            if (editingUserId) {

                const response = await axios.put(
                    `${API_BASE_URL}/users/${editingUserId}`,
                    formData
                );

                console.log(
                    "User updated:",
                    response.data
                );


                setUsers((currentUsers) =>
                    currentUsers.map((user) =>
                        user.id === editingUserId
                            ? response.data
                            : user
                    )
                );


                resetForm();

            }

            // ----------------------------------------------------
            // CREATE USER
            // ----------------------------------------------------

            else {

                const response = await axios.post(
                    `${API_BASE_URL}/users`,
                    formData
                );

                console.log(
                    "User created:",
                    response.data
                );


                setUsers((currentUsers) => [
                    ...currentUsers,
                    response.data
                ]);


                resetForm();

            }

        } catch (error) {

            console.error(
                "Error saving user:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to save user. Please try again."
            );

        } finally {

            setSubmitting(false);

        }

    };


    // ============================================================
    // EDIT USER
    // ============================================================

    const handleEditUser = (user) => {

        setEditingUserId(user.id);

        setFormData({
            name: user.name || "",
            contact: user.contact || "",
            email: user.email || "",
            password: user.password || ""
        });

        setShowForm(true);

    };


    // ============================================================
    // DELETE USER
    // ============================================================

    const handleDeleteUser = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) {
            return;
        }


        try {

            setError("");

            await axios.delete(
                `${API_BASE_URL}/users/${id}`
            );

            console.log("User deleted");


            setUsers((currentUsers) =>
                currentUsers.filter(
                    (user) => user.id !== id
                )
            );

        } catch (error) {

            console.error(
                "Error deleting user:",
                error
            );

            setError(
                "Unable to delete user. Please try again."
            );

        }

    };


    // ============================================================
    // FILTER USERS
    // ============================================================

    const filteredUsers = users.filter((user) => {

        const search =
            searchTerm
                .trim()
                .toLowerCase();

        return (

            user.name
                ?.toLowerCase()
                .includes(search)

            ||

            user.contact
                ?.toLowerCase()
                .includes(search)

            ||

            user.email
                ?.toLowerCase()
                .includes(search)

        );

    });


    // ============================================================
    // CLOSE FORM
    // ============================================================

    const handleCloseForm = () => {

        if (submitting) {
            return;
        }

        resetForm();

    };


    // ============================================================
    // RENDER
    // ============================================================

    return (

        <section className="accounts-user-management-page">


            {/* ====================================================
                PAGE HEADER
            ==================================================== */}

            <div className="accounts-user-management-header">

                <div className="accounts-user-management-header-left">

                    <div className="accounts-user-management-header-icon">
                        <Users size={28} />
                    </div>


                    <div>

                        <div className="accounts-user-management-breadcrumb">

                            Dashboard
                            <span>/</span>
                            User Management

                        </div>


                        <h1>
                            User Management
                        </h1>


                        <p>
                            Create, update and manage system users.
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    className="accounts-user-management-add-btn"
                    onClick={handleAddUser}
                >

                    <UserRoundPlus size={18} />

                    Add User

                </button>

            </div>


            {/* ====================================================
                STAT CARDS
            ==================================================== */}

            <div className="accounts-user-management-stats">


                {/* TOTAL USERS */}

                <div className="accounts-user-management-stat-card">

                    <div className="accounts-user-management-stat-icon">
                        <Users size={21} />
                    </div>


                    <div>

                        <span>
                            Total Users
                        </span>

                        <strong>
                            {users.length}
                        </strong>

                    </div>

                </div>


                {/* SEARCH RESULTS */}

                <div className="accounts-user-management-stat-card">

                    <div className="accounts-user-management-stat-icon">
                        <Search size={21} />
                    </div>


                    <div>

                        <span>
                            Showing
                        </span>

                        <strong>
                            {filteredUsers.length}
                        </strong>

                    </div>

                </div>


                {/* SYSTEM ACCESS */}

                <div className="accounts-user-management-stat-card">

                    <div className="accounts-user-management-stat-icon">
                        <UserRound size={21} />
                    </div>


                    <div>

                        <span>
                            System Accounts
                        </span>

                        <strong>
                            {users.length}
                        </strong>

                    </div>

                </div>

            </div>


            {/* ====================================================
                ERROR MESSAGE
            ==================================================== */}

            {error && (

                <div className="accounts-user-management-error">

                    <span>
                        {error}
                    </span>


                    <button
                        type="button"
                        onClick={fetchUsers}
                    >
                        Try Again
                    </button>

                </div>

            )}


            {/* ====================================================
                USERS TABLE CARD
            ==================================================== */}

            <div className="accounts-user-management-table-card">


                {/* TABLE HEADER */}

                <div className="accounts-user-management-table-header">

                    <div>

                        <h2>
                            All Users
                        </h2>

                        <p>
                            Manage users registered in the system.
                        </p>

                    </div>


                    <div className="accounts-user-management-table-controls">


                        {/* SEARCH */}

                        <div className="accounts-user-management-search">

                            <Search size={17} />

                            <input
                                type="text"
                                placeholder="Search name, contact or email..."
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(
                                        event.target.value
                                    )
                                }
                            />

                            {searchTerm && (

                                <button
                                    type="button"
                                    className="accounts-user-management-clear-search"
                                    onClick={() =>
                                        setSearchTerm("")
                                    }
                                    aria-label="Clear search"
                                >
                                    <X size={15} />
                                </button>

                            )}

                        </div>


                        {/* COUNT */}

                        <span className="accounts-user-management-count">

                            {filteredUsers.length}
                            {" "}
                            {filteredUsers.length === 1
                                ? "User"
                                : "Users"
                            }

                        </span>


                        {/* REFRESH */}

                        <button
                            type="button"
                            className="accounts-user-management-refresh-btn"
                            onClick={fetchUsers}
                            disabled={loading}
                            title="Refresh users"
                        >

                            <RefreshCw
                                size={17}
                                className={
                                    loading
                                        ? "accounts-user-management-spin"
                                        : ""
                                }
                            />

                        </button>

                    </div>

                </div>


                {/* ==================================================
                    LOADING
                ================================================== */}

                {loading ? (

                    <div className="accounts-user-management-loading">

                        <RefreshCw
                            size={30}
                            className="accounts-user-management-spin"
                        />

                        <p>
                            Loading users...
                        </p>

                    </div>

                ) : filteredUsers.length === 0 ? (

                    /* ==================================================
                        EMPTY STATE
                    ================================================== */

                    <div className="accounts-user-management-empty">

                        <div className="accounts-user-management-empty-icon">

                            <Users size={34} />

                        </div>


                        <h3>
                            No Users Found
                        </h3>


                        <p>

                            {searchTerm
                                ? "No users match your current search."
                                : "No users have been added yet."
                            }

                        </p>


                        {searchTerm ? (

                            <button
                                type="button"
                                onClick={() =>
                                    setSearchTerm("")
                                }
                            >
                                Clear Search
                            </button>

                        ) : (

                            <button
                                type="button"
                                onClick={handleAddUser}
                            >
                                <UserPlus size={16} />
                                Add First User
                            </button>

                        )}

                    </div>

                ) : (

                    /* ==================================================
                        USERS TABLE
                    ================================================== */

                    <div className="accounts-user-management-table-wrapper">

                        <table className="accounts-user-management-table">

                            <thead>

                                <tr>

                                    <th>
                                        #
                                    </th>

                                    <th>
                                        User
                                    </th>

                                    <th>
                                        Contact Number
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredUsers.map(
                                    (user, index) => (

                                        <tr key={user.id}>


                                            {/* SERIAL NUMBER */}

                                            <td>

                                                <span className="accounts-user-management-serial">
                                                    {index + 1}
                                                </span>

                                            </td>


                                            {/* USER */}

                                            <td>

                                                <div className="accounts-user-management-user-cell">

                                                    <div className="accounts-user-management-avatar">

                                                        {user.name
                                                            ?.charAt(0)
                                                            .toUpperCase() || "U"}

                                                    </div>


                                                    <div className="accounts-user-management-user-info">

                                                        <strong>
                                                            {user.name}
                                                        </strong>

                                                        <small>
                                                            User ID: #{user.id}
                                                        </small>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* CONTACT */}

                                            <td>

                                                <div className="accounts-user-management-contact">

                                                    <Phone size={15} />

                                                    <span>
                                                        {user.contact || "-"}
                                                    </span>

                                                </div>

                                            </td>


                                            {/* EMAIL */}

                                            <td>

                                                <div className="accounts-user-management-contact">

                                                    <Mail size={15} />

                                                    <span>
                                                        {user.email || "-"}
                                                    </span>

                                                </div>

                                            </td>


                                            {/* ACTION */}

                                            <td>

                                                <div className="accounts-user-management-actions">

                                                    <button
                                                        type="button"
                                                        className="accounts-user-management-edit-btn"
                                                        onClick={() =>
                                                            handleEditUser(
                                                                user
                                                            )
                                                        }
                                                    >

                                                        <Pencil size={15} />

                                                        Edit

                                                    </button>


                                                    <button
                                                        type="button"
                                                        className="accounts-user-management-delete-btn"
                                                        onClick={() =>
                                                            handleDeleteUser(
                                                                user.id
                                                            )
                                                        }
                                                    >

                                                        <Trash2 size={15} />

                                                        Delete

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* ====================================================
                ADD / EDIT USER MODAL
            ==================================================== */}

            {showForm && (

                <div
                    className="accounts-user-management-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target === event.currentTarget &&
                            !submitting
                        ) {
                            handleCloseForm();
                        }

                    }}
                >

                    <div className="accounts-user-management-modal">


                        {/* MODAL HEADER */}

                        <div className="accounts-user-management-modal-header">

                            <div className="accounts-user-management-modal-title">

                                <div className="accounts-user-management-modal-icon">

                                    {editingUserId
                                        ? <Pencil size={20} />
                                        : <UserRoundPlus size={20} />
                                    }

                                </div>


                                <div>

                                    <h2>

                                        {editingUserId
                                            ? "Edit User"
                                            : "Add New User"
                                        }

                                    </h2>

                                    <p>

                                        {editingUserId
                                            ? "Update user account information."
                                            : "Create a new system user account."
                                        }

                                    </p>

                                </div>

                            </div>


                            <button
                                type="button"
                                className="accounts-user-management-close-btn"
                                onClick={handleCloseForm}
                                disabled={submitting}
                            >

                                <X size={20} />

                            </button>

                        </div>


                        {/* MODAL FORM */}

                        <form
                            className="accounts-user-management-form"
                            onSubmit={handleSubmitUser}
                        >


                            {/* NAME */}

                            <div className="accounts-user-management-form-group">

                                <label htmlFor="user-name">
                                    Name
                                </label>

                                <div className="accounts-user-management-form-input">

                                    <UserRound size={17} />

                                    <input
                                        type="text"
                                        id="user-name"
                                        name="name"
                                        placeholder="Enter user name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />

                                </div>

                            </div>


                            {/* CONTACT */}

                            <div className="accounts-user-management-form-group">

                                <label htmlFor="user-contact">
                                    Contact Number
                                </label>

                                <div className="accounts-user-management-form-input">

                                    <Phone size={17} />

                                    <input
                                        type="tel"
                                        id="user-contact"
                                        name="contact"
                                        placeholder="Enter contact number"
                                        value={formData.contact}
                                        onChange={handleInputChange}
                                        required
                                    />

                                </div>

                            </div>


                            {/* EMAIL */}

                            <div className="accounts-user-management-form-group">

                                <label htmlFor="user-email">
                                    Email
                                </label>

                                <div className="accounts-user-management-form-input">

                                    <Mail size={17} />

                                    <input
                                        type="email"
                                        id="user-email"
                                        name="email"
                                        placeholder="Enter email address"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />

                                </div>

                            </div>


                            {/* PASSWORD */}

                            <div className="accounts-user-management-form-group">

                                <label htmlFor="user-password">
                                    Password
                                </label>

                                <div className="accounts-user-management-form-input">

                                    <UserRound size={17} />

                                    <input
                                        type="password"
                                        id="user-password"
                                        name="password"
                                        placeholder="Enter password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                    />

                                </div>

                            </div>


                            {/* FORM BUTTONS */}
                            <div className="accounts-user-management-form-buttons">
                                <button
                                    type="button"
                                    className="accounts-user-management-cancel-btn"
                                    onClick={handleCloseForm}
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="accounts-user-management-save-btn"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <RefreshCw
                                                size={16}
                                                className="accounts-user-management-spin"
                                            />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            {editingUserId
                                                ? <Pencil size={16} />
                                                : <UserPlus size={16} />
                                            }
                                            {editingUserId
                                                ? "Update User"
                                                : "Add User"
                                            }
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
export default ViewUsers;