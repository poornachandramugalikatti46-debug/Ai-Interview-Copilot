import React from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const VoiceRecorder = ({ answer, setAnswer }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return (
      <p className="text-red-500">
        Your browser doesn't support Speech Recognition.
      </p>
    );
  }

  const startListening = () => {
    resetTranscript();

    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();

    setAnswer((prev) => {
      if (!transcript.trim()) return prev;

      if (!prev.trim()) return transcript;

      return prev + " " + transcript;
    });
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 mt-6">

      <h2 className="text-xl font-bold text-white mb-4">
        Voice Answer
      </h2>

      <div className="flex gap-4 flex-wrap">

        <button
          onClick={startListening}
          className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-lg text-white font-semibold"
        >
          🎤 Start Recording
        </button>

        <button
          onClick={stopListening}
          className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-lg text-white font-semibold"
        >
          ⏹ Stop Recording
        </button>

        <button
          onClick={resetTranscript}
          className="bg-gray-700 hover:bg-gray-800 px-5 py-3 rounded-lg text-white"
        >
          🗑 Clear Voice
        </button>

      </div>

      <div className="mt-6">

        <p className="text-gray-400 mb-2">
          Status :
          <span
            className={`ml-2 font-bold ${
              listening ? "text-green-400" : "text-red-400"
            }`}
          >
            {listening ? "Listening..." : "Stopped"}
          </span>
        </p>

        <div className="bg-slate-800 rounded-xl p-4 min-h-[120px]">

          <p className="text-white whitespace-pre-wrap">
            {transcript || "Your speech will appear here..."}
          </p>

        </div>

      </div>
    </div>
  );
};

export default VoiceRecorder;