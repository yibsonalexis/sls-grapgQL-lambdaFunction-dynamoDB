const { gql } = require("apollo-server-lambda");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Country {
    id: String
    name: String
  }
  
  type Customer {
    ID: String
    FullName: String
    FirstName: String
    SecondName: String
    LastName: String
    SecondLastName: String
    Address: String
    Phone1: String
    Email: String
  }

  type Query {
    Country: [Country]
    Customers: [Customer]
    Customer(ID: String!): Customer
  }

  type Mutation {
    CreateCustomer(
      FullName: String
      FirstName: String
      SecondName: String
      LastName: String
      SecondLastName: String
      Address: String
      Phone1: String
      Email: String
    ): Boolean
  }
`;
module.exports = typeDefs;
