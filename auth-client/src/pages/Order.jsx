import React from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import logo from "../assets/Logo.svg"
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { useCartContext } from "../../context/cartContext";
import { useUserContext } from "../../context/userContext";
import { useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
const Order = () => {
    const { cartItems, removeItem, addToCart } = useCartContext()
    const itemsPrice = cartItems.reduce((a, c) => a + c.qty + c.price, 0)
    const taxPrice = itemsPrice * 0.14;
    const taxPriceLength = taxPrice.toFixed(2)
    const deliveryPrice = itemsPrice > 2000 ? 0 : 20
    const totalPrice = itemsPrice + deliveryPrice + parseInt(taxPriceLength)

    const { user } = useUserContext()
    const stripe = useStripe()

    const handleFinish = async () => {

        try {
            const orderItems = cartItems.map(item => ({
                food: item._id,
                qty: item.qty
            }))
            const res = await axios.post(`http://localhost:8000/api/vl/order/order`, {
                user: user?.user._id,
                items: orderItems,
                totalAmount: totalPrice,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })

            if (res.data.success) {
                const result = await stripe.redirectToCheckout({
                    sessionId: res.data.sessionId
                })
                toast.success(res.data.message)
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error('Something Went Wrong')
        }
    }


    return (
        <div className=" h-screen pt-[16vh]">
            <div className=" ease-in duration-300 w-[80%] sm:w-max shadow-sm backdrop-blur-md bg-white/80 lg:w-[28rem] mx-auto flex flex-col items-center rounded-md px-8 py-5 " >
                <NavLink to="/">
                    <img src={logo} alt="" className="logo mb-6 cursor-pointer text-center" />
                </NavLink>
                <div className="text-xl text-[#2e2e2e] mb-3">
                    Items Price : <span className="text-[#f54748]">Rs.{itemsPrice}</span>
                </div>
                <div className="text-xl text-[#2e2e2e] mb-3">
                    Tax Price : <span className="text-[#f54748]">Rs.{taxPriceLength}</span>
                </div>
                <div className="text-xl text-[#2e2e2e] mb-3">
                    Delivery Price : <span className="text-[#f54748]">Rs.{deliveryPrice}</span>
                </div>
                <div className="text-xl text-[#2e2e2e] mb-3">
                    Total Price : <span className="text-[#f54748]">Rs.{totalPrice}</span>
                </div>
                <button className="bg-[#f54748] active:scale-90 transition duration-150 transform hover:shadow-xl shadow-md w-full rounded-full px-8 py-2 text-xl font-medium text-white mx-auto text-center" onClick={handleFinish}>Pay Rs.{totalPrice}</button>


                <ToastContainer />
            </div>
        </div>
    )
}

export default Order