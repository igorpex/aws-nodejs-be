This is a backend repository for task-3, NodeJS in AWS, RS School training

Done 2 options, both working the same way:

1.**Commond JS option** (directory "product-service")
   ***endpoints:***
  * GET - https://0bmlw5rrlg.execute-api.eu-west-1.amazonaws.com/dev/products
  * GET - https://0bmlw5rrlg.execute-api.eu-west-1.amazonaws.com/dev/products/{productId}

    For example, for product with ID 16: https://0bmlw5rrlg.execute-api.eu-west-1.amazonaws.com/dev/products/16

2.**TS options** (directory "product-service-ts")
  
  ***endpoints:***

* GET - https://a3loi3zsk8.execute-api.eu-west-1.amazonaws.com/dev/products
   
* GET - https://a3loi3zsk8.execute-api.eu-west-1.amazonaws.com/dev/products/{productId}

  For example, for product with ID 16: https://a3loi3zsk8.execute-api.eu-west-1.amazonaws.com/dev/products/16


**Modified FE application** is available here:

Repository: https://github.com/igorpex/shop-react-redux-cloudfront/tree/task-3

Deploy: http://igorpex-rs-app-serverless.s3-website-us-east-1.amazonaws.com/

**Scores: 7/11**

**Done:**

4 - Your own Frontend application is integrated with product service (/products API) and products from product-service are represented on Frontend. AND POINT1 and POINT2 are done.

**Additionally done(optional):**

+1 - Async/await is used in lambda functions

+1 - ES6 modules are used for product-service implementation (in TS option)

+1 (All languages) - Lambda handlers (getProductsList, getProductsById) code is written not in 1 single module (file) and separated in codebase.

+1 (All languages) - Main error scenarious are handled by API ("Product not found" error).

**Not done (optional):**
0 - Webpack is configured for product-service

0 (All languages) - SWAGGER documentation is created for product-service

0 (All languages) - Lambda handlers are covered by basic UNIT tests (NO infrastructure logic is needed to be covered)


To deploy, go to one or other directory and use sls deploy
