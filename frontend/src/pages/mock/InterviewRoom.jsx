import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FaVideo,
  FaMicrophone,
  FaStop,
  FaSignOutAlt,
  FaClock,
  FaVolumeUp,
  FaVolumeMute,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

import {
  getQuestion,
  submitAnswer,
} from "../../services/mockInterviewApi";

import { useNavigate } from "react-router-dom";

export default function InterviewRoom() {
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);

  const [stream, setStream] = useState(null);

  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [seconds, setSeconds] = useState(0);

  const [interviewId, setInterviewId] = useState("");
  const [question, setQuestion] = useState("");

  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5);

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New states
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [nextLoading, setNextLoading] = useState(false);

  // ============================================
  // LOAD INTERVIEW
  // ============================================

  const loadInterview = async () => {
    try {
      setLoading(true);

      const saved = localStorage.getItem("mockInterview");

      if (!saved) {
        console.error("mockInterview not found");
        navigate("/mock-interview");
        return;
      }

      const setup = JSON.parse(saved);

      if (!setup?.interviewId) {
        console.error("Interview ID missing");
        navigate("/mock-interview");
        return;
      }

      console.log("=================================");
      console.log("LOADING MOCK INTERVIEW");
      console.log("=================================");

      console.log("Interview ID:", setup.interviewId);
      console.log("Role:", setup.role);
      console.log("Experience:", setup.experience);
      console.log("Type:", setup.type);
      console.log("Questions:", setup.questionCount);

      setInterviewId(setup.interviewId);

      setTotalQuestions(
        Number(
          setup.questionCount ||
          setup.questionLimit ||
          5
        )
      );

      setQuestionNumber(1);

      setTranscript("");

      setQuestion(setup.firstQuestion || "");

      // If backend didn't return the first question during setup,
      // request it now so the room reliably shows question 1.
      if (!setup.firstQuestion) {
        try {
          const response = await getQuestion(setup.interviewId);
          if (response.data?.question) {
            setQuestion(response.data.question);
          }
        } catch (error) {
          console.error("Failed to generate first question:", error);
        }
      }

    } catch (error) {
      console.error(
        "Invalid interview setup:",
        error
      );

      navigate("/mock-interview");

    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // LOAD ONCE
  // ============================================

  useEffect(() => {
    loadInterview();
  }, []);

  // ============================================
  // CAMERA
  // ============================================

  const startCamera = async () => {
    try {
      const media =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

      setStream(media);

      if (videoRef.current) {
        videoRef.current.srcObject = media;
      }

    } catch (error) {
      console.error("Camera error:", error);

      alert(
        "Camera/Microphone permission denied."
      );
    }
  };

  useEffect(() => {
    startCamera();

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // ============================================
  // STOP CAMERA
  // ============================================

  useEffect(() => {
    return () => {
      if (stream) {
        stream
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, [stream]);

  // ============================================
  // SPEECH RECOGNITION
  // ============================================

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech Recognition is not supported in this browser."
      );
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalTranscript = "";

      for (
        let i = 0;
        i < event.results.length;
        i++
      ) {
        finalTranscript +=
          event.results[i][0].transcript + " ";
      }

      setTranscript(
        finalTranscript.trim()
      );
    };

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      console.log(
        "Speech recognition error:",
        event.error
      );

      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch (error) {
        // Ignore
      }
    };
  }, []);

  // ============================================
  // START RECORDING
  // ============================================

  const startRecording = () => {
    if (
      !recognitionRef.current ||
      isSubmitting ||
      nextLoading ||
      loading ||
      answerSubmitted
    ) {
      return;
    }

    setTranscript("");

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.log(
        "Recognition already started."
      );
    }
  };

  // ============================================
  // STOP + SUBMIT ANSWER
  // ============================================

  const stopRecording = async () => {
    if (
      !recognitionRef.current ||
      isSubmitting ||
      !interviewId
    ) {
      return;
    }

    try {
      recognitionRef.current.stop();
    } catch (error) {
      // Ignore
    }

    // Give speech recognition a moment
    // to update the final transcript.
    await new Promise((resolve) =>
      setTimeout(resolve, 300)
    );

    const answer = transcript.trim();

    if (!answer) {
      alert(
        "Please provide an answer before continuing."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      console.log(
        `SUBMITTING ANSWER FOR Q${questionNumber}`
      );

      // ONLY submit answer here.
      // Do NOT request next question yet.
      const answerResult =
        await submitAnswer({
          interviewId,
          question,
          answer,
        });

      console.log(
        "Answer evaluated:",
        answerResult.data
      );

      const data =
        answerResult.data;

      if (!data?.success) {
        throw new Error(
          data?.message ||
          "Answer submission failed"
        );
      }

      // Interview finished
      if (data.completed) {
        navigate(
          `/mock-interview/report/${interviewId}`
        );

        return;
      }

      // Store evaluation
      setEvaluation(
        data.evaluation || null
      );

      // Mark answer submitted
      setAnswerSubmitted(true);

    } catch (error) {
      console.error(
        "Answer submission error:",
        error
      );

      alert(
        error?.response?.data?.message ||
        error.message ||
        "Failed to submit answer"
      );

    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================
  // NEXT QUESTION
  // ============================================

  const handleNextQuestion = async () => {
    if (
      !interviewId ||
      !answerSubmitted ||
      nextLoading
    ) {
      return;
    }

    try {
      setNextLoading(true);

      console.log(
        `Requesting Question ${
          questionNumber + 1
        }...`
      );

      const nextResponse =
        await getQuestion(interviewId);

      console.log(
        "Next question response:",
        nextResponse.data
      );

      const data =
        nextResponse.data;

      if (!data?.success) {
        throw new Error(
          data?.message ||
          "Failed to get next question"
        );
      }

      // If backend says completed
      if (data.completed) {
        navigate(
          `/mock-interview/report/${interviewId}`
        );
        return;
      }

      if (!data.question) {
        throw new Error(
          "No next question received"
        );
      }

      // Update question
      setQuestion(data.question);

      // Clear old answer
      setTranscript("");

      // Clear evaluation
      setEvaluation(null);

      // Allow recording again
      setAnswerSubmitted(false);

      // Increase question number
      setQuestionNumber(
        (prev) => prev + 1
      );

      console.log(
        `Question ${
          questionNumber + 1
        } displayed.`
      );

    } catch (error) {
      console.error(
        "Next question error:",
        error
      );

      alert(
        error?.response?.data?.message ||
        error.message ||
        "Failed to load next question"
      );

    } finally {
      setNextLoading(false);
    }
  };

  // ============================================
  // TEXT TO SPEECH
  // ============================================

  const speakQuestion = (text) => {
    if (!text) return;

    if (!window.speechSynthesis) {
      alert(
        "Speech Synthesis is not supported."
      );
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(
      utterance
    );
  };

  // ============================================
  // STOP SPEAKING
  // ============================================

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // ============================================
  // SPEAK NEW QUESTION
  // ============================================

  useEffect(() => {
    if (question) {
      speakQuestion(question);
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [question]);

  // ============================================
  // TIMER
  // ============================================

  const formatTime = () => {
    const mins =
      Math.floor(seconds / 60);

    const secs =
      seconds % 60;

    return `${mins
      .toString()
      .padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // ============================================
  // LOADING
  // ============================================

  if (loading && !question) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">
            🤖
          </div>

          <h2 className="text-2xl font-bold">
            AI is preparing your interview...
          </h2>

          <p className="text-gray-400 mt-2">
            Analyzing your role and resume
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // SETUP
  // ============================================

  const setup = JSON.parse(
    localStorage.getItem(
      "mockInterview"
    ) || "{}"
  );

  // ============================================
  // UI
  // ============================================

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-3xl font-bold">
              AI Mock Interview
            </h1>

            <p className="text-gray-400 mt-2">
              {setup?.role} |{" "}
              {setup?.experience} |{" "}
              {setup?.type}
            </p>
          </div>

          <div className="bg-purple-600 px-5 py-3 rounded-xl flex items-center gap-3">
            <FaClock />

            {formatTime()}
          </div>

        </div>

        {/* PROGRESS */}

        <div className="mb-6">

          <div className="flex justify-between text-sm mb-2">

            <span className="text-gray-400">
              Interview Progress
            </span>

            <span className="font-semibold">
              {questionNumber} /{" "}
              {totalQuestions}
            </span>

          </div>

          <div className="w-full bg-gray-800 rounded-full h-3">

            <div
              className="bg-purple-600 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(
                  (questionNumber /
                    totalQuestions) *
                    100,
                  100
                )}%`,
              }}
            />

          </div>

        </div>

        {/* MAIN GRID */}

        <div className="grid lg:grid-cols-3 gap-6">

          {/* CAMERA */}

          <motion.div
            initial={{
              x: -40,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            className="bg-[#111827] rounded-2xl p-5 border border-gray-700"
          >

            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <FaVideo />
              Camera Preview
            </h2>

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="rounded-xl w-full h-[400px] object-cover bg-black"
            />

            <div className="mt-4 flex justify-center">

              <span className="bg-green-600 px-4 py-2 rounded-full text-sm">
                Camera Connected
              </span>

            </div>

          </motion.div>

          {/* RIGHT SIDE */}

          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* QUESTION */}

            <motion.div
              initial={{
                y: 30,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              className="bg-[#111827] rounded-2xl p-6 border border-gray-700"
            >

              <div className="flex items-center justify-between mb-4">

                <h2 className="text-xl font-bold">
                  Interview Question
                </h2>

                <span className="bg-purple-600 px-4 py-2 rounded-full text-sm font-semibold">
                  Question {questionNumber} /{" "}
                  {totalQuestions}
                </span>

              </div>

              <div className="mb-4">

                {isSpeaking ? (
                  <p className="text-green-400 animate-pulse">
                    🤖 AI is speaking...
                  </p>
                ) : (
                  <p className="text-gray-400">
                    AI is waiting for your response.
                  </p>
                )}

              </div>

              <p className="text-lg leading-8 text-gray-200">
                {question}
              </p>

              <div className="flex gap-4 mt-6">

                <button
                  onClick={() =>
                    speakQuestion(question)
                  }
                  disabled={!question}
                  className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl flex items-center gap-2 disabled:opacity-50"
                >
                  <FaVolumeUp />
                  Replay Question
                </button>

                <button
                  onClick={stopSpeaking}
                  disabled={!isSpeaking}
                  className="bg-gray-700 hover:bg-gray-600 px-5 py-3 rounded-xl flex items-center gap-2 disabled:opacity-50"
                >
                  <FaVolumeMute />
                  Stop Voice
                </button>

              </div>

            </motion.div>

            {/* ANSWER */}

            <motion.div
              initial={{
                y: 30,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              className="bg-[#111827] rounded-2xl p-6 border border-gray-700"
            >

              <div className="flex justify-between items-center mb-4">

                <h2 className="text-xl font-bold">
                  Your Answer
                </h2>

                {answerSubmitted && (
                  <span className="text-green-400 flex items-center gap-2">
                    <FaCheckCircle />
                    Answer Submitted
                  </span>
                )}

              </div>

              <div className="mb-3">

                {isRecording ? (
                  <span className="text-green-400 font-semibold animate-pulse">
                    🎙 Listening...
                  </span>
                ) : answerSubmitted ? (
                  <span className="text-green-400">
                    Your answer has been evaluated.
                  </span>
                ) : (
                  <span className="text-gray-400">
                    Press Start to answer.
                  </span>
                )}

              </div>

              <textarea
                rows={8}
                value={transcript}
                readOnly
                className="w-full bg-[#1f2937] rounded-xl p-4 outline-none resize-none"
                placeholder="Your speech will appear here..."
              />

            </motion.div>

            {/* AI EVALUATION */}

            {answerSubmitted &&
              evaluation && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="bg-[#111827] rounded-2xl p-6 border border-green-700"
                >

                  <h2 className="text-xl font-bold mb-4 text-green-400">
                    AI Answer Evaluation
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">

                    <div className="bg-[#1f2937] p-4 rounded-xl">
                      <p className="text-gray-400 text-sm">
                        Score
                      </p>
                      <p className="text-2xl font-bold">
                        {evaluation.score ?? 0}
                      </p>
                    </div>

                    <div className="bg-[#1f2937] p-4 rounded-xl">
                      <p className="text-gray-400 text-sm">
                        Confidence
                      </p>
                      <p className="text-2xl font-bold">
                        {evaluation.confidence ?? 0}
                      </p>
                    </div>

                    <div className="bg-[#1f2937] p-4 rounded-xl">
                      <p className="text-gray-400 text-sm">
                        Fluency
                      </p>
                      <p className="text-2xl font-bold">
                        {evaluation.fluency ?? 0}
                      </p>
                    </div>

                    <div className="bg-[#1f2937] p-4 rounded-xl">
                      <p className="text-gray-400 text-sm">
                        Grammar
                      </p>
                      <p className="text-2xl font-bold">
                        {evaluation.grammar ?? 0}
                      </p>
                    </div>

                  </div>

                  {evaluation.feedback && (
                    <div className="mb-4">

                      <h3 className="font-semibold mb-1">
                        Feedback
                      </h3>

                      <p className="text-gray-300">
                        {evaluation.feedback}
                      </p>

                    </div>
                  )}

                  {evaluation.improvement && (
                    <div>

                      <h3 className="font-semibold mb-1">
                        Improvement
                      </h3>

                      <p className="text-gray-300">
                        {evaluation.improvement}
                      </p>

                    </div>
                  )}

                </motion.div>
              )}

            {/* CONTROLS */}

            <div className="grid md:grid-cols-3 gap-4">

              {/* START */}

              <button
                onClick={startRecording}
                disabled={
                  isRecording ||
                  isSubmitting ||
                  nextLoading ||
                  loading ||
                  answerSubmitted
                }
                className={`py-4 rounded-xl flex justify-center items-center gap-2 transition ${
                  isRecording ||
                  isSubmitting ||
                  nextLoading ||
                  loading ||
                  answerSubmitted
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >

                <FaMicrophone />

                {isRecording
                  ? "Recording..."
                  : isSubmitting
                  ? "Processing..."
                  : answerSubmitted
                  ? "Submitted"
                  : "Start"}

              </button>

              {/* STOP & SUBMIT */}

              <button
                onClick={stopRecording}
                disabled={
                  !isRecording ||
                  isSubmitting ||
                  nextLoading ||
                  !interviewId ||
                  answerSubmitted
                }
                className={`py-4 rounded-xl flex justify-center items-center gap-2 transition ${
                  !isRecording ||
                  isSubmitting ||
                  nextLoading ||
                  !interviewId ||
                  answerSubmitted
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >

                <FaStop />

                {isSubmitting
                  ? "AI Processing..."
                  : "Stop & Submit"}

              </button>

              {/* NEXT QUESTION */}

              <button
                onClick={handleNextQuestion}
                disabled={
                  !answerSubmitted ||
                  nextLoading ||
                  isSubmitting
                }
                className={`py-4 rounded-xl flex justify-center items-center gap-2 transition ${
                  !answerSubmitted ||
                  nextLoading ||
                  isSubmitting
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >

                <FaArrowRight />

                {nextLoading
                  ? "Loading..."
                  : questionNumber >=
                    totalQuestions
                  ? "Finish Interview"
                  : "Next Question"}

              </button>

            </div>

            {/* EXIT */}

            <button
              onClick={() => {
                stopSpeaking();

                if (recognitionRef.current) {
                  try {
                    recognitionRef.current.stop();
                  } catch (error) {
                    // Ignore
                  }
                }

                navigate("/mock-interview");
              }}
              className="bg-gray-700 py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-gray-800"
            >
              <FaSignOutAlt />
              Exit Interview
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}