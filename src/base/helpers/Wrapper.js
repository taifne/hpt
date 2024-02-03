const express = require("express")
const { JsonWebTokenError, TokenExpiredError, NotBeforeError } = require("jsonwebtoken");
const ServiceException = require("@src/base/services/ServiceException");
const { HTTP_CODE, HTTP_REASON } = require("@src/base/enums/HttpStatus");

/**
 * 
 * @param {Error} error 
 * @param {express.Request} request
 * @param {express.Response} response
 * @param {express.NextFunction} next 
 */
const errorHandler = (error, request, response, next) => {
    const { stack } = error
    console.log(stack)

    if (error instanceof ServiceException) {
        const { httpStatus } = error
        const payload = {
            ...error,
            message: error.message
        }

        return response.status(httpStatus).send(payload)
    }

    if (error instanceof JsonWebTokenError || error instanceof NotBeforeError || error instanceof TokenExpiredError) {
        console.log("JWT");
        return response.status(HTTP_CODE.UNAUTHORIZED).send(
            ServiceException.builder(
                HTTP_CODE.UNAUTHORIZED,
                HTTP_CODE.UNAUTHORIZED,
                "Invalid token.",
                null,
                null
            )
        )
    }

    const exception = ServiceException.builder(
        HTTP_CODE.UNAUTHORIZED,
        HTTP_CODE.UNAUTHORIZED,
        HTTP_REASON.UNAUTHORIZED,
        null,
        null
    )

    response.status(exception.httpStatus).send(
        {
            ...exception,
            message: exception.message
        }
    )
}

const wrapperAsyncHandler = fn => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next)
        } catch (error) {
            next(error)
        }
    }
}

const wrapperSyncHandler = fn => {
    return (req, res, next) => {
        try {
            fn(req, res, next)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {
    errorHandler,
    wrapperSyncHandler,
    wrapperAsyncHandler,
}