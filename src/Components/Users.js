import React, { useState, useEffect, useContext } from "react";
import {
  collection,
  getDocs,
  query,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom"; // Pour la redirection après déconnexion
import { signOut } from "firebase/auth";
import "./Users.css";
import { auth, database, storage } from "../utils/firebase";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";
const Users = () => {
  const [users, setUsers] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    surname: "",
    email: "",
    profession: "",
    phone: "",
    photo: null,
  });
  const [originalData, setOriginalData] = useState({
    name: "",
    surname: "",
    email: "",
    profession: "",
    phone: "",
    photo: null,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState(null); // Pour stocker le rôle de l'utilisateur connecté
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // Hook pour rediriger

  // Fonction pour récupérer le rôle de l'utilisateur
  const getCurrentUserRole = async (uid) => {
    const userDoc = await getDoc(doc(database, "users", uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      setCurrentUserRole(userData.role); // Stocker le rôle de l'utilisateur
    }
  };

  // Fonction pour récupérer les utilisateurs depuis Firestore
  const getUsers = async () => {
    setLoading(true);
    try {
      const data = await getDocs(query(collection(database, "user_list")));
      const usersList = [];
      data.forEach((doc) => {
        const dataObject = {
          id: doc.id,
          ...doc.data(),
        };
        usersList.push(dataObject);
      });
      setUsers(usersList);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // Utilisation de useEffect pour appeler getUsers et getCurrentUserRole
  useEffect(() => {
    getUsers();
    const user = auth.currentUser;
    if (user) {
      getCurrentUserRole(user.uid); // Récupérer le rôle de l'utilisateur connecté
    }
  }, []);

  const toggleForm = () => {
    setFormVisible(!formVisible);
    resetForm();
  };

  const resetForm = () => {
    setUserData({
      name: "",
      surname: "",
      email: "",
      profession: "",
      phone: "",
      photo: null,
    });
    setEditingUser(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleFileChange = (e) => {
    setUserData({ ...userData, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (editingUser) {
      console.log("editing user");
      handleEdit();
      setMessage("Utilisateur modifié avec succès !");
    } else {
      handleAddUser();
    }
  };

  const newPhotoEdit = async () => {
    const uploadRef = ref(storage, `user_photo/${userData.photo.name}`);
    const uploadTask = uploadBytesResumable(uploadRef, userData.photo);

    // Gérer l'état de l'upload
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Optionnel : Suivre la progression du téléchargement
      },
      (error) => {
        console.error("Upload failed:", error);
      },
      async () => {
        // Cette partie est exécutée une fois l'upload terminé
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          const userInfo = {
            ...userData,
            photo: downloadURL,
          };

          const userDocRef = doc(database, "user_list", userData.id);

          // Mise à jour du document avec les nouvelles informations
          await updateDoc(userDocRef, userInfo);

          setMessage("Utilisateur ajouté avec succès !");
          toggleForm();
          getUsers();
          toast.success("User updated!");
          getUsers();
          // window.location.reload()
          setLoading(false);
        } catch (error) {
          console.error("Error getting download URL or saving user:", error);
        }
      }
    );
  };
  const handleAddUser = async () => {
    const uploadRef = ref(storage, `user_photo/${userData.photo.name}`);
    const uploadTask = uploadBytesResumable(uploadRef, userData.photo);

    // Gérer l'état de l'upload
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Optionnel : Suivre la progression du téléchargement
      },
      (error) => {
        console.error("Upload failed:", error);
      },
      async () => {
        // Cette partie est exécutée une fois l'upload terminé
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          const userInfo = {
            ...userData,
            photo: downloadURL,
          };

          const userCollection = collection(database, "user_list");
          await addDoc(userCollection, userInfo);

          setMessage("Utilisateur ajouté avec succès !");
          toggleForm();
          getUsers();
          // window.location.reload()
          setLoading(false);
          setTimeout(() => setMessage(""), 3000);
        } catch (error) {
          console.error("Error getting download URL or saving user:", error);
        }
      }
    );
  };

  const editUser = async (user) => {
    setUserData(user);
    setOriginalData(user);
    setEditingUser(true);
    setFormVisible(true);
  };
  const handleEdit = async () => {
    try {
      if (userData.photo !== null && userData.photo !== originalData.photo) {
        newPhotoEdit();
      } else {
        const userInfo = {
          ...userData,
        };

        // Référence correcte du document dans la collection
        const userDocRef = doc(database, "user_list", userData.id);

        // Mise à jour du document avec les nouvelles informations
        await updateDoc(userDocRef, userInfo);
        toast.success("User updated!");
        getUsers();
      }
    } catch (err) {
      toast.error("Something went wrong please try again.");
      console.log(err);
    }
  };

  const deleteUser = async (user) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      try {
        await deleteDoc(doc(database, "user_list", user.id));

        // setUsers(users.filter((user) => user.id !== id));
        getUsers();
        setMessage("Utilisateur supprimé avec succès !");
        setLoading(false);
        toast.success("User deleted");
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong please try again.");
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.surname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Déconnecté");
      navigate("/"); // Rediriger vers la page de connexion après déconnexion
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="users-container">
      <h1>
        <marquee>Gestion des utilisateurs / Users Management.</marquee>
      </h1>
      <input
        type="text"
        placeholder="Rechercher un utilisateur..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      {currentUserRole !== "admin" && (
        <button onClick={toggleForm} className="add-button">
          Ajouter un Utilisateur
        </button>
      )}
      <button onClick={handleLogout} className="logout-button">
        Se déconnecter
      </button>

      <p>Hello, {user?.displayName?.toLocaleUpperCase()}</p>

      {message && <div className="message">{message}</div>}

      {formVisible && (
        <form onSubmit={handleSubmit} className="user-form">
          <h2>
            {editingUser ? "Modifier un Utilisateur" : "Ajouter un Utilisateur"}
          </h2>
          <input
            type="text"
            name="name"
            placeholder="?? Nom"
            value={userData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="surname"
            placeholder="?? Prénom"
            value={userData.surname}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="?? Email"
            value={userData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="profession"
            placeholder="?? Profession"
            value={userData.profession}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="?? Numéro de Téléphone"
            value={userData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
          />
          <button type="submit" disabled={loading} onClick={handleSubmit}>
            {loading ? "Chargement..." : "Enregistrer"}
          </button>
          <button type="button" disabled={loading} onClick={toggleForm}>
            Annuler
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading users</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Profession</th>
              <th>Téléphone</th>
              {currentUserRole !== "admin" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, i) => (
              <tr key={i}>
                <td>
                  {user.photo ? (
                    <img
                      src={user.photo}
                      alt={`${user.name} ${user.surname}`}
                      className="user-photo"
                    />
                  ) : (
                    "Aucune photo"
                  )}
                </td>
                <td>{user.name}</td>
                <td>{user.surname}</td>
                <td>{user.email}</td>
                <td>{user.profession}</td>
                <td>{user.phone}</td>
                <td>
                  {currentUserRole !== "admin" && (
                    <>
                      <button onClick={() => editUser(user)}>Modifier</button>
                      <button onClick={() => deleteUser(user)}>
                        Supprimer
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;
