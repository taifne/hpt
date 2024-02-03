require('dotenv').config()
require('module-alias/register')
const { PORT } = require('@configs/app.config');
const app = require('@src/app');

app.listen(
    PORT,
    () => {
        console.log(`Server start at: ${PORT}`);
    }
)