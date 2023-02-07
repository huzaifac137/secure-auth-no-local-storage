import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import Router from "next/router";
import authContext from "@/CONTEXT/authContext";
export default function Register() {
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

      const responseData = await response.json();

      if (response.status !== 201) {
        throw new Error(responseData.message);
      }

      toast.success(responseData.message);
    } catch (err) {
      toast.error(err.message);
      setIsLoading(false);
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
