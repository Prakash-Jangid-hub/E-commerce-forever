import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/frontend_assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
  const { navigate, backendUrl, cartItems, token, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);

  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [formData, setFromData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  })

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value

    setFromData(prev => ({
      ...prev, [name]: value
    }));
  }

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(`${backendUrl}/order/verifyRazorpay`, response, { headers: { "Authorization": `Bearer ${token}` } })

          if (data.success) {
            navigate("/orders")
            setCartItems([])
          }
        } catch (error) {
          toast.error(error.data.message)
        }
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {

      const cartDetails = cartItems.map((item) => {
        const product = products.find(p => p._id === item.itemId)  // match product
        return {
          size: item.size,
          quantity: item.quantity,
          product: item.itemId,
          name: product?.name,     // add product name
          price: product?.price    // add product price
        }
      })


      const items = cartDetails
      const address = formData
      const amount = getCartAmount() + delivery_fee

      switch (paymentMethod) {

        case 'cod':
          const response = await axios.post(`${backendUrl}/order/placeorder`, { items, address, amount }, {
            headers: { "Authorization": `Bearer ${token}` }
          })

          if (response.data.success) {
            navigate("/orders")
            toast.success(response.data.message)
          }
          else {
            toast.error(response.data.message)
          }
          break;

        case 'stripe':
          const responseStripe = await axios.post(`${backendUrl}/order/stripe`, { items, address, amount }, {
            headers: { "Authorization": `Bearer ${token}` }
          })

          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data
            window.location.replace(session_url)
          }
          else {
            toast.error(responseStripe.data.message)
          }

          break;

        case 'razorpay':
          const responseRazorpay = await axios.post(`${backendUrl}/order/razorpay`, { items, amount, address }, {
            headers: { "Authorization": `Bearer ${token}` }
          })

          if (responseRazorpay.data.success) {
            initPay(responseRazorpay.data.order)
          }


          break;

        default:
          break;
      }

    } catch (error) {
      toast.error(error.data)
    }
  }



  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh]'>
      {/* Left side */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
        </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
        <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
          <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' />
          <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
        </div>
        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />
      </div>


      {/* Right side */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1={"PAYMENT"} text2={"METHOD"} />

          {/* payment method selection */}
          <div className='flex gap-3 lg:flex-row'>
            <div onClick={() => setPaymentMethod("stripe")} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${paymentMethod === "stripe" ? "bg-green-400" : ""}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
            </div>
            <div onClick={() => setPaymentMethod("razorpay")} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full  ${paymentMethod === "razorpay" ? "bg-green-400" : ""}`}></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
            </div>
            <div onClick={() => setPaymentMethod("cod")} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full  ${paymentMethod === "cod" ? "bg-green-400" : ""}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black cursor-pointer text-white px-16 py-3 text-sm'>PLACE ORDER</button>
          </div>


        </div>

      </div>

    </form>
  )
}

export default PlaceOrder