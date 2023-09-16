import authContext from "../CONTEXT/authContext";
import useRefreshToken from "../CUSTOME-HOOKS/useRefreshToken";
import Router from "next/router";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Home() {

  interface IUser
  {
    id : string ,
    email :string ,
    username : string
  }
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<IUser[] | []>([]);
  const context = useContext(authContext);

  useEffect(() => {
    if (context.token === "") {
      Router.push("/auth/login");
    } else {
      handleGetUsers();
    }

    return ()=>{
      setUsers([]);
    }
  }, []);

  const handleGetUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`,
        {
          headers: {
            Authorization: `mjfcmjbl${context.token}`,
          },
          // credentials: "include",
        },
      );

      const responseData = await response.json();

      if (response.status !== 200) {
        throw new Error(responseData.message);
      }
      console.log(responseData.users);
      setUsers(responseData.users);
    } catch (err) {
      
      if(err instanceof Error)
      {toast.error(err.message);
      setIsLoading(false);
    }
    }

    setIsLoading(false);
  };

  return (
    <>
      <h1>HOME PAGE INDEX.JS</h1>

      {isLoading === true && <h2>LOADING...</h2>}
      {users.length === 0 ? (
        <h2>NO users found!</h2>
      ) : (
        users?.map((user) => (
          <div key={user.id}>
            <h1 style={{ margin: "30px auto" }}>username : {user.username}</h1>
            <h2>email : {user.email} </h2>
          </div>
        ))
      )}
    </>
  );
}
