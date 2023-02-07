import authContext from "@/CONTEXT/authContext";
import Router from "next/router";
import { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
export default function Login() {
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

  const usernameChangeHandler = (e) => {
    setUsername(e.target.value);
  };

  const emailChangeHandler = (e) => {
    setEmail(e.target.value);
  };

  const passwordChangeHandler = (e) => {
    setPassword(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      email: EMAIL,
      password: PASSWORD,
    };

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(loginData),
        },
      );

      const responseData = await response.json();

      if (response.status !== 201) {
        throw new Error(responseData.message);
      }

      const uid = responseData.userId;
      const usernamee = responseData.username;
      const emaill = responseData.email;
      const tokenn = responseData.token;

      toast.success(responseData.message);
      context.setEmail(emaill);
      context.setUserId(uid);
      context.setUsername(usernamee);
      context.setToken(tokenn);

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          userId: uid,
          email: emaill,
          username: usernamee,
        }),
      );

      Router.push("/");
    } catch (err) {
      setIsLoading(false);
      toast.error(err.message);
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
          <h3> Login into your account </h3>
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
          <button className="btn"> Login </button>
        </>
      )}
    </form>
  );
}
