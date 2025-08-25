import React from 'react'
import Navbar from './components/Navbar'
import SideBar from "./components/Sidebar.jsx"
import { Route, Routes, useLocation } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify'
import ProtectedRoute from './components/ProtectedRoute.jsx'


const App = () => {
  const location = useLocation()
  const isLoginPage = location.pathname === "/login"

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />

      {/* Navbar + Sidebar should not show on login page */}
      {!isLoginPage && (
        <>
          <Navbar />
          <hr />
          <div className='flex w-full'>
            <SideBar />
            <div className='w-[70%] mx-auto ml-[5vw,25px] my-8 text-gray-600 text-base'>
              <Routes>
                <Route
                  path="/add"
                  element={
                    <ProtectedRoute>
                      <Add />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/list"
                  element={
                    <ProtectedRoute>
                      <List />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </div>
        </>
      )}

      {/* Login route should always exist */}
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App
