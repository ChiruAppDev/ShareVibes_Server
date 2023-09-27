const fs = require('fs');

//Log the error
let errorLogger = (err, req, res, next) => {
    if(err){
        fs.appendFile('errorLogger.txt', new Date() + " - " + err.stack + "\n", (error)=>{
            if(error) {
                console.log("Logging Error Failed")
            }
        });
        if(err.status) {
            console.log(err.status);
            res.status(err.status);
        }
        console.log("Line 15",{ "message" : err.message });
        // res.send({ "message" : err.message });
        res.json({ "message" : err.message });
        next();
    }
}

module.exports = errorLogger;
