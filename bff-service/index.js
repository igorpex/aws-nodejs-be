import express from 'express';
import 'dotenv/config';
import axios from 'axios';
import cors from 'cors';
import * as crypto from "crypto";
import NodeCache from 'node-cache';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Set time for cache 2 minutes
const cache = new NodeCache({ stdTTL: 20 });

// Verify if request with combination of parameters exists in cache
const verifyCache = (req, res, next) => {
  try {
    if (req.method === 'GET') {
      const uniqParams = {
        method: req.method,
        url: `${req.originalUrl}`,
        ...(Object.keys(req.body || {}).length > 0 && {data: req.body})
      };
      const md5sum = crypto.createHash('md5').update(JSON.stringify(uniqParams)).digest("hex");
      console.log('md5sum on Verify:', md5sum);
      if (cache.has(md5sum)) {
        console.log('Return from cache. md5sum:', md5sum);
        return res.status(200).json(cache.get(md5sum));
      }
      return next();
    }
    return next();
  } catch (err) {
    throw new Error(err);
  }
};

app.all('/*', verifyCache, (req, res) => {
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
        .then((response) => {
          // Save answer to cache (applied to GET requests only)
          if (req.method === 'GET') {
              const uniqParams = {
              method: req.method,
              url: `${req.originalUrl}`,
              ...(Object.keys(req.body || {}).length > 0 && {data: req.body})
            };
            const md5sum = crypto.createHash('md5').update(JSON.stringify(uniqParams)).digest("hex");
            console.log('md5sum before cache.set:', md5sum);
            cache.set(md5sum, response.data);
          }
          // Response with result
          res.json(response.data)})
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

