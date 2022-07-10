import mongoose from "mongoose";

const videoConvertResultSchema = mongoose.Schema(
    {
        user_id:{
            type: Number,
            require: true,
        },
        video_id:{
            type: Number,
            require: true,
        },
        encode_id:{
            type: String,
            require: true,
        },
        video_title:{
            type: String,
            require: true,
        },
        video_size:{
            type: Number
        },
        encode_date:{
            type: String,
            require: true,
        },
        encode_status:{
            type: String,
            require: true,
        },
        encode_message:{
            type: String,
            require: true,
        },
        

    },
    {
        timestamps:{createAt: true, updateAt: false}
    }
)

export const videoConvertResultModel = mongoose.model("ConvertResult",videoConvertResultSchema);


