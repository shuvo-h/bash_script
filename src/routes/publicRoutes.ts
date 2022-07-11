import React ,{ FunctionComponent } from "react";

const Home = React.lazy(()=> import("../views/pages/Home/Home"));
const NotFound = React.lazy(()=>import("../views/components/sharedComponents/NotFound"))
const Login = React.lazy(()=>import("../views/components/LoginOutComponents/login/Login"))
const RegistrationForm = React.lazy(()=>import("../views/components/LoginOutComponents/login/RegistrationForm"))

export type routesDataType = {
    name: string
    path: string
    Component: FunctionComponent
}[];

export const publicRoutes: routesDataType = [
    {  name: "home", path: "/", Component: Home },
    {  name: "login", path: "/login",  Component: Login },
    {  name: "Registration", path: "/registration",  Component: RegistrationForm },
    {  name: "NotFound", path: "*",  Component: NotFound },
];