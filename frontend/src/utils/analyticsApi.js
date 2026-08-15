import axios from "axios";

const API_URL =
  "http://localhost:5000/api/analytics";

export const saveAnalyticsScore =
  async (
    feature,
    score
  ) => {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {
        return;
      }

      const response =
        await axios.post(
          `${API_URL}/score`,
          {
            feature,
            score,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      return response.data;
    } catch (error) {
      console.error(
        "Analytics score error:",
        error
      );
    }
  };