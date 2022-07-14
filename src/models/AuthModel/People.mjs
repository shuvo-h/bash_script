import mongoose from "mongoose";

const peopleSchema = mongoose.Schema(
    {
        name:{
            type: String,
            require: true,
            trim: true,
        },
        email:{
            type: String,
            require: true,
            trim: true,
            lowercase: true

        },
        password:{
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

export const People = mongoose.model("People",peopleSchema);

