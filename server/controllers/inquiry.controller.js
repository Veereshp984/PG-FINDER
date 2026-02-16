import Inquiry from '../models/Inquiry.js';
import PG from '../models/PG.js';
import { validationResult } from 'express-validator';

export const createInquiry = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, message } = req.body;
    const { pgId } = req.params;

    // Check if PG exists
    const pg = await PG.findById(pgId);
    if (!pg) {
      return res.status(404).json({ message: 'PG not found' });
    }

    const inquiry = await Inquiry.create({
      pgId,
      userId: req.user.id,
      name,
      phone,
      message
    });

    await inquiry.populate('pgId', 'title');

    res.status(201).json(inquiry);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getInquiries = async (req, res) => {
  try {
    // Get PGs owned by the user
    const userPGs = await PG.find({ ownerId: req.user.id }).select('_id');
    const pgIds = userPGs.map(pg => pg._id);

    const inquiries = await Inquiry.find({ pgId: { $in: pgIds } })
      .populate('pgId', 'title photos')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    // Check if user owns the PG
    const pg = await PG.findById(inquiry.pgId);
    if (pg.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    inquiry.status = status;
    await inquiry.save();

    await inquiry.populate('pgId', 'title');

    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
