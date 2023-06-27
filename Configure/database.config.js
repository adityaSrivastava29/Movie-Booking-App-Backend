const mongo = require("mongoose");
const { logger } = require("./logger.config");

let mongoConnectUrl;
if (process.env.ENV === "development") {
  mongoConnectUrl = `${process.env.DB_URL}/moviebookingapp_db`;
} else if (process.env.ENV === "test") {
  mongoConnectUrl = `${process.env.DB_TEST_URL}`;
}

mongo.set("strictQuery", true);
mongo
  .connect(mongoConnectUrl)
  .then(() =>
    logger.info(
      `Connected to the database successfully, URL: ${mongoConnectUrl}`
    )
  );

module.exports.mongo = mongo;


