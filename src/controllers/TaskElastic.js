// @ts-ignore
const TaskService = require("@services/TaskElastic");
const UserService = require("@services/UserService");
const express = require("express")
// @ts-ignore
const Joi = require('joi');


class TaskController {
    /**
     * 
     * @param {express.Request} request 
     * @param {express.Response} response 
     */
    // @ts-ignore
    static createIndex=async(request, response)=> {
  
          
       
        // @ts-ignore
        (await TaskService.createIndex("DTT-index",{})).send(response);

    }
    static getIndex=async(request, response)=> {
  
        ;(await UserService.getAllUsers()).send(response)
    }

     
    
  



}

module.exports = TaskController