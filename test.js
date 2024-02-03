const https = require('node:https');
const agent = new https.Agent({
    rejectUnauthorized: false,
});
const HSOC_ES_USERNAME='elastic';
const HSOC_ES_PASSWORD='FrgfHmkJ2JZpj1zge7ei'
const HSOC_ES_SERVER='http://localhost:9200/'
// const hsoc_headers = new fetch.Headers();
// hsoc_headers.set(
//     "Authorization",
//     "Basic " +
//     Buffer.from(hsoc_es_username + ":" + hsoc_es_password).toString("base64")
// );
// hsoc_headers.set("Access-Control-Allow-Origin", "*");
const hsoc_settings = {
    method: "GET",
    headers: {
        "Authorization": "Basic " + Buffer.from(HSOC_ES_USERNAME + ":" + HSOC_ES_PASSWORD).toString("base64"),
        "Access-Control-Allow-Origin": "*"
    },
    source_content_type: "application/json",
    agent: HSOC_ES_SERVER.includes("https://") ? agent : null,
    timeout: 30000,
};


let getExecutiveAlertChart = async function (
    dataRequest,
    hsoc_es_server,
    hsoc_es_port,
    hsoc_settings,
    fe_hsoc_common_alert_index,
    alert_index_arr
) {
    let     high_case_arr = [0,0,0],
    medium_case_arr = [0,0,0],
    low_case_arr = [0,0,0];
    let timerange = dataRequest.timerange;
    let size = 60 * 24; //pastweek
    if (timerange === "pastyear") size = 365 * 24;
    if (timerange === "pastmonth") size = 30 * 24;
    if (timerange === "realtime") size = 12;
    if (timerange === "pastday") size = 24;

    let result = {};
    let dateUTC = new Date();
    let dtFrom = new Date(dateUTC.valueOf() - size * 3600 * 1000).toISOString();
    let dtTo = new Date(dateUTC.valueOf()).toISOString();
    // if(dataRequest.timeFrom!=='' && dataRequest.timeTo!==''){
    //   dtFrom = dataRequest.timeFrom;
    //   dtTo = dataRequest.timeTo;
    // }
    let critical_alert_arr = [0, 0, 0],
        high_alert_arr = [0, 0, 0],
        medium_alert_arr = [0, 0, 0],
        low_alert_arr = [0, 0, 0];

    let url = "",
        list_index = "";
    for (let i = 0; i < alert_index_arr.length; i++) {
        if (i > 0) list_index += ",";
        list_index += alert_index_arr[i];
    }
    if (alert_index_arr.length > 15) list_index = fe_hsoc_common_alert_index;
    url =
        hsoc_es_server +
        ":" +
        hsoc_es_port +
        "/" +
        fe_hsoc_common_alert_index +
        '/_search?pretty=true&source={ "size": 0, "query": { "bool": { "must": [ { "range":{ "_createdAt":{ "gte":"'+ dtFrom+'","lt":"'+ dtTo+'"} } }, { "match": { "case_type.keyword": { "query": "'+ dataRequest.case_type+'"} } }] } },  "aggs": { "group_by_case_status": { "terms": { "field": "status.keyword" },  "aggs": { "group_by_severity": { "terms": { "field": "severity.keyword" } }} }}}&source_content_type=application/json';
   console.log(url);
        await fetch(url, hsoc_settings)
        .then(function (response) {
            return response.json();

        })
        .then(function (jsonData) {
            jsonData.aggregations.group_by_case_status.buckets.map((item)=>{
                if(item.key==='Resolved'){
                  item.group_by_severity.buckets.map((subitem)=>{
                    if(subitem.key==='C' || subitem.key==='H') high_case_arr[1]+=subitem.doc_count;
                    if(subitem.key==='M') medium_case_arr[1]=subitem.doc_count;
                    if(subitem.key==='L' ) low_case_arr[1]=subitem.doc_count;
                  })
                 }
               if(item.key==='Open' || item.key==='in_progress'){
                  item.group_by_severity.buckets.map((subitem)=>{
                    if(subitem.key==='C' || subitem.key==='H') high_case_arr[2]+=subitem.doc_count;
                    if(subitem.key==='M') medium_case_arr[2]=subitem.doc_count;
                    if(subitem.key==='L' ) low_case_arr[2]=subitem.doc_count;
                  })
               }
              })
        })
        .catch(function (error) { });
        high_case_arr[0] = high_case_arr[1]+ high_case_arr[2];
        medium_case_arr[0] = medium_case_arr[1]+ medium_case_arr[2];
        low_case_arr[0] = low_case_arr[1]+ low_case_arr[2];
       console.log({high_case_arr: high_case_arr, medium_case_arr: medium_case_arr, low_case_arr: low_case_arr} )
        return {high_case_arr: high_case_arr, medium_case_arr: medium_case_arr, low_case_arr: low_case_arr };
};
getExecutiveAlertChart({timerange:"lastweek",case_type:"case"},'http://localhost','9200',hsoc_settings,'fe_hsoc_incident_demo_2023.11',[])