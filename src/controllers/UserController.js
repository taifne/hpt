const UserService = require("@services/UserService");
const express = require("express")
const Joi = require('joi');


class UserController {
    /**
     * 
     * @param {express.Request} request 
     * @param {express.Response} response 
     */
    static getAllUsers=async(request, response)=> {
        const { query } = request
        const schema = Joi.object(
            {
                id: Joi.string().required()
            }
        )

        //Validation request
        schema.validate(query)

        ;(await UserService.getAllUsers()).send(response)
    }

    
  

    static updateUser=async(request, response)=> {
        const  body  = request.body
        const schema = Joi.object(
            {
                body: Joi.string().required()
            }
        )

        //Validation request
        schema.validate(body)
        ;(await UserService.updateUser(body)).send(response)
    }
    

}

module.exports = UserController