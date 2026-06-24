export default function AdminUsers() {

  const users = [
    {
      name: "Poornachandra",
      email: "poorna@gmail.com",
      interviews: 12,
    },

    {
      name: "Rahul",
      email: "rahul@gmail.com",
      interviews: 8,
    },

    {
      name: "Aman",
      email: "aman@gmail.com",
      interviews: 15,
    },
  ];

  return (

    <div style={styles.container}>

      <h2 style={styles.heading}>
        👥 Users Management
      </h2>

      {users.map((user, index) => (

        <div
          key={index}
          style={styles.card}
        >

          <div>
            <h3>{user.name}</h3>

            <p>{user.email}</p>
          </div>

          <div>
            <p>
              Interviews:
              {user.interviews}
            </p>

            <button style={styles.deleteBtn}>
              Delete
            </button>
          </div>

        </div>

      ))}

    </div>
  );
}

const styles = {

  container: {
    color: "white",
  },

  heading: {
    marginBottom: "20px",
  },

  card: {
    background:
      "rgba(17,24,39,0.9)",

    padding: "20px",

    borderRadius: "16px",

    marginBottom: "15px",

    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",

    border:
      "1px solid rgba(255,255,255,0.08)",
  },

  deleteBtn: {
    padding: "10px 15px",

    border: "none",

    borderRadius: "10px",

    background:
      "linear-gradient(90deg,#ef4444,#dc2626)",

    color: "white",

    cursor: "pointer",
  },
};