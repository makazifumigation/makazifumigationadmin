import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

/**
 * Upload an image file to Firebase Storage
 * @param {File} file - The image file to upload
 * @param {string} folder - The folder path in storage (e.g., 'blogs', 'projects')
 * @returns {Promise<string>} - The download URL of the uploaded image
 */
export async function uploadImage(file, folder = "uploads") {
  if (!file) {
    throw new Error("No file provided");
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error("Image size must be less than 5MB");
  }

  // Generate unique filename
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileExtension = file.name.split(".").pop();
  const fileName = `${timestamp}_${randomString}.${fileExtension}`;
  const storageRef = ref(storage, `${folder}/${fileName}`);

  try {
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image. Please try again.");
  }
}

/**
 * Delete an image from Firebase Storage
 * @param {string} url - The download URL of the image to delete
 */
export async function deleteImage(url) {
  if (!url || !url.includes("firebasestorage.googleapis.com")) {
    // Not a Firebase Storage URL, skip deletion
    return;
  }

  try {
    // Extract the path from the URL
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/o\/(.+)\?/);
    
    if (pathMatch) {
      const filePath = decodeURIComponent(pathMatch[1]);
      const { deleteObject } = await import("firebase/storage");
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    // Don't throw - deletion failure shouldn't block the operation
  }
}

