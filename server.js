const express = require('express');

const app = express()

app.get('/', (req,res) => res.send('API running'))

app.use('/api/users', require('./routes/users'))
app.use('/api/movies', require('./routes/movies'))

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`))