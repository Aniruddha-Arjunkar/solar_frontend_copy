import { Outlet } from "react-router";
import TopBar from "../../Components/TopBar/TopBar.jsx";
import SideBar from "../../Components/SideBar/SideBar.jsx";

import "./DashBoardLayout.css";

function DashBoardLayout(){
    return(
        <>
           <div className="dashboard_layout">
              <SideBar/>
              <div className="dashboard_content">
                <TopBar/>
                <main className="dashboard_main">
                    <Outlet/>
                </main>
              </div>
           </div>
        </>
    )
}

export default DashBoardLayout;