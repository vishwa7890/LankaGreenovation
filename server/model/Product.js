const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    images: [
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true }
  }
],
thumbnail: {
  url: { type: String, required: true },
  public_id: { type: String, required: true }
},
    price: { type: Number, required: true },
    shortDescription: { type: String, required: true },
    detailedDescription: { type: String, required: true },
    
    stockStatus: { 
        type: String, 
        enum: ['In Stock', 'Out of Stock', 'Limited Stock'], 
        default: 'In Stock' 
    },
    availablestock: { type: Number, required: true },

    // Add category field here
    category: { 
        type: String,
        enum: ['Food Product', 'Cosmetics','Biofertilizers'],
        required: true
    },

    specs: {
        itemForm: String,
        productBenefits: String,
        scent: String,
        skinType: String,
        netQuantity: String,
        numberOfItems: Number,
        recommendedUses: String,
        upc: String
    },
    technicalDetails: {
        manufacturer: String,
        countryOfOrigin: String,
        itemPartNumber: String,
        productDimensions: String,
        asin: String
    },
    additionalInfo: {
        itemWeight: String,
        itemDimensions: String,
        netQuantity: String,
        bestSellersRank: String,
        rankInFaceMasks: String
    },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
