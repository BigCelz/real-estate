import User from "../models/user.model.js";

export const test = (req, res) => {
  res.json({ message: "User controller is working" });
};

export const UploadProfilePic = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Cloudinary URL
    user.avatar = req.file.path;
    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("UploadProfilePic error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
