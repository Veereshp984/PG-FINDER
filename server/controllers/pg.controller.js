import PG from '../models/PG.js';
import Review from '../models/Review.js';
import { validationResult } from 'express-validator';

export const getPGs = async (req, res) => {
  try {
    const {
      search,
      city,
      sharing,
      minPrice,
      maxPrice,
      gender,
      minRating,
      amenities,
      lat,
      lng,
      radius = 10,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    const query = { isActive: true };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // City filter
    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }

    // Gender filter
    if (gender) {
      query.genderAllowed = gender;
    }

    // Rating filter
    if (minRating) {
      query.avgRating = { $gte: parseFloat(minRating) };
    }

    // Sharing type filter
    if (sharing) {
      const sharingTypes = sharing.split(',').map(s => parseInt(s));
      query['sharingTypes.type'] = { $in: sharingTypes };
    }

    // Price filter
    if (minPrice || maxPrice) {
      query['sharingTypes.price'] = {};
      if (minPrice) query['sharingTypes.price'].$gte = parseInt(minPrice);
      if (maxPrice) query['sharingTypes.price'].$lte = parseInt(maxPrice);
    }

    // Amenities filter
    if (amenities) {
      const amenityList = amenities.split(',');
      query.amenities = { $all: amenityList };
    }

    // Geospatial query
    if (lat && lng) {
      query['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius) * 1000 // Convert to meters
        }
      };
    }

    const sortOptions = {};
    sortOptions[sortBy] = order === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const pgs = await PG.find(query)
      .populate('ownerId', 'name phone')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await PG.countDocuments(query);

    res.json({
      pgs,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPGById = async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id)
      .populate('ownerId', 'name phone email');

    if (!pg) {
      return res.status(404).json({ message: 'PG not found' });
    }

    res.json(pg);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createPG = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const pgData = {
      ...req.body,
      ownerId: req.user.id
    };

    // Add uploaded photos
    if (req.files && req.files.length > 0) {
      pgData.photos = req.files.map(file => file.path);
    }

    const pg = await PG.create(pgData);
    res.status(201).json(pg);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updatePG = async (req, res) => {
  try {
    let pg = await PG.findById(req.params.id);

    if (!pg) {
      return res.status(404).json({ message: 'PG not found' });
    }

    // Check ownership or admin
    if (pg.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updateData = { ...req.body };

    // Add new uploaded photos
    if (req.files && req.files.length > 0) {
      const newPhotos = req.files.map(file => file.path);
      updateData.photos = [...(pg.photos || []), ...newPhotos];
    }

    pg = await PG.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(pg);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deletePG = async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);

    if (!pg) {
      return res.status(404).json({ message: 'PG not found' });
    }

    // Check ownership or admin
    if (pg.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await PG.findByIdAndDelete(req.params.id);
    await Review.deleteMany({ pgId: req.params.id });

    res.json({ message: 'PG deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMyListings = async (req, res) => {
  try {
    const pgs = await PG.find({ ownerId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(pgs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const removePhoto = async (req, res) => {
  try {
    const { photoUrl } = req.body;
    const pg = await PG.findById(req.params.id);

    if (!pg) {
      return res.status(404).json({ message: 'PG not found' });
    }

    if (pg.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    pg.photos = pg.photos.filter(photo => photo !== photoUrl);
    await pg.save();

    res.json(pg);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
