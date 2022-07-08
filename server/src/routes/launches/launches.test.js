const request = require("supertest");
const app = require("../../app"); // need app.js as application for request
const { loadPlanetsData } = require("../../models/planets.model");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

const { loadPlanetsData } = require("../../models/planets.model");

// use JEST to set up an environment for our test;  we want our Mongo connection to stay alive for our GET & POST tests
//   solution is to put the GET & POST describes w/in another describe block
describe("Launches API", () => {
	// beforeAll() needs to run once before all other tests are run
	beforeAll(async () => {
		await mongoConnect();
		await loadPlanetsData();
	});
	afterAll(async () => {
		await mongoDisconnect();
	});

	describe("Test GET /launches", () => {
		test("It should respond with 200 success", async () => {
			// makes request of /launches on HTTP server we passed in (app);  similar to axios or fetch
			const response = await request(app)
				.get("/v1/launches")
				.expect("Content-Type", /json/)
				.expect(200);
			// expect(response.statusCode).toBe(200);
		});
	});

	describe("Test POST /launch", () => {
		const completeLaunchData = {
			mission: "USS Enterprise",
			rocket: "NCC 1701-D",
			target: "Kepler-62 f",
			launchDate: "January 4, 2028",
		};

		const launchDataWithoutDate = {
			mission: "USS Enterprise",
			rocket: "NCC 1701-D",
			target: "Kepler-62 f",
		};

		const launchDataWithInvalidDate = {
			mission: "USS Enterprise",
			rocket: "NCC 1701-D",
			target: "Kepler-62 f",
			launchDate: "zoot",
		};

		test("It should respond with 201 success", async () => {
			const response = await request(app)
				.post("/v1/launches")
				.send(completeLaunchData)
				.expect("Content-Type", /json/)
				.expect(201);
			// expect(response.statusCode).toBe(200);

			// match the Date with Date from response (even if of diff formats);  validate this separate from other fields
			const requestDate = new Date(completeLaunchData.launchDate).valueOf(); // gives numerical representation of date
			const responseDate = new Date(response.body.launchDate).valueOf();
			expect(responseDate).toBe(requestDate);

			expect(response.body).toMatchObject(launchDataWithoutDate);
		});

		test("It should catch missing required properties", async () => {
			const response = await request(app)
				.post("/v1/launches")
				.send(launchDataWithoutDate)
				.expect("Content-Type", /json/)
				.expect(400);

			// match to exact error received
			expect(response.body).toStrictEqual({
				error: "Missing required launch property",
			});
		});

		test("It should catch invalid dates", async () => {
			const response = await request(app)
				.post("/v1/launches")
				.send(launchDataWithInvalidDate)
				.expect("Content-Type", /json/)
				.expect(400);

			expect(response.body).toStrictEqual({
				error: "Invalid launch date",
			});
		});
	});
});
