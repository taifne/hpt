const { HTTP_CODE, HTTP_REASON } = require("@src/base/enums/HttpStatus");
const ServiceJsonResult = require("@src/base/services/ServiceJsonResult");
// const ServiceException = require("@src/base/services/ServiceException");
const bcrypt = require("bcryptjs");

const elasticClient = require("../databases/index")
class TaskService {
    /**
     * 
     * @returns Simple information
     */
    static createIndex = async (name, indexConfig) => {
        try {
            await elasticClient.client.indices.delete({ index: name })
        } catch (err) {
            // catch in case the index doesn't already exist
        }
        
        await elasticClient.client.indices.create({
            index: name,
            body: indexConfig,
        }).then(result => {
            return ServiceJsonResult.builder(
                HTTP_CODE.OK,
                HTTP_CODE.OK,
                { hit: { name: "thai tai" } },
                "Create new Index Success",
                {
                    address: "HPT HCM"
                }
            )
        })

    }

    static getIndex = async () => {

        const response = await elasticClient.client.search({
            index: 'huan1                                        '
        })
        return ServiceJsonResult.builder(
            HTTP_CODE.OK,
            HTTP_CODE.OK,
            response.hits,
            "Get info success",
            {
                address: "HPT HCM"
            }
        )
    }




}

module.exports = TaskService