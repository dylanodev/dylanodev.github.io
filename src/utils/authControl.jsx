import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const handleAuthError = (error) => {
  console.log("incoming error", error.code);
  console.log("incoming error", typeof error);
  switch (error.code) {
    case "auth/user-not-found":
      toast.error("Utilisateur non trouvé", { className: "error-toast" });
      break;
    case "auth/invalid-email":
      toast.error("Email invalide", { className: "error-toast" });
      break;
    case "auth/wrong-password":
      toast.error("Mot de passe incorrect", { className: "error-toast" });
      break;
    case "auth/email-already-in-use":
      toast.error("L'email est déjà utilisé", { className: "error-toast" });
      break;
    case "auth/too-many-requests":
      toast.error("Too many failed login attepts, please try again later.", {
        data: { title: "error-toast", text: "Error" },
      });
      break;
    case "auth/invalid-login-credentials":
      toast.error("Wrong email or password.", {
        data: { title: "error-toast", text: "Error" },
      });
      break;
    default:
      toast.error("Erreur: " + error.message, { className: "error-toast" });
  }
};
