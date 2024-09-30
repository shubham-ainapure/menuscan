const config={
    appwriteUrl:String(import.meta.env.VITE_APPWRITE_ENDPOINT),
    projectId:String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    databaseId:String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    restaurantCollection:String(import.meta.env.VITE_APPWRITE_RESTAURANT_COLLECTION_ID),
    categoriesCollection:String(import.meta.env.VITE_APPWRITE_CATEGORIES_COLLECTION_ID),
    disheshCollection:String(import.meta.env.VITE_APPWRITE_DISHESH_COLLECTION_ID),
    bucketId:String(import.meta.env.VITE_APPWRITE_BUCKET_ID)
}

export default config