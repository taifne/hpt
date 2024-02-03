const { Client } = require("@elastic/elasticsearch");
var fs = require("fs");
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
connecToElasticsearch();

let files_arr = [];
files_arr.push("/data_demo/fe_hsoc_vulnerable_demo_2023.json");
files_arr.push("")
files_arr.push("/data_demo/fe_hsoc_vulnerability_statistic_demo_2023.08.json");
files_arr.push("/data_demo/fe_hsoc_timerange_statistic_alert_demo.json");
files_arr.push("/data_demo/fe_hsoc_incident_demo_2023.json");
files_arr.push("/data_demo/fe_hsoc_daily_statistic_alert_demo_2023.json");
files_arr.push("/data_demo/fe_hsoc_case_statistic_demo_2023.json");
files_arr.push("/data_demo/fe_hsoc_asset_demo_2023.json");
files_arr.push("/data_demo/fe_hsoc_alert_demo_2023.json");

async function ImportData() {
  let result = {};
  await fs.readFile(files_arr[7], "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    result = JSON.parse(data);
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
    await client.index(
      {
        index: index_name,
        id: id,
        body: body,
      },
      function (err, resp, status) {
        console.log(resp);
        console.log("insert record: " + status);
      }
    );
    console.log(i + " / " + total);
    await timeout(50);
  }
}

ImportData();
