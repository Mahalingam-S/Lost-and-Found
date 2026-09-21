const Item = require('../models/Item');
const { getIsConnected } = require('../config/db');

// In-memory items store fallback with initial seed data
const initialSeedItems = [
  {
    _id: 'item_1',
    title: 'Black Sony WH-1000XM4 Headphones',
    description: 'Black Sony wireless noise cancelling headphones found near the central library study desk on the 2nd floor.',
    category: 'Electronics',
    type: 'FOUND',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    location: 'Library 2nd Floor',
    date: '2026-09-20',
    userId: 'usr_demo_1',
    userName: 'Rahul Sharma',
    userPhone: '+91 9876543210',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000)
  },
  {
    _id: 'item_2',
    title: 'Student ID Card - CS Department',
    description: 'Student ID card belonging to Vikram Singh (Roll No: 2023CS1082) lost around Academic Block A cafeteria.',
    category: 'ID Cards',
    type: 'LOST',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    location: 'Academic Block A',
    date: '2026-09-21',
    userId: 'usr_demo_2',
    userName: 'Vikram Singh',
    userPhone: '+91 9812345678',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000)
  },
  {
    _id: 'item_3',
    title: 'Blue Leather Keychain with Bike Key',
    description: 'Yamaha bike key with a blue leather keychain found near the sports ground pavilion.',
    category: 'Keys',
    type: 'FOUND',
    image: 'https://images.unsplash.com/photo-1582142407894-ec85a1260aee?w=600&auto=format&fit=crop&q=80',
    location: 'Sports Ground',
    date: '2026-09-19',
    userId: 'usr_demo_3',
    userName: 'Ananya Verma',
    userPhone: '+91 9988776655',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000)
  },
  {
    _id: 'item_4',
    title: 'Scientific Calculator Casio fx-991EX',
    description: 'Black Casio scientific calculator left in Lecture Hall 3 after Mathematics lecture.',
    category: 'Electronics',
    type: 'LOST',
    image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80',
    location: 'Lecture Hall 3',
    date: '2026-09-18',
    userId: 'usr_demo_1',
    userName: 'Rahul Sharma',
    userPhone: '+91 9876543210',
    status: 'RESOLVED',
    createdAt: new Date(Date.now() - 72 * 3600 * 1000)
  }
];

const memoryItems = new Map();
initialSeedItems.forEach(item => memoryItems.set(item._id, item));

// GET /api/items
exports.getItems = async (req, res) => {
  try {
    const { search, type, category, status } = req.query;

    if (getIsConnected()) {
      let query = {};
      if (type) query.type = type.toUpperCase();
      if (category) query.category = category;
      if (status) query.status = status.toUpperCase();

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } }
        ];
      }

      const items = await Item.find(query).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: items.length, items });
    } else {
      let items = Array.from(memoryItems.values());

      if (type) {
        items = items.filter(i => i.type.toUpperCase() === type.toUpperCase());
      }
      if (category) {
        items = items.filter(i => i.category.toLowerCase() === category.toLowerCase());
      }
      if (status) {
        items = items.filter(i => i.status.toUpperCase() === status.toUpperCase());
      }
      if (search) {
        const q = search.toLowerCase();
        items = items.filter(i =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q)
        );
      }

      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.status(200).json({ success: true, count: items.length, items });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/items/my-posts
exports.getMyPosts = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (getIsConnected()) {
      const items = await Item.find({ userId }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: items.length, items });
    } else {
      const items = Array.from(memoryItems.values())
        .filter(i => i.userId === userId || i.userPhone === req.user.phone)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.status(200).json({ success: true, count: items.length, items });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/items/:id
exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const item = await Item.findById(id);
      if (!item) return res.status(404).json({ message: 'Item not found' });
      return res.status(200).json({ success: true, item });
    } else {
      const item = memoryItems.get(id);
      if (!item) return res.status(404).json({ message: 'Item not found' });
      return res.status(200).json({ success: true, item });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// POST /api/items
exports.createItem = async (req, res) => {
  try {
    const { title, description, category, type, image, location, date } = req.body;
    const user = req.user;

    if (!title || !description || !category || !type || !location || !date) {
      return res.status(400).json({ message: 'Missing required item fields' });
    }

    const newItemData = {
      title,
      description,
      category,
      type: type.toUpperCase(),
      image: image || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80',
      location,
      date,
      userId: user.userId,
      userName: user.name || 'Campus Student',
      userPhone: user.phone || '',
      status: 'ACTIVE',
      createdAt: new Date()
    };

    let item;
    if (getIsConnected()) {
      item = await Item.create(newItemData);
    } else {
      item = {
        _id: 'item_' + Date.now(),
        ...newItemData
      };
      memoryItems.set(item._id, item);
    }

    return res.status(201).json({ success: true, message: 'Item posted successfully', item });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// PUT /api/items/:id
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user.userId;
    const userPhone = req.user.phone;

    if (getIsConnected()) {
      let item = await Item.findById(id);
      if (!item) return res.status(404).json({ message: 'Item not found' });
      if (item.userId !== userId && item.userPhone !== userPhone) {
        return res.status(403).json({ message: 'Unauthorized to edit this item' });
      }
      item = await Item.findByIdAndUpdate(id, updates, { new: true });
      return res.status(200).json({ success: true, message: 'Item updated', item });
    } else {
      let item = memoryItems.get(id);
      if (!item) return res.status(404).json({ message: 'Item not found' });
      if (item.userId && item.userId !== userId && item.userPhone !== userPhone) {
        return res.status(403).json({ message: 'Unauthorized to edit this item' });
      }
      Object.assign(item, updates);
      memoryItems.set(id, item);
      return res.status(200).json({ success: true, message: 'Item updated', item });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// DELETE /api/items/:id
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userPhone = req.user.phone;

    if (getIsConnected()) {
      const item = await Item.findById(id);
      if (!item) return res.status(404).json({ message: 'Item not found' });
      if (item.userId !== userId && item.userPhone !== userPhone) {
        return res.status(403).json({ message: 'Unauthorized to delete this item' });
      }
      await Item.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: 'Item deleted' });
    } else {
      const item = memoryItems.get(id);
      if (!item) return res.status(404).json({ message: 'Item not found' });
      if (item.userId && item.userId !== userId && item.userPhone !== userPhone) {
        return res.status(403).json({ message: 'Unauthorized to delete this item' });
      }
      memoryItems.delete(id);
      return res.status(200).json({ success: true, message: 'Item deleted' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
