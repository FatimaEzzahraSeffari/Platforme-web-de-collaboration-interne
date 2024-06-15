import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { authProtectedRoutes, publicRoutes } from './allRoutes';
import HomePage from 'pages/Home/HomePage'; 
import SocialMediaDashboard from "pages/Dashboards/SocialMedia";

import Layout from 'Layout';
import NonAuthLayout from "Layout/NonLayout"
import AuthProtected from './AuthProtected';
import Header from 'Layout/Header';
import WatchVideo from 'pages/SocialMedia/WatchVideo';
import Settings from 'pages/Pages/Settings';
import Chat from 'pages/Chat';
import Friends from 'pages/SocialMedia/Friends';
import Event from 'pages/SocialMedia/Event';
import FavorisComponent from 'pages/Components/Posts/FavorisComponent';
import Calendar from 'pages/SocialMedia/Calendar';
import ListUsers from 'pages/Admin/ListUsers';
import ContactList from 'pages/Admin/ContactList';
import OverviewTabs from 'pages/Pages/Account/OverviewTabs';
import Account from 'pages/Pages/Account';
import AccountOverview from 'pages/Pages/Account/Accountoverview';


const RouteIndex = () => {
  return (
    <React.Fragment>
      <Routes>
<Route path="/"element={<HomePage />}/> 
<Route path="/apps-chat"element={<Chat/>}/> 
<Route path="/apps-favoris"element={<FavorisComponent />}/> 
<Route path="/dashboards-social"element={<SocialMediaDashboard/>}/> 
<Route path="/apps-social-video"element={<WatchVideo/> }/> 
<Route path="/apps-favoris"element={<FavorisComponent/>}/>
<Route path="/apps-social-calendar"element={<Calendar/>}/>
<Route path="/pages-account-settings"element={<Settings/>}/>
<Route path="/apps-social-friends"element={<Friends/> }/>  
<Route path="/apps-social-event"element={<Event/> } />  
<Route path="/dashboards-admin" element={<ListUsers />} /> 
<Route path="/ContactList" element={<ContactList />} /> 
<Route path="/pages-account" element={<Account/>} /> 

        {authProtectedRoutes.map((route: any, idx: number) => (
          <Route
            key={idx}
            path={route.path}
            element={
              <AuthProtected>
                <Layout>
                  <route.component />
                </Layout>
                
              </AuthProtected>
            }
          />
        ))}
        {publicRoutes.map((route: any, idx: number) => (
          <Route
            path={route.path}
            key={idx}
            element={
              <NonAuthLayout>
                <route.component />
              </NonAuthLayout>
            } />
        ))}
      </Routes>
    </React.Fragment>
  );
};

export default RouteIndex;
