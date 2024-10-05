import React, { useEffect, useState } from 'react';
import '../../Styles/LogoutModal.css';
import authService from '../../appwrite/auth';
import { useSelector } from 'react-redux';
import dbService from '../../appwrite/DbService';
import { TailSpin } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import Button from '../Button';

const LogoutModal = ({ showModal, setShowModal }) => {
    const navigate=useNavigate();
    const restaurant = useSelector((state)=>state.db.restaurant);
    const [showConvertFields, setShowConvertFields] = useState(false);
    const[success,setSuccess]=useState(null);
    const [name,setName]=useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [load,setLoad]=useState(
        {
            modalLog:false,
            modalConvert:false

        }
    )

    useEffect(()=>{
        setShowConvertFields(false);
    },[showModal])

    const handleLogout = async() => {
        setLoad({...load,modalLog:true});
        const del=await dbService.deleteRestaurant(restaurant.documents[0].$id);
           if(del){
            const log= await authService.logout();
            if(log){
                setLoad({...load,modalLog:false});
                navigate('/menuscan');
            }
           }
        setShowModal(false);
    };

    const handleConvert = async(e) => {
        e.preventDefault();
        setLoad({...load,modalConvert:true});
        try {
            const res=await authService.updateName(name);
           if(res){
            console.log(res);
            const response= await authService.convertGuest(email,password);
            setSuccess('Account converted Successfully!!');
            console.log(response);
            setLoad({...load,modalLog:false});
           }
        } catch (error) {
            setLoad({...load,modalLog:false});
            console.log(error);
        }    
    };

    return (
        <>
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2 className='h1'>Warning</h2>
                        <p className='warningMsg'>
                            If you log out, you will lose your data. To retain your data,
                            please convert your guest account to a normal account.
                        </p>
                        {showConvertFields ? (
                            <div className="convert-fields">
                                 <form onSubmit={handleConvert}>
                                 <input
                                    type="text"
                                    placeholder="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {success?<span className='success'>{success}</span>:null}
                            
                                 <Button type='submit' name='Convert Account' loading={load.modalConvert}/>
                                 </form>
                            </div>
                        ) : (
                            <>
                                <button onClick={handleLogout}>
                                {load.modalLog? <TailSpin color="#73c988" height='20' width='20' wrapperClass='spinner'/>: 'Confirm Logout' }
                                </button>
                                <button onClick={() => setShowConvertFields(true)}>Convert Account</button>
                            </>
                        )}
                        <button className="close-button" onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default LogoutModal;
