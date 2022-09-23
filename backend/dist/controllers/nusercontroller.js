"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.issuehave = exports.getNuser = exports.getNusers = exports.createNuser = void 0;
const index_1 = require("../index");
const Issue_1 = require("../models/Issue");
const Nuser_1 = require("../models/Nuser");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createNuser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const cuser = new Nuser_1.Nuser();
        cuser.username = username;
        cuser.password = password;
        cuser.password = yield cuser.encryptPassword(cuser.password);
        const saveduser = yield cuser.save();
        const token = jsonwebtoken_1.default.sign({ id: saveduser.id }, process.env.TOKEN_SECRECT || 'tokentest');
        res.header('auth-token', token).json(saveduser);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createNuser = createNuser;
const getNusers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nusers = yield Nuser_1.Nuser.find();
        res.json(nusers);
        console.log(req.body.userId);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getNusers = getNusers;
const getNuser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(req.body.userId);
        const cuser = yield Nuser_1.Nuser.findOneBy({ id: parseInt(id) });
        res.json(cuser);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getNuser = getNuser;
const issuehave = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body.userId;
        let haveIssue;
        const havingissue = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder("issue")
            .where("nuserId = :nuserId", { nuserId: req.body.userId })
            .andWhere("isDone = 0")
            .getOne();
        if (havingissue) {
            haveIssue = 1;
        }
        else {
            haveIssue = 0;
        }
        res.json({ havingissue: haveIssue });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.issuehave = issuehave;
//# sourceMappingURL=nusercontroller.js.map