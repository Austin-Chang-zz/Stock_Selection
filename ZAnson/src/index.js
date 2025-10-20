import express, { request, response } from "express";

const app = express();
// 添加中間件來解析 JSON 請求體
app.use(express.json());
// 添加中間件來解析 URL 編碼的請求體
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

const mockUsers = [
    { id: 1, useranme: "anson", displayname: "Anson" },
    { id: 2, useranme: "jack", displayname: "Jack" },
    { id: 3, useranme: "adam", displayname: "Adam" },
    { id: 4, useranme: "tina", displayname: "Tina" },
    { id: 5, useranme: "jason", displayname: "Jason" },
    { id: 6, useranme: "henry", displayname: "Henry" },
    { id: 7, useranme: "marilyn", displayname: "Marilyn" },
];

// Simple text response
// app.get("/", (request, response) => {
//     response.send("Hello, World");
// });

// send JSON object response
app.get("/", (request, response) => {
    response.status(200).send({msg: "Hello"});
});

//make route
app.get("/api/users", (request, response) => {
    console.log(request.query);
    const {
        query: { filter, value },
    } = request;
    //when filter and value are undefined
    if (!filter && !value) response.send(mockUsers);   
    //-------------not working?--------------------because includes problem
    if (filter && value)
        return response.send(
            mockUsers.filter((user) => user[filter].includes(value))
        );
    
    return response.send(mockUsers);
    
});

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

// app.listen(PORT, () => {
//     console.log('running on Port ${PORT}');
// });
app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));