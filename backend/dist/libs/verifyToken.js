"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ValidateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token)
        return res.status(401).json('Access denied');
    const payload = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET || 'tokentest');
    req.body.userId = payload.id;
    return next();
};
exports.ValidateToken = ValidateToken;
//# sourceMappingURL=verifyToken.js.map