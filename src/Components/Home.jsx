import React, { useEffect } from 'react';
import '../Styles/Home.css';
import { Link, useNavigate } from 'react-router-dom';
// import config from './Config/config';
import authService from '../appwrite/auth';
import { useDispatch, useSelector } from 'react-redux';
import { categoryInfo, dishInfo, restaurantinfo } from '../Store/dbSlice';
import { login } from '../Store/authSlice';

const Home = () => {
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const restroData = useSelector((state) => state.db.restaurant);

    useEffect(() => {
        const login = localStorage.getItem('cookieFallback');
        if (login && login.length>2) {
            if(restroData){
                navigate('/menuscan/dashboard');
            }else{
                navigate('/menuscan/restaurant-form');
            }
            
        }
    }, []);

    const handleLogin=async ()=>{
        try {
            const result= await authService.guestLogin();
        if(result){
            const userData = await authService.getUser();
                console.log('user', userData);
                if (userData) 
                {
                    dispatch(login(userData));
                   const  res=await dbService.getRestaurantList(userData.$id)
                   console.log("res",res.documents);
                   if (res.documents.length>0){

                    dispatch(restaurantinfo(res));

                    const cat=await dbService.getCategoryList(res.documents[0].$id)
                    dispatch(categoryInfo(cat.documents));

                    const dish=await dbService.getAllDish(res.documents[0].$id);
                    dispatch(dishInfo(dish.documents));

                    navigate('/menuscan/dashboard');
                    
                }
                else{
                        navigate('/menuscan/restaurant-form');
                    }                 
                }
        }
        
        } catch (error) {
            console.log();
        }
    }


    return (
        <div className="home-container">
            {/* Header Section */}
            <header className="header">
                <div className="logo">MenuScan</div>
                <nav className="nav">
                    <Link to='/menuscan/login' className="login-button">Log in</Link>
                    <Link to='/menuscan/signup' className="signup-button">Sign up</Link>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <h1>Create and Share Your Menu with Ease</h1>
                <p>Manage your restaurant's menu and share it with customers using a simple QR code.</p>
                <div className="cta-buttons">
                    <Link to='/menuscan/login' className="cta-button">Get Started</Link>
                    <a onClick={handleLogin} className="cta-button-secondary">Guest Login</a>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works" id="how-it-works">
                <h2>How It Works</h2>
                <div className='horizontal-bar'></div>
                <div className="steps">
                    <div className="step">
                        <h3>1. Sign Up</h3>
                        <p>Create an account to manage your restaurant's menu.</p>
                    </div>
                    <div className="step">
                        <h3>2. Set Up Your Menu</h3>
                        <p>Add and update your menu items with ease.</p>
                    </div>
                    <div className="step">
                        <h3>3. Generate QR Code</h3>
                        <p>Generate a QR code for customers to scan and view your menu.</p>
                    </div>
                    <div className="step">
                        <h3>4. Share and Serve</h3>
                        <p>Display the QR code at your restaurant, and let customers view your menu instantly.</p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features" id="features">
                <h2>Features</h2>
                <div className='horizontal-bar'></div>
                <div className="feature-list">
                    <div className="feature-item">
                        <h3>Menu Management</h3>
                        <p>Effortlessly add, edit, and remove menu items.</p>
                    </div>
                    <div className="feature-item">
                        <h3>QR Code Generation</h3>
                        <p>Create a unique QR code for easy menu access.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Real-Time Updates</h3>
                        <p>Update your menu in real-time, and changes are reflected instantly.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Customer Convenience</h3>
                        <p>Customers can scan and view the menu without needing to sign up.</p>
                    </div>
                </div>
            </section>

        </div>
        
    );
};

export default Home;
