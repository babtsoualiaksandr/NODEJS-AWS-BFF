const express = require('express');
require('dotenv').config();
const axios = require('axios').default;

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.all('/*', (req, res) => {

    console.log('originalUrl', req.originalUrl);
    console.log('method', req.method);
    console.log('body',req.body);

    const recipient = req.originalUrl.split('/')[1];

    const recipientURL = process.env[recipient];
    console.log('recipientURL',recipientURL);

    if (recipientURL) {
        const axiosConfig = {
            method: req.method,
            url: `${recipientURL}${req.originalUrl}`,
            ...(Object.keys(req.body || {}).length > 0 && {data: req.body})
        };
        console.log('axiosConfig', axiosConfig);

        axios(axiosConfig)
            .then(function (response) {
                console.log('response from ', response.data);
                res.json(response.data);             
            })
            .catch(error => {
                console.log('error', JSON.stringify(error))
                if (error.response) {
                    const {
                        status,
                        data
                    } = error.response;

                    res.status(status).json(data);
                } else {
                    res.status(500).json({error: error.message});
                }
            });
    } else {
        res.status(502).json({error: 'Cannot  process request'});
    }

});

app.listen(PORT, () => {
    console.log(`Example app listening at localhost:${PORT}`);
})

