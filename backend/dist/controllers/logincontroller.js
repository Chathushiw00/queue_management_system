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
exports.loginCuser = exports.loginNuser = void 0;
const Nuser_1 = require("../models/Nuser");
const Cuser_1 = require("../models/Cuser");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Counter_1 = require("../models/Counter");
const Issue_1 = require("../models/Issue");
const index_1 = require("../index");
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
const loginCuser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const cuser = yield Cuser_1.Cuser.findOneBy({ username: username });
        if (!cuser)
            return res.status(400).json('username or password is wrong');
        const correctPassword = yield cuser.validatePassword(password);
        if (!correctPassword)
            return res.status(400).json('invalid password');
        const counterinfo = yield index_1.AppDataSource.getRepository(Counter_1.Counter)
            .createQueryBuilder("counter")
            .where("counter.cuser = :cuser", { cuser: cuser.id })
            .andWhere("counter.isOnline = :online", { online: 0 })
            .getOne();
        if (!counterinfo) {
            const newcounter = yield index_1.AppDataSource.getRepository(Counter_1.Counter)
                .createQueryBuilder("counter")
                .where("counter.isOnline = :online", { online: 0 })
                .getOne();
            if (!newcounter)
                return res.json({ 'message': 'no counter available' });
            const updateCounter = yield index_1.AppDataSource
                .createQueryBuilder()
                .update(Counter_1.Counter)
                .set({
                cuser: cuser,
                isOnline: true
            })
                .where("id = :counter", { counter: newcounter.id })
                .execute();
            newcounter.isOnline = true;
            const token = jsonwebtoken_1.default.sign({ id: cuser.id }, process.env.TOKEN_SECRECT || 'tokentest');
            return res.json({ 'accessToken': token, 'counterinfo': newcounter });
        }
        else {
            const updateCounter = yield index_1.AppDataSource
                .createQueryBuilder()
                .update(Counter_1.Counter)
                .set({
                cuser: cuser,
                isOnline: true
            })
                .where("id = :counter", { counter: counterinfo.id })
                .execute();
            const token = jsonwebtoken_1.default.sign({ id: cuser.id }, process.env.TOKEN_SECRET || 'tokentest');
            return res.json({ 'accessToken': token, 'counterinfo': counterinfo });
        }
    }
    catch (error) {
        return res.status(500).json({});
    }
});
exports.loginCuser = loginCuser;
//# sourceMappingURL=logincontroller.js.map