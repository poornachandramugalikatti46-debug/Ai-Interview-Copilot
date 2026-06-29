import React, {
  useEffect,
  useState,
} from "react";

export default function AppUpdates() {

  const [settings, setSettings] =
    useState({

      autoUpdate: false,

      betaFeatures: false,

      currentVersion: "2.1.0",

    });

  /* FETCH */

  useEffect(() => {

    fetch(
      "http://localhost:5001/api/settings"
    )

      .then((res) => res.json())

      .then((data) => {

        setSettings(
          data.updates
        );

      });

  }, []);

  /* TOGGLE */

  const toggleSetting = (key) => {

    setSettings({

      ...settings,

      [key]:
        !settings[key],

    });

  };

  /* SAVE */

  const saveSettings =
    async () => {

      const res = await fetch(
        "http://localhost:5001/api/settings",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            updates:
              settings,

          }),

        }
      );

      const data =
        await res.json();

      alert(data.message);

    };

  return (

    <div style={styles.page}>

      <h1 style={styles.title}>
        🚀 App Updates
      </h1>

      <div style={styles.card}>

        <h2>
          Current Version
        </h2>

        <p style={styles.version}>
          v{settings.currentVersion}
        </p>

      </div>

      <div style={styles.card}>

        <h3>
          Auto Updates
        </h3>

        <button

          onClick={() =>
            toggleSetting(
              "autoUpdate"
            )
          }

          style={{
            ...styles.toggle,

            background:
              settings.autoUpdate
                ? "#22c55e"
                : "#ef4444",
          }}
        >

          {settings.autoUpdate
            ? "Enabled"
            : "Disabled"}

        </button>

      </div>

      <div style={styles.card}>

        <h3>
          Beta Features
        </h3>

        <button

          onClick={() =>
            toggleSetting(
              "betaFeatures"
            )
          }

          style={{
            ...styles.toggle,

            background:
              settings.betaFeatures
                ? "#22c55e"
                : "#ef4444",
          }}
        >

          {settings.betaFeatures
            ? "Enabled"
            : "Disabled"}

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
    padding: "30px",
  },

  title: {
    fontSize: "34px",
    marginBottom: "30px",
  },

  card: {
    background:
      "rgba(255,255,255,0.05)",

    padding: "24px",

    borderRadius: "20px",

    marginBottom: "20px",

    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",
  },

  version: {
    fontSize: "28px",
    fontWeight: "bold",
  },

  toggle: {
    width: "120px",

    height: "42px",

    border: "none",

    borderRadius: "999px",

    color: "white",

    fontWeight: "bold",

    cursor: "pointer",
  },

  save: {
    marginTop: "20px",

    padding: "16px 26px",

    border: "none",

    borderRadius: "18px",

    background:
      "linear-gradient(135deg,#3b82f6,#8b5cf6)",

    color: "white",

    fontWeight: "bold",

    cursor: "pointer",
  },

};