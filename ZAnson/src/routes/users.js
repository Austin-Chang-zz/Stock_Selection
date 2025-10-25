import { Router } from "express";

import { query, validationResult } from "express-validator";
import { mockUsers } from "../utils/constents.js";

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

export default router;