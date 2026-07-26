/*
==================================================
EXECUTION ENGINE

Responsible for:
- Reading question metadata
- Creating wrapper
- Sending to Judge0
- Checking result
- Calculating score
==================================================
*/


import { buildWrapper } from "./wrapperService.js";
import { executeSubmission } from "./judge0Service.js";



/*
=========================================
Generate Source Code
=========================================
*/

export const generateExecutionCode = ({
    language,
    userCode,
    execution
}) => {


    const {

        functionName,

        parameters,

        returnType


    } = execution;



    const wrapper =
        buildWrapper({

            language,

            userCode,

            functionName,

            parameters,

            returnType

        });



    return wrapper;

};



/*
=========================================
Run Submission
=========================================
*/

export const runSubmission = async ({

    question,

    userCode,

    language,

    testCases


}) => {


    let passed = 0;


    let results = [];



    for(
        const testCase of testCases
    ){


        const sourceCode =
            generateExecutionCode({

                language,

                userCode,

                execution:
                    question.execution

            });



        const result =
            await executeSubmission(
                sourceCode,
                language,
                testCase.input
            );



        const isCorrect =
            normalizeOutput(
                result.stdout
            )
            ===
            normalizeOutput(
                testCase.output
            );



        if(isCorrect){

            passed++;

        }



        results.push({

            input:
                testCase.input,


            expected:
                testCase.output,


            actual:
                result.stdout,


            passed:
                isCorrect,


            runtime:
                result.runtime,


            memory:
                result.memory

        });


    }



    const score =
        calculateScore(
            passed,
            testCases.length
        );



    return {


        passed,

        total:
            testCases.length,


        score,


        results


    };


};





/*
=========================================
Normalize Output
=========================================
*/

function normalizeOutput(output){

    if(!output)
        return "";



    return output

        .trim()

        .replace(/\s+/g," ");

}



/*
=========================================
Score Calculator
=========================================
*/

function calculateScore(
    passed,
    total
){

    if(total===0)
        return 0;


    return Math.round(
        (passed / total) * 100
    );

}