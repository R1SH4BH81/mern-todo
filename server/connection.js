const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose
      .connect(`${process.env.MONGO_URI}/${process.env.DBNAME}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("Connected!"))
      .catch(err);
  } catch (err) {
    console.log(`error ${err.message}`);
    process.exit(1);
  } finally {
    console.log("mongo connect ran");
  }
};

module.exports = connectDB;
