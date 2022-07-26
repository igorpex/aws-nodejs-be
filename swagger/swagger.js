export const swaggerDocument = {
  "swagger": "2.0",
  "info": {
    "description": "This is a documentation for Products API",
    "version": "1.0.0",
    "title": "Products API",
    "contact": {
      "email": "igor.bogdanov@gmail.com"
    },
    "license": {
      "name": "Apache 2.0",
      "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
    }
  },
  "schemes": [
    "https"
  ],
  "host": "0bmlw5rrlg.execute-api.eu-west-1.amazonaws.com",
  "basePath": "/dev",
  "paths": {
    "/products": {
      "get": {
        "summary": "Get all products",
        "description": "Get all products",
        "produces": [
          "application/json"
        ],
        "parameters": [],
        "responses": {
          "200": {
            "description": "successful operation",
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/product"
              }
            }
          }
        }
      }
    },
    "/products/{productId}": {
      "get": {
        "summary": "Get product details",
        "description": "Get product details",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "productId",
            "in": "path",
            "description": "product ID that needs to be shown",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "successful operation",
            "schema": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/product"
              }
            }
          },
          "404": {
            "description": "Product not found",
            "schema": {
              "$ref": "#/definitions/ProductNotFoundResponse"
            }
          }
        }
      }
    }
  },
  "definitions": {
    "product": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "example": "16"
        },
        "count": {
          "type": "integer",
          "example": 10
        },
        "price": {
          "type": "integer",
          "example": 2900
        },
        "title": {
          "type": "string",
          "example": "Flying car"
        },
        "description": {
          "type": "string",
          "example": "The Flying Ford Anglia was used on 3 August 1992 by Fred, George, and Ron Weasley to rescue Harry Potter, who was locked up in his room at the Dursleys' and had been unable to receive any mail from the Wizarding community as a result of Dobby's attempts to protect him."
        },
        "imageurl": {
          "type": "string",
          "example": "https://picsum.photos/id/1071/300/200"
        }
      }
    },
    "ProductNotFoundResponse": {
      "type": "object",
      "properties": {
        "statusCode": {
          "type": "string"
        },
        "message": {
          "type": "string"
        }
      }
    }
  }
}
