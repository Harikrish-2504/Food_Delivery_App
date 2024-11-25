const cloudinary = require('cloudinary')

cloudinary.config({
    cloud_name: "deegjzwap",
    api_key: "264577128132649",
    api_secret: "-SBH3g62F5bpjZwiDe5z_MPM4yw",
})

const imageUploadController = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.files.image.path)
        res.json({
            url: result.secure_url,
            public_id: result.piblic_id,
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = { imageUploadController };