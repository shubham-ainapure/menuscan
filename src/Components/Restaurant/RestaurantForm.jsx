import React, { useState } from 'react';
import '../../Styles/RestaurantForm.css';
import Button from '../Button';
// import authService from '../appwrite/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import dbService from '../../appwrite/DbService';
import {categoryInfo, dishInfo, restaurantinfo } from '../../Store/dbSlice';

const RestaurantForm = () => {
  const userID=useSelector((state)=>state.auth.userdata);
  const dispatch=useDispatch();
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const navigate=useNavigate();
  const [details,setDetails]=useState({
    name:'',
    contact:'',
    address:''
  })
 const handleSubmit= async (e)=>{
  e.preventDefault();
  console.log(userID);
  setError(null);
  setLoading(true);
  try {
    const result=await dbService.createRestaurant(details.name,details.contact,details.address,userID.$id)
    if(result){
      const  res=await dbService.getRestaurantList(userID.$id);
      if(res){
        dispatch(restaurantinfo(res));

        const cat=await dbService.getCategoryList(res.documents[0].$id)
        dispatch(categoryInfo(cat.documents));

        const dish=await dbService.getAllDish(res.documents[0].$id);
        dispatch(dishInfo(dish.documents));

        navigate('/menuscan/dashboard');
      }
     
    }
    setLoading(false);
  } catch (error) {
    setError(error.message);
    setLoading(false);
  }

 }
 const handleLogout=()=>{
  authService.logout();
  navigate('/menuscan')
 }
  return (
    <div className="restaurant-form-container">
      <h2>Restaurant Information</h2>
      <form onSubmit={handleSubmit} className="restaurant-form">
        <div className="form-group">
          <label htmlFor="name">Restaurant Name</label>
          <input
            type="text"
            id="name"
            onChange={(e) =>setDetails({...details,name:e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="contact">Contact Number</label>
          <input
            type="number"
            id="contact"
            
            onChange={(e) => setDetails({...details,contact:e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            
            onChange={(e) => setDetails({...details,address:e.target.value})}
            required
          />
        </div>
        {/* <button type="submit">Submit</button> */}
        <Button type='submit' name='submit' loading={loading}/>
      </form>
    </div>
  );
};

export default RestaurantForm;
