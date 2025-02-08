

  
  const cloudinary = require("cloudinary").v2;
  
  async function cloudinaryConfig() {
	try {
	  await cloudinary.config({
		cloud_name: process.env.CLOUD_NAME,
		api_key: process.env.API_KEY,
		api_secret: process.env.API_SECRET,
	  });
	  console.log("cloudinary configuration successfull");
	} catch (error) {
	  console.log("error aa gaya while config cloudinary");
	  console.log(error);
	}
  }
  
  module.exports = cloudinaryConfig;

