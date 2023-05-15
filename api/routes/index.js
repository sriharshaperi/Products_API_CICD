const Routes = require("./routes");
// exports default as a function with express() as argument
function routes(app) {
  //sets itemRouter component to search for all routes
  app.use("/", Routes);
  app.get("*", function (request, response) {
    response.status(404).send({ message: "404 : Not Found" });
  });
}

module.exports = routes;
