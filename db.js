const { default: mongoose } = require("mongoose");
const mongoUri = process.env.MONGO_URI;

const connectToMongo = () => {
    mongoose.connect(mongoUri).then(() => {
        console.log("Connected to Mongo Successfully");
    }).catch((err) => {
        console.log(err);
    })
}
module.exports = connectToMongo;
