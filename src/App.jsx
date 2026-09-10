import { Routes , Route } from 'react-router'
import Layout from "./Layout/DashBoardLayout/DashBoardLayout.jsx";
import DashBoard from './Views/DashBoard/DashBoard.jsx';

// ========== Lead Management ============
import AddInquiry from './Views/Leads_Management/Add_Inquiry/AddInquiry.jsx';
import ViewInquiry from './Views/Leads_Management/View_Inquiry/ViewInquiry.jsx';
import ReFollowUp from './Views/Leads_Management/Re_FollowUp/FollowUp.jsx';
import Visit from './Views/Leads_Management/Visit/Visit.jsx';
import FutureClient from './Views/Leads_Management/Future_Clients/FutureClients.jsx';
import ScheduleClient from './Views/Leads_Management/Schedule_Client/ScheduleClient.jsx';
import Quotation from './Views/Leads_Management/Quotation/Quotation.jsx';
import AddQuotation from "./Views/Leads_Management/Add_Quotation/AddQuotation.jsx";
import MakeClient from "./Views/Leads_Management/MakeClient/MakeClient.jsx";

//=========== Vendor Mangement ============
import AddVendor from "./Views/Vendor_Management/Add_Vendor/AddVendor.jsx";
import ViewVendor from "./Views/Vendor_Management/View_Vendor/ViewVendor.jsx";

//========== Clients Managements ==========
import ViewClient from "./Views/Client_Management/ViewClients/ViewClient.jsx"
import GSTClient from "./Views/Client_Management/GSTClients/GSTClient.jsx";
import PendingWork from "./Views/Client_Management/PendingWork/PendingWork.jsx"
import EditClient from './Views/Client_Management/EditClient/EditClient.jsx';
import GenerateInvoice from "./Views/Client_Management/GenerateInvoice/GenerateInvoice.jsx";
import ViewClientInvoice from "./Views/Client_Management/ViewClientInvoice/ViewClientInvoice.jsx";

//============== Employee Management =======================
import AddEmployee from './Views/Employee_Management/AddEmployee/AddEmployee.jsx';
import ViewEmployee from './Views/Employee_Management/ViewEmployee/ViewEmployee.jsx';
import AddSalary from './Views/Employee_Management/AddSalary/AddSalary.jsx';
import ViewEmployeeProfile from "./Views/Employee_Management/ViewEmployeeProfile/ViewEmployeeProfile.jsx";
import UpdateEmployee from "./Views/Employee_Management/UpdateEmployee/UpdateEmployee.jsx";

//============= Attendence Management =====================
import AddAttendence from "./Views/Attendence_Managment/AddAttendence/AddAttendence.jsx";
import ViewAttendence from "./Views/Attendence_Managment/ViewAttendence/ViewAttendence.jsx";

//================ Account Management =======================
import AddAdvance from './Views/Account_Management/AddAdvance/AddAdvance.jsx';
import AddExpenses from './Views/Account_Management/AddExpenses/AddExpenses.jsx';
import DuePayment from './Views/Account_Management/DuePayment/DuePayment.jsx';
import GSTInvoice from './Views/Account_Management/GST Invoice/GSTInvoice.jsx';
import ViewAdvance from './Views/Account_Management/ViewAdvance/ViewAdvance.jsx';
import ViewExpenses from './Views/Account_Management/ViewExpenses/ViewExpenses.jsx';
import ViewPayment from './Views/Account_Management/ViewPayment/ViewPayment.jsx';
import AddPayment from './Views/Account_Management/AddPayment/AddPayment.jsx';
import AdvanceDetails from './Views/Account_Management/AdvanceDetails/AdvanceDetails.jsx';


//=========== Users ======================
import ViewUsers from "./Views/Users/View_Users/ViewUsers.jsx";

//============ User Admin =============
import Login from './pages/Login/Login.jsx';

//==========Protected Rotes ==========
import ProjectedRoute from './Components/ProtectedRoutes.jsx';

//========= LoginRoute.jsx===============
// import LoginRoute from './Components/LoginRoute.jsx';

import './App.css'

function App() {

  return (
    <>
        <Routes>

          {/*========== Admin Login ===============*/}
            <Route path='/login' element={<Login/>}/>
          
          {/* ===== protected Routes ============= */}
          <Route element={<ProjectedRoute/>}>

          {/*======== Layout =================*/}
          <Route path='/' element={<Layout/>}>

            {/* DashBoard */}
            <Route index element={<DashBoard/>}/>

            {/* Lead Management */}
            <Route path='dashboard/add-inquiry' element={<AddInquiry/>}/>
            <Route path='dashboard/view-inquiry' element={<ViewInquiry/>}/>
            <Route path='dashboard/re-followup' element={<ReFollowUp/>}/>
            <Route path='dashboard/visit' element={<Visit/>}/>
            <Route path='dashboard/future-client' element={<FutureClient/>}/>
            <Route path='dashboard/schedule-client' element={<ScheduleClient/>}/>
            <Route path='dashboard/quotations' element={<Quotation/>}/>
            <Route path="/dashboard/add-quotation/:leadId" element={<AddQuotation />}/>
            <Route path="/dashboard/make-client/:leadId" element={<MakeClient/>}/>

            {/* Vendor Management */}
            <Route path="dasboard/add-vendor" element={<AddVendor/>}/>
            <Route path="dashboard/view-vendor" element={<ViewVendor/>}/>

            {/* Client Management */}
            <Route path="dashboard/view-client" element={<ViewClient/>}/>
            <Route path="dashboard/gst-client" element={<GSTClient/>}/>
            <Route path="dashboard/pending-work" element={<PendingWork/>}/>
            <Route path="dashboard/edit-client/:clientId" element={<EditClient/>}/>
            <Route path="dashboard/generate-invoice/:clientId" element={<GenerateInvoice />}/>
            <Route path="/dashboard/view-client-invoice/:invoiceId" element={<ViewClientInvoice />}/>
            

            {/* Employee Management */}
              <Route path="dashboard/add-employee" element={<AddEmployee/>}/>
              <Route path="dashboard/view-employee" element={<ViewEmployee/>}/>
              <Route path="dashboard/add-salary" element={<AddSalary/>}/>
              <Route path="/dashboard/view-employee/profile/:employeeId" element={<ViewEmployeeProfile />}/>
              <Route path="/dashboard/update-employee/:employeeId" element={<UpdateEmployee />}/>
              

            {/* Attendence Management */}
             <Route path="dashboard/add-attendence" element={<AddAttendence/>}/>
             <Route path="dashboard/view-attendence" element={<ViewAttendence/>}/>

            {/* Account Management */}
            <Route path="dashboard/add-advance" element={<AddAdvance/>}/>
             <Route path="dashboard/due-payment" element={<DuePayment/>}/>
             <Route path="dashboard/add-expenses" element={<AddExpenses/>}/>
             <Route path="dashboard/gst-invoice" element={<GSTInvoice/>}/>
             <Route path="dashboard/view-advance" element={<ViewAdvance/>}/>
             <Route path="dashboard/view-expenses" element={<ViewExpenses/>}/>
             <Route path="dashboard/view-payment" element={<ViewPayment/>}/>
             <Route path="/dashboard/add-payment/:clientId" element={<AddPayment />}/>
             <Route path="/dashboard/view-advance/details/:employeeId" element={<AdvanceDetails />}/>


            {/* Users */}
            <Route path='dashboard/view-users' element={<ViewUsers/>}/>
         
          </Route>
          </Route>
        </Routes>
    </>
  )
}

export default App
