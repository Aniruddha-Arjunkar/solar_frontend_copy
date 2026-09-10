
import {
    Plus,
    List
} from "lucide-react";

import { useNavigate } from "react-router";

import "./VendorHeader.css";


function VendorHeader({
    currectPage,
    title,
    description,
    buttonType,
    icon: Icon
}) {

    const navigate = useNavigate();

    const handleButtonClick = () => {

        if (buttonType === "add") {
            navigate("/dashboard/add-vendor");
        } else {
            navigate("/dashboard/view-vendor");
        }

    };

    return (

        <div className="vendor-page-header">

            {/* ================= LEFT ================= */}
            <div className="vendor-page-heading">

                <div className="vendor-currectPage-location">
                    Dashboard
                    <span>/</span>
                    {currectPage}
                </div>


                <h1>
                    {
                        Icon && (
                            <Icon
                                size={35}
                                strokeWidth={1.8}
                            />
                        )
                    }

                    {title}
                </h1>


                <p>
                    {description}
                </p>

            </div>


            {/* ================= RIGHT ================= */}
            <div className="vendor-page-header-button">

                {
                    buttonType === "add" ? (

                        <button
                            className="vendor-header-btn"
                            onClick={handleButtonClick}
                        >

                            <Plus size={19} />

                            Add Vendor

                        </button>

                    ) : (

                        <button
                            className="vendor-header-btn"
                            onClick={handleButtonClick}
                        >

                            <List size={19} />

                            View Vendors

                        </button>

                    )
                }

            </div>

        </div>

    );

}

export default VendorHeader;
