import express, { request, response } from "express";
import userRouter from "./routes/users.js";


const app = express();

// 添加中間件(middleware)來解析 JSON 請求體
app.use(express.json());
// add routers and put user related handler to routes/users.js
app.use(userRouter);

const loggingMiddleware = (request, response, next) => {
    console.log(`${request.method} - ${request.url}`);
    next();
};

// app.use(loggingMiddleware);

// 添加中間件來解析 URL 編碼的請求體
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));
// Simple text response
// app.get("/", (request, response) => {
//     response.send("Hello, World");
// });

//send JSON object response
// app.get("/",
//     (request, response, next) => { 
//         console.log("Base URL 1");
//         next();
//     },
//     (request, response, next) => {
//         console.log("Base URL 2");
//         next();
//     },
//     (request, response, next) => {
//         console.log("Base URL 3");
//         next();
//     },
//     (request,response) =>{
//         response.status(200).send({msg: "Hello"});
//     }
// );

//declare the middleware, then middleware will be responsed after this instruction
// app.use(loggingMiddleware); //---------important--------
// app.use(loggingMiddleware, (request, response, next) => {
//     console.log("Finished Logging...");
//     next();
// });

app.get("/api/products", (request, response) => {
    response.send([{ id: 123, name: "chicken breast", price: 12.99 }]);
});



// app.listen(PORT, () => {
//     console.log('running on Port ${PORT}');
// });
