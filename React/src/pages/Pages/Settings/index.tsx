import React from "react";
import BreadCrumb from "Common/BreadCrumb";
import AccountInfo from "../Account/AccountInfo";
import { Nav } from "Common/Components/Tab/Nav";
import Tab from "Common/Components/Tab/Tab";
import PersonalTabs from "./PersonalTabs";
// import IntegrationTabs from "./IntegrationTabs";
import ChangePasswordTabs from "./ChangePasswordTabs";
import PrivacyPolicyTabs from "./PrivacyPolicyTabs";
import { ChevronsLeft, Link, LogOut } from "lucide-react";
import { logout } from "services/authService";
import { useNavigate } from 'react-router-dom';
import LightDark from "Common/LightDark";
import ContactUs from "../ContactUs";

const Settings = () => {
    const navigate = useNavigate(); // This is where you get the 'navigate' function

    const handleLogout = () => {
        logout(); // Appeler la fonction logout lors du clic sur le lien "Sign Out"
        navigate('/logout'); // Navigate to the logout page after logging out

    };

    const returnToPreviousPage = () => {
        navigate(-1); // Navigates back to the previous page
    };
    return (
        <React.Fragment >
            <div className="mt-5 ml-1 mr-1">
           
            <Tab.Container defaultActiveKey="personalTabs" >
                <div className="card mr-1">
               
                <div className="flex justify-between items-center w-full">
  <button
    onClick={returnToPreviousPage}
    className="inline-flex items-center justify-center w-12 h-12 transition-all duration-200 ease-linear rounded-md cursor-pointer text-slate-500"
  >
    <ChevronsLeft />
  </button>

  <div className="flex items-center space-x-4">
    <LightDark />
  
    <button onClick={handleLogout} className="px-4 py-2 text-base font-medium text-slate-500 transition-all duration-300 ease-linear rounded-md border border-transparent dark:text-zinc-200 hover:bg-custom-500 hover:text-white dark:hover:bg-custom-500 dark:hover:text-white flex items-center space-x-2">
      <LogOut className="w-4 h-4" />
      <span className="dark:text-gray-400">Sign Out</span>
    </button>
  </div>
</div>





                                        
                    <AccountInfo className="card-body" />
                    <div className="card-body !py-0">
                        
                        <Nav className="flex flex-wrap w-full text-sm font-medium text-center nav-tabs ">
                            <Nav.Item eventKey="personalTabs" className="group">
                                <a href="#!" data-tab-toggle data-target="personalTabs" className="inline-block px-4 py-2 text-base transition-all duration-300 ease-linear rounded-t-md text-slate-500 dark:text-zink-200 border-b border-transparent group-[.active]:text-custom-500 dark:group-[.active]:text-custom-500 group-[.active]:border-b-custom-500 hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]">Personal Info</a>
                            </Nav.Item>
                            <Nav.Item eventKey="contactUs" className="group">
                                <a href="#!" data-tab-toggle data-target="contactUs" className="inline-block px-4 py-2 text-base transition-all duration-300 ease-linear rounded-t-md text-slate-500 dark:text-zink-200 border-b border-transparent group-[.active]:text-custom-500 dark:group-[.active]:text-custom-500 group-[.active]:border-b-custom-500 hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]">Contact Us</a>
                            </Nav.Item>
                            <Nav.Item eventKey="changePasswordTabs" className="group">
                                <a href="#!" data-tab-toggle data-target="changePasswordTabs" className="inline-block px-4 py-2 text-base transition-all duration-300 ease-linear rounded-t-md text-slate-500 dark:text-zink-200 border-b border-transparent group-[.active]:text-custom-500 dark:group-[.active]:text-custom-500 group-[.active]:border-b-custom-500 hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]">Change Password</a>
                            </Nav.Item>
                            <Nav.Item eventKey="privacyPolicyTabs" className="group">
                                <a href="#!" data-tab-toggle data-target="privacyPolicyTabs" className="inline-block px-4 py-2 text-base transition-all duration-300 ease-linear rounded-t-md text-slate-500 dark:text-zink-200 border-b border-transparent group-[.active]:text-custom-500 dark:group-[.active]:text-custom-500 group-[.active]:border-b-custom-500 hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]">Privacy Policy</a>
                            </Nav.Item>
                            
                        </Nav>
                       
                    </div>
                </div>
                <Tab.Content >
                    <Tab.Pane eventKey="personalTabs" >
                        <PersonalTabs />
                    </Tab.Pane>
                     <Tab.Pane eventKey="contactUs" >
                        <ContactUs />
                    </Tab.Pane> 
                    <Tab.Pane eventKey="changePasswordTabs" >
                        <ChangePasswordTabs />
                    </Tab.Pane>
                    <Tab.Pane eventKey="privacyPolicyTabs" >
                        <PrivacyPolicyTabs />
                    </Tab.Pane>
                   
                </Tab.Content>

            </Tab.Container>
            </div>
        </React.Fragment>
    );
}

export default Settings;