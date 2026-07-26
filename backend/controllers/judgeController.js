/*
====================================================
JUDGE CONTROLLER

Handles:
- Run Code
- Submit Code
- Execution Results
====================================================
*/


import {
    runSubmission
} from "../services/executionEngine.js";



/*
====================================================
RUN CODE

Used when user clicks RUN

Only executes public test cases
====================================================
*/

export const runCode = async (req,res)=>{

    try{


        const {

            question,

            userCode,

            language


        } = req.body;



        if(
            !question ||
            !userCode ||
            !language
        ){

            return res.status(400).json({

                success:false,

                message:
                "Missing required fields"

            });

        }



        /*
        Public test cases only
        */

        const testCases = question.testCases.filter(
    (test) => !test.isHidden
);



        const result =
            await runSubmission({

                question,

                userCode,

                language,

                testCases

            });



        return res.json({

            success:true,

            mode:"run",

            result

        });



    }

    catch(error){


        console.error(
            "Run Code Error:",
            error
        );


        return res.status(500).json({

            success:false,

            message:
            error.message

        });

    }

};





/*
====================================================
SUBMIT CODE

Used when user clicks SUBMIT

Runs all test cases
(public + hidden)
====================================================
*/


export const submitCode = async(req,res)=>{


    try{

const { question, userCode, language } = req.body;

console.log("BODY RECEIVED");
console.log(req.body);

if (!question) {
    return res.status(400).json({
        success:false,
        message:"question missing"
    });
}

if (!userCode) {
    return res.status(400).json({
        success:false,
        message:"userCode missing"
    });
}

if (!language) {
    return res.status(400).json({
        success:false,
        message:"language missing"
    });
}



        /*
        All test cases
        */

        const testCases =
            question.testCases;



        const result =
            await runSubmission({

                question,

                userCode,

                language,

                testCases

            });




        return res.json({

            success:true,

            mode:"submit",

            result

        });



    }


    catch(error){


        console.error(
            "Submit Error:",
            error
        );


        return res.status(500).json({

            success:false,

            message:
            error.message

        });


    }

};





/*
====================================================
HEALTH CHECK
====================================================
*/

export const judgeHealth = (req,res)=>{


    res.json({

        success:true,

        service:
        "Judge Controller Running"

    });


};