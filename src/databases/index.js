const { Client } = require('@elastic/elasticsearch');

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
module.exports = {
    client,
    connecToElasticsearch
};