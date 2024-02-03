const express = require("express")
const { HTTP_CODE, HTTP_REASON } = require("@src/base/enums/HttpStatus")

class ServiceJsonResult {

    /**
     * Creates a new instance of a json response.
     *
     * @param {number} httpStatus - The HTTP status code of the response.
     * @param {string | number} code - The custom response code.
     * @param {any} payload - The payload data associated with the response.
     * @param {string} message - A message describing the response.
     * @param {any} meta - Additional metadata for the response.
     */
    constructor(httpStatus, code, payload, message, meta) {
        this.error = false
        this.success = true
        this.code = code
        this.httpStatus = httpStatus
        this.message = message
        this.payload = payload
        this.meta = meta
    }

    /**
     * Builder a json response.
     *
     * @param {number} httpStatus - The HTTP status code of the response.
     * @param {string | number} code - The custom response code.
     * @param {any} payload - The payload data associated with the response.
     * @param {string} message - A message describing the response.
     * @param {any} meta - Additional metadata for the response.
     */

    static builder(httpStatus = HTTP_CODE.OK, code = HTTP_CODE.OK, payload, message = HTTP_REASON.OK, meta) {
        return new ServiceJsonResult(httpStatus, code, payload, message, meta)
    }

    /**
     * Send the response object to an Express.js response and set the provided HTTP headers.
     *
     * @param {express.Response} response - The Express.js response object to send the response to.
     * @param {object} header - Optional HTTP headers to set for the response.
     */
    send(response, header) {
        if (header) {
            response.header(header)
        }
        response.status(this.httpStatus).json(this)
    }
}

module.exports = ServiceJsonResult