import React, { useEffect, useState } from 'react';
import '../Styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import authService from '../appwrite/auth';
import dbService from '../appwrite/DbService';
import { dishInfo } from '../Store/dbSlice';

const Dashboard = () => {
    const restroData=useSelector((state)=>state.db.restaurant);
    const categories=useSelector((state) => state.db.category);
    const dish=useSelector((state)=>state.db.dishesh);
    const dispatch=useDispatch();
    const navigate=useNavigate();

    const handleLogout=()=>{
        authService.logout();
        navigate('/menuscan')
       }
    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Welcome, {restroData ? restroData.documents[0].name: 'Restaurant name'}!</h1>
            </header>
            
            <div className="dashboard-content">
                <section className="dashboard-stats">
                    <div className="stat-card">
                        <h3>Categories</h3>
                        <p>{categories.length}</p> {/* Replace with dynamic data */}
                    </div>
                    <div className="stat-card">
                        <h3>Dishes</h3>
                        <p>{dish.length}</p> {/* Replace with dynamic data */}
                    </div>
                </section>
                
                <section className="dashboard-actions">
                    <button className="action-card" onClick={()=>navigate('/menuscan/ManageMenu')}>Manage Menu</button>
                    <button className="action-card">Generate QR Code</button>
                    <button className="action-card" onClick={()=>navigate('/menuscan/restaurant')}>Restaurant Settings</button>
                    <button className="action-card" onClick={()=>navigate('/menuscan/menu')}>View Menu</button>
                </section>
                <button onClick={handleLogout}>Log out</button>
              
            </div>
            
        </div>
    );
};

export default Dashboard;
