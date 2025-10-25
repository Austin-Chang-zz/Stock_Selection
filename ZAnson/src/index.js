import express, { request, response } from "express";
import {
    query,
    validationResult,
    body,
    matchedData,
    checkSchema,
} from "express-validator";
import {createUserValidationSchema} from "./utils/validateSchemas.js"
import userRouter from "./routes/users.js";
import { mockUsers } from "./utils/constents.js";
const app = express();

// 添加中間件(middleware)來解析 JSON 請求體
app.use(express.json());

app.use(userRouter);

const loggingMiddleware = (request, response, next) => {
    console.log(`${request.method} - ${request.url}`);
    next();
};

// app.use(loggingMiddleware);

const resolveIndexByUserID = (request, response, next) => {
    //define request format , all body by id
    const { body, params: { id }, } = request;
    const parsedId = parseInt(id);
    //check the correct id as body index
    if (isNaN(parsedId))
        return response.sendStatus(400);  //bad request
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    //find the correct index and body
    if (findUserIndex === -1)
        return response.sendStatus(404); //not found
    request.findUserIndex = findUserIndex; 
    next();
};

// 添加中間件來解析 URL 編碼的請求體
app.use(express.urlencoded({ extended: true }));



const PORT = process.env.PORT || 3000;

app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));
// Simple text response
// app.get("/", (request, response) => {
//     response.send("Hello, World");
// });

//send JSON object response
app.get("/",
    (request, response, next) => { 
        console.log("Base URL 1");
        next();
    },
    (request, response, next) => {
        console.log("Base URL 2");
        next();
    },
    (request, response, next) => {
        console.log("Base URL 3");
        next();
    },
    (request,response) =>{
        response.status(200).send({msg: "Hello"});
    }
);

//make route
app.get("/api/users", query("filter")
    .isString()
    .notEmpty()
    .withMessage("Must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be at least 3-10 characters"),
    (request, response) => {
        console.log(request["acceptedexpress - validator#contexts"]);
    const result = validationResult(request);
        console.log(result);
    const {
        query: { filter, value },
    } = request;
    //when filter and value are undefined
    if (!filter && !value)
        return response.send(mockUsers);

    if (filter && value)
        return response.send(
            mockUsers.filter((user) => user[filter].includes(value))
        );

    return response.send(mockUsers);
});

//declare the middleware, then middleware will be responsed after this instruction
// app.use(loggingMiddleware); //---------important--------
app.use(loggingMiddleware, (request, response, next) => {
    console.log("Finished Logging...");
    next();
});

//post a new user body as feedback of request
app.post("/api/users", checkSchema(createUserValidationSchema),
    (request, response) => {
        const result = validationResult(request);
        console.log(result);

        if (!result.isEmpty())
            return response.status(400).send({errors: result.array() });
        
        const data = matchedData(request);
        console.log(data);
        // const { body } = request;  //request a body
        //define a new user begin from the last user id + body
        const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data }; 
        mockUsers.push(newUser);
    return response.status(201).send(newUser);
    }
);

app.get("/api/users/:id", resolveIndexByUserID,
    (request, response) => {
        const { findUserIndex } = request;
        const findUser = mockUsers[findUserIndex];
    if (!findUser) return response.sendStatus(404);
    return response.send(findUser);

});

app.get("/api/products", (request, response) => {
    response.send([{ id: 123, name: "chicken breast", price: 12.99 }]);
});

//put request
app.put("/api/users/:id",resolveIndexByUserID,
    (request, response) => {
        //define request format , all body by id
        const {body,findUserIndex} = request;
        mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };

    //send correct request body
    return response.sendStatus(200); //OK
    }
);


//patch request (only change some field of body)
app.patch("/api/users/:id",resolveIndexByUserID,
    (request, response) => {
        //define request format , all body by id
        const { body, findUserIndex } = request;
        mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body }
        
    return response.sendStatus(200);
    }
);

//delete request
app.delete("/api/users/:id", resolveIndexByUserID,
    (request, response) => {
        //define request format , all body by id
        const { findUserIndex } = request;
        mockUsers.splice(findUserIndex,1);
        return response.sendStatus(200);
    }
);

// app.listen(PORT, () => {
//     console.log('running on Port ${PORT}');
// });
