import React, { useState, useRef, useEffect } from 'react';
import '../../Styles/ManageMenu.css';
import { useDispatch, useSelector } from 'react-redux';
import dbService from '../../appwrite/DbService';
import { categoryInfo, dishInfo } from '../../Store/dbSlice';
import { TailSpin } from 'react-loader-spinner';
import config from '../../Config/config';

const ManageMenu = () => {
    const restroData = useSelector((state) => state.db.restaurant);
    const categoryData = useSelector((state) => state.db.category);
    const [dishIds,setDishIds]=useState(null);
    const [loading,setLoading]=useState({
        addcategory:false,
        updateCategory:false,
        deleteCategory:false,
        addDish:false,
        updateDish:false,
        deleteDish:false
    })
    const dispatch = useDispatch();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [newCategory, setNewCategory] = useState('');
    const [updatedCategoryName, setUpdatedCategoryName] = useState('');
    const [dish,setDish]=useState(null);
    const [newDish, setNewDish] = useState({ name: '', price: '', description: '', veg: 'Veg', imageId: '' });
    const [selectedDish, setSelectedDish] = useState(null);
    const imageInputRef = useRef(null);
    const [imgload,setImgload]=useState(false);

    useEffect(() => {
        console.log(categoryData);
    }, [categoryData]);

    //function to fetch dihes based on category
    const fetchDishesForCategory = async (categoryId) => {
        const dishRes = await dbService.getDishesh(categoryId);
        const ids=dishRes.documents.map(item=> {return item.$id});
        setDishIds(ids);
        console.log(dishRes);
        if (dishRes) {
            setDish(dishRes.documents)
        }
    };

    // add new category and update the the category in redux store 
    const handleAddCategory = async () => {
        if (newCategory) {
            setLoading({...loading,addcategory:true});
            const res = await dbService.createCategory(newCategory, restroData.documents[0].$id);
            if (res) {
                const cat = await dbService.getCategoryList(restroData.documents[0].$id);
                if (cat) {
                    dispatch(categoryInfo(cat.documents));
                }
            }
            setLoading({...loading,addcategory:false});
            setNewCategory('');
        }
    };

    //select a category and fetch dishes based on that category
    const handleSelectCategory = async (category) => {
       if(selectedDish){
        setSelectedDish(null);
        setNewDish({ name: '', price: '', description: '', veg: 'Veg', imageId: '' });
        imageInputRef.current.value = null;
       }
        setSelectedCategory(category);
        console.log(category);
        setUpdatedCategoryName(category.name);
        await fetchDishesForCategory(category.$id);
    };

    //update the category name and update the category in redux store as well
    const handleUpdateCategoryName = async () => {
        if (selectedCategory) {
            setLoading({...loading,updateCategory:true});
            const res = await dbService.updateCategory(selectedCategory.$id, updatedCategoryName);
            if (res) {
                const cat = await dbService.getCategoryList(restroData.documents[0].$id);
                if (cat) {
                    dispatch(categoryInfo(cat.documents));
                }
                const updatedCategories = categories.map((category) =>
                    category.$id === selectedCategory.$id ? { ...category, name: updatedCategoryName } : category
                );
                setCategories(updatedCategories);
                setSelectedCategory({ ...selectedCategory, name: updatedCategoryName });
            }
            setLoading({...loading,updateCategory:false});
        }
    };

    // add a new dish to a category and update dishInfo in redux store
    const handleAddDish = async () => {
        if ( newDish.imageId) {
            setLoading({...loading,addDish:true});
            const res = await dbService.createMenu({
                name: newDish.name,
                description: newDish.description,
                price: newDish.price,
                imageId: newDish.imageId,
                veg: newDish.veg === 'Veg',
                categoryId: selectedCategory.$id,
                restaurantId:restroData.documents[0].$id
            });
            if (res) {

                await fetchDishesForCategory(selectedCategory.$id);
                setLoading({...loading,addDish:false});
                setNewDish({ name: '', price: '', description: '', veg: 'Veg', imageId: '' });
                imageInputRef.current.value = null;
                    const dish= await dbService.getAllDish(restroData.documents[0].$id);
                    dispatch(dishInfo(dish.documents));
            }
        }
    };

    // set a perticular dish as selected
    const handleSelectDish = (dish) => {
        setSelectedDish(dish);
        setNewDish(dish);
    };

    // update the dish 
    const handleUpdateDish = async () => {
        console.log(selectedCategory)
        if (selectedDish && newDish.name && newDish.price && newDish.description && newDish.imageId) {
            setLoading({...loading,updateDish:true});
            const res = await dbService.updateMenu(selectedDish.$id, {
                name: newDish.name,
                description: newDish.description,
                price: newDish.price,
                imageId: newDish.imageId,
                veg: newDish.veg === 'Veg'
            });
            if (res) {
               

                await fetchDishesForCategory(selectedCategory.$id);
                setSelectedDish(null);

                setNewDish({ name: '', price: '', description: '', veg: 'Veg', imageId: '' });
                imageInputRef.current.value = null;
                
               
            }
            setLoading({...loading,updateDish:false});
        }
    };

    // delete dish
    const handleDeleteDish = async (dishId) => {
        setLoading({...loading,deleteDish:true});
        const res = await dbService.deleteDish(dishId);
        if (res) {
            await fetchDishesForCategory(selectedCategory.$id);
            setSelectedDish(null);
            setNewDish({ name: '', price: '', description: '', veg: 'Veg', imageId: '' });

            const dish= await dbService.getAllDish(restroData.documents[0].$id);
            dispatch(dishInfo(dish.documents));
        }
        setLoading({...loading,deleteDish:false});
    };

    // delete category
    const handleDeleteCategory = async () => {
        if (selectedCategory) {
            setLoading({...loading,deleteCategory:true});
            const res = await dbService.deleteCategory(selectedCategory.$id);
            if (res) {
                if(dishIds.length>0){
                    await dbService.deleteMultipleDish(dishIds);
                }
                const cat = await dbService.getCategoryList(restroData.documents[0].$id);
                if (cat) {
                    setLoading({...loading,deleteCategory:false});
                    dispatch(categoryInfo(cat.documents));
                }
                const dish= await dbService.getAllDish(restroData.documents[0].$id);
                dispatch(dishInfo(dish.documents));

                setCategories(categories.filter((category) => category.$id !== selectedCategory.$id));
                setSelectedCategory(null);
                setSelectedDish(null);
            }
        }
    };

    // upload image file to the bucket and covert the file id to url
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
         console.log(file)
         setImgload(true);
            const res = await dbService.uploadImg(file);
            if (res) {
                const url= dbService.bucket.getFilePreview(config.bucketId,res.$id).href;
                setImgload(false);
                console.log(res)
                setNewDish({ ...newDish, imageId: url });
            }
        
    };

    return (
        <div className="manage-menu-container">
            <h1>Manage Menu</h1>

            <div className="add-category">
                <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter Category Name"
                    required
                />
                <button onClick={handleAddCategory}>{loading.addcategory? <TailSpin color="#73c988" height='20' width='20' wrapperClass='spinner'/>: 'Add Category'}</button>
            </div>

            <div className="category-scroll">
                {/* {categories && categories.map((category) => ( */}
                {categoryData && categoryData.map((category) => (

                    <div
                        key={category.$id}
                        className={`category-tab ${selectedCategory && selectedCategory.$id === category.$id ? 'active' : ''}`}
                        onClick={() => handleSelectCategory(category)}
                    >
                        {category.name}
                    </div>
                ))}
            </div>

            {selectedCategory && (
                <div className="category-management">
                    <div className="category-actions">
                        <input
                            type="text"
                            value={updatedCategoryName}
                            onChange={(e) => setUpdatedCategoryName(e.target.value)}
                        />
                        <button onClick={handleUpdateCategoryName}>{loading.updateCategory? <TailSpin color="#73c988" height='20' width='20' wrapperClass='spinner'/>:'Update'}</button>
                        <button onClick={handleDeleteCategory}>{loading.deleteCategory? <TailSpin color="#73c988" height='20' width='20' wrapperClass='spinner'/>:'Delete'}</button>
                    </div>

                    <div className="add-dish">
                        <h2>Add Dish to {updatedCategoryName}</h2>

                        <div className="dish-scroll">
                            {/* {selectedCategory.dishes && selectedCategory.dishes.map((dish) => ( */}
                            {dish && dish.map((dish) => (
                                <div
                                    key={dish.$id}
                                    className={`dish-tab ${selectedDish && selectedDish.$id === dish.$id ? 'active' : ''}`}
                                    onClick={() => handleSelectDish(dish)}
                                >
                                    {dish.name}
                                </div>
                            ))}
                        </div>

                        <div className='dish-form'>
                            <input
                                type="text"
                                value={newDish.name}
                                onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                                placeholder="Dish Name"
                                required
                            />
                            <input
                                type="text"
                                value={newDish.price}
                                onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                                placeholder="Dish Price"
                                required
                            />
                            <textarea
                                value={newDish.description}
                                onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                                placeholder="Dish Description"
                                required
                            />
                            <select
                                value={newDish.veg}
                                onChange={(e) => setNewDish({ ...newDish, veg: e.target.value })}
                            >
                                <option value="Veg">Veg</option>
                                <option value="Non-Veg">Non-Veg</option>
                            </select>
                            <input ref={imageInputRef} className='img-file' type="file" accept="image/*" onChange={handleImageChange} required />
                            <span></span>
                            {selectedDish ? (
                                <div className='dish-btn'>
                                    <button onClick={handleUpdateDish}>{loading.updateDish? <TailSpin color="#73c988" height='20' width='20' wrapperClass='spinner'/>:'Update Dish'}</button>
                                    <button onClick={() => handleDeleteDish(selectedDish.$id)}>{loading.deleteDish? <TailSpin color="#73c988" height='20' width='20' wrapperClass='spinner'/>:'Delete'}</button>
                                </div>
                            ) : (
                                <button onClick={handleAddDish}>{imgload ? 'please wait..' : loading.addDish?<TailSpin color="#73c988" height='20' width='20' wrapperClass='spinner'/>:'Add Dish'}</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageMenu;
