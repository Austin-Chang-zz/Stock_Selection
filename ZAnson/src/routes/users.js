import { Router } from "express";

import { query, validationResult, checkSchema, matchedData} from "express-validator";
import { mockUsers } from "../utils/constents.js";
import { createUserValidationSchema } from "../utils/validateSchemas.js";
import { resolveIndexByUserID } from "../utils/middlewares.js";


const router = Router();

router.get("/api/users", query("filter")
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
    }
);

router.post("/api/users", checkSchema(createUserValidationSchema),
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

router.get("/api/users/:id", resolveIndexByUserID,
    (request, response) => {
        const { findUserIndex } = request;
        const findUser = mockUsers[findUserIndex];
    if (!findUser) return response.sendStatus(404);
    return response.send(findUser);

    });

//put request
router.put("/api/users/:id", resolveIndexByUserID,
    (request, response) => {
        //define request format , all body by id
        const { body, findUserIndex } = request;
        mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };

        //send correct request body
        return response.sendStatus(200); //OK
    }
);
//patch request (only change some field of body)
router.patch("/api/users/:id", resolveIndexByUserID,
    (request, response) => {
        //define request format , all body by id
        const { body, findUserIndex } = request;
        mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body }

        return response.sendStatus(200);
    }
);
//delete request
router.delete("/api/users/:id", resolveIndexByUserID,
    (request, response) => {
        //define request format , all body by id
        const { findUserIndex } = request;
        mockUsers.splice(findUserIndex, 1);
        return response.sendStatus(200);
    }
);

export default router;