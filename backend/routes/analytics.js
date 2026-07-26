import express from "express";
import InterviewSession from "../models/InterviewSession.js";
import trackEvent from "../utils/trackEvent.js";

const router = express.Router();


/*
=================================
TRACK USER EVENT
POST /api/analytics/track
=================================
*/

router.post("/track", async (req, res) => {

    try {

        const { userId, event, meta = {} } = req.body;


        if (!userId || !event) {

            return res.status(400).json({
                success:false,
                message:"userId and event are required"
            });

        }


        await trackEvent({
            userId,
            event,
            meta
        });


        res.json({
            success:true,
            message:"Event tracked"
        });


    } catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

});





/*
=================================
WEEKLY PRACTICE TIME
GET /api/analytics/weekly-time
=================================
*/

router.get("/weekly-time", async (req,res)=>{

    try {


        const sessions = await InterviewSession.find();



        const weekly = {

            Sun:0,
            Mon:0,
            Tue:0,
            Wed:0,
            Thu:0,
            Fri:0,
            Sat:0

        };



        sessions.forEach((session)=>{


            const day =
            new Date(session.createdAt)
            .toLocaleDateString("en-US",{
                weekday:"short"
            });



            weekly[day] +=
            (session.timeSpent || 0) / 60;



        });



        const result =
        Object.keys(weekly).map(day=>({

            day,

            hours:
            Number(weekly[day].toFixed(2))

        }));


        res.json(result);



    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }


});






/*
=================================
SKILL MAP
GET /api/analytics/skill-map
=================================
*/


router.get("/skill-map", async(req,res)=>{


    try{


        const sessions =
        await InterviewSession.find();



        let skills = {};



        sessions.forEach(session=>{


            session.answers?.forEach(answer=>{


                if(!skills[answer.topic]){


                    skills[answer.topic]={

                        correct:0,
                        wrong:0

                    };


                }



                if(answer.isCorrect)

                    skills[answer.topic].correct++;

                else

                    skills[answer.topic].wrong++;



            });



        });





        const result =
        Object.keys(skills).map(topic=>{


            const data = skills[topic];


            const accuracy =
            (data.correct /
            (data.correct + data.wrong))
            *100 || 0;



            return {

                topic,

                accuracy:
                Math.round(accuracy)

            };


        });




        res.json(result);



    }catch(error){


        res.status(500).json({
            message:error.message
        });


    }


});







/*
=================================
STRESS ANALYTICS
GET /api/analytics/stress
=================================
*/


router.get("/stress", async(req,res)=>{


    try{


        const sessions =
        await InterviewSession.find();



        let total=0;

        let stress=0;



        sessions.forEach(session=>{


            session.answers?.forEach(answer=>{


                total++;



                if(answer.responseTime > 15)

                    stress++;



                if(answer.hesitationCount > 2)

                    stress++;



                if(!answer.isCorrect)

                    stress++;



            });


        });





        const score =
        total===0
        ?0
        :
        Math.max(
            0,
            Math.round(
                100 -
                (stress/total)*100
            )
        );





        res.json({

            score,


            stressLevel:
            score>70
            ?"LOW"
            :
            score>40
            ?"MEDIUM"
            :
            "HIGH"

        });



    }catch(error){


        res.status(500).json({
            message:error.message
        });


    }


});





export default router;