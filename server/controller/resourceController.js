export const uploadResources = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.json({ success: false, message: 'No files uploaded' });
    }

    const fileUrls = req.files.map(file => ({
      url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
      name: file.originalname,
    }));

    res.json({ success: true, files: fileUrls });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};