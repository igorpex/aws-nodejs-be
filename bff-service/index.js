import express from 'express';
import 'dotenv/config';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.all('/*', (req, res) => {
  let recipientURL;
  if (req.originalUrl.startsWith('/profile/cart')) recipientURL = process.env['cart'];
  if (req.originalUrl.startsWith('/products')) recipientURL = process.env['products'];
  if (recipientURL) {
    const axiosConfig = {
      method: req.method,
      url: `${recipientURL}${req.originalUrl}`,
      ...(Object.keys(req.body || {}).length > 0 && {data: req.body})
    };

    axios(axiosConfig)
        .then((response) => res.json(response.data))
        .catch(error => {
          console.log('error:', JSON.stringify(error))
          if (error.response) {
            const {
              status,
              data
            } = error.response;

            res.status(status).json(data);
          } else {
            res.status(500).json({error: error.message});
          }
        })
  } else {
    res.status(502).json({error: 'Cannot process request'})
  }
})

app.listen(PORT, () => {
  console.log(`App is listening at http://localhost:${PORT}`)
})
