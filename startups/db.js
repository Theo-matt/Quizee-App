const mongoose = require('mongoose');

module.exports = async(db) => {
    try{
        const con = await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true 
        })

        console.log('DB connection successful!');
    }
    catch(err){
        console.error({error: err});
        console.log("Error occurred while connecting to database");
    }
}
