import React, { useEffect, useState } from 'react';
import '../../Styles/RestaurantMenu.css';
import { useSelector } from 'react-redux';
import dbService from '../../appwrite/DbService';
import dbSlice from '../../Store/dbSlice';
import config from '../../Config/config';
import veg from '/icons8-veg-30.png';
import nonveg from '/icons8-non-veg-30.png';
import { useLocation, useParams } from 'react-router-dom';

const RestaurantMenu = () => {
    // const restroData=useSelector((state)=>state.db.restaurant);
    // const categories=useSelector((state) => state.db.category);
    const location=useLocation();
    const queryParams=new URLSearchParams(location.search);
    const data=queryParams.get('data');
    const {restroData,categories}=JSON.parse(decodeURIComponent(data));
    const [dish,setDish]=useState(null);
    const [selectedCategory,setSelectedCategory]=useState(null);

    useEffect(()=>{
        fetchDishesForCategory(categories[0].$id);
    },[])

    const fetchDishesForCategory = async (categoryId) => {
        setSelectedCategory(categoryId);
        const dishRes = await dbService.getDishesh(categoryId);
        console.log(dishRes);
        if (dishRes) {
            setDish(dishRes.documents)
        }
    };

    return (
        <div className="restaurant-menu">
            <div className="restaurant-card">
                <h2>{restroData.documents[0].name}</h2>
                <p>{restroData.documents[0].contact}</p>
                <p>{restroData.documents[0].address}</p>
            </div>

            <div className="categories">
                {categories && categories.map((category) => (
                    <div key={category.$id} className={`category ${selectedCategory && selectedCategory === category.$id ? 'active' : ''}`} onClick={()=>fetchDishesForCategory(category.$id)}>
                        {category.name}
                    </div>
                ))}
            </div>

            <div className="food-items">
                {dish && dish.map(item => (
                    <div key={item.$id} className="food-card">
                        <img src={item.imageId} alt={item.name} className="food-image" />
                        <div className="food-details">
                            <h3 className='dishName'>{item.name}</h3>
                            <p className='decs'>{item.description}</p>
                           <div className='dishInfo'>
                           <p className='price'>{'\u20A8'} {item.price}</p>
                           <img src={item.veg ? veg:nonveg}/>
                           </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

};

export default RestaurantMenu;
