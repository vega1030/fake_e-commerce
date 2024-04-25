'use strict'

import express from 'express';
import path from 'path';
const app = express();

app.use(express.static(path.join(__dirname, '../public')));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`El servidor está corriendo en http://localhost:${ PORT }`);
});