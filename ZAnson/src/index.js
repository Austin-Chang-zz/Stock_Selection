import express, { request, response } from "express";

const app = express();

// 添加中間件(midware)來解析 JSON 請求體
app.use(express.json());
// 添加中間件來解析 URL 編碼的請求體
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

const mockUsers = [
    { id: 1, username: "anson", displayname: "Anson" },
    { id: 2, username: "jack", displayname: "Jack" },
    { id: 3, username: "adam", displayname: "Adam" },
    { id: 4, username: "tina", displayname: "Tina" },
    { id: 5, username: "jason", displayname: "Jason" },
    { id: 6, username: "henry", displayname: "Henry" },
    { id: 7, username: "marilyn", displayname: "Marilyn" },
];

// Simple text response
// app.get("/", (request, response) => {
//     response.send("Hello, World");
// });

// send JSON object response
app.get("/", (request, response) => {
    response.status(200).send({msg: "Hello"});
});


//post a new user body as feedback of request
app.post("/api/users",
    (request, response) => {
        const { body } = request;  //request a body
        //define a new user begin from the last user id + body
        const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body }; 
        mockUsers.push(newUser);
        console.log(req.body);
    return response.status(201).send(newUser);
    }
);

app.get("/api/users/:id", (request, response) => {
    console.log(request.params);
    const parsedId = parseInt(request.params.id);

    //print out the typed id of URL on console
    console.log(parsedId);
    //print out the status 400 if not a number
    if (isNaN(parsedId)) return response.status(400).send({ msg: "Bad Request. Invalid" });

    const findUser = mockUsers.find((user) => user.id === parsedId);
    if (!findUser) return response.sendStatus(404);
    return response.send(findUser);

});

app.get("/api/products", (request, response) => {
    response.send([{ id: 123, name: "chicken breast", price: 12.99 }]);
});

//put request
app.put("/api/users/:id",
    (request, response) => {
        //define request format , all body by id
        const {body,params: { id },} = request;
        const parsedId = parseInt(id);
        //check the correct id as body index
        if (isNaN(parsedId))
            return response.sendStatus(400);  //bad request
        const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
        //find the correct index and body
        if (findUserIndex === -1)
            return response.sendStatus(404); //not found
        mockUsers[findUserIndex] = { id: parsedId, ...body };

    //send correct request body
    return response.sendStatus(200); //OK
    }
);


//patch request (only change some field of body)
app.patch("/api/users/:id",
    (request, response) => {
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
        mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body }
        
    return response.sendStatus(200);
    }
);


//make route
app.get("/api/users", (request, response) => {
    console.log(request.query);
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

// app.listen(PORT, () => {
//     console.log('running on Port ${PORT}');
// });
app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));