import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../context/authContext'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from "axios"
import { toast } from 'react-toastify'
import { assets } from '../assets/admin_assets/assets.js'

const Orders = () => {

  const { token, currency, BACKEND_URL } = useContext(AuthContext)

  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {
    if (!token) {
      return null
    }

    try {
      const response = await axios.get(`${BACKEND_URL}/order/allorders`, {
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      }

      else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const updateOrderStatus = async (e, orderId) => {
    try {
      const response = await axios.put(`${BACKEND_URL}/order/status`, { orderId, status: e.target.value }, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      
      await fetchAllOrders()
    } catch (error) {
      toast.error(error.message)
    }
  }



  useEffect(() => {
    fetchAllOrders()
  }, [token])

  return (
    <div>
      <h1>Order page</h1>

      <div>
        {
          orders.map((order, index) => (
            <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700 ' key={index}>
              <img className='w-12' src={assets.parcel_icon} alt="" />

              <div>

                <div>
                  {
                    order.items.map((item, index) => {
                      if (index === order.items, length - 1) {
                        return <p className='py-0.5' key={index}>{item.product.name} X {item.quantity} <span>{item.size}</span></p>
                      }

                      else {
                        return <p className='py-0.5' key={index}>{item.product.name} X {item.quantity} <span>{item.size}</span>,</p>
                      }
                    })
                  }
                </div>
                <p className='mt-3 mb-2 font-medium'>{order.address.firstName + " " + order.address.lastName}</p>
                <div>
                  <p>{order.address.street + ","}</p>
                  <p>{order.address.city + "," + order.address.state + "," + order.address.country + "," + order.address.zipcode}</p>
                </div>
                <p>{order.address.phone}</p>
              </div>

              <div>
                <p className='text-sm sm:text-[15px]'>Items: {order.items.length}</p>
                <p className='mt-3'>Method: {order.paymentMethod}</p>
                <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <p className='text-sm sm:text-[15px]'>{currency}{order.amount}</p>
              <select value={order.status} onChange={(e) => updateOrderStatus(e, order._id)} className='p-2 font-semibold'>
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Orders