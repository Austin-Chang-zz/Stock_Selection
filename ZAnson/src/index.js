import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//     console.log('running on Port ${PORT}');
// });
app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));