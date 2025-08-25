import { Order } from "../models/order.model.js"
import { User } from "../models/user.model.js"
import Stripe from "stripe"
import razorpay from "razorpay"

const currency = 'inr'
const deliveryCharges = 10

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId

    console.log(items)

    if (!amount || !items || !address) {
      return res.status(400).json({ success: false, message: "All fields are required" })
    }

    if (!userId) {
      return res.status(400).json({ success: false, message: "User not found" })
    }

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now()
    }

    const newOrder = new Order(orderData)
    await newOrder.save()

    await User.findByIdAndUpdate(userId, { cartData: [] })

    return res.status(200).json({ success: true, message: "Order placed" })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, message: "Failed to place order" })
  }
};

const verifyStripe = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId, success } = req.body;

    if (success === "true") {
      await Order.findByIdAndUpdate(orderId, { payment: true });
      await User.findByIdAndUpdate(userId, { cartData: [] });

      return res.status(200).json({ success: true, message: "Payment successful" })
    }
    else {
      await Order.findByIdAndDelete(orderId)

      return res.status(400).json({ success: false, message: "Payment failed" })
    }
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, message: "Error in payment" })
  }
};

const placeOrderStripe = async (req, res) => {

  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;
    const { origin } = req.headers;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now()
    }

    const newOrder = new Order(orderData)
    await newOrder.save()

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(Number(item.price) * 100), // ensure integer
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: Math.round(Number(deliveryCharges) * 100), // ensure integer
      },
      quantity: 1,
    });


    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: 'payment',
    })

    return res.status(200).json({ success: true, session_url: session.url })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, message: "Failed to place order" })
  }

};

const placeOrderRazorPay = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId

    console.log(items)

    if (!amount || !items || !address) {
      return res.status(400).json({ success: false, message: "All fields are required" })
    }

    if (!userId) {
      return res.status(400).json({ success: false, message: "User not found" })
    }

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now()
    }

    const newOrder = new Order(orderData)
    await newOrder.save()

    const options = {
      amount: amount * 100,
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString()
    }

    await razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error)
        return res.status(400).json({ success: false, message: error })
      }
      return res.status(200).json({ success: true, order })
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, message: "Failed to place order" })
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    const userId = req.userId;
    const { razorpay_order_id } = req.body;

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
    if (orderInfo.status === "paid") {
      await Order.findByIdAndUpdate(orderInfo.receipt, { payment: true });
      await User.findByIdAndUpdate(userId, { cartData: [] });

      return res.status(200).json({ success: true, message: "Payment Successful" })
    }
    else {
      return res.status(400).json({ success: false, message: "Payment Failed" })
    }
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, message: "Failed to place order" })
  }
}

const allOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("items.product", "name image price")
    return res.status(200).json({ success: true, orders })

  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, message: "Failed to fetch orders" })
  }
};

const userOrders = async (req, res) => {
  try {
    const userId = req.userId

    const orders = await Order.find({ userId })
      .populate("items.product", "name price image")

    console.log(orders)

    return res.status(200).json({ success: true, orders })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, message: "Server error" })
  }
}

const updateStatus = async (req, res) => {
  const { orderId, status } = req.body;
  try {
    const order = await Order.findById(orderId)

    order.status = status

    await order.save()

    return res.status(200).json({ success: true, order })
  } catch (error) {
    console.log(error)
    return res.status(400).json({ success: false, message: "Failed to update status" })
  }
};

export { verifyRazorpay, placeOrder, verifyStripe, placeOrderStripe, placeOrderRazorPay, allOrders, userOrders, updateStatus }