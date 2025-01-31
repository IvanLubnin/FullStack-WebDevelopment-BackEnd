const Item = require('../models/item');

// GET /items
const getAllItems = async (req, res) =>
{
    try
    {
        const query = {};
        if (req.query.title) query.title = req.query.title;
        if (req.query.date) query.date = { $gte: new Date(req.query.date) };
        if (req.query.location) query.location = req.query.location;

        const items = await Item.find(query);
        res.json(items);
    }
    catch (error)
    {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Error fetching items' });
    }
};

// GET /items/id
const getItemById = async (req, res) =>
{
    try
{
        const { id } = req.params;
        const item = await Item.findById(id);

        if (!item)
        {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(item);
    } catch (error)
    {
        console.error('Error fetching item:', error);
        res.status(500).json({ error: 'Error fetching item' });
    }
};

// POST /items
const createItem = async (req, res) =>
{
    try
    {
        const { title, date, location } = req.body;

        if (!title || !date || !location)
        {
            return res.status(400).json({ error: 'Missing required fields: title, date, or location' });
        }

        const newItem = new Item({
            title,
            date,
            location,
        });
        await newItem.save();

        res.status(201).json(newItem); // Return the newly created item
    }
    catch (error)
    {
        console.error('Error adding item:', error);
        res.status(500).json({ error: 'Error adding item' });
    }
};

// PUT /items/id
const updateItem = async (req, res) =>
{
    try {
        const { id } = req.params;
        const { title, date, location } = req.body;

        if (!title || !date || !location)
        {
            return res.status(400).json({ error: 'Missing required fields: title, date, or location' });
        }

        const updatedItem = await Item.findByIdAndUpdate(
            id,
            { title, date, location },
            { new: true, runValidators: true }
        );

        if (!updatedItem)
        {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.status(200).json({ message: 'Item updated successfully', item: updatedItem });
    }
    catch (error)
    {
        console.error('Error updating item:', error);
        res.status(500).json({ error: 'Error updating item' });
    }
};

// DELETE /items/id
const deleteItem = async (req, res) =>
{
    try
{
        const { id } = req.params;

        const deletedItem = await Item.findByIdAndDelete(id);

        if (!deletedItem)
        {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json({ message: 'Item deleted' });
    }
    catch (error)
    {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Error deleting item' });
    }
};

module.exports =
{
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
};
