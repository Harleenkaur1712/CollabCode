// import { Router } from "express";
// import User from "../models/User";

// const router = Router();

// router.post("/create-user", async (_req, res) => {
//   try {
//     const user = await User.create({
//       name: "Harleen",
//       email: "harleen@test.com",
//       password: "123456",
//     });

//     res.status(201).json(user);
//   } catch (error) {
//     res.status(500).json({
//       message: "Error creating user",
//     });
//   }
// });

// export default router;