require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

// Connect Database
connectDB();

const port = Number(process.env.PORT || 5000);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`AnnSeva backend listening on http://localhost:${port}`);
});
