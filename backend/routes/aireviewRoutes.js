/*
====================================================
AI REVIEW ROUTES
====================================================
*/


import express from "express";


import {

    reviewCode

}
from "../controllers/aiReviewController.js";



const router = express.Router();



router.post(
    "/review",
    reviewCode
);



export default router;