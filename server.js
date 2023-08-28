const express = require('express');
const connectDB = require('./config/db');

const app = express()

// connect database
connectDB();

// Init Middleware
app.use(express.json())

app.get('/', (req,res) => res.send('API running'))

app.use('/api/users', require('./routes/users'))
app.use('/api/movies', require('./routes/movies'))
app.use('/api/watchList', require('./routes/watchList'))

const PORT = process.env.PORT || 8000

app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`))