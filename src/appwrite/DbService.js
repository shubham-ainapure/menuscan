import { Client, Databases, ID, Query, Storage } from "appwrite";
import config from "../Config/config";

export class DbService{
   client=new Client();
   database;
   bucket;
    constructor(){
        this.client
        .setEndpoint(config.appwriteUrl)
        .setProject(config.projectId);

        this.database=new Databases(this.client);
        this.bucket=new Storage(this.client)
    }

    async createRestaurant(name,contact,address,userId){
        try {
            return await this.database.createDocument(
                config.databaseId,
                config.restaurantCollection,
                ID.unique(),
                {
                    name,
                    contact,
                    address,
                    userId
                }
            )
        } catch (error) {
            console.log(error);
            throw error; 
        }
    }

    async createCategory(name,restaurantId){
        try {
            return await this.database.createDocument(
                config.databaseId,
                config.categoriesCollection,
                ID.unique(),
                {
                    name,
                    restaurantId
                }
            )
        } catch (error) {
            console.log(error);
        }
    }

    async createMenu({name,description,price,imageId,veg,categoryId,restaurantId}){
        try {
            return await this.database.createDocument(
                config.databaseId,
                config.disheshCollection,
                ID.unique(),
                {
                    name,
                    description,
                    price,
                    imageId,
                    veg,
                    categoryId,
                    restaurantId
                }
            )
        } catch (error) {
            console.log(error)
        }
    }

    async updateRestaurant(docId,{name,contact,address}){
        try {
            return await this.database.updateDocument(
                config.databaseId,
                config.restaurantCollection,
                docId,
                {
                    name,
                    contact,
                    address
                }
            )
        } catch (error) {
            console.log(error);
        }
    }

    async updateCategory(docId,name){
        try {
            return await this.database.updateDocument(
                config.databaseId,
                config.categoriesCollection,
                docId,
                {
                    name
                }
            )       
        } catch (error) {
            console.log(error)
        }
    }

    async updateMenu(docId,{name,description,price,imageId,veg}){
        try {
            return await this.database.updateDocument(
                config.databaseId,
                config.disheshCollection,
                docId,
                {
                  name,
                  description,
                  price,
                  imageId,
                  veg
                }
            )
        } catch (error) {
            console.log(error);
        }
    }

    async deleteCategory(docId){
        try {
             await this.database.deleteDocument(
                config.databaseId,
                config.categoriesCollection,
                docId
            )
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async deleteRestaurant(docId){
        try {
            return await this.database.deleteDocument(
                config.databaseId,
                config.restaurantCollection,
                docId
            )
        } catch (error) {
            console.log(error);
        }
    }
    
    async deleteMultipleDish(documentIds){
        try {
            for (const documentId of documentIds){
               await this.database.deleteDocument(
                config.databaseId,
                config.disheshCollection,
                documentId
               )
            }
        } catch (error) {
            console.log('deleteMultipleDish',error);
        }
    }

    async deleteDish(docId){
        try {
            return await this.database.deleteDocument(
                config.databaseId,
                config.disheshCollection,
                docId
            )
        } catch (error) {
            console.log(error);
        }
    }

    async uploadImg(img){
        try {
            return await this.bucket.createFile(
                config.bucketId,
                ID.unique(),
                img
            )           
        } catch (error) {
            console.log(error);
        }
    }

    async getRestaurant(docId){
        try {
            return await this.database.getDocument(
                config.databaseId,
                config.restaurantCollection,
                docId
            )
        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async getCategory(docId){
        try {
            return await this.database.getDocument(
                config.databaseId,
                config.categoriesCollection,
                docId
            )
        } catch (error) {
            console.log(error)
        }
    }

    async getDishesh(categoryId){
        try {
            return await this.database.listDocuments(
                config.databaseId,
                config.disheshCollection,
                [Query.equal('categoryId',categoryId)]
            )
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async getAllDish(restaurantId){
        try {
            return await this.database.listDocuments(
                config.databaseId,
                config.disheshCollection,
                [Query.equal('restaurantId',restaurantId)]
            )
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async getRestaurantList(userId){
        try {
            return await this.database.listDocuments(
                config.databaseId,
                config.restaurantCollection,
              [Query.equal('userId', userId)]
            )
        } catch (error) {
            console.log(error);
        }
    }

    async getCategoryList(restaurantId){
        try {
            return await this.database.listDocuments(
                config.databaseId,
                config.categoriesCollection,
                [Query.equal('restaurantId',restaurantId)]
            )
        } catch (error) {
            console.log(error);
        }
    }
}

const dbService=new DbService();

export default dbService