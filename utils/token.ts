import { jwtDecode } from "jwt-decode";

export function GetToken():any{
    if(typeof window !== "undefined" ){
        
        const token = localStorage.getItem("access")
        return  token && jwtDecode(token)
    }
    return ""
}