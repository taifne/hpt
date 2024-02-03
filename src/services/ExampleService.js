const { HTTP_CODE, HTTP_REASON } = require("@src/base/enums/HttpStatus");
const ServiceJsonResult = require("@src/base/services/ServiceJsonResult");
// const ServiceException = require("@src/base/services/ServiceException");

class ExampleService {
    /**
     * 
     * @returns Simple information
     */
    static get() {

        //Logic query database

        // throw ServiceException.builder(
        //     HTTP_CODE.NOT_ACCEPTABLE,
        //     HTTP_CODE.NOT_ACCEPTABLE,
        //     HTTP_REASON.NOT_ACCEPTABLE,
        //     null,
        //     null
        // )

        return ServiceJsonResult.builder(
            HTTP_CODE.OK,
            HTTP_CODE.OK,
            {
                name: "R&D",
                location: "HCM"
            },
            "Get info success",
            {
                address: "HPT HCM"
            }
        )
    }
}

module.exports = ExampleService