import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHistory } from "../../services/hrService";

export default function HRHistory() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">

      <h1 className="text-4xl font-bold mb-8">
        HR Interview History
      </h1>

      {history.length === 0 ? (
        <div className="text-center mt-20">
          <h2 className="text-2xl font-semibold">
            No Interviews Found
          </h2>

          <button
            onClick={() => navigate("/hr/setup")}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Start Interview
          </button>
        </div>
      ) : (
        <div className="grid gap-5">

          {history.map((item) => (

            <div
              key={item._id}
              className="bg-white rounded-xl shadow-lg p-6 flex justify-between items-center"
            >

              <div>

                <h2 className="text-xl font-bold">
                  {item.role}
                </h2>

                <p>
                  Score : {item.score}%
                </p>

                <p>
                  Status :
                  {" "}
                  {item.completed
                    ? "Completed"
                    : "In Progress"}
                </p>

                <p>
                  {new Date(
                    item.createdAt
                  ).toLocaleString()}
                </p>

              </div>

              <button
                onClick={() =>
                  navigate(`/hr/result/${item._id}`)
                }
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
              >
                View Report
              </button>

            </div>

          ))}

        </div>
      )}
    </div>
  );
}