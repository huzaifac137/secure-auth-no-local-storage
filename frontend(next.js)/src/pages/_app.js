import Link from "next/link";
import Router, { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import authContext from "@/CONTEXT/authContext";
import { useEffect, useState } from "react";
import useRefreshToken from "@/CUSTOME-HOOKS/useRefreshToken";
export default function App({ Component, pageProps }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");

  const { getRefreshToken, Token } = useRefreshToken();

  const router = useRouter();
  const currentRoute = router.pathname;

  const setUN = (un) => {
    setUsername(un);
  };

  const setEm = (em) => {
    setEmail(em);
  };

  const setUID = (uid) => {
    setUserId(uid);
  };

  const setTOKEN = (tokn) => {
    setToken(tokn);
  };

  useEffect(() => {
    getRefreshToken(setUN, setEm, setUID, setTOKEN);
  }, []);

  useEffect(() => {
    if (Token !== "") {
      Router.push("/auth/login");
    }
  }, []);

  const handleLogout = () => {
    /* localStorage.removeItem("loggedInUser");
    setEmail("");
    setUserId("");
    setUsername("");
    Router.push("/auth/login"); */
  };

  return (
    <>
      <authContext.Provider
        value={{
          username: username,
          email: email,
          userId: userId,
          token: token,
          setEmail: setEm,
          setUserId: setUID,
          setUsername: setUN,
          setToken: setTOKEN,
        }}
      >
        <div className="navlink">
          {!userId && (
            <>
              {" "}
              <Link
                href="/auth/login"
                className={`${
                  currentRoute === "/auth/login" ? "active" : "nonActive"
                }`}
              >
                {" "}
                Login{" "}
              </Link>
              <Link
                href="/auth/register"
                className={`${
                  currentRoute === "/auth/register" ? "active" : "nonActive"
                }`}
              >
                {" "}
                Register{" "}
              </Link>
            </>
          )}
          {userId && <button onClick={handleLogout}>LOGOUT</button>}
        </div>
        <ToastContainer position="top-center" />
        <Component {...pageProps} />
      </authContext.Provider>
    </>
  );
}
