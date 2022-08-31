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
exports.loginNuser = exports.havingissue = void 0;
const index_1 = require("../index");
const Issue_1 = require("../models/Issue");
const Nuser_1 = require("../models/Nuser");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const havingissue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body.userId;
        console.log(req.body.userId);
        let haveIssue;
        const havingissue = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder("issue")
            .where("nuserId = :nuserId", { nuserId: req.body.userId })
            .getOne();
        if (havingissue) {
            haveIssue = true;
        }
        else {
            haveIssue = false;
        }
        res.json({ 'havingIssue': haveIssue });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.havingissue = havingissue;
const loginNuser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const nuser = yield Nuser_1.Nuser.findOneBy({ username: username });
        if (!nuser)
            return res.status(400).json('username or password is wrong');
        const correctPassword = yield nuser.validatePassword(password);
        if (!correctPassword)
            return res.status(400).json('invalid password');
        const token = jsonwebtoken_1.default.sign({ id: nuser.id }, process.env.TOKEN_SECRECT || 'tokentest');
        const issue = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder("issue")
            .where("issue.nuser = :nuser", { nuser: nuser.id })
            .andWhere("issue.isDone = :isDone", { isDone: false })
            .getRawOne();
        console.log(issue);
        if (issue) {
            const counter = issue.issue_counterId;
            const queue_num = issue.issue_counterId;
            console.log(queue_num);
            return res.json({ 'accessToken': token, 'counter': issue.issue_counterId, 'queue_num': issue.issue_queueNo });
        }
        return res.json({ 'accessToken': token });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});
exports.loginNuser = loginNuser;
//# sourceMappingURL=nusercontroller.js.map