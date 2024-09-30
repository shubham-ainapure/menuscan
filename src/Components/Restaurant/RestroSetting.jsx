import React, { useState, useEffect } from 'react';
import '../../Styles/AccountSetting.css';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../Button';
import dbService from '../../appwrite/DbService';
import { restaurantinfo } from '../../Store/dbSlice';
import authService from '../../appwrite/auth';


const RestroSetting = () => {
    const dispatch = useDispatch();
    const userID=useSelector((state)=>state.auth.userdata);
    const restaurant = useSelector((state)=>state.db.restaurant);
    const [restaurantDetails, setRestaurantDetails] = useState({
        name: restaurant.documents[0].name,
        contact: restaurant.documents[0].contact,
        address: restaurant.documents[0].address
        
    });
    const [loading,setLoading] =useState(false);
    const [success,setSuccess]=useState(null);
    const [error,setError]=useState(null);
    


    const handleRestaurantDetailsChange = async (e) => {
        e.preventDefault();
        setLoading(true);
       try {
        const res = await dbService.updateRestaurant(restaurant.documents[0].$id, restaurantDetails);
        if (res) {
            console.log(res);
            const  response=await dbService.getRestaurantList(userID.$id);
            if(response){
                setLoading(false);
                dispatch(restaurantinfo(response));
                setSuccess('Details updated successfully!');
            }
         
        }
       } catch (error) {
        setLoading(false);
        setError(error.message);
       }
    };

   

    return (
        <>
        <h1>Restaurant Settings</h1>
        <div className="account-settings-container">

        <div className="account-section">
                
                    <form onSubmit={handleRestaurantDetailsChange}>
                        <input
                            type="text"
                            value={restaurantDetails.name}
                            onChange={(e) => setRestaurantDetails({ ...restaurantDetails, name: e.target.value })}
                            placeholder="Restaurant Name"
                            required
                        />
                        <input
                            type="text"
                            value={restaurantDetails.address}
                            onChange={(e) => setRestaurantDetails({ ...restaurantDetails, address: e.target.value })}
                            placeholder="Address"
                            required
                        />
                        <input
                            type="text"
                            value={restaurantDetails.contact}
                            onChange={(e) => setRestaurantDetails({ ...restaurantDetails, contact: e.target.value })}
                            placeholder="Contact"
                            required
                        />
                        {error ? <span className='errorMsg'>{error}</span> : success ? <span className='successMsg'>{success}</span> : null}
                        <Button type='submit' loading={loading} name='Update Details'/>
                    </form>
                
            </div>

        </div>
        </>
    )
}

export default RestroSetting;
