import  React  from 'react';
import { routesDataType } from "./publicRoutes";

const MyOrders = React.lazy(()=>import("../views/pages/MyOrders/MyOrders"))
const ArticleInput = React.lazy(()=>import('../views/pages/ArticleInput/ArticleInput'))

export const privatePageName = {
    MyOrders: "MyOrders",
    ArticleInput: "ArticleInput"
}

export const privateRoutes: routesDataType = [
    {  name: privatePageName.MyOrders, path: "/my-order", Component: MyOrders },
    {  name: privatePageName.ArticleInput, path: "/my-order/new-order", Component: ArticleInput },
];