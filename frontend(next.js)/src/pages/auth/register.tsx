import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import Router from "next/router";
import authContext from "../../CONTEXT/authContext";
import { EventType } from "./login.jsx";
export default function Register() {

  interface IResponseData {
    message :string
  }
  const [responseMsg, setResponseMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [USERNAME, setUsername] = useState("");
  const [PASSWORD, setPassword] = useState("");
  const [EMAIL, setEmail] = useState("");

  const context = useContext(authContext);

  useEffect(() => {
    if (context.token !== "") {
      Router.push("/");
    }
  }, [context.token]);

  const usernameChangeHandler  = (e : EventType) => {
    setUsername(e.target.value);
  };

  const emailChangeHandler  = (e : EventType) => {
    setEmail(e.target.value);
  };

  const passwordChangeHandler  = (e : EventType) => {
    setPassword(e.target.value);
  };
  const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const signupData = {
      username: USERNAME,
      email: EMAIL,
      password: PASSWORD,
    };

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(signupData),
        },
      );

      const responseData :IResponseData  = await response.json();

      if (response.status !== 201) {
        throw new Error(responseData.message);
      }

      toast.success(responseData.message);
    } catch (err) {
      if(err instanceof Error)
     { toast.error(err.message);
      setIsLoading(false);
    }
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="auth">
      {isLoading ? (
        <h2>LOADING...</h2>
      ) : (
        <>
          {" "}
          <h3> CREATE A NEW ACCOUNT </h3>
          <input
            type="text"
            placeholder="USERNAME"
            value={USERNAME}
            onChange={usernameChangeHandler}
          />
          <input
            type="text"
            placeholder="EMAIL"
            value={EMAIL}
            onChange={emailChangeHandler}
          />
          <input
            type="password"
            placeholder="PASSWORD"
            value={PASSWORD}
            onChange={passwordChangeHandler}
          />
          <button className="btn" style={{ cursor: "pointer" }}>
            {" "}
            Sign up{" "}
          </button>
        </>
      )}
    </form>
  );
}
