import { DataSource } from "typeorm";

const LogBookDataSource = new DataSource({
  type: "mongodb",
  database: "log-book",
  url: "mongodb://mercedes-log-book:bJoEHqy5cUiX0m5mw2VKfYTDj8Rxp6LgTPw6qifekPwSujufLrVZ7fqdkUpYgFDQpzzhPPmATiQVgZpXLSf7LA==@mercedes-log-book.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@mercedes-log-book@",
});
