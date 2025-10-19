import express, { request, response } from "express";

const app = express();

const PORT = process.env.PORT || 3000;

const mockUsers = [
    { id: 1, useranme: "anson", displayname: "Anson" },
    { id: 2, useranme: "jack", displayname: "Jack" },
    { id: 3, useranme: "adam", displayname: "Adam" },
];

// app.get("/", (request, response) => {
//     response.send("Hello, World");
// });

// send msg object 
app.get("/", (request, response) => {
    response.status(201).send({msg: "Hello"});
});

//make route
app.get("/api/users", (request, response) => {
    response.send(mockUsers);
});

app.get("/api/users/:id", (request, response) => {
    console.log(request.params);
    const parsedId = parseInt(request.params.id);

    //print out the typed id of URL on console
    console.log(parsedId);
    //print out the status 400 if not a number
    if (isNaN(parsedId)) return response.status(400).send({ msg: "Bad Request. Invalid" });

    const findUser = mockUsers.find(user) => user.id === parsedId;
    if (!findUsers) return response.sendStatus(404);
    return response.send(findUser);

});

app.get("/api/products", (request, response) => {
    response.send([{ id: 123, name: "chicken breast", price: 12.99 }]);
});

// app.listen(PORT, () => {
//     console.log('running on Port ${PORT}');
// });
app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));