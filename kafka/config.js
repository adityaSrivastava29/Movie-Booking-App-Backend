const { Kafka } = require("kafkajs");

exports.kafka = new Kafka({
  clientId: "movie-app",
  brokers: ["kafka1:9092", "kafka2:9092"],
});
