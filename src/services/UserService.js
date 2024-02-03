const { HTTP_CODE, HTTP_REASON } = require("@src/base/enums/HttpStatus");
const ServiceJsonResult = require("@src/base/services/ServiceJsonResult");
// const ServiceException = require("@src/base/services/ServiceException");
const bcrypt =require("bcryptjs");
var fs = require("fs");
const elasticClient = require("../databases/index")
function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  let files_arr = [];
files_arr.push("/data/alert-goc.json");
files_arr.push("/data/alert_hsoc_dashboard.json");

async function createIndex() {
    // try {
    //   const x = await elasticClient.client.indices.create({
    //     index: 'test1',
    //     body: {
    //       mappings: {
    //         properties: {
    //           // Define your index properties here
    //         }
    //       }
    //     }
    //   });
    //   console.log(x);
    // } catch (error) {
    //   console.error(error);
    // }

    let result = {};
    await fs.readFile(files_arr[0], "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      result = JSON.parse(data);console.log(result);
    });
    while (result.hits === undefined) {
        await timeout(1000);
      }
      let total = result.hits.total.value;
      for (let i = 0; i < result.hits.hits.length; i++) {
        let item = result.hits.hits[i];
        let id = item._id;
        let index_name = item._index;
        let body = item._source;
        await elasticClient.client.index(
          {
            index: "dtt",
            id: id,
            body: body,
          }
        );
        console.log(i + " / " + total);
        await timeout(50);
      }
    
  }
  
  async function readIndex() {
    // try {
    //   const x = await elasticClient.client.indices.create({
    //     index: 'test1',
    //     body: {
    //       mappings: {
    //         properties: {
    //           // Define your index properties here
    //         }
    //       }
    //     }
    //   });
    //   console.log(x);
    // } catch (error) {
    //   console.error(error);
    // }

    let result = {};
    await fs.readFile(files_arr[1], "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      result = JSON.parse(data);console.log(result);
    });
    while (result.hits === undefined) {
        await timeout(1000);
      }
     return result.hits.hits[0];
  }
  

class ExampleService {
    /**
     * 
     * @returns Simple information
     */



    static getAllUsers=async()=> {
        let files_arr = [];
        files_arr.push("/");
        
     let reasul= await readIndex();
        return ServiceJsonResult.builder(
            HTTP_CODE.OK,
            HTTP_CODE.OK,
            {reasul},
            "Get info success",
            {
                address: "HPT HCM"
            }
        )
    }
   
    

    static updateUser=async(body)=> {
        const passwordR = body.passWord;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passwordR, salt);
        const newUser={...body,passwordR:hashedPassword,delete:body.passWord}

        const response = await elasticClient.client.update({
            index:'hungtest',
            id:body.id,
            doc:
                newUser
            
        })
        return ServiceJsonResult.builder(
            HTTP_CODE.OK,
            HTTP_CODE.OK,
            response.result,
            "Get info success",
            {
                address: "HPT HCM"
            }
        )
    }
}

module.exports = ExampleService