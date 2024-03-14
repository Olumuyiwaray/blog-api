import { Request } from "express";


interface iGetUser extends Request {
    userId: string;
}

interface jwtPayLoad {
    uID: string;
}