
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title:
    {
        type: String,
        required: true,
    },
    date:
    {
        type: String,
        required: true,
    },
    location:
    {
        type: String,
        required: true,
    },
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;