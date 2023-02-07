const { createContext } = require("react");

const authContext = createContext({
  username: "",
  email: "",
  userId: "",
  token: "",
  setUsername: () => {},
  setEmail: () => {},
  setUserId: () => {},
  setToken: () => {},
});

export default authContext;
