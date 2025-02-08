import "./App.css";
import React, { useState } from "react"; // Import useState from React
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import  Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import UserDetails from "./pages/UserDetails";
import EditForm from "./pages/EditForm";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateNotePage from "./pages/CreateNotePage";



function App() {
  // const stringUser = localStorage.getItem("user");
  // console.log(stringUser);
  // const user =stringUser ? JSON.parse(stringUser) : null;
  // console.log(user);
  // const {id} = user;
  // console.log("userId",id)

    const [isLoggedIn, setIsLoggedIn] = useState(false);

  return <div className="min-h-screen w-screen bg-zinc-900">
    <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>

    <Routes>

    <Route path = "/" element = {<Home/>}/>
    <Route path = "/about" element = {<About/>}/>
    <Route path = "/contact" element = {<ContactUs/>}/>

    <Route path="/create-note" element={<CreateNotePage />} />


    <Route path = "/login" element = {<Login setIsLoggedIn={setIsLoggedIn}/>}/>
    <Route path = "/signup" element = {<Signup setIsLoggedIn={setIsLoggedIn}/>}/>

    
    <Route path = "/dashboard"
           element = {  <ProtectedRoute>
             <Dashboard/>
              </ProtectedRoute>}/>

    <Route path="/user/:id" element={
      <ProtectedRoute>
        <UserDetails/>
      </ProtectedRoute>
      }/>
    <Route path="/edit/:noteId" element={<EditForm />} />



    </Routes>
  </div>;
}

export default App;
