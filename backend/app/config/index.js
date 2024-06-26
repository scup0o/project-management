require('dotenv').config()

const config = {
    app : {
        port : process.env.PORT,
        hostname: process.env.HOSTNAME,
    },

    db : {
      //uri : process.env.MONGODB_URI  
    }

    
};
module.exports = config;