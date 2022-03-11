const express = require("express");
const sendmail = require("../util/mail");
const router = express.Router();

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
    console.log(date);
    let schedule = new Date(date);
    return schedule.valueOf();
}

router.post("/", async(req,res) => {
    try {
        const sendMail = () => {
            console.log("here");
            sendmail("prakharbhalla2016@gmail.com", req.body.email, req.body.Subject, req.body.body, "");
        }
        let time = req.body.Time;
        let delay;
        if(time === "now")
        {
            delay = 0;
        }
        if(time.trim().split(" ")[1] === "hour")
        {
            delay = 1000 * 60 * 60 * (+(time.trim().split(" ")[0]));
        }
        else 
        {
            let schedule = convert(time);
            let present = Date.now();
            delay = schedule - present - (5.5*60*60*1000);
        }
        console.log("d:", delay/1000);
        setTimeout(sendMail, delay);
        res.status(201).send(`Mail sent to ${req.body.email}`);
    } catch(e) {
        res.status(500).send("Something went wrong");
    }
})

module.exports = router;