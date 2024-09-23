import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";

const useAuthStatus = () => {
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user) {
        console.log(user);
        setIsLogin(true);
        authContext.setUser(user);
      } else {
        console.log("not logged in");
      }
      setLoading(false);
    });
  }, []);

  return { isLogin, loading };
};
export default useAuthStatus;
