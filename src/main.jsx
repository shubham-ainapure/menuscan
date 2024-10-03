import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { Provider } from 'react-redux'
import  {store, persistor } from './Store/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import RestroSetting from './Components/Restaurant/RestroSetting.jsx'
import RestaurantMenu from './Components/Restaurant/RestaurantMenu.jsx'
import Home from './Components/Home.jsx'
import Dashboard from './Components/Dashboard.jsx'
import ManageMenu from './Components/Restaurant/ManageMenu.jsx'
import Login from './Components/Authentication/Login.jsx'
import SignUp from './Components/Authentication/SignUp.jsx'
import RestaurantForm from './Components/Restaurant/RestaurantForm.jsx'
import QRGenerator from './Components/QRCode/QRGenerator.jsx'

const router=createBrowserRouter([
  {
  path:'/menuscan/',
  element:<Home/>,
  },
  {
    path:'/menuscan/dashboard',
    element:<Dashboard/>
  },
  {
    path:'/menuscan/ManageMenu',
    element:<ManageMenu/>
  },
  {
    path:'/menuscan/menu',
    element:<RestaurantMenu/>
  },
  {
    path:'/menuscan/login',
    element:<Login/>
  },
  {
    path:'/menuscan/signup',
    element:<SignUp/>
  },
  {
    path:'/menuscan/restaurant-form',
    element:<RestaurantForm/>
  },
  {
    path:'/menuscan/restaurant',
    element:<RestroSetting/>
  },
  {
    path:'/menuscan/qrcode',
    element:<QRGenerator/>
  }

])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
     <PersistGate persistor={persistor}>
      <RouterProvider router={router}/>
     </PersistGate>
    </Provider>
  </StrictMode>,
)
