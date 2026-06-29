import React, {
  useEffect,
  useState,
} from "react";

export default function PrivacySettings() {

  const [aiTraining, setAiTraining] =
    useState(false);

  const [profileVisibility,
    setProfileVisibility] =
    useState(false);

  /* FETCH */

  useEffect(() => {

    fetch(
      "http://localhost:5001/api/settings"
    )

      .then((res) => res.json())

      .then((data) => {

        const p =
          data.settings.privacy;

        setAiTraining(
          p.aiTraining
        );

        setProfileVisibility(
          p.profileVisibility
        );

      });

  }, []);

  /* SAVE */

  const saveSettings =
    async () => {

      const data = {

        privacy: {
          aiTraining,
          profileVisibility,
        },

      };

      const res = await fetch(
        "http://localhost:5001/api/settings",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(data),
        }
      );

      const result =
        await res.json();

      alert(result.message);

    };

  return (

    <div style={styles.page}>

      <h1>
        🛡 Data Privacy
      </h1>

      <div style={styles.card}>

        <h3>
          AI Training
        </h3>

        <button
          onClick={() =>
            setAiTraining(
              !aiTraining
            )
          }

          style={styles.button}
        >

          {aiTraining
            ? "ON"
            : "OFF"}

        </button>

      </div>

      <div style={styles.card}>

        <h3>
          Profile Visibility
        </h3>

        <button
          onClick={() =>
            setProfileVisibility(
              !profileVisibility
            )
          }

          style={styles.button}
        >

          {profileVisibility
            ? "Public"
            : "Private"}

        </button>

      </div>

      <button
        onClick={saveSettings}
        style={styles.save}
      >

        Save Changes

      </button>

    </div>
  );
}

const styles = {

  page: {
    color: "white",
    padding: "20px",
  },

  card: {
    padding: "20px",
    marginTop: "20px",

    borderRadius: "20px",

    background:
      "rgba(255,255,255,0.05)",
  },

  button: {
    marginTop: "15px",

    padding: "12px 20px",

    border: "none",

    borderRadius: "12px",

    background:
      "#3b82f6",

    color: "white",
  },

  save: {
    marginTop: "30px",

    padding: "14px 24px",

    border: "none",

    borderRadius: "14px",

    background:
      "#8b5cf6",

    color: "white",
  },

};