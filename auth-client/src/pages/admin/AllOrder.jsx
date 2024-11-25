import React from "react"
import { useUserContext } from "../../../context/userContext"
import axios from "axios"
import { ToastContainer } from "react-toastify"

const AllOrder = () => {
    return (
        <div></div>
    )
}

export default AllOrder

const OrderFoods = ({ order }) => {
    const { user, setUser } = useUserContext()
    const handleDelivered = async (id) => {
        console.log(id)
        try {
            const res = await axios.post(`http://localhost:8000/api/vl/order/status`, {
                userId: user?.user_id,
                orderId: id,
                token: localStorage.getItem("token")
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            console.log(res.data)
            if (res.data.success) {
                toast.success(res.data.message)
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="flex items-center hover:bg-gray-100 -mx-8 px-6 py-5">
            <div className="flex w-2/5">
                <div className="grid grid-cols-3">
                    {
                        order?.items?.map((item) => <div className="flex flex-col justify-between ml-4 flex-grow">
                            <div>
                                <img className="h-20" src={item?.food.foodImage} alt="" />
                            </div>
                            <span className="font-bold text-sm">{item?.food?.name}</span>
                            <span className="flex items-center space-x-4">
                                qty:
                                <span className="text-red-500 px-3 py-2 bg-slate-50 text-lg font-medium">{item?.qty}</span>
                            </span>
                        </div>)
                    }
                </div>
            </div>
            <div className="flex justify-center w-1/5 cursor-pointer">
                {order?.payment === false && <span className="font-bold text-sm">Not Paid</span>}
                {order?.payment && <span className="font-bold text-green-600 text-sm">Paid</span>}
            </div>
            <div className="flex justify-center w-1/5 cursor-pointer">
                <button className="bg-[#f54748] active:scale-90 transition duration-150 transform hover:shadow-xl shadow-md rounded-full px-8 py-2 text-xl font-medium text-white mx-auto text-center" onClick={() => handleDelivered(order?._id)}>Delivered</button>
            </div>
            <span className="text-center w-1/5 font-semibold text-sm">
                {order?.createdAt}
            </span>
            <span className="text-center w-1/5 font-semibold text-sm">
                {order?.totalAmount}
            </span>
            <ToastContainer />
        </div>
    );
};