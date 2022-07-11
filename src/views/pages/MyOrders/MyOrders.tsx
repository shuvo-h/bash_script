import React, { useEffect, useState } from 'react';
import "./orderList.css";
import OrderListCard from '../../components/OrderCard/OrderListCard/OrderListCard';
import { NavLink } from 'react-router-dom';
import { privateRoutes } from '../../../routes/privateRoutes';
import videoService from '../../../services/videoService/video.Service';

export type orderListType = {
    encode_id?: string,
    video_id: String,
    video_title: String,
    video_size: number,
    encode_status: String,
    encode_message: string,
    order_date: String,
    expire_date: String,
    isExpire: boolean,
    download_uri?: String
}

const demoOrrderList = [
    {video_id:"dfh4yhbr6h", video_title:"video 1", video_size: 16, encode_status:"pending", encode_message:"",order_date:"12/07/2022",expire_date:"1625488",download_uri:"",isExpire:true},
    {video_id:"dfh4yhbh6h", video_title:"video 2", video_size: 14, encode_status:"done", encode_message:"",  order_date:"12/8/2022",expire_date:"1645566",download_uri:"",isExpire:false},
]

const MyOrders = () => {
    const [orderList, setOrderList] = useState<orderListType[]>([]);
    const newAddUri = privateRoutes.find(route=> route.name === "ArticleInput")?.path;

    // fetch the ordered videos info summary
    useEffect(()=>{
        
        const orderSummaryFn = async() => {
          const orderSummary=   await videoService.getAllVideoSummary();
           setOrderList(orderSummary)
        }
        orderSummaryFn();
        
    },[])
console.log(orderList);

    return (
        <section className='myorder_container' >
            <div className='new_order'>
                <div><NavLink className='btn_regular' style={{textDecoration:"none"}} to={newAddUri? newAddUri : "/"}>+ new</NavLink></div>
            </div>
            <div>
                {
                    orderList.length > 0 ? <div className='orderList_card orderList_card_title'>
                            <div className='title_search_wrapper'> <input type="text" placeholder='Search by title' /></div>
                            <div>Video ID</div>
                            <div>Status</div>
                            <div>Order Place</div>
                            <div>Expire on</div>
                            <div>Size (MB)</div>
                            <div>Download</div>
                        </div>
                    : <div><h2 style={{textAlign:"center"}}>You have not ordered any video!</h2></div>
                }
                
            </div>
            <div>
                {
                    orderList.map((order,idx) =><OrderListCard order={order} key={ idx + "orderList"}></OrderListCard>)
                }
            </div>
        </section>
    );
};

export default MyOrders;