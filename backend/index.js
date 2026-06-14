require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const tasks   = require('./tasksController');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

