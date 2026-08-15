import { useEffect, useState } from "react";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLightbulb,
  FaRedo,
} from "react-icons/fa";

import {
  getResumeInterview,
} from "../../services/resumeInterviewApi";

const ResumeInterviewReport = () => {
  const {
    interviewId,
  } = useParams();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const normalizeReport = (value) => {
    const source = value || {};
    return {
      interviewId: source.interviewId || interviewId,
      resumeName: source.resumeName || "Resume Interview",
      overallScore: Number(source.overallScore ?? source.overall ?? 0),
      communication: Number(source.communication ?? source.communicationScore ?? 0),
      technical: Number(source.technical ?? source.technicalScore ?? 0),
      relevance: Number(source.relevance ?? source.relevanceScore ?? 0),
      confidence: Number(source.confidence ?? source.confidenceScore ?? 0),
      resumeAccuracy: Number(source.resumeAccuracy ?? source.resumeAccuracyScore ?? 0),
      strengths: Array.isArray(source.strengths) ? source.strengths : [],
      areasToImprove: Array.isArray(source.areasToImprove) ? source.areasToImprove : Array.isArray(source.weaknesses) ? source.weaknesses : [],
      finalFeedback: source.finalFeedback || source.feedback || "AI feedback is being generated...",
      answers: Array.isArray(source.answers) ? source.answers : [],
    };
  };

  const [
    report,
    setReport,
  ] = useState(
    normalizeReport(location.state?.report || null)
  );

  const [loading, setLoading] =
    useState(!location.state?.report);

  useEffect(() => {
    const loadReport =
      async () => {
        if (location.state?.report) {
          return;
        }

        try {
          const data =
            await getResumeInterview(
              interviewId
            );

          const interview =
            data.interview;

          setReport(
            normalizeReport({
              interviewId: interview._id,
              resumeName: interview.resumeName,
              overallScore: interview.overallScore,
              communication: interview.communication,
              technical: interview.technical,
              relevance: interview.relevance,
              confidence: interview.confidence,
              resumeAccuracy: interview.resumeAccuracy,
              strengths: interview.strengths,
              areasToImprove: interview.areasToImprove,
              finalFeedback: interview.finalFeedback,
              answers: interview.answers,
            })
          );
        } catch (error) {
          console.error(
            "LOAD REPORT ERROR:",
            error
          );
        } finally {
          setLoading(false);
        }
      };

    loadReport();
  }, [
    interviewId,
    location.state,
  ]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-5 text-gray-400">
            Generating your report...
          </p>

        </div>

      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

        <div className="text-center">

          <h1 className="text-2xl font-bold">
            Report Not Found
          </h1>

          <button
            onClick={() =>
              navigate(
                "/resume-interview"
              )
            }
            className="mt-5 bg-blue-600 px-6 py-3 rounded-xl"
          >
            Resume Interview
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8">

      <div className="max-w-6xl mx-auto">

        {/* Back */}

        <button
          onClick={() =>
            navigate("/dashboard")
          }
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8"
        >
          <FaArrowLeft />

          Dashboard
        </button>

        {/* Heading */}

        <div className="text-center mb-10">

          <div className="text-green-400 font-semibold">
            INTERVIEW COMPLETED
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mt-3">
            AI Resume Interview Report
          </h1>

          <p className="text-gray-400 mt-3">
            {report.resumeName}
          </p>

        </div>

        {/* Overall */}

        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-10 text-center mb-8">

          <p className="text-blue-100 text-lg">
            Overall Score
          </p>

          <div className="text-7xl font-bold mt-2">
            {report.overallScore ?? 0}
          </div>

          <p className="text-blue-100 mt-2">
            out of 100
          </p>

        </div>

        {/* Category Scores */}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">

          <ScoreCard
            label="Communication"
            value={
              report.communication ?? 0
            }
          />

          <ScoreCard
            label="Technical"
            value={
              report.technical ?? 0
            }
          />

          <ScoreCard
            label="Relevance"
            value={
              report.relevance ?? 0
            }
          />

          <ScoreCard
            label="Confidence"
            value={
              report.confidence ?? 0
            }
          />

          <ScoreCard
            label="Resume Accuracy"
            value={
              report.resumeAccuracy ?? 0
            }
          />

        </div>

        {/* Strengths + Weaknesses */}

        <div className="grid md:grid-cols-2 gap-6">

          {/* Strengths */}

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">

            <h2 className="text-xl font-bold flex items-center gap-3 mb-5">

              <FaCheckCircle className="text-green-400" />

              Strengths

            </h2>

            <div className="space-y-3">

              {(report.strengths || []).map(
                (item, index) => (
                  <div
                    key={index}
                    className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-gray-200"
                  >
                    ✓ {item}
                  </div>
                )
              )}

              {(report.strengths || []).length === 0 && (
                <div className="bg-slate-800 rounded-xl p-4 text-gray-400">
                  No strengths available yet.
                </div>
              )}

            </div>

          </div>

          {/* Weaknesses */}

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">

            <h2 className="text-xl font-bold flex items-center gap-3 mb-5">

              <FaExclamationTriangle className="text-yellow-400" />

              Areas to Improve

            </h2>

            <div className="space-y-3">

              {(report.areasToImprove || []).map(
                (item, index) => (
                  <div
                    key={index}
                    className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-gray-200"
                  >
                    ⚠ {item}
                  </div>
                )
              )}

              {(report.areasToImprove || []).length === 0 && (
                <div className="bg-slate-800 rounded-xl p-4 text-gray-400">
                  No improvement suggestions available yet.
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Final Feedback */}

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 mt-6">

          <h2 className="text-xl font-bold flex items-center gap-3 mb-4">

            <FaLightbulb className="text-yellow-400" />

            AI Final Feedback

          </h2>

          <p className="text-gray-300 leading-8">
            {report.finalFeedback || "AI feedback is being generated..."}
          </p>

        </div>

        {/* Question Performance */}

        <div className="mt-10">

          <h2 className="text-2xl font-bold mb-5">
            Question-wise Performance
          </h2>

          <div className="space-y-5">

            {report.answers?.map(
              (item, index) => (
                <AnswerCard
                  key={item._id || index}
                  item={item}
                  index={index}
                />
              )
            )}

          </div>

        </div>

        {/* Buttons */}

        <div className="flex flex-wrap justify-center gap-4 mt-10">

          <button
            onClick={() =>
              navigate(
                "/resume-interview"
              )
            }
            className="bg-gradient-to-r from-purple-600 to-blue-600 px-7 py-4 rounded-xl font-bold flex items-center gap-3"
          >

            <FaRedo />

            Practice Again

          </button>

          <button
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
            className="bg-slate-800 hover:bg-slate-700 px-7 py-4 rounded-xl font-bold"
          >
            Dashboard
          </button>

        </div>

      </div>

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Score Card
|--------------------------------------------------------------------------
*/

const ScoreCard = ({
  label,
  value,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">

      <p className="text-gray-400 text-sm">
        {label}
      </p>

      <p className="text-3xl font-bold mt-3">
        {value}
      </p>

      <p className="text-gray-500 text-xs mt-1">
        / 100
      </p>

    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Answer Card
|--------------------------------------------------------------------------
*/

const AnswerCard = ({
  item,
  index,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7">

      <div className="flex flex-col md:flex-row justify-between gap-4">

        <h3 className="text-lg font-bold">
          Q{index + 1}.{" "}
          {item.question}
        </h3>

        <div className="bg-blue-600 px-4 py-2 rounded-xl h-fit font-bold whitespace-nowrap">
          {item.overallScore}/100
        </div>

      </div>

      {/* Answer */}

      <div className="mt-6">

        <p className="text-sm text-gray-500 mb-2">
          Your Answer
        </p>

        <div className="bg-slate-800 rounded-xl p-5 text-gray-200 leading-7">
          {item.answer}
        </div>

      </div>

      {/* Scores */}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5">

        <MiniScore
          label="Communication"
          value={
            item.communication
          }
        />

        <MiniScore
          label="Technical"
          value={
            item.technicalKnowledge
          }
        />

        <MiniScore
          label="Relevance"
          value={
            item.relevance
          }
        />

        <MiniScore
          label="Confidence"
          value={
            item.confidence
          }
        />

        <MiniScore
          label="Resume Accuracy"
          value={
            item.resumeAccuracy
          }
        />

      </div>

      {/* Feedback */}

      <div className="mt-6">

        <p className="text-sm text-gray-500 mb-2">
          AI Feedback
        </p>

        <p className="text-gray-300 leading-7">
          {item.feedback}
        </p>

      </div>

      {/* Better Answer */}

      {item.betterAnswer && (
        <div className="mt-6">

          <p className="text-sm text-green-400 mb-2">
            Better Answer
          </p>

          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5 text-gray-200 leading-7">
            {item.betterAnswer}
          </div>

        </div>
      )}

    </div>
  );
};

const MiniScore = ({
  label,
  value,
}) => {
  return (
    <div className="bg-slate-800 rounded-xl p-3 text-center">

      <p className="text-gray-500 text-xs">
        {label}
      </p>

      <p className="font-bold mt-1">
        {value}/20
      </p>

    </div>
  );
};

export default ResumeInterviewReport;