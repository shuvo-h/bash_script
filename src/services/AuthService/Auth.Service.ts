import { LgoinType, LogOutType, RegistrationType, UserLoginType } from "../../types/userTypes";
import httpReq from "../http.services";

class MainAuthService {
    
    async login<GenericReturnType>(payload:LgoinType): Promise<GenericReturnType>{  // write the server data type
        const {data} = await httpReq.post("/auth/login", payload);
        return data;
    }
    async registerMember<T>(payload: RegistrationType): Promise<T>{  // write the server data type
        const {data} = await httpReq.post("/auth/registration", payload);
        return data;
    }
    
    async keepUserLogin():Promise<UserLoginType>{
        const {data} = await httpReq.get("/auth/onAuthStateChange");
        return data;
    }

    async logOut():Promise<LogOutType>{
        const {data} = await httpReq.get("/auth/logout");
        return data;
    }
    
    
}

const AuthService = new MainAuthService();

export default AuthService;