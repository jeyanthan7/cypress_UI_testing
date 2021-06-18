const config = {

report: {
    sample: {
        email: {
            shareReport: true,
            subject:  "Subject",
            mailList:{
                from:"jeyanthan7@gmail.com",
                pass:"******",
                to:"jeyanthan7@gmail.com"
            }
        }
    }
}
};


const getConfig = key => config[key] || {};
module.exports = {getConfig};