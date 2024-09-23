import React, { useEffect, useState, useContext } from "react";
import { addDoc, Timestamp, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { database, auth, googleProvider } from "../../utils/firebase";
import { handleAuthError } from "../../utils/authControl";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import AuthContext from "../../context/AuthContext";
import "../../App.css";

function LoginSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { isLogin: loggedIn, loading: checkAuth } = useContext(AuthContext);

  useEffect(() => {
    if (loggedIn) {
      // navigate("/users");
    }
  }, [loggedIn]);

  const handleGoogleLogin = async () => {
    // ... (code inchangé)
  };

  const handleLogin = async (email, password) => {
    // ... (code inchangé)
  };

  const handleSignup = async (name, email, password) => {
    // ... (code inchangé)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await handleLogin(email, password);
      } else {
        await handleSignup(name, email, password);
        setIsLogin(true);
      }
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  if (checkAuth) return <p>Loading</p>;

  return (
    <div className="background">
      <div className="container">
        <h1>{isLogin ? "Se connecter" : "S'inscrire"}</h1>
        <form onSubmit={handleSubmit} className="form">
          {!isLogin && (
            <input
              type="text"
              placeholder="Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {loading ? (
            <button type="submit" className="submit-button" disabled={loading}>
              Chargement...
            </button>
          ) : (
            <button type="submit" className="submit-button" disabled={loading}>
              {isLogin ? "Se connecter" : "S'inscrire"}
            </button>
          )}
        </form>

        <div onClick={() => setIsLogin(!isLogin)}>
          <p className="toggle-text">
            {isLogin
              ? "Pas encore inscrit ? S'inscrire"
              : "Déjà inscrit ? Se connecter"}
          </p>
        </div>

        <button className="google-button" onClick={handleGoogleLogin}>
          <img
            src="/images/google-Icon.png"
            alt="Google Icon"
            style={{ width: "30px", height: "30px", marginRight: "8px" }}
          />
          Se connecter avec Google
        </button>

        {isLogin && (
          <p
            onClick={() => navigate("/password-reset")} // Naviguer vers le formulaire de réinitialisation
            className="forgot-password"
            style={{ textAlign: "right" }} // Aligne à droite
          >
            Mot de passe oublié ?
          </p>
        )}
      </div>
    </div>
  );
}

export default LoginSignup;
