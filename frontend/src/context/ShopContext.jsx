import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"
import axios from "axios"

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '$'
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState("")
    const [showSearch, setShowSearch] = useState(false)
    const [cartItems, setCartItems] = useState([])
    const [products, setProducts] = useState([])
    const [token, setToken] = useState(localStorage.getItem("Token"))
    const navigate = useNavigate()




    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error("Select Product Size");
            return;
        }

        if (token) {
            try {
                const response = await axios.post(
                    `${backendUrl}/cart/addtocart`,
                    { itemId, size },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setCartItems(response.data.cart);
                toast.success(response.data.message);
            } catch (error) {
                toast.error(error.response?.data?.message || error.message);
                setCartItems(cartData); // rollback local update
            }
        }
    };

    const removeProductFromCart = async (itemId, size) => {
        try {
            const response = await axios.put(`${backendUrl}/cart/removeproduct`, { itemId, size }, {
                headers: { "Authorization": `Bearer ${token}` }
            })

            toast.success(response.data.message)
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }


    const getCartCount = () => {
        let totalCount = 0;
        cartItems.forEach(item => {
            totalCount += item.quantity;
        });
        return totalCount;
    };


    const getUserCart = async () => {
        try {
            const response = await axios.get(`${backendUrl}/cart/getusercart`, {
                headers: { "Authorization": `Bearer ${token}` }
            })

            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            toast.error(error?.response?.data.message)
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0
        cartItems.forEach((item) => {
            const product = products.find((product) => product._id === item.itemId)

            if (product) {
                totalAmount += product.price * item.quantity
            }
        });

        return totalAmount;
    }

    const getProductData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/product/listproducts`)

            setProducts(response.data.products)
        } catch (error) {
            toast.error(error.response?.data?.message)
        }
    }

    useEffect(() => {
        if (token) {
            getUserCart()
        }
    }, [token])

    useEffect(() => {
        getProductData()
    }, [])

    const logout = () => {
        setToken(null)
        setCartItems([])
    }

    useEffect(() => {
        if (token) {
            localStorage.setItem("Token", token)

        } else {
            localStorage.removeItem("Token")
            navigate("/register")
        }
    }, [token])



    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        setCartItems,
        addToCart,
        getCartCount,
        getCartAmount,
        navigate,
        backendUrl,
        token,
        setToken,
        logout,
        removeProductFromCart
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;