/*
====================================================
JUDGE ROUTES

Handles:
- Run Code API
- Submit Code API
- Health Check
====================================================
*/


import express from "express";


import {
    runCode,
    submitCode,
    judgeHealth
} from "../controllers/judgeController.js";



const router = express.Router();





/*
=====================================
Run Code

Frontend:
Click Run Button

POST
/api/judge/run
=====================================
*/

router.post(
    "/run",
    runCode
);





/*
=====================================
Submit Code

Frontend:
Click Submit Button

POST
/api/judge/submit
=====================================
*/

router.post(
    "/submit",
    submitCode
);





/*
=====================================
Health Check

GET
/api/judge/health
=====================================
*/

router.get(
    "/health",
    judgeHealth
);



export default router;