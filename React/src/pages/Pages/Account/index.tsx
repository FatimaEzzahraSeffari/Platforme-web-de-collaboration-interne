import React, { useEffect, useState } from "react";
import AccountInfo from "./AccountInfo";
import { Nav } from "Common/Components/Tab/Nav";
import Tab from "Common/Components/Tab/Tab";
import OverviewTabs from "./OverviewTabs";
import Documents from "./Documents";
import ProjectsTabs from "./ProjectsTabs";
import Followers from "./Followers";
import { User } from "lucide-react";
import AccountOverview from "./Accountoverview";
import authService from "services/authService";
import { useLocation } from "react-router-dom";

const Account = () => {
    const [userList, setUserList] = useState([]);
    const [user, setUser] = useState(null);
    const location = useLocation();
    document.title = "Account | OCP LINK Collaboration platform";
    const fetchUsers = async () => {
        try {
            const response = await authService.getUsers();
            console.log("Fetched user data:", response);
            setUserList(response);

            // Just setting the first user as the selected user for demonstration
            if (response.length > 0) {
                setUser(response[0]);
            }

        } catch (error) {
            console.error(error);
        }
    };
   
    useEffect(() => {
        fetchUsers();
    }, []);
    useEffect(() => {
        if (location.state && location.state.user) {
            setUser(location.state.user);
        }
    }, [location.state]);
    console.log("User state in Account component:", user);
    return (
        <React.Fragment>
            
            <Tab.Container defaultActiveKey="overviewTabs">
                <div className="mt-1 -ml-3 -mr-3 rounded-none card">
                    <AccountOverview className="card-body !px-2.5"/>
                    <div className="card-body !px-2.5 !py-0">
                        <Nav className="flex flex-wrap w-full text-sm font-medium text-center nav-tabs">
                            <Nav.Item eventKey="overviewTabs" className="group">
                                <a href="#!" data-tab-toggle data-target="overviewTabs" className="inline-block px-4 py-2 text-base transition-all duration-300 ease-linear rounded-t-md text-slate-500 dark:text-zink-200 border-b border-transparent group-[.active]:text-custom-500 dark:group-[.active]:text-custom-500 group-[.active]:border-b-custom-500 dark:group-[.active]:border-b-custom-500 hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]">Overview</a>
                            </Nav.Item>
                            {/* <Nav.Item eventKey="documentsTabs" className="group">
                                <a href="#!" data-tab-toggle data-target="documentsTabs" className="inline-block px-4 py-2 text-base transition-all duration-300 ease-linear rounded-t-md text-slate-500 dark:text-zink-200 border-b border-transparent group-[.active]:text-custom-500 dark:group-[.active]:text-custom-500 group-[.active]:border-b-custom-500 dark:group-[.active]:border-b-custom-500 hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]">Documents</a>
                            </Nav.Item> */}
                           
                        </Nav>
                    </div>
                </div>
                <Tab.Content className="tab-content">
                <Tab.Pane eventKey="overviewTabs" id="overviewTabs">
                        {user ? <OverviewTabs user={user} /> : <p></p>}
                       

                    </Tab.Pane> 
                    {/* <Tab.Pane eventKey="documentsTabs" id="documentsTabs">
                        <Documents />
                    </Tab.Pane>
                   */}
                </Tab.Content>
            </Tab.Container>
        </React.Fragment>
    );
}

export default Account;