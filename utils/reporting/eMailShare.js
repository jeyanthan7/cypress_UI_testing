const nodemailer = require("nodemailer");
const customReportObj = require('./customReport.js');
const config = require("../../config").getConfig;
const path = require('path');
const { resolve } = require("path");



function shareReportViaEmail(subject, from, pass, to) {

    console.log("--shareReportViaEmail---");
    let reportPath = path.resolve(__dirname, "../../cypress/report/mochawesome-report/report.html");

    return new Promise((resolve, reject) => {
        try {
            customReportObj.consolidateResults().then(async reportMap => {


                let content = generateHTMLContent(reportMap);

                let transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    tls: {rejectUnauthorized: false},
                    auth: {
                        user: from, // gmail user name
                        pass: pass, // gmail app password
                    },
                });


                // send mail with defined transport object
                let info = await transporter.sendMail({
                    from: from, // sender address
                    to: to, // list of receivers
                    subject: subject, // Subject line
                    html: content, // html body
                    attachments: [{
                        filename: "Execution Report.html",
                        path: reportPath
                    }
                    ]
                });
                resolve(info.messageId);

            }).catch(err => {
                console.log("---err------", err);
                reject(err);
            });
        }
        catch (err) {
            reject(err);
        }
    });




}
function generateHTMLContent(reportMap) {

    var htmlContentString = "";
    htmlContentString += frameWelcome(htmlContentString);
    htmlContentString = frameHeader(htmlContentString);
    htmlContentString = frameSuiteStats(htmlContentString, reportMap);
    htmlContentString = frameTestsStats(htmlContentString, reportMap);
    htmlContentString = frameFooter(htmlContentString);
    htmlContentString = frameSignature(htmlContentString);

    return htmlContentString;


}
function frameWelcome(htmlContentString) {

    htmlContentString += "<label>Hi all,</label>";
    htmlContentString += "<br/><br/>";
    htmlContentString += "<label>Please find the automation execution status below and attachment for detailed report,</label><br/><br/>";

    return htmlContentString;
}

function frameHeader(htmlContentString) {

    htmlContentString += "<html><head>";
    htmlContentString = frameStyles(htmlContentString);
    htmlContentString += "<div class=\"overAllDiv\">";

    return htmlContentString;
}
function frameStyles(htmlContentString) {

    htmlContentString += "<style>";
    htmlContentString += ".test{color:yellow;}";

    htmlContentString += ".overAllDiv{"
        + "border-radius:.3rem;border-color: #007bff;border: 2px solid #007bff;width: 90%;padding-right: 15px;padding-left: 15px;"
        + "margin-right: auto;padding-bottom: 20px;margin-left: auto;"
        + "}";
    htmlContentString += ".button{"
        + "padding: .25rem .5rem;margin-right: 10px;margin-top: 10px;font-size: .875rem;line-height: 1.5;border-radius: .2rem;"
        + "color: #fff; display: inline-block;font-weight: 400;text-align: center;vertical-align: middle;"
        + "border: 1px solid transparent;"
        + "}";
    htmlContentString += ".ttc{"
        + "color: #fff;  background-color: #007bff;border-color: #007bff;"
        + "}";
    htmlContentString += ".tpc{"
        + "color: #fff;  background-color: #28a745;border-color: #28a745;"
        + "}";
    htmlContentString += ".tfc{"
        + "color: #fff;  background-color: #dc3545;border-color: #dc3545;"
        + "}";
    htmlContentString += ".tsc{"
        + "color: #fff;  background-color: #ffc107;border-color: #ffc107;"
        + "}";
    htmlContentString += ".passHeading{"
        + "color: #28a745;"
        + "}";
    htmlContentString += ".failHeading{"
        + "color: #dc3545;"
        + "}";
    htmlContentString += ".skipHeading{"
        + "color: #ffc107;"
        + "}";

    htmlContentString += ".time{"
        + "color: #fff;  background-color: #17a2b8;border-color: #17a2b8;"
        + "}";
    htmlContentString += ".button-span{"
        + "color: #212529;background-color: #f8f9fa; display: inline-block;padding: .25em .4em;font-size: 75%;"
        + " font-weight: 700; line-height: 1;text-align: center; white-space: nowrap; vertical-align: baseline; border-radius: .25rem;"
        + "}";

    htmlContentString += ".tcHeading{"
        + "color: #0d47a1;"
        + "}";
    htmlContentString += ".list{"
        + "margin-left: 15px; margin-bottom: 0;position: relative; background-color: #fff;"
        + "}";

    htmlContentString += "</style></head><body>";

    return htmlContentString;
}
function frameSuiteStats(htmlContentString, reportMap) {

    htmlContentString += "<button class=\"button ttc\" type=\"button\">Total TestCases <span class=\"button-span\">"
        + (reportMap.get('stats').tests) + "</span></button>";

    htmlContentString += "<button class=\"button tpc\" type=\"button\">Pass <span class=\"button-span\">"
        + reportMap.get('stats').passes + "</span></button>";

    htmlContentString += "<button class=\"button tfc\" type=\"button\">Fail <span class=\"button-span\">"
        + reportMap.get('stats').failures + "</span></button>";

    htmlContentString += "<button class=\"button tsc\" type=\"button\">Skip <span class=\"button-span\">"
        + reportMap.get('stats').skipped + "</span></button>";

    htmlContentString += "<button class=\"button time\" type=\"button\">Start Time <span class=\"button-span\">"
        + customReportObj.convertToCurrentime(reportMap.get('stats').start) + "</span></button>";

    htmlContentString += "<button class=\"button time\" type=\"button\">End Time <span class=\"button-span\">"
        + customReportObj.convertToCurrentime(reportMap.get('stats').end) + "</span></button>";

    htmlContentString += "<button class=\"button time\" type=\"button\">Duration <span class=\"button-span\">"
        + customReportObj.getDuration(reportMap.get('stats').duration) + "min</span></button>";

    return htmlContentString;

}

function frameTestsStats(htmlContentString, reportMap) {

    htmlContentString += "<h2 class=\"tcHeading\">Test Cases: </h2>";

    if (reportMap.get('passTests').length > 0) {

        htmlContentString += "<ol>";
        htmlContentString += "<h3 class=\"passHeading\">Passed: </h3>";
        reportMap.get('passTests').forEach((test) => {

            htmlContentString += "<li class=\"list\">" + test.name + "</li>";

        });
        htmlContentString += "</ol>";
    }


    if (reportMap.get('failTests').length > 0) {
        htmlContentString += "<ol>";
        htmlContentString += "<h3 class=\"failHeading\">Failed: </h3>";
        reportMap.get('failTests').forEach((test) => {

            htmlContentString += "<li class=\"list\">" + test.name + "</li>";

        });
        htmlContentString += "</ol>";
    }


    if (reportMap.get('skipTests').length > 0) {
        htmlContentString += "<ol>";
        htmlContentString += "<h3 class=\"skipHeading\">Skiped: </h3>";
        reportMap.get('skipTests').forEach((test) => {

            htmlContentString += "<li class=\"list\">" + test.name + "</li>";

        });
        htmlContentString += "</ol>";
    }


    htmlContentString += "</div>";

    return htmlContentString;

}

function frameFooter(htmlContentString) {

    htmlContentString += "</body>";
    htmlContentString += "</html>";
    return htmlContentString;

}

function frameSignature(htmlContentString) {

    htmlContentString += "<br/><br/>";
    htmlContentString += "Regards,<br/> JeyapathakaraMuthu Chandrasekaran.";
    return htmlContentString;
}

module.exports = {
    shareReportViaEmail,
    generateHTMLContent
}
