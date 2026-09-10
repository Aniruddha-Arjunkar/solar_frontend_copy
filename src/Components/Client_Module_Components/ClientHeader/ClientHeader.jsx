import {
    Plus,
    List,
    FileText,
    Clock
} from "lucide-react";

import { useNavigate } from "react-router";

import "./ClientHeader.css";


function ClientHeader({ currectPage, title, description, buttonType
    , icon: Icon}) {

    const navigate = useNavigate();

    /* ======= BUTTON HANDLER =========== */

    const handleButtonClick = () => {

        switch (buttonType) {

            case "add":
                navigate("/dashboard/add-client");
                break;

            case "view":
                navigate("/dashboard/view-client");
                break;

            case "gst":
                navigate("/dashboard/gst-client");
                break;

            case "pending":
                navigate("/dashboard/pending-work");
                break;
            default:
                break;
        }
    };

    /* ===== BUTTON CONTENT ===== */

    const getButtonContent = () => {

        switch (buttonType) {
            case "add":
                return (
                    <>
                        <Plus size={19} />
                        Add Client
                    </>
                );

            case "gst":
                return (
                    <>
                        <FileText size={19} />
                        GST Clients
                    </>
                );
            case "pending":
                return (
                    <>
                        <Clock size={19} />
                        Pending Work
                    </>
                );
            case "view":
                return (
                    <>
                        <List size={19} />
                        View Clients
                    </>
                );
            default:
                return null;
        }
    };

    return (

        <div className="client-page-header">

            {/* =========================================
                LEFT SECTION
            ========================================= */}
            <div className="client-page-heading">

                {/* ===== BREADCRUMB ===== */}
                <div className="client-current-page-location">
                    Dashboard
                    <span>
                        /
                    </span>
                    {currectPage}
                </div>

                {/* ===== TITLE ===== */}
                <h1>
                    {Icon && (
                        <Icon
                            size={35}
                            strokeWidth={1.8}/>
                    )}
                    {title}
                </h1>

                {/* ===== DESCRIPTION ===== */}
                <p>
                    {description}
                </p>
            </div>

            {/* ========== RIGHT BUTTON  ========== */}
            <div className="client-page-header-button">
                {buttonType && (
                    <button
                        type="button"
                        className="client-header-btn"
                        onClick={handleButtonClick}>
                        {getButtonContent()}
                    </button>
                )}
            </div>
        </div>
    );
}
export default ClientHeader;