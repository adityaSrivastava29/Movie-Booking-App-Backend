const { kafka } = require("./config");

exports.producer = kafka.producer();
