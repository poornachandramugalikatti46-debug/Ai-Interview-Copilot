/*
====================================================
REPORT CONTROLLER

Generates final interview report

Includes:
- Score
- Questions solved
- Accuracy
- Runtime analysis
- AI feedback
====================================================
*/


import Submission from "../models/Submission.js";

import Interview from "../models/Interview.js";



/*
====================================================
GENERATE INTERVIEW REPORT
====================================================
*/


export const generateReport = async(req,res)=>{


    try{


        const {
            interviewId
        } = req.params;



        /*
        Find Interview
        */

        const interview =
            await Interview.findById(
                interviewId
            );



        if(!interview){


            return res.status(404).json({

                success:false,

                message:
                "Interview not found"

            });

        }





        /*
        Find submissions
        */

        const submissions =
            await Submission.find({

                interviewId

            });





        if(submissions.length===0){


            return res.json({

                success:true,

                message:
                "No submissions found",

                report:null

            });

        }







        let totalScore = 0;

        let accepted = 0;

        let totalQuestions =
            submissions.length;



        let totalRuntime = 0;

        let runtimeCount = 0;






        submissions.forEach(
            submission=>{


                totalScore +=
                    submission.score || 0;



                if(
                    submission.status === "Accepted"
                ){

                    accepted++;

                }



                if(
                    submission.runtime
                ){

                    totalRuntime +=
                    Number(
                        submission.runtime
                        .replace("s","")
                    );


                    runtimeCount++;

                }


            }
        );






        const averageScore =
            Math.round(
                totalScore /
                totalQuestions
            );




        const accuracy =
            Math.round(
                (
                    accepted /
                    totalQuestions
                )
                *
                100
            );





        const averageRuntime =
            runtimeCount
            ?
            (
                totalRuntime /
                runtimeCount
            )
            .toFixed(3)
            :
            0;








        /*
        Final Report Object
        */


        const report = {


            interviewId,


            totalQuestions,


            solvedQuestions:
                accepted,



            failedQuestions:
                totalQuestions -
                accepted,



            score:
                averageScore,



            accuracy,



            averageRuntime:

                `${averageRuntime}s`,




            codingPerformance:{


                accepted,

                failed:
                    totalQuestions -
                    accepted


            },




            aiFeedback:{


                strengths:[

                    "Problem solving",

                    "Code submission"

                ],



                weaknesses:[

                    "Optimization analysis pending"

                ],



                suggestions:[

                    "Practice more DSA problems",

                    "Improve time complexity"

                ]

            }



        };





        return res.json({

            success:true,

            report

        });




    }

    catch(error){


        console.error(
            "Report Error:",
            error
        );


        res.status(500).json({

            success:false,

            message:
            error.message

        });


    }


};