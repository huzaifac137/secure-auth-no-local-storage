import { toast } from "react-toastify";
import { useState } from "react";

const useRefreshToken = () => {
  const [isLoading, setIsLoading] = useState(false);

  let toastError = "";
  let Token = "";
  const getRefreshToken = async (
    setUsername,
    setEmail,
    setUserId,
    setToken,
  ) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/token/refresh`,
        {
          credentials: "include",
        },
      );

      const responseData = await response.json();

      if (response.status !== 200) {
        throw new Error(responseData.message);
      }

      console.log(responseData);

      setEmail(responseData.email);
      setUserId(responseData.userId);
      setUsername(responseData.username);
      setToken(responseData.token);
      Token = responseData.token;
    } catch (err) {
      toastError = err.message;
      setIsLoading(false);
      toast.error(err.message);
      setEmail("");
      setUserId("");
      setUsername("");
      setToken("");
    }

    console.log(Token);
    setIsLoading(false);
  };

  return { getRefreshToken, Token };
};

export default useRefreshToken;
