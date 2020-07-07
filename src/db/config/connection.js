import mongoose from "mongoose";

const connection = () => {
  mongoose.connect(process.env.DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on("connected", () => console.log("conectado ao banco!"));
};

export default connection;
