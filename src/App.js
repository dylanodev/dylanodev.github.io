import React, { useState, useEffect, useContext } from "react";
import Users from "./Components/Users"; // Importer le composant Users
import ProtectedRoute from "./Components/ProtectedRoute"; // Importer le composant Users
import LoginSignup from "./Components/LoginSignup/LoginSignup"; // Importer le composant Users
import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import AuthContext from "./context/AuthContext";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { ToastContainer } from "react-toastify";
import { database } from "./utils/firebase";

import { auth } from "./utils/firebase";
import PasswordReset from "./Components/LoginSignup/PasswordReset"; // Assurez-vous que c'est bien avec "P" majuscule

function App() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentUser = getAuth();

  useEffect(() => {
    setLoading(true);
    onAuthStateChanged(auth, (usr) => {
      if (usr) {
        setIsLogin(true);
        getUser(usr?.uid);
        setUser(usr);
      }
    });
    setLoading(false);
  }, []);

  const getUser = async (userId) => {
    try {
      const userRef = doc(database, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log(userData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <p>Loading</p>;

  return (
    <AuthContext.Provider value={{ user, setUser, isLogin, setIsLogin }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/password-reset" element={<PasswordReset />} />{" "}
          {/* Route pour PasswordReset */}
          <Route path="/users" element={<ProtectedRoute />}>
            <Route path="/users" element={<Users />} />
          </Route>
          <Route path="*" element={<p>404 page not found.</p>} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </AuthContext.Provider>
  );
}

export default App;
