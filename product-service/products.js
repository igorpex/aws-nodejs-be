'use strict';
const productList = require('./mock/productList.js');

module.exports.products = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify(productList),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Content-Type": "application/json;charset=UTF-8",
    },
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
