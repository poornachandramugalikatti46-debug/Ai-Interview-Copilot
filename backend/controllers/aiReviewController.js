/*
====================================================
AI REVIEW CONTROLLER
====================================================
*/


import {
    generateAIReview
}
from "../services/aiReviewService.js";




export const reviewCode = async(req,res)=>{


    try{


        const {

            sourceCode,

            code,

            language,

            question,

            problemId


        } = req.body;

        // Support both naming conventions
        const finalCode = sourceCode || code;
        const finalQuestion = question || problemId;


        if(
            !finalCode ||
            !language ||
            !finalQuestion
        ){


            return res.status(400).json({

                success:false,

                message:
                "Missing review data (required: sourceCode or code, language, question or problemId)"

            });


        }





        const review =
        await generateAIReview({

            code: finalCode,

            language,

            question: finalQuestion

        });






        res.json({

            success:true,

            review

        });



    }


    catch(error){

        console.error("AI Review Error:", error);

        res.status(500).json({

            success:false,

            message:
            error.message

        });


    }


};
