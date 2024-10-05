import { Account, Client, ID } from "appwrite";
import config from "../Config/config";

export class AuthService{
     client=new Client();
     account;

      constructor(){
        this.client
        .setEndpoint(config.appwriteUrl)
        .setProject(config.projectId);
    
        this.account=new Account(this.client);
      }

      async createAccount(name,email,password){
        try {
            const user=await this.account.create(ID.unique(),email,password,name);
            if(user){
                return this.login(email,password);
            }else{
                return user;
            }
        } catch (error) {
            console.log('account',error);
            throw error;
        }
      }

      async login(email,password){
        try {
           const result= await this.account.createEmailPasswordSession(email,password);
           return result;
        } catch (error) {
            console.log('authService',error);
            throw error;
        }
      }

      async guestLogin(){
        try {
          const result=await this.account.createAnonymousSession();
          return result;
        } catch (error) {
          console.log(error);
        }
      }

      async updateName(name){
        try {
          const result=await this.account.updateName(name);
          return result;
        } catch (error) {
          console.log(error);
        }
      }
      
      async convertGuest(email,password){
        try {
          const result= await this.account.updateEmail(email,password);
          return result;
        } catch (error) {
          console.log(error);
        }
      }

      async getUser(){
        try {
          return await this.account.get();
        } catch (error) {
          console.log(error);
        }
        return null;
      }

      async updatePassword(oldPass,newPass){
        try {
          const res=await this.account.get();
          console.log(res);
          const result= await this.account.updatePassword(newPass,oldPass);
          console.log(result);
          return result;
          
        } catch (error) {
          console.log('authService',error);
          throw error;
        }
      }


      async logout(){
        try {
          localStorage.removeItem('persist:auth'); // Clear the auth slice
          localStorage.removeItem('persist:db');
          return await this.account.deleteSession('current');
           
        } catch (error) {
          console.log(error)
        }
      }
}

const authService=new AuthService();

export default authService;