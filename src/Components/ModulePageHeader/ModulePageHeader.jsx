import {
    Plus,
    List
} from "lucide-react";

import { useNavigate } from "react-router";

import "./ModulePageHeader.css";


function ModulePageHeader({currectPage,title,description,
                            buttonType , icon : Icon}) {

    const navigate = useNavigate();

    const handleButtonClick = () => {
        if (buttonType === "add") {
            navigate("/dashboard/add-inquiry");
        } else{
            navigate("/dashboard/view-inquiry");
        } 
    };

    return (

        <div className="module-page-header">
            {/* ==== LEFT ================= */}
            <div className="module-page-heading">
                <div className="module-currectPage-location">
                    Dashboard
                    <span>/</span>
                    {currectPage}
                </div>

                <h1>
                    {
                        Icon && (<Icon size={25} strokeWidth={1.8}/>)
                    }
                    {title}
                </h1>

                <p>
                    {description}
                </p>
            </div>

            {/* ================= RIGHT ================= */}
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
                        onClick={handleButtonClick} >
                        <List size={19} />
                        View Inquiries
                    </button>
                )}
            </div>
        </div>
    );
}
export default ModulePageHeader;