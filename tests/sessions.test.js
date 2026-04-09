import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";

describe("Sessions API", () => {

  // Creation Test
  it("should create a new workout session", async () => {
    const res = await request(app)
      .post("/sessions/start")
      .set("Authorization", "Bearer test-token")
      .send({
        templateId: null,
      });

    expect(res.statusCode).toBe(201);

    expect(res.body).toMatchObject({
      id: expect.any(String),
      startedAt: expect.any(String),
      status: "IN_PROGRESS",
    });
  });

  // Completion Test
  it("should complete a workout session", async () => {
    // create exercise (avoids FK errors)
    await prisma.exercise.upsert({
      where: { id: "bench-test-id" },
      update: {},
      create: { 
        id: "bench-test-id", 
        name: "Test Bench", 
        muscleGroup: "Chest" ,
        category: "Compound",
        description: "Test exercise",
      },
    });

    // start session
    const startRes = await request(app)
      .post("/sessions/start")
      .set("Authorization", "Bearer test-token")
      .send({ templateId: null });

    const sessionId = startRes.body.id;

    // complete session
    const res = await request(app)
      .post(`/sessions/${sessionId}/complete`)
      .set("Authorization", "Bearer test-token")
      .send({
        exercises: [
          {
            exerciseId: "bench-test-id",
            sets: [
              { setNumber: 1, weight: 135, reps: 8 },
            ],
          },
        ],
        endNote: "Good workout",
        title: "Push Day",
      });

    expect(res.statusCode).toBe(200);

    // verify DB update
    const session = await prisma.workoutSession.findUnique({
      where: { id: sessionId },
    });

    expect(session.status).toBe("COMPLETED");
    expect(session.completedAt).not.toBeNull();
  });

  // Previous Test
  it("should return previous workout sets for an exercise", async () => {
  // Create exercise
  const exercise = await prisma.exercise.upsert({
    where: { id: "pulldown-test-id" },
    update: {},
    create: { 
      id: "pulldown-test-id",
      name: "Test Lat Pulldown",
      muscleGroup: "Back",
      category: "Compound",
      description: "Test lat pulldown exercise",
     },
  });

  // Start session
  const startRes = await request(app)
    .post("/sessions/start")
    .set("Authorization", "Bearer test-token")
    .send({ templateId: null });

  const sessionId = startRes.body.id;

  // Complete session
  await request(app)
    .post(`/sessions/${sessionId}/complete`)
    .set("Authorization", "Bearer test-token")
    .send({
      exercises: [
        {
          exerciseId: exercise.id,
          sets: [
            { setNumber: 1, weight: 120, reps: 10 },
          ],
        },
      ],
      endNote: "Back day",
      title: "Pull",
    });

  // Fetch previous
  const res = await request(app)
    .get(`/workout/previous?exerciseIds=${exercise.id}`)
    .set("Authorization", "Bearer test-token");

  expect(res.statusCode).toBe(200);
  expect(res.body).toBeDefined();
});

});