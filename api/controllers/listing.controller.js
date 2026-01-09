import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const uploadListingImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    const images = req.files
      .map((f) => f.path || f.location || f.secure_url || f.url)
      .filter(Boolean);

    res.status(200).json({ success: true, images });
  } catch (error) {
    next(error);
  }
};

export const createListing = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      userRef: req.user.id,
      type: req.body.type, 
    };

    if (req.files && req.files.length > 0) {
      payload.images = req.files
        .map((f) => f.path || f.location || f.secure_url || f.url)
        .filter(Boolean);
    } else if (req.body.images) {
      try {
        payload.images =
          typeof req.body.images === "string"
            ? JSON.parse(req.body.images)
            : req.body.images;
      } catch (err) {
        payload.images = req.body.images;
      }
    }

    const listing = await Listing.create(payload);

    res.status(201).json({
      success: true,
      listing,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }
    if (listing.userRef.toString() !== req.user.id) {
      return next(errorHandler(401, "You can delete only your own listing"));
    }
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }
    if (listing.userRef.toString() !== req.user.id) {
      return next(errorHandler(401, "You can update only your own listing"));
    }

    const payload = {
      ...req.body,
      type: req.body.type ?? listing.type, // keep old type if not provided
    };

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Listing updated successfully",
      listing: updatedListing,
    });
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    res.status(200).json({
      success: true,
      listing,
    });
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    const filters = {
      ...(req.query.type && { type: req.query.type }),
      ...(req.query.offer && { offer: req.query.offer === "true" }),
      ...(req.query.furnished && { furnished: req.query.furnished === "true" }),
      ...(req.query.parking && { parking: req.query.parking === "true" }),
      ...(req.query.search && {
        name: { $regex: req.query.search, $options: "i" },
      }),
    };

    const listings = await Listing.find(filters)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    res.status(200).json({
      success: true,
      count: listings.length,
      listings,
    });
  } catch (error) {
    next(error);
  }
};
