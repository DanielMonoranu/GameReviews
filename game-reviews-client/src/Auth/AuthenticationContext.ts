import React from "react";
import { claim } from "./auth.models";


//through this context we can access the claims from anywhere in the application and update them 
const AuthenticationContext = React.createContext<{
    claims: claim[];
    update(claimse: claim[]): void;
}>({ claims: [], update: () => { } }); // default value


export default AuthenticationContext;