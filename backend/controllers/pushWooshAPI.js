const PW = require('pushwoosh-client');

const PWClient = new PW(process.env.APP_CODE, process.env.API_KEY);

const registerClient = (req, res) => {
    const userId = req.body.userId;
    const time = req.body.time;
    PWClient.sendMessage('IT WORKED!!!', [userId], {send_date: `2021-03-06 ${time}`, timezone: 'America/Caracas'}, (error, response) => {
        if (error){
            console.log(error);
            res.status(500).json({title: 'Error', content: 'Not nice'});
        }
        else{
            console.log(response);
            res.status(200).json({title: 'Success', content: 'NICE!!!'});
        }
    });
}

module.exports = {
    registerClient
}