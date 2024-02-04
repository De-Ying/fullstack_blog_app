import axios from "axios";

export const uploadImage = async (img) => {
  try {
    const serverDomain = import.meta.env.VITE_SERVER_API;
    
    // Send a GET request to get the upload URL from the server
    const response = await axios.get(`${serverDomain}/site/s3Url`);
    const { uploadURL } = response.data;

    // Send a PUT request to upload an image to the URL that was received
    await axios.put(uploadURL, img, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Returns the uploaded image URL
    return uploadURL.split("?")[0];
  } catch (error) {
    console.error("Error uploading image:", error);
    return null; 
  }
};

