import express from 'express';
const app = express();
import pkg from 'body-parser';
const { json } = pkg;
import { readFileSync } from 'fs';
const port = 3080;

import { serve, setup } from 'swagger-ui-express';
import { swaggerDocument } from './swagger.js';
const customCss = readFileSync((process.cwd() + "/swagger.css"), 'utf8');

app.use(json());
app.use('/', serve, setup(swaggerDocument, { customCss }));
app.use('/api-docs', serve, setup(swaggerDocument, { customCss }));

// app.get('/', (req, res) => {
//   res.send(`<h1>API Running on port ${port}</h1>`);
// });

app.listen(port, () => {
  console.log(`Server listening on the port::::::${port} , visit http://localhost:${port}`);
});
