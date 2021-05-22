require("dotenv").config(); // now you can accesss the variable

const mongoose = require("mongoose");

// function connectDB() {
//   mongoose
//     .connect(
//       "mongodb+srv://fileShare:8LQvJMOGoznpMAx8@cluster0.1nnpx.mongodb.net/fileShare?retryWrites=true&w=majority",
//       {
//         useNewUrlParser: true,
//         useCreateIndex: true,
//         useUnifiedTopology: true,
//         useFindAndModify: true
//       }
//     )
//     .then(() => console.log("Mongodb is conneted!"))
//     .catch(err => console.log(err));
// }
function connectDB() {
  mongoose
    .connect(process.env.MONGO_CONNECTION_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: true
    })
    .then(() => console.log("Mongodb is conneted!"))
    .catch(err => console.log(err));
}

module.exports = connectDB;
