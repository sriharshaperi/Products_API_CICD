const request = require("supertest");
const app = require("./server");

const userDetails = {
  userId: "1",
  username: "perisp@gmail.com",
  password: "peri",
  first_name: "peri",
  last_name: "peri",
};

describe("GET /healthz", () => {
  it("returns 200 on hitting this endpoint with HTTP GET method", async () => {
    const response = await request(app).get("/healthz");
    expect(response.statusCode).toBe(200);
  });
});

// describe("POST /v5/user", () => {
//   it("returns 400 Bad Request if username already exists", (done) => {
//     const { first_name, last_name, username, password } = userDetails;

//     request(app)
//       .post("/v5/user")
//       .send({
//         first_name,
//         last_name,
//         username,
//         password,
//       })
//       .set("Accept", "application/json")
//       .expect("Content-Type", /json/)
//       .expect(400)
//       .end((err, res) => {
//         if (err) return done(err);
//         return done();
//       });
//   });
// });

// describe("GET /v5/user/:userId", () => {
//   it("should have userId as request param and Authorization header", async () => {
//     const { userId, username, password } = userDetails;
//     const encodedToken = Buffer.from(`${username}:${password}`).toString(
//       "base64"
//     );
//     const res = await request(app)
//       .get(`/v5/user/${userId}`)
//       .set("Authorization", `Basic ${encodedToken}`)
//       .expect(200);
//   });
// });

// describe("PUT /v5/user/:userId", () => {
//   it("should have userId as request param and Authorization header", async () => {
//     const { userId, username, password, first_name, last_name } = userDetails;
//     const encodedToken = Buffer.from(`${username}:${password}`).toString(
//       "base64"
//     );
//     const res = await request(app)
//       .put(`/v5/user/${userId}`)
//       .send({
//         first_name,
//         last_name,
//         password,
//       })
//       .set("Accept", "application/json")
//       .set("Authorization", `Basic ${encodedToken}`)
//       .expect(204);
//   });
// });
