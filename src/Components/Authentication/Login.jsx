import React, { useState } from 'react';
import '../../Styles/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../Button';
import authService from '../../appwrite/auth';
import { useDispatch } from 'react-redux';
import { login } from '../../Store/authSlice';
import dbService from '../../appwrite/DbService';
import { categoryInfo, dishInfo, restaurantinfo } from '../../Store/dbSlice';

function Login() {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState(null);
    const [user,setUser]=useState({
        email:'',
        password:''
    })

    const handleLogin= async (e)=>{
        e.preventDefault();
        setError(null);
         setLoading(true);
        try {
            const result= await authService.login(user.email,user.password);
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

                    navigate('/dashboard');
                    
                }
                    else{
                        navigate('/restaurant-form');
                    }                 
                }
        }
        setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false)
        }
    }

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required onChange={(e)=>setUser({...user,email:e.target.value})}/>
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" required onChange={(e)=>setUser({...user,password:e.target.value})}/>
                </div>
               
                    <span className='login-container-span'>{error ? error:''}</span>
               
                {/* <button type="submit" className="login-button">Log in</button> */}
                <Button type='submit' name='Log in' loading={loading}/>
            </form>
            <p className="signup-link">
                Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
        </div>
    );
};

export default Login;
