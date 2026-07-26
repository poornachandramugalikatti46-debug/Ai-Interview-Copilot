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

            code,

            language,

            question


        } = req.body;




        if(
            !code ||
            !language ||
            !question
        ){


            return res.status(400).json({

                success:false,

                message:
                "Missing review data"

            });


        }





        const review =
        await generateAIReview({

            code,

            language,

            question

        });






        res.json({

            success:true,

            review

        });



    }


    catch(error){


        res.status(500).json({

            success:false,

            message:
            error.message

        });


    }


};