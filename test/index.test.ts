import request from "supertest";
import { App } from "../src/Providers/App";
import { Express } from "../src/Providers/Express";

describe("GET /", () => {
    let app: Express;
    let application: App;


    beforeAll(async () => {
        app = new Express();
        application = new App(app.app);
        await application.initServer();
    });

    it('should return a 200 status and success message', async () => {
        const response = await request(app.app).get("/");

        console.log("Response", response.body)

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.message).toBe('ok');
    });
    afterAll(async () => {
        await application.stopServer();
    });
});
``


describe("GET /health", () => {
    let app: Express;
    let application: App;

    beforeAll(async () => {
        app = new Express();
        application = new App(app.app);
        await application.initServer();
    })


    it("should retunr a 200 status_code and status:success and message: Server is healthy", async () => {
        const response = await request(app.app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Server is healthy");
        expect(response.body.status).toBe("success");


    });

    afterAll(async () => {
        await application.stopServer();
    });
})
