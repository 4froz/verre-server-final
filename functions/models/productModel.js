import mongoose from "mongoose";



const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
    },
    img: {
      type: [String],
      required: true,
    },
    inStock: { type: Boolean, required: true, default: true },

    price: { type: Number, required: true },
    discountPrice: { type: Number, required: false, default: 0 },


    bestSellers: {
      type: Boolean,
      default: false,
    },
   
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
