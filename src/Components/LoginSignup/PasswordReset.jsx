import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // Importer useNavigate
import { auth } from "../../utils/firebase"; // Assurez-vous que votre chemin Firebase est correct
import { toast } from "react-toastify";
import "../../App.css";

function PasswordReset() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate(); // Initialiser la navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Email de réinitialisation de mot de passe envoyé !");
      // Redirection automatique vers la page de connexion après envoi de l'email
      navigate("/");
    } catch (error) {
      toast.error("Erreur lors de l'envoi de l'email de réinitialisation");
    }
  };

  return (
    <div className="background">
      <div className="container">
        <h1>Réinitialiser votre mot de passe</h1>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="email"
            placeholder="Entrez votre adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="submit-button">
            Initialiser le mot de passe
          </button>
        </form>
      </div>
    </div>
  );
}

export default PasswordReset;
