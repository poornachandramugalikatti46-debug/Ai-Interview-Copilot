import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  startInterview,
  getQuestion,
  submitAnswer,
} from "../../services/mockInterviewApi";
import {
  FaVideo,
  FaMicrophone,
  FaStop,
  FaArrowRight,
  FaSignOutAlt,
  FaClock,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function InterviewRoom() {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interviewId, setInterviewId] = useState("");
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);

  const [interview, setInterview] = useState(() => {
    try {
      const raw = localStorage.getItem("mockInterview");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  
  useEffect(() => {
    createInterview();
  }, []);

  const createInterview = async () => {
  try {
    setLoading(true);
    setError("");

    const raw = localStorage.getItem("mockInterview");
    let setup = null;

    if (raw) {
      try {
        setup = JSON.parse(raw);
      } catch {
        setup = null;
      }
    }

    if (!setup) {
      setError("Interview setup data was not found. Please start again.");
      setLoading(false);
      return;
    }

    const res = await startInterview(setup);

    setInterviewId(res?.data?.interviewId || "");
    setQuestion(res?.data?.question || "No question available yet.");
    setLoading(false);

  } catch (err) {
    console.log(err);
    setError("Unable to reach the interview service right now. Please try again later.");
    setLoading(false);
  }
};

const nextQuestion = async () => {

  try {

    const res = await getQuestion(interviewId);


if(res.data.completed){

navigate(
`/mock-interview/report/${interviewId}`
);

return;

}


setQuestion(res.data.question);

setTranscript("");

  } catch (err) {

    console.log(err);

  }

};
  
  useEffect(() => {
    startCamera();

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(media);

      if (videoRef.current) {
        videoRef.current.srcObject = media;
      }
    } catch (err) {
      alert("Camera/Microphone permission denied.");
    }
  };
   
  const startRecording = () => {
    if (!recognitionRef.current)
  return; 
    setTranscript("");   
    recognitionRef.current.start();
    };
  
  const stopRecording = async () => {

  recognitionRef.current.stop();

  try {

    await submitAnswer({

      interviewId,

      question,

      answer: transcript,

    });

  } catch (err) {

    console.log(err);

  }

};

  const speakQuestion = (text) => {
  if (!window.speechSynthesis) {
    alert("Speech Synthesis is not supported.");
    return;
  }

  // Stop previous speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

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

  window.speechSynthesis.speak(utterance);
};

  const stopSpeaking = () => {
  window.speechSynthesis.cancel();
  setIsSpeaking(false);
};

  useEffect(() => {
    if (question) {
      speakQuestion(question);
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [question]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalTranscript = "";

      for (let i = 0; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript + " ";
      }

      setTranscript(finalTranscript);
    };

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      console.log(event.error);
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">
      {error && (
        <div className="max-w-7xl mx-auto mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-200">
          {error}
        </div>
      )}

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-3xl font-bold">
              AI Mock Interview
            </h1>

            <p className="text-gray-400 mt-2">
              {interview?.role || "Mock Interview"} | {interview?.experience || "N/A"} | {interview?.type || "N/A"}
            </p>

          </div>

          <div className="bg-purple-600 px-5 py-3 rounded-xl flex items-center gap-3">

            <FaClock />

            {formatTime()}

          </div>

        </div>

        {/* Main Grid */}

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Camera */}

          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
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

          {/* Right Side */}

          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Question */}

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-[#111827] rounded-2xl p-6 border border-gray-700"
            >
              <h2 className="text-xl font-bold mb-4">
                Interview Question
              </h2>

              <p className="text-lg leading-8 text-gray-200">
                {question}
              </p>
              <div className="mt-6 flex gap-4">
                
                <button
    onClick={nextQuestion}
    className="bg-blue-600 py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-blue-700"
>
    Next
    <FaArrowRight />
</button>

  <button
    onClick={() => speakQuestion(question)}
    className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl flex items-center gap-2"
  >
    <FaVolumeUp />
    Replay Question
  </button>

  <button
    onClick={() => {
      stopSpeaking();
      navigate("/mock-interview");
    }}
    className={`px-5 py-3 rounded-xl flex items-center gap-2 transition ${
      isSpeaking
        ? "bg-red-600 hover:bg-red-700"
        : "bg-gray-500 cursor-not-allowed"
    }`}
  >
    <FaVolumeMute />
    Stop Voice
  </button>

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
            </motion.div>

            {/* Transcript */}

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-[#111827] rounded-2xl p-6 border border-gray-700 flex-1"
            >
              <h2 className="text-xl font-bold mb-4">
                Your Answer
              </h2>
            <div className="mb-3">

  {isRecording ? (
    <span className="text-green-400 font-semibold animate-pulse">
      🎤 Listening...
    </span>
  ) : (
    <span className="text-gray-400">
      Press Start to answer.
    </span>
  )}

</div>
             <textarea
 rows={10}
 value={transcript}
 onChange={(e)=>setTranscript(e.target.value)}
 className="w-full bg-[#1f2937] rounded-xl p-4 outline-none resize-none"
 placeholder="Your speech will appear here..."
/>
            </motion.div>

            {/* Controls */}

            <div className="grid md:grid-cols-4 gap-4">

              <button
                onClick={startRecording}
                disabled={isRecording}
                className={
                  "py-4 rounded-xl flex justify-center items-center gap-2 transition " +
                  (isRecording
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700")
                }

              >
                <FaMicrophone />
                {isRecording ? "Recording..." : "Start"}
              </button>
            <button
              onClick={stopRecording}
              disabled={!isRecording}
              className={
                "py-4 rounded-xl flex justify-center items-center gap-2 transition " +
                (!isRecording
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700")
              }
            >
              <FaStop />
              Stop
            </button>
              <button
  onClick={nextQuestion}
  className="bg-blue-600 py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-blue-700"
>
  Next
  <FaArrowRight />
</button>
              <button
                onClick={() => navigate("/mock-interview")}
                className="bg-gray-700 py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-gray-800"
              >
                <FaSignOutAlt />
                Exit
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}