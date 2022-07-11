import { parabasedTitleType } from "../../types/videoTypes";
import httpReq from "../http.services";

type placeOrderBodyType = {
    textInfo:{mainTitle: string, all_para: parabasedTitleType[]},
    template:string
}


class MainVideoService {
    async  placeOrder(payload:placeOrderBodyType):Promise<any> {  // condition from backend that the array must be sent through "textInfo" object property
        const {data} = await httpReq.post("/video/order",payload)
        return data;
    }

    async  getAllVideoSummary():Promise<any> {  // condition from backend that the array must be sent through "textInfo" object property
        const {data} = await httpReq.get("/video/all/status")
        return data;
    }
}

const videoService = new MainVideoService();

export default videoService;




