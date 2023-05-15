async function testController(request, response) {
  response.status(200).json({ message: "Test API working" });
}

module.exports = { testController };
