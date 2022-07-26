'use strict';
const productList = require('./mock/productList.js');

module.exports.productById = async (event) => {

  const productId = event.pathParameters.productId;
  const product = productList.productList.find((element) => element['id'] === productId);

  if (product) {
    return {
      statusCode: 200,
      body: JSON.stringify(product),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Content-Type": "application/json;charset=UTF-8",
      },
    };
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify('Product not found'),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Content-Type": "application/json;charset=UTF-8",
      },
    };

  }


  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
