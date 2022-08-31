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
exports.getcurrentnext4 = exports.getcurrentnext3 = exports.getcurrentnext2 = exports.counterclose = exports.loginCuser = void 0;
const index_1 = require("../index");
const Cuser_1 = require("../models/Cuser");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Counter_1 = require("../models/Counter");
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
const counterclose = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const counterRepository = yield index_1.AppDataSource.getRepository(Counter_1.Counter)
            .createQueryBuilder("counter")
            .update(Counter_1.Counter)
            .set({ isOnline: false })
            .where("cuser = :cuser", { cuser: req.body.userId })
            .execute();
        res.json({ message: "Counter closed" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.counterclose = counterclose;
const getcurrentnext2 = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const issueRepository = yield index_1.AppDataSource.getRepository(Counter_1.Counter)
            .createQueryBuilder("counter")
            .where("counter.id = :id", { id: 2 })
            .getRawOne();
        return (issueRepository);
    }
    catch (error) {
        return [];
    }
});
exports.getcurrentnext2 = getcurrentnext2;
const getcurrentnext3 = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const issueRepository = yield index_1.AppDataSource.getRepository(Counter_1.Counter)
            .createQueryBuilder("counter")
            .where("counter.id = :id", { id: 3 })
            .getRawOne();
        return (issueRepository);
    }
    catch (error) {
        return [];
    }
});
exports.getcurrentnext3 = getcurrentnext3;
const getcurrentnext4 = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const issueRepository = yield index_1.AppDataSource.getRepository(Counter_1.Counter)
            .createQueryBuilder("counter")
            .where("counter.id = :id", { id: 4 })
            .getRawOne();
        return (issueRepository);
    }
    catch (error) {
        return [];
    }
});
exports.getcurrentnext4 = getcurrentnext4;
//# sourceMappingURL=cusercontroller.js.map