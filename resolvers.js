const Axios = require("axios");
const uuidv1 = require('uuid/v1');

const url_api = process.env.URL_API;
const customerTable = process.env.CUSTOMER_TABLE;

const AWS = require("aws-sdk");

let options = {};
if (process.env.IS_OFFLINE) {
  options = {
    region: "localhost",
    endpoint: "http://localhost:8000"
  };
}
const dynamoDb = new AWS.DynamoDB.DocumentClient(options);

// if we want to consult an external API
const fetchCountry = async () => {
  const results = await Axios.get(`${url_api}countries`);
  console.log(results.data);
  return results.data;
};

//Crear un 
const createCustomer = async (args) => {
  const params = {
    TableName: customerTable,
    Item: {
      ID: uuidv1(),
      ...args
    },
    ReturnValues: "ALL_OLD"
  };

  return new Promise((resolve, reject) => {
    dynamoDb.put(params, (err, data) => {
      if (err) {
        console.log("error: ", err);
        reject(false);
      } else {
        console.log("Resolve: ", data);
        resolve(true);
      }
    });
  });
};

const getCusomer = ID => {
  const params = {
    TableName: customerTable,
    Key: { ID }
  };

  return new Promise((resolve, reject) => {
    dynamoDb.get(params, (err, data) => {
      if (err) {
        console.log("error: ", err);
        reject(false);
      } else {
        console.log("Resolve: ", data);
        resolve(data.Item);
      }
    });
  });
};

//
const getAllCusomers = () => {
  const params = {
    TableName: customerTable
  };

  return new Promise((resolve, reject) => {
    dynamoDb.scan(params, (err, data) => {
      if (err) {
        console.log("error: ", err);
        reject(false);
      } else {
        console.log("Resolve: ", data);
        resolve(data.Items);
      }
    });
  });
};

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    Country: () => fetchCountry(),
    Customer: (_, { ID }) => getCusomer(ID),
    Customers: () => getAllCusomers(),
  },
  Mutation: {
    CreateCustomer: (_, data) => createCustomer(data)
  }
};

module.exports = resolvers;
