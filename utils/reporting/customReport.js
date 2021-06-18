const path = require('path');
const fs = require('fs');
const { fail } = require('assert');

let passTestArray = [];
let failTestArray = [];
let skipTestArray = [];

function consolidateResults() {
    return new Promise((resolve, reject) => {

        let reportJson = path.resolve(__dirname, "../../cypress/report/mochawesome-report/mochawesome.json");
        let reportMap = new Map();
        try {
           
            const jsonString = fs.readFileSync(reportJson);
            const jsonObject = JSON.parse(jsonString);

            reportMap.set("stats", jsonObject.stats);

            //let suiteDetailsObject = jsonObject.suites.suites;
            let resultsDetailsObject = jsonObject.results;

            for (let i = 0; i < resultsDetailsObject.length; i++) {

                let suiteDetailsObject = resultsDetailsObject[i].suites;
                for (let j = 0; j < suiteDetailsObject.length; j++) {
                    getInnerSuiteDetails(suiteDetailsObject[j].suites);
                    getTestDetails(suiteDetailsObject[j].tests);
                    reportMap.set("passTests", passTestArray);
                    reportMap.set("failTests", failTestArray);
                    reportMap.set("skipTests", skipTestArray);
                }


            }
            resolve(reportMap);
        }
        catch (err) {
            console.error('lot of errs',err);
            reject(err);
        }

    });

}

function getInnerSuiteDetails(suiteDetails) {

    for (let i = 0; i < suiteDetails.length; i++) {
        getTestDetails(suiteDetails[i].tests);
    }
}

function getTestDetails(testDetails) {

    for (let i = 0; i < testDetails.length; i++) {
        if (testDetails[i].state === "failed") {
            failTestArray.push({
                "name": testDetails[i].title,
                "state": testDetails[i].state,
                "duration": getDuration(testDetails[i].duration)
            });
        }
        else if (testDetails[i].state === "passed") {
            passTestArray.push({
                "name": testDetails[i].title,
                "state": testDetails[i].state,
                "duration": getDuration(testDetails[i].duration)
            });
        }
        else {
            skipTestArray.push({
                "name": testDetails[i].title,
                "state": testDetails[i].state,
                "duration": getDuration(testDetails[i].duration)
            });
        }
    }
}

function getDuration(millis) {

    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;

}

function convertToCurrentime(dateString) {

    let date = new Date(dateString).toLocaleString("en-US", { timeZone: "Australia/Sydney" });
    return date;

}

module.exports = {
    consolidateResults,
    getDuration,
    convertToCurrentime
}
