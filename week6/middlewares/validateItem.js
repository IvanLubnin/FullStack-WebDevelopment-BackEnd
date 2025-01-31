const Joi = require('joi');
const Item = require('../models/item');

// validation of object item
const itemSchema = Joi.object({
    title: Joi.string().min(1).required(),
    date: Joi.string().min(1).required(),
    location: Joi.string().min(1).required(),
});

// controller for new element
const createItem = async (req, res) =>
    {
    try {
        // validation of the request body
        const { error } = itemSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // creating new element and saving it it DB
        const item = new Item(req.body);
        const savedItem = await item.save();

        // answer with element
        res.status(201).json(savedItem);
    }
    catch (error)
    {
        console.error('Error creating item:', error);
        res.status(500).json({ error: 'Failed to create item' });
    }
};

module.exports = createItem;
