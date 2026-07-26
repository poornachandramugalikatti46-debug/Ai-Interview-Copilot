/*
====================================================
REPORT ROUTES

Handles:
- Generate Interview Report
====================================================
*/


import express from "express";


import {
    generateReport
} from "../controllers/reportController.js";



const router = express.Router();





/*
=====================================
Generate Interview Report

GET
/api/reports/:interviewId
=====================================
*/


router.get(
    "/:interviewId",
    generateReport
);



export default router;