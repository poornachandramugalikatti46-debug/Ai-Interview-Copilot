import dns from "node:dns";
import mongoose from "mongoose";

let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    try {
      mongoose.set("strictQuery", true);

      const mongoUri = process.env.MONGODB_URI;

      if (!mongoUri) {
        throw new Error(
          "MONGODB_URI is not defined. Please add it to Render Environment Variables."
        );
      }

      console.log("🔗 Connecting to MongoDB Atlas...");

      if (dns.getServers().some((server) => server === "127.0.0.1")) {
        dns.setServers(["1.1.1.1", "8.8.8.8"]);
      }

      const conn = await mongoose.connect(mongoUri, {
        autoIndex: false,
        maxPoolSize: 20,
        minPoolSize: 5,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4,
      });

      console.log(`
========================================
 MongoDB Connected Successfully
 Host     : ${conn.connection.host}
 Database : ${conn.connection.name}
========================================
`);

      return conn;
    } catch (error) {
      console.error(`
========================================
 MongoDB Connection Failed
========================================
${error.message}
`);

      throw error;
    }
  })();

  try {
    return await connectionPromise;
  } finally {
    connectionPromise = null;
  }
};

mongoose.connection.on("connected", () => {
  console.log("MongoDB connection established.");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB Error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected.");
});

process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
    process.exit(0);
  } catch (err) {
    console.error("Error closing MongoDB connection:", err.message);
    process.exit(1);
  }
});

export default connectDB;