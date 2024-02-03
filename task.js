
var fs = require("fs");
const { Client } = require('@elastic/elasticsearch');

const LOCAL_INDEX="siem-signals-data-demo";
const DB_INDEX="fe_hsoc_alert_demo_2023.11";
let lastCheckedTimestamp = null;
let maxRow = 2;
let currentLength = 2;
const client = new Client({
    node: "http://localhost:9200", // Đảm bảo URL này đúng
    auth: {
        username: "elastic",
        password: "FrgfHmkJ2JZpj1zge7ei",
    },
    tls: {
        rejectUnauthorized: false, // Bỏ qua xác minh chứng chỉ SSL
    },
});
async function checkConnection() {
    try {
        const response = await client.ping();
        console.log('Elasticsearch cluster is up,', response);

    }
    catch (error) {
        console.error('Elasticsearch cluster is down!', error);

    }
}
async function connecToElasticsearch() {
    await checkConnection();
}

function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
let files_arr = [];

files_arr.push("/data/fe_hsoc_alert_demo_2023.json");
files_arr.push("/data/fe_hsoc_asset_demo_2023.json");
files_arr.push("/data/fe_hsoc_case_statistic_demo_2023.json");
files_arr.push("/data/fe_hsoc_daily_statistic_alert_demo_2023.json");
files_arr.push("/data/fe_hsoc_incident_demo_2023.json");
files_arr.push("/data/fe_hsoc_timerange_statistic_alert_demo.json");
files_arr.push("/data/fe_hsoc_vulnerability_statistic_demo_2023.08.json")
files_arr.push("/data/fe_hsoc_vulnerable_demo_2023.json");
files_arr.push("/data/seting.json");
files_arr.push("/data/secnew.json");


let createIndex = async (name, indexConfig) => {
    try {
        await client.indices.delete({ index: name })
    } catch (err) {
        // catch in case the index doesn't already exist
    }

    await client.indices.create({
        index: name,
        body: indexConfig,
    }).then(result => {
        console.log("create new  index :" + name);
    })

}

let pushData = async (name, indexConfig) => {


    let result = {};
    await fs.readFile(files_arr[indexConfig], "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        result = JSON.parse(data);
    });
    while (result.hits === undefined) {
        await timeout(50);
    }
    let total = result.hits.total.value;

    for (let i = 0; i < (result.hits.hits.length); i++) {
        let item = result.hits.hits[i];
        let id = item._id;
        let index_name = item._index;
        let body = item._source;
        await client.index(
            {
                index: index_name,
                id: id,
                body: body,
            }
        );
        console.log(i+" : "+total);
      
    }


}
async function deleteIndex(indexName) {
    try {
      await client.indices.delete({
        index: indexName
      });
      console.log('Index', indexName, 'deleted:');
    } catch (error) {
      console.error('Error deleting index', indexName, ':', error);
    }
  }


async function checkForNewRecordsAndCopy() {
    console.log(lastCheckedTimestamp);
    const data = await client.search({
      index: LOCAL_INDEX,
      body: {
        query: {
          range: {
            "@timestamp": { 
                gte: lastCheckedTimestamp||0
            }
          }
        }
      }
    });
  console.log(data.hits.hits);
    if (data.hits.hits.length > 0) {
      console.log(data.hits.hits.length+  ' New records found in the first index!');
      // Handle the new records here
      const newRecords = data.hits.hits.map(hit => hit._source);
  
      // Add the new records to index 2
      await Promise.all(newRecords.map(record => {
        return client.index({
          index: DB_INDEX,
          body: record
        });
      }));
      lastCheckedTimestamp = data.hits.hits[data.hits.hits.length-1]._source['@timestamp'];

    
      console.log('New records added to the second index.');
    } else {
      console.log('No new records found.');
    }
  }
connecToElasticsearch();
//deleteIndex('fe_hsoc_tenant_setting');
// deleteIndex(LOCAL_INDEX);
pushData(LOCAL_INDEX,9);
// setInterval(checkForNewRecordsAndCopy, 13000);
