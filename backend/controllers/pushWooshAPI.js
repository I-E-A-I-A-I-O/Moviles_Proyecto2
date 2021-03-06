const { response } = require('express');
const PW = require('pushwoosh-client');

const registerClient = (req, res) => {
    const userId = req.body.UserId;
    const PWClient = new PW(process.env.APP_CODE, process.env.API_KEY);
    PWClient.sendMessage('IT WORKED!!!', userId, {send_date: '2021-03-06 18:59', timezone: 'America/Caracas'}, (error, response) => {
        if (error){
            console.log(error);
            res.status(200).json({title: 'Error', content: 'Not nice'});
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