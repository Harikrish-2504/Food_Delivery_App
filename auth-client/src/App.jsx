import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './Shared/Navbar'
import Home from './pages/Home'
import Footer from './Shared/Footer'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './pages/ProtectedRoute'
import VerifyOtp from './pages/VerifyOtp'
import Addfood from './pages/admin/Addfood'
import Menu from './pages/Menu'
import FoodPage from './pages/FoodPage'
import Profile from './pages/Profile'
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ViewCart from './pages/ViewCart'
import Success from './pages/Success'
import Cancel from './pages/Cancel'
import Order from './pages/Order'
import MyOrder from './pages/MyOrder'

function App() {
  const [count, setCount] = useState(0)
  const stripePromise = loadStripe('pk_test_51P9wp6SG0XuRqBMq7LmC83ZbOkzcuTrhLPripJ1KlX1yZdxXBiz5oKXsMluLZzKqi0DNav2Q4D5hRbS5lUYS3iAU00AnfiGA7N');
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/verifyOtp' element={
          <ProtectedRoute>
            <VerifyOtp />
          </ProtectedRoute>
        } />
        <Route path='/addfood' element={<ProtectedRoute><Addfood /></ProtectedRoute>} />
        <Route path='/menu' element={<ProtectedRoute><Menu /></ProtectedRoute>} />
        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path='/menu/:id' element={<ProtectedRoute><FoodPage /></ProtectedRoute>} />
        <Route path='/viewcart' element={<ProtectedRoute><ViewCart /></ProtectedRoute>} />
        <Route path='/success' element={<ProtectedRoute><Success /></ProtectedRoute>} />
        <Route path='/cancel' element={<ProtectedRoute><Cancel /></ProtectedRoute>} />
        <Route path='/my-order' element={<ProtectedRoute><MyOrder /></ProtectedRoute>} />
        <Route path='/order' element={<ProtectedRoute>
          <Elements stripe={stripePromise}>
            <Order />
          </Elements>
        </ProtectedRoute>} />
        
      </Routes>
      <Footer />
    </>
  )
}

export default App
