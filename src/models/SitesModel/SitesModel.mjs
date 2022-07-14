import mongoose from "mongoose";

const SitesSchema = mongoose.Schema(
    {
        token:{
            type: String,
            require: true
        },
        site_id:{
            type: Number,
            require: true
        },
        domain_url:{
            type: String,
            require: true
        },
        title:{
            type: String,
            require: true
        },
        user_id:{
            type: Number,
            require: true
        }
    },
    {
        timestamps: { createdAt: true, updatedAt: false }
    }
)

export const SitesModel = mongoose.model("Sites",SitesSchema);

