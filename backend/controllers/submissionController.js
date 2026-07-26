/*
====================================================
SUBMISSION CONTROLLER

Handles:
- Save submission
- Get user submissions
- Get single submission
- Update submission status
====================================================
*/


import Submission from "../models/Submission.js";



/*
====================================================
CREATE SUBMISSION

Called after code execution
====================================================
*/

export const createSubmission = async (req, res) => {

    try {


        const {

            userId,

            interviewId,

            questionId,

            code,

            language,

            result


        } = req.body;



        if (
            !code ||
            !language ||
            !result
        ) {

            return res.status(400).json({

                success:false,

                message:
                "Missing submission data"

            });

        }



        const submission =
            await Submission.create({

                userId,

                interviewId,

                questionId,

                code,

                language,


                status:
                    result.score === 100
                    ? "Accepted"
                    : "Wrong Answer",



                score:
                    result.score,



                passedTests:
                    result.passed,



                totalTests:
                    result.total,



                testResults:
                    result.results || [],



                runtime:
                    result.results?.[0]?.runtime
                    || null,



                memory:
                    result.results?.[0]?.memory
                    || null

            });



        return res.status(201).json({

            success:true,

            submission

        });



    }

    catch(error){


        console.error(
            "Create Submission Error:",
            error
        );


        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};





/*
====================================================
GET USER SUBMISSIONS
====================================================
*/

export const getUserSubmissions = async(
    req,
    res
)=>{


    try{


        const {
            userId
        } = req.params;



        const submissions =
            await Submission
            .find({
                userId
            })
            .sort({
                createdAt:-1
            });



        res.json({

            success:true,

            count:
                submissions.length,

            submissions

        });



    }

    catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};





/*
====================================================
GET SINGLE SUBMISSION
====================================================
*/

export const getSubmissionById =
async(req,res)=>{


    try{


        const submission =
            await Submission
            .findById(
                req.params.id
            );



        if(!submission){

            return res.status(404).json({

                success:false,

                message:
                "Submission not found"

            });

        }



        res.json({

            success:true,

            submission

        });



    }

    catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};





/*
====================================================
UPDATE SUBMISSION REVIEW

Used later for AI review
====================================================
*/

export const updateSubmissionReview =
async(req,res)=>{


    try{


        const {

            aiFeedback,

            qualityScore


        } = req.body;



        const submission =
            await Submission.findByIdAndUpdate(

                req.params.id,

                {

                    aiFeedback,

                    qualityScore

                },

                {
                    new:true
                }

            );



        res.json({

            success:true,

            submission

        });



    }

    catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};