import Listing from "../models/listing.model.js";
export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create({
      ...req.body,
      userRef: req.user.id,
    });

    res.status(201).json({
      success: true,
      listing,
    });
  } catch (error) {
    next(error);
  }
};
