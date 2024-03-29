import Link from "next/link";
import Router, { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import authContext from "../CONTEXT/authContext";
import { useEffect, useState } from "react";
import useRefreshToken from "../CUSTOME-HOOKS/useRefreshToken";
import { AppProps } from "next/app";

interface customePageProps{
  
}

export interface ISetStateFunc {
  (val : string) : void
}
export default function App({ Component, pageProps } : AppProps<customePageProps>) {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [token, setToken] = useState<string>("");

  const { getRefreshToken, Token } = useRefreshToken();

  const router = useRouter();
  const currentRoute = router.pathname;

 

  const setUN : ISetStateFunc = (un ) => {
    setUsername(un);
  };

  const setEm : ISetStateFunc= (em) => {
    setEmail(em);
  };

  const setUID : ISetStateFunc = (uid) => {
    setUserId(uid);
  };

  const setTOKEN : ISetStateFunc = (tokn) => {
    setToken(tokn);
  };

  useEffect(() => {
    getRefreshToken(setUN, setEm, setUID, setTOKEN);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/cookies/remove`,
        {
          credentials: "include",
        },
      );

      if (response.status === 200) {
        setUserId("");
        setUsername("");
        setEmail("");
        setToken("");

        Router.push("/auth/login");
      }
    } catch (err) {
      if(err instanceof Error)
      {
        toast.error(err.message);
      }
      
    }
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
