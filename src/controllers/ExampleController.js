const ExampleService = require("@services/ExampleService");
const express = require("express")
const Joi = require('joi');


class ExampleController {
    /**
     * 
     * @param {express.Request} request 
     * @param {express.Response} response 
     */
    static get(request, response) {
    
  
        ExampleService.get().send(response)
    }
}

module.exports = ExampleController