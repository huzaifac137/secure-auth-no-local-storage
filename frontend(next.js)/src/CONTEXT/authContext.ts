import React from "react";

const { createContext } = require("react");

interface IContext{
  username : string ,
  email : string ,
  userId : string ,
  token : string,
  setUsername : (val : string)=>void,
  setEmail : (val : string)=>void 
  setUserId : (val : string)=>void ,
  setToken : (val : string)=>void
}

const authContext = React.createContext<IContext>({
  username: "",
  email: "",
  userId: "",
  token: "",
  setUsername: () => {},
  setEmail: () => {},
  setUserId: () => {},
  setToken : ()=> {}
  
});

export default authContext;
