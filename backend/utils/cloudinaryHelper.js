const cloudinary = require("cloudinary").v2;

async function uploadImage(filePath) {
  try {
    console.log("here");

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "blog app",
    });
    console.log("Cloudinary upload result:", result);


    return result;
  } catch (error) {
    console.log(error);
  }
}

async function deleteImagefromCloudinary(noteId) {
  try {
    await cloudinary.uploader.destroy(noteId);
  } catch (error) {
    console.log(error);
  }
}



module.exports = { uploadImage, deleteImagefromCloudinary };