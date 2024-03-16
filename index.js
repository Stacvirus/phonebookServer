const app = require('./app')
// var morgan = require('morgan')
const { info } = require('./utils/logger')
const { PORT } = require('./utils/config')


app.listen(PORT, () => {
    info(`Server running on port ${PORT}`)
})