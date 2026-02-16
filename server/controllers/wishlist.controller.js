import User from '../models/User.js';
import PG from '../models/PG.js';

export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'wishlist',
      populate: {
        path: 'ownerId',
        select: 'name phone'
      }
    });

    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { pgId } = req.params;

    // Check if PG exists
    const pg = await PG.findById(pgId);
    if (!pg) {
      return res.status(404).json({ message: 'PG not found' });
    }

    const user = await User.findById(req.user.id);

    // Check if already in wishlist
    if (user.wishlist.includes(pgId)) {
      return res.status(400).json({ message: 'PG already in wishlist' });
    }

    user.wishlist.push(pgId);
    await user.save();

    await user.populate({
      path: 'wishlist',
      populate: {
        path: 'ownerId',
        select: 'name phone'
      }
    });

    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { pgId } = req.params;

    const user = await User.findById(req.user.id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== pgId);
    await user.save();

    await user.populate({
      path: 'wishlist',
      populate: {
        path: 'ownerId',
        select: 'name phone'
      }
    });

    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
