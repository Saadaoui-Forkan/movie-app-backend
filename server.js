const express = require('express');

const app = express()

app.get('/', (req,res) => res.send('API running'))

app.use('/api/users', require('./api/users'))
app.use('/api/posts', require('./api/movies'))

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`))