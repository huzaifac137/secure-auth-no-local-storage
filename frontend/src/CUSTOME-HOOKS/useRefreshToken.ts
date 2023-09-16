import { toast } from "react-toastify";
import { useState } from "react";
import { ISetStateFunc } from "../pages/_app";
import { IResponseData } from "../pages/auth/login";

interface getTokenFuncType {
  (setUsername :  ISetStateFunc ,setEmail :  ISetStateFunc , setUserId  :  ISetStateFunc , setToken :  ISetStateFunc) : Promise<void>
}

interface HookReturnType
{
  getRefreshToken : getTokenFuncType ,
     Token : typeof Token
}

let Token :string = "";
const useRefreshToken = () : HookReturnType   => {
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const getRefreshToken : getTokenFuncType = async (
    setUsername ,
    setEmail ,
    setUserId,
    setToken ,
  ) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/token/refresh`,
        {
          credentials: "include",
        },
      );

      const responseData : IResponseData = await response.json();

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
      if(err instanceof Error)
      {

      
      toast.error(err.message);
      setIsLoading(false);
      setEmail("");
      setUserId("");
      setUsername("");
      setToken("");
      }
    }

    console.log(Token);
    setIsLoading(false);
   
  };

  return { getRefreshToken, Token };
};

export default useRefreshToken;
