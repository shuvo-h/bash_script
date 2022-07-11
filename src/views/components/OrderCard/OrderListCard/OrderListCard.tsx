import React, { useState } from 'react';
import axios from "axios"
import "../../../pages/MyOrders/orderList.css";
import { orderListType } from '../../../pages/MyOrders/MyOrders';

type OrderListCardPropsType = {
    order: orderListType
}

const OrderListCard = ({order}:OrderListCardPropsType) => {
    const  {video_id, video_title, video_size, encode_status, order_date,expire_date,download_uri,isExpire} = order;
    const [errorToolTip,setErrorToolTip] = useState<String | null>(null);

    // download a video
    const handleDownload = async(encodeID: string | undefined) =>{
        try {
            if (encodeID) {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_BASE_URL}/video/download?encode_id=${encodeID}`, { responseType: 'blob', withCredentials: true });
                if (response.data.error) {
                console.error(response.data.error)
                }
        
                const fileURL = window.URL.createObjectURL(new Blob([response.data]));
                const fileLink = document.createElement('a');
                fileLink.href = fileURL;
                const fileName = response.headers['content-disposition'].substring(22, response.headers['content-disposition'].length-1);;
                // const fileName = response.headers['content-disposition'].split("filename=")[1];
                fileLink.setAttribute('download', `${fileName}.mp4`);
                fileLink.setAttribute('target', '_blank');
                document.body.appendChild(fileLink);
                fileLink.click();
                fileLink.remove();

                console.log(fileName);
                
                
            }
        
        } catch (error) {
            console.log(error);
            
        }


    }
    return (
        <div className='orderList_card'>
            <div>{video_title}</div>
            <div>{video_id}</div>
            <div onMouseEnter={()=>setErrorToolTip(video_id)} onMouseLeave={()=>setErrorToolTip(null)} style={{position:"relative", cursor:"pointer"}}>
                {errorToolTip === video_id && <div style={{position:"absolute", top:"-15px", backgroundColor:"lightgray", padding:"0 5px", borderRadius:"5px", width:"max-content"}}>{order.encode_message}</div>}
                {encode_status}
            </div>
            <div>{order_date}</div>
            <div>{expire_date}</div>
            <div>{ video_size ?  (video_size / (1024*1024)).toFixed(2) : 0}</div>
            <div>
                {
                    (isExpire || !video_size) ? <button className='btn_regular' style={{pointerEvents:"none", backgroundColor:"rgba(255, 153, 153,0.9)"}} disabled>Download</button>
                    : <button className='btn_regular' onClick={()=>handleDownload(order.encode_id)} >Download</button>
                }
            </div>
        </div>
    );
};

export default OrderListCard;