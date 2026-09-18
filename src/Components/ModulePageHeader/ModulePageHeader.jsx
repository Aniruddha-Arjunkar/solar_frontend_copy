import {
    Plus,
    List
} from "lucide-react";
import { useNavigate } from "react-router";
import "./ModulePageHeader.css";

function ModulePageHeader({
    currectPage,
    title,
    description,
    buttonType,
    icon: Icon
}) {

    const navigate = useNavigate();
    const handleButtonClick = () => {
        if (buttonType === "add") {
            navigate("/dashboard/add-inquiry");
        } else {
            navigate("/dashboard/view-inquiry");
        }
    };


    return (
        <div className="module-page-header">

            {/* =============== LEFT SECTION ======= */}
            <div className="module-page-header-left">

                {/* ================= ICON ================= */}
                <div className="module-page-header-icon">
                    {Icon && (
                        <Icon
                            size={26}
                            strokeWidth={1.8}
                        />
                    )}
                </div>


                {/* ================= HEADING ================= */}

                <div className="module-page-heading">
                    <h1>
                        {title}
                    </h1>
                    <p>
                        {description}
                    </p>
                </div>
            </div>


            {/* =================================================
                            RIGHT SECTION
            ================================================== */}

            <div className="module-page-header-button">
                {buttonType === "add" ? (
                    <button
                        className="module-header-btn"
                        onClick={handleButtonClick}>
                        <Plus size={19} />
                        Add Lead
                    </button>
                ) : (
                    <button
                        className="module-header-btn"
                        onClick={handleButtonClick}
                    >
                        <List size={19} />
                        View Inquiries
                  </button>
                )}
            </div>
        </div>
    );
}
export default ModulePageHeader;