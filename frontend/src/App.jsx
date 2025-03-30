import "./App.css";
import React, { useState } from "react"; // Import useState from React
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import  Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard";
import BrowseNotes from "./pages/BrowseNotes"
import UserDetails from "./pages/UserDetails";
import EditForm from "./pages/EditForm";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import ProtectedRoute from "./components/ProtectedRoute";
import NoteForm from "./pages/NoteForm";
import MyProfile from "./pages/MyProfile";
import PendingNotes from "./pages/PendingNotes";
import AdminDashboard from "./pages/AdminDashboard";
import ApprovedNotesPage from "./pages/ApprovedNotes";
import RejectedNotes from "./pages/RejectedNotes";
import Bookmarks from "./pages/Bookmarks";
import Status from "./pages/Status";
import StudentDashboard from "./pages/StudentDashboard";


function App() {
  // const stringUser = localStorage.getItem("user");
  // console.log(stringUser);
  // const user =stringUser ? JSON.parse(stringUser) : null;
  // console.log(user);
  // const {id} = user;
  // console.log("userId",id)


    const [isLoggedIn, setIsLoggedIn] = useState(false);

  return <div className="min-h-screen w-screen ">
    <div>
    <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>

    </div>

    <Routes>

    <Route path = "/" element = {<Home/>}/>
    <Route path = "/about" element = {<About/>}/>
    <Route path = "/contact" element = {<ContactUs/>}/>



    <Route path = "/login" element = {<Login setIsLoggedIn={setIsLoggedIn}/>}/>
    <Route path = "/signup" element = {<Signup setIsLoggedIn={setIsLoggedIn}/>}/>


    <Route 
    path ="/dashboard"
    element = {<ProtectedRoute>
      <Dashboard/>
    </ProtectedRoute>}>
    
  <Route path = "studentdashboard" element={<StudentDashboard />} />
  <Route path = "browseNotes" element={<ProtectedRoute>
                    <BrowseNotes/>
                    </ProtectedRoute>}/>
                    <Route path="my-profile" element={<MyProfile />} />
                    <Route path="add-material" element={<NoteForm />} />
                    <Route path="edit/:noteId" element={<NoteForm />} />
                    <Route path="bookmarks" element={<Bookmarks />} />
                    <Route path="status" element={<Status />} />
        

    <Route path="my-uploads/:id" element={
                        <ProtectedRoute>
                          <UserDetails/>
                        </ProtectedRoute>                
      }/>
         <Route path="admin" element={
                        <ProtectedRoute>
                          <AdminDashboard/>
                        </ProtectedRoute>                
      }/>

                        




<Route path="pendingNotes" element={
                        <ProtectedRoute>
                          <PendingNotes/>
                        </ProtectedRoute>
                        
      }/>
<Route path="approvedNotes" element={
                        <ProtectedRoute>
                          <ApprovedNotesPage/>
                        </ProtectedRoute>
                        
      }/>

<Route path="rejectedNotes" element={
                        <ProtectedRoute>
                          <RejectedNotes/>
                        </ProtectedRoute>
                        
      }/>


    </Route>

    <Route path="edit/:noteId" element={<EditForm />} />


    </Routes>
  </div>;
}

export default App;
