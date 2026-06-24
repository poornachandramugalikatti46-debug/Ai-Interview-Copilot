import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function ATSChart({
  score = 0,
  skillsScore = 0,
  formatScore = 0,
  keywordScore = 0,
  projectScore = 0,
}) {

  const data = [

    {
      name: "ATS Score",
      value: score,
    },

    {
      name: "Skills",
      value: skillsScore,
    },

    {
      name: "Format",
      value: formatScore,
    },

    {
      name: "Keywords",
      value: keywordScore,
    },

    {
      name: "Projects",
      value: projectScore,
    },

  ];

  const COLORS = [
    "#06b6d4",
    "#7c3aed",
    "#10b981",
    "#f59e0b",
    "#ef4444",
  ];

  return (

    <div style={styles.container}>

      <h2 style={styles.title}>
        📊 ATS Performance Chart
      </h2>

      <ResponsiveContainer
        width="100%"
        height={350}
      >

        <PieChart>

          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={120}
            dataKey="value"
            label
          >

            {data.map(
              (entry, index) => (

                <Cell
                  key={`cell-${index}`}
                  fill={
                    COLORS[
                      index % COLORS.length
                    ]
                  }
                />

              )
            )}

          </Pie>

          <Tooltip />

          <Legend />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
}

/* =========================
   STYLES
========================= */

const styles = {

  container: {

    width: "100%",

    background:
      "rgba(255,255,255,0.05)",

    padding: "25px",

    borderRadius: "20px",

    marginTop: "20px",

    border:
      "1px solid rgba(255,255,255,0.08)",
  },

  title: {

    textAlign: "center",

    marginBottom: "20px",

    color: "#38bdf8",

    fontSize: "28px",
  },

};