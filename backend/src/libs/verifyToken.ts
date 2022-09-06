import {Request,Response,NextFunction} from 'express'
import jwt from 'jsonwebtoken'

interface IPayload {
    id: string
}

export const ValidateToken =(req:Request,res:Response,next:NextFunction) => {

    const accToken = req.cookies.jwt
    const authHeader =req.headers['authorization']
    const token =authHeader && authHeader.split(' ')[1]

    if(accToken != token) return res.status(403).send({ message : 'Invalid Access Token' })
    
    if(!token) return res.status(401).json('Access denied')

    const payload =jwt.verify(token,process.env.TOKEN_SECRET || 'tokentest') as IPayload

    req.body.userId = payload.id

    return next()
}