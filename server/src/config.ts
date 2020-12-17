export default {
  port: 8080,
  mongoURL: process.argv[3] ? process.argv[3] : "mongodb://localhost:27017/spotify-data",
  apiBaseRoute: "/api",
};
