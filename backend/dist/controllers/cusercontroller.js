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
exports.getcurr_next3 = exports.getcurr_next2 = exports.getcurr_next1 = exports.closecounter = exports.deleteCusers = exports.updateCusers = exports.getCuser = exports.getCusers = exports.createCuser = void 0;
const index_1 = require("../index");
const Cuser_1 = require("../models/Cuser");
const Issue_1 = require("../models/Issue");
const Counter_1 = require("../models/Counter");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createCuser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const cuser = new Cuser_1.Cuser();
        cuser.username = username;
        cuser.password = password;
        cuser.password = yield cuser.encryptPassword(cuser.password);
        const saveduser = yield cuser.save();
        const token = jsonwebtoken_1.default.sign({ id: saveduser.id }, process.env.TOKEN_SECRECT || 'tokentest');
        res.header('auth-token', token).json(saveduser);
    }
    catch (error) {
    }
});
exports.createCuser = createCuser;
const getCusers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cusers = yield Cuser_1.Cuser.find();
        res.json(cusers);
        console.log(req.body.userId);
    }
    catch (error) {
    }
});
exports.getCusers = getCusers;
const getCuser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        console.log(req.body.userId);
        const cuser = yield Cuser_1.Cuser.findOneBy({ id: parseInt(id) });
        res.json(cuser);
    }
    catch (error) {
    }
});
exports.getCuser = getCuser;
const updateCusers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield Cuser_1.Cuser.findOneBy({ id: parseInt(req.params.id) });
        if (!user)
            return res.status(404).json({ message: "user does not exists" });
        yield Cuser_1.Cuser.update({ id: parseInt(id) }, req.body);
        return res.json({ message: "successfully updated" });
    }
    catch (error) {
        return res.status(500).json({});
    }
});
exports.updateCusers = updateCusers;
const deleteCusers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield Cuser_1.Cuser.delete({ id: parseInt(id) });
        if (result.affected === 0) {
            return res.status(404).json({ message: "user does not exists" });
        }
        return res.json({ message: "successfully deleted" });
    }
    catch (error) {
        return res.status(500).json({});
    }
});
exports.deleteCusers = deleteCusers;
const closecounter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cuserIdentify = req.body.userId;
        const skipcounter = yield index_1.AppDataSource.getRepository(Counter_1.Counter)
            .createQueryBuilder("counter")
            .where("counter.cuser = :cuser", { cuser: cuserIdentify })
            .getOne();
        const counterRepository = yield index_1.AppDataSource.getRepository(Counter_1.Counter)
            .createQueryBuilder("counter")
            .update(Counter_1.Counter)
            .set({ isOnline: false })
            .where("cuser = :cuser", { cuser: cuserIdentify })
            .execute();
        let countissue = [];
        for (let i = 1; i <= 3; i++) {
            const checkcounter = yield index_1.AppDataSource.getRepository(Counter_1.Counter)
                .createQueryBuilder("counter")
                .where("id = :id", { id: i })
                .getOne();
            let conline = checkcounter.isOnline;
            if (conline) {
                const checkissues = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
                    .createQueryBuilder("issue")
                    .select("COUNT(issue.id)", "count")
                    .where("issue.counter = :counter", { counter: i })
                    .andWhere("issue.isDone = :isDone", { isDone: false })
                    .getRawOne();
                countissue[i - 1] = checkissues.count;
            }
            else {
                countissue[i - 1] = Infinity;
            }
        }
        let freequeue = 0;
        let a = countissue[0];
        let b = countissue[1];
        let c = countissue[2];
        if ((a == Infinity && b == Infinity && c == Infinity)) {
            return res.status(500).json({ message: 'No counter available' });
        }
        if (a <= b && a <= c) {
            freequeue = 1;
        }
        else if (b <= c) {
            freequeue = 2;
        }
        else {
            freequeue = 3;
        }
        const freeCounter = yield Counter_1.Counter.findOne({ where: { id: freequeue } });
        const changingIssues = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder("issue")
            .where("issue.counterId = :id", { id: skipcounter === null || skipcounter === void 0 ? void 0 : skipcounter.id })
            .andWhere("issue.isDone = :done", { done: false })
            .getManyAndCount();
        console.log(changingIssues);
        for (let n = 0; n < changingIssues[1]; n++) {
            let issueIdentity = changingIssues[0][n].id;
            const issueRepository = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
                .createQueryBuilder("issue")
                .select("MAX(issue.queueNo)", "max")
                .where("issue.counter = :counter", { counter: freequeue })
                .getRawOne();
            if (issueRepository.max == null) {
                issueRepository.max = 1;
            }
            else {
                issueRepository.max += 1;
            }
            const updateIssue = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
                .createQueryBuilder("issue")
                .update(Issue_1.Issue)
                .set({ queueNo: issueRepository.max, counter: freeCounter })
                .where("issue.id = :isId", { isId: issueIdentity })
                .execute();
        }
        return res.json({ message: "closed" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.closecounter = closecounter;
const getcurr_next1 = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const issueRepository = yield index_1.AppDataSource.getRepository(Counter_1.Counter)
            .createQueryBuilder("counter")
            .where("counter.id = :id", { id: 1 })
            .getRawOne();
        return (issueRepository);
    }
    catch (error) {
        return [];
    }
});
exports.getcurr_next1 = getcurr_next1;
const getcurr_next2 = () => __awaiter(void 0, void 0, void 0, function* () {
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
exports.getcurr_next2 = getcurr_next2;
const getcurr_next3 = () => __awaiter(void 0, void 0, void 0, function* () {
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
exports.getcurr_next3 = getcurr_next3;
//# sourceMappingURL=cusercontroller.js.map