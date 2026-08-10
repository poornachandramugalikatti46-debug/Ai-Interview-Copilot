import { motion } from "framer-motion";
import {
  FaMicrophone,
  FaRobot,
  FaChartLine,
  FaPlayCircle,
  FaUserTie,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: <FaRobot size={35} />,
    title: "AI Interviewer",
    desc: "Practice interviews with an AI interviewer that asks smart follow-up questions.",
  },
  {
    icon: <FaMicrophone size={35} />,
    title: "Voice Communication",
    desc: "Answer naturally using your microphone with real-time speech recognition.",
  },
  {
    icon: <FaChartLine size={35} />,
    title: "Instant Feedback",
    desc: "Receive confidence, fluency, grammar, and communication analysis instantly.",
  },
];

export default function MockInterviewHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050816] text-white px-6 py-10">

      {/* Hero */}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto"
      >
        <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 rounded-3xl p-10 shadow-2xl">

          <div className="flex flex-col lg:flex-row justify-between items-center gap-10">

            <div className="flex-1">
            <button
            onClick={() => navigate("/dashboard")}
            className="mb-8 bg-gray-800 px-5 py-2 rounded-lg hover:bg-gray-700"
          >
            ← Back
          </button>

              <h1 className="text-5xl font-bold leading-tight">
                AI Mock Interview
              </h1>

              <p className="mt-5 text-lg text-gray-200 leading-8">
                Improve your communication skills through realistic AI-powered
                mock interviews. Practice HR, Behavioral and Technical
                interviews with instant feedback.
              </p>

              <div className="flex gap-4 mt-8 flex-wrap">

                <button
                  onClick={() => navigate("/mock-interview/setup")}
                  className="flex items-center gap-3 bg-white text-black px-7 py-4 rounded-xl font-semibold hover:scale-105 transition"
                >
                  <FaPlayCircle />
                  Start Mock Interview
                </button>

                <button
                  className="flex items-center gap-3 border border-white px-7 py-4 rounded-xl hover:bg-white hover:text-black transition"
                >
                  <FaUserTie />
                  Learn More
                </button>

              </div>

            </div>

            <motion.div
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
              }}
              className="flex-1 flex justify-center"
            >
              <div className="w-72 h-72 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-lg border border-white/20 shadow-xl">

                <FaRobot
                  size={120}
                  className="text-white"
                />

              </div>
            </motion.div>

          </div>

        </div>

        {/* Feature Cards */}

        <div className="grid md:grid-cols-3 gap-8 mt-12">

          {features.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{
                y: -8,
                scale: 1.03,
              }}
              className="bg-[#111827] rounded-2xl p-8 border border-gray-700 hover:border-purple-500 transition"
            >
              <div className="text-purple-400 mb-5">
                {item.icon}
              </div>

              <h2 className="text-2xl font-semibold mb-3">
                {item.title}
              </h2>

              <p className="text-gray-400 leading-7">
                {item.desc}
              </p>
            </motion.div>
          ))}

        </div>

        {/* CTA */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mt-16"
        >
          <div className="bg-[#111827] rounded-3xl p-10 flex flex-col lg:flex-row justify-between items-center border border-gray-700">

            <div>

              <h2 className="text-3xl font-bold">
                Ready to Ace Your Interview?
              </h2>

              <p className="text-gray-400 mt-3">
                Start practicing now and receive AI-powered feedback after every answer.
              </p>

            </div>

            <button
              onClick={() => navigate("/mock-interview/setup")}
              className="mt-6 lg:mt-0 flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 rounded-xl font-semibold hover:scale-105 transition"
            >
              Start Now
              <FaArrowRight />
            </button>

          </div>
        </motion.div>

        <div className="mt-20">
          
          <h2 className="text-4xl font-bold text-center mb-12">
            Interview Process
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-[#111827] rounded-2xl p-6">
              <h3 className="text-xl font-bold">1. Setup</h3>
              <p className="text-gray-400 mt-3">
                Choose role, experience and interview type.
              </p>
            </div>

            <div className="bg-[#111827] rounded-2xl p-6">
              <h3 className="text-xl font-bold">2. Camera</h3>
              <p className="text-gray-400 mt-3">
                Check camera and microphone.
              </p>
            </div>

            <div className="bg-[#111827] rounded-2xl p-6">
              <h3 className="text-xl font-bold">3. Interview</h3>
              <p className="text-gray-400 mt-3">
                Answer AI questions using voice.
              </p>
            </div>

            <div className="bg-[#111827] rounded-2xl p-6">
              <h3 className="text-xl font-bold">4. Report</h3>
              <p className="text-gray-400 mt-3">
                Receive complete AI feedback.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="bg-[#111827] rounded-2xl p-6 text-center">
              <h2 className="text-4xl font-bold text-purple-400">1000+</h2>
              <p className="text-gray-400 mt-2">Questions</p>
            </div>

            <div className="bg-[#111827] rounded-2xl p-6 text-center">
              <h2 className="text-4xl font-bold text-green-400">95%</h2>
              <p className="text-gray-400 mt-2">AI Accuracy</p>
            </div>

            <div className="bg-[#111827] rounded-2xl p-6 text-center">
              <h2 className="text-4xl font-bold text-blue-400">24/7</h2>
              <p className="text-gray-400 mt-2">Available</p>
            </div>

            <div className="bg-[#111827] rounded-2xl p-6 text-center">
              <h2 className="text-4xl font-bold text-yellow-400">AI</h2>
              <p className="text-gray-400 mt-2">Powered</p>
            </div>
          </div>
        </div>

      </motion.div>

    </div>
  );
}