const { kafka } = require("./config");

exports.consumer = kafka.consumer({ groupId: "movie-user" });
