const mongoose =require('mongoose')
const feedbackSchema =mongoose.Schema(
    {
        username:{type: String, required: true },
        feedback:{type: String, required: true },
        date:{type: Date, default: Date.now },
        productId:{type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },

        }
)