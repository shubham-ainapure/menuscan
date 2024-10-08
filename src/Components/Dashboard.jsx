import React, { useEffect, useState } from 'react';
import '../Styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import authService from '../appwrite/auth';
import dbService from '../appwrite/DbService';
import { dishInfo } from '../Store/dbSlice';
import { TailSpin } from 'react-loader-spinner';
import LogoutModal from './Modal/LogoutModal';

const Dashboard = () => {
    const restroData=useSelector((state)=>state.db.restaurant);
    const categories=useSelector((state) => state.db.category);
    const dish=useSelector((state)=>state.db.dishesh);
    const queryString=restroData.documents[0].userId;
    const [logload,setLogload]=useState(false);
    const [showModal, setShowModal] = useState(false);
    const dispatch=useDispatch();
    const navigate=useNavigate();

    const handleLogout= async ()=>{
        const user=await authService.getUser();
        if(!user.email){
            setShowModal(true);
        }else{
            setLogload(true);
            const log= await authService.logout();
             if(log){
                 setLogload(false);
                 navigate('/menuscan');
             }
        }
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
                    <button className="action-card" onClick={()=>navigate('/menuscan/qrcode')}>Generate QR Code</button>
                    <button className="action-card" onClick={()=>navigate('/menuscan/restaurant')}>Restaurant Settings</button>
                    <button className="action-card" onClick={()=>navigate(`/menuscan/menu/?data=${queryString}`)}>View Menu</button>
                </section>
                <button onClick={handleLogout}>{logload ? <TailSpin color="#73c988" height='20' width='20' wrapperClass='spinner'/>:'Log out' }</button>
                <LogoutModal showModal={showModal} setShowModal={setShowModal} />
              
            </div>
            
        </div>
    );
};

export default Dashboard;
