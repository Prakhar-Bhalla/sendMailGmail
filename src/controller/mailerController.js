const express = require("express");
const sendmail = require("../util/mail");
const router = express.Router();

// function to convert input date to milliseconds since 1 jan 1970
const convert = (d) => {
    let date = "";
    let x = d.trim().split(",");
    if(isNaN(+x[0][1]))
    {
        date += x[0][0] + " ";
    }
    else
    {
        date += x[0][0] + x[0][1] + " ";
    }
    let month = x[0].trim().split(" ")[1][0] + x[0].trim().split(" ")[1][1] + x[0].trim().split(" ")[1][2];
    date += month + " ";
    date += x[1] + " ";
    let clock = "";
    if(x[2].slice(-2) === "AM")
    {
        if(x[2].trim().split(" ")[0].trim().split(":")[0] == "12")
        {
            clock += "00" + ":" + x[2].trim().split(" ")[0].trim().split(":")[1] + ":" + "00" + " " + "GMT";
        }
        if(x[2].trim().split(" ")[0].trim().split(":")[0].length === 1)
        {
            clock += "0" + x[2].trim().split(" ")[0].trim().split(":")[0] + ":" + x[2].trim().split(" ")[0].trim().split(":")[1] + ":" + "00" + " " + "GMT";
        }
        if(x[2].trim().split(" ")[0].trim().split(":")[0].length === 2 && x[2].trim().split(" ")[0].trim().split(":")[0] != "12")
        {
            clock += x[2].trim().split(" ")[0].trim().split(":")[0] + ":" + x[2].trim().split(" ")[0].trim().split(":")[1] + ":" + "00" + " " + "GMT";
        }
    }
    if(x[2].slice(-2) === "PM")
    {
        if(x[2].trim().split(" ")[0].trim().split(":")[0] == "12")
        {
            clock += "12" + ":" + x[2].trim().split(" ")[0].trim().split(":")[1] + ":" + "00" + " " + "GMT";
        }
        else
        {
            let y = +x[2].trim().split(" ")[0].trim().split(":")[0] + 12;
            clock += y + ":" + x[2].trim().split(" ")[0].trim().split(":")[1] + ":" + "00" + " " + "GMT";
        }
    }
    date += clock;
    let schedule = new Date(date);
    return schedule.valueOf();
}


router.post("/", async(req,res) => {
    try {
        // If request is in array form
        if(Array.isArray(req.body))
        {
            let arr = [];
            req.body.forEach(el => {
                const sendMail = () => {
                    sendmail("prakharbhalla2016@gmail.com", el.email, el.Subject, el.body, "");
                }
                arr.push(el.email);
                let time = el.Time;
                let delay;
                if(time === "now")
                {
                    return sendMail();
                }
                if(time.trim().split(" ")[1] === "hour" || time.trim().split(" ")[1] === "hours")
                {
                    delay = 1000 * 60 * 60 * (+(time.trim().split(" ")[0]));
                }
                else 
                {
                    let schedule = convert(time);
                    let present = Date.now();
                    delay = schedule - present - (5.5*60*60*1000);
                }
                // Time interval after which mail will be sent
                console.log("delay in sec:", delay/1000);
                setTimeout(sendMail, delay);
            });
            res.status(201).send(`Mails set successfully to ${arr.join(",")}`);
        }
        // if request is in object form
        else
        {
            const sendMail = () => {
                console.log("here");
                sendmail("prakharbhalla2016@gmail.com", req.body.email, req.body.Subject, req.body.body, "");
            }
            let time = req.body.Time;
            let delay;
            if(time === "now")
            {
                sendMail();
                return res.status(201).send(`Mails set into queue successfully`);
            }
            if(time.trim().split(" ")[1] === "hour" || time.trim().split(" ")[1] === "hours")
            {
                delay = 1000 * 60 * 60 * (+(time.trim().split(" ")[0]));
            }
            else 
            {
                let schedule = convert(time);
                let present = Date.now();
                delay = schedule - present - (5.5*60*60*1000);
            }
            // Time interval after which mail will be sent
            console.log("delay in sec:", delay/1000);
            setTimeout(sendMail, delay);
            res.status(201).send(`Mail set successfully to ${req.body.email}`);
        }
    } catch(e) {
        res.status(500).send("Something went wrong");
    }
})

module.exports = router;