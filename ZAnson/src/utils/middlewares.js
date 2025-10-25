import { mockUsers } from "./constents.js";

export const resolveIndexByUserID = (request, response, next) => {
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