// use yargs to the arguments while running as node
// otherwise use process.env while running as npm
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv

const config = require("../../config").getConfig;
const shareReportObj = require("./eMailShare");
//const { run1 } = require('./slackShare1');

function reporting() {

    //var projectName = argv.project; // use this whie running as node
    var projectName = process.env.npm_config_project; // use this while running as npm

    if (config("report")[projectName].email["shareReport"]) {

        var subject = config("report")[projectName].email["subject"];
        var from = config("report")[projectName].email["mailList"].from;
        var pass = config("report")[projectName].email["mailList"].pass;
        var to = config("report")[projectName].email["mailList"].to;

        shareReportObj.shareReportViaEmail(subject, from, pass, to).then(async status => {
       
            console.log("eMail sent-----", status);

        }).catch(err => {

            console.log("-----Error----", err);

        });
       

    }
/*  //    run1(); */

}

reporting();