import User from '../models/User.js';
import PG from '../models/PG.js';
import Review from '../models/Review.js';
import Inquiry from '../models/Inquiry.js';

export const getAllPGs = async (req, res) => {
  try {
    const pgs = await PG.find()
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });
    res.json(pgs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await Review.findByIdAndDelete(req.params.id);

    // Update PG rating
    const reviews = await Review.find({ pgId: review.pgId });
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    await PG.findByIdAndUpdate(review.pgId, {
      avgRating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length
    });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPGs = await PG.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalInquiries = await Inquiry.countDocuments();

    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    const pgsByCity = await PG.aggregate([
      { $group: { _id: '$location.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const recentPGs = await PG.find()
      .populate('ownerId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalPGs,
        totalReviews,
        totalInquiries
      },
      usersByRole,
      pgsByCity,
      recentPGs
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
