import React, {
  useEffect,
  useState,
} from "react";

export default function NotificationSettings() {

  const [settings, setSettings] =
    useState({

      pushNotifications: false,

      emailNotifications: false,

      interviewReminders: false,

      practiceReminders: false,

      systemUpdates: false,

      soundVibration: false,

    });

  /* FETCH */

  useEffect(() => {

    fetch(
      "http://localhost:5001/api/settings"
    )

      .then((res) => res.json())

      .then((data) => {

        setSettings(
          data.notifications
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

            notifications:
              settings,

          }),

        }
      );

      const data =
        await res.json();

      alert(data.message);

    };

  const items = [

    {
      key:
        "pushNotifications",

      label:
        "Push Notifications",
    },

    {
      key:
        "emailNotifications",

      label:
        "Email Notifications",
    },

    {
      key:
        "interviewReminders",

      label:
        "Interview Reminders",
    },

    {
      key:
        "practiceReminders",

      label:
        "Practice Reminders",
    },

    {
      key:
        "systemUpdates",

      label:
        "System Updates",
    },

    {
      key:
        "soundVibration",

      label:
        "Sound & Vibration",
    },

  ];

  return (

    <div style={styles.page}>

      <h1 style={styles.title}>
        🔔 Notifications
      </h1>

      <div style={styles.grid}>

        {items.map((item) => (

          <div
            key={item.key}
            style={styles.card}
          >

            <h3>
              {item.label}
            </h3>

            <button

              onClick={() =>
                toggleSetting(
                  item.key
                )
              }

              style={{
                ...styles.toggle,

                background:
                  settings[
                    item.key
                  ]
                    ? "#22c55e"
                    : "#ef4444",
              }}
            >

              {settings[
                item.key
              ]
                ? "ON"
                : "OFF"}

            </button>

          </div>

        ))}

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

  grid: {
    display: "grid",

    gap: "20px",
  },

  card: {
    background:
      "rgba(255,255,255,0.05)",

    padding: "24px",

    borderRadius: "20px",

    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",
  },

  toggle: {
    width: "80px",

    height: "40px",

    border: "none",

    borderRadius: "999px",

    color: "white",

    fontWeight: "bold",

    cursor: "pointer",
  },

  save: {
    marginTop: "30px",

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