const { response } = require('express');
const PW = require('pushwoosh-client');

const registerClient = (req, res) => {
    try{
        const userId = req.body.UserId;
        const time = req.body.time;
        const PWClient = new PW(process.env.APP_CODE, process.env.API_KEY);
        PWClient.sendMessage('IT WORKED!!!', userId, {send_date: `2021-03-06 ${time}`, timezone: 'America/Caracas'}, (error, response) => {
            if (error){
                console.log(error);
                res.status(200).json({title: 'Error', content: 'Not nice'});
            }
            else{
                console.log(response);
                res.status(200).json({title: 'Success', content: 'NICE!!!'});
            }
        });
    }catch(e){
        console.log(e);
        res.status(500).send(e.message);
    }
}

module.exports = {
    registerClient
}