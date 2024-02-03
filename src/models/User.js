const { object } = require("joi");
const elasticClient = require("../databases/index")

class User {
  constructor(username, email,password) {
    this.userName = username;
    this.email = email;
    this.passWord=password;
  }

  save=async()=> {
    console.log(this.passWord)

    elasticClient.connecToElasticsearch();
    // Thực hiện lưu thông tin user vào Elasticsearch
    console.log(this.userName)
    return await elasticClient.client.index({
      index: 'hungtest', // Tên index trong Elasticsearch
      body: {
        userName: this.userName,
        email: this.email,
        passWord:this.passWord
      }
      
    });
  }

  static findByUsername=async(username)=> {
    // Tìm user dựa trên username
    const res=await elasticClient.client.search({
        index: 'hungtest',
        body: {
          query: {
            match: { userName:username },
          },
        },
      });

      let resUser=Object(res.hits.hits[1]._source);
      resUser._id=res.hits.hits[1]._id;
    return resUser
  }

  // Các phương thức tìm kiếm và quản lý người dùng khác có thể được thêm vào ở đây
}

module.exports = User;