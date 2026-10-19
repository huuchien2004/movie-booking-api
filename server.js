require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3069;

app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`✅ Server is running on: http://localhost:${PORT}`);
    console.log(`✅ API Health check:     http://localhost:${PORT}/api`);
    console.log(`====================================================`);
});
