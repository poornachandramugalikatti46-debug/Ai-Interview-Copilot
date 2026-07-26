/*
====================================================
SUBMISSION ROUTES

Handles:
- Create Submission
- User Submission History
- Single Submission
- AI Review Update
====================================================
*/


import express from "express";


import {

    createSubmission,

    getUserSubmissions,

    getSubmissionById,

    updateSubmissionReview

} from "../controllers/submissionController.js";



const router = express.Router();





/*
=====================================
Create Submission

POST
/api/submissions
=====================================
*/

router.post(
    "/",
    createSubmission
);





/*
=====================================
Get User Submissions

GET
/api/submissions/user/:userId
=====================================
*/

router.get(
    "/user/:userId",
    getUserSubmissions
);





/*
=====================================
Get Single Submission

GET
/api/submissions/:id
=====================================
*/

router.get(
    "/:id",
    getSubmissionById
);





/*
=====================================
Update AI Review

PUT
/api/submissions/:id/review
=====================================
*/

router.put(
    "/:id/review",
    updateSubmissionReview
);



export default router;