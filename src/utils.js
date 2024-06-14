// src/utils.js

// Function to convert a name to URL-friendly format
export const formatForURL = (name) => {
    return name.replace(/\s+/g, '');
  };
  
  // Function to convert URL-friendly format back to the original name with spaces
  export const decodeFromURL = (urlName, collection) => {
    // Retrieve the original name from Firestore based on the URL-friendly name
    const originalDoc = collection.find(doc => formatForURL(doc.name) === urlName);
    return originalDoc ? originalDoc.name : null;
  };