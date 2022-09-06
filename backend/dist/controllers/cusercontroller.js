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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getcurrentnext3 = exports.getcurrentnext2 = exports.getcurrentnext1 = exports.counterclose = void 0;
const index_1 = require("../index");
const Issue_1 = require("../models/Issue");
const Counter_1 = require("../models/Counter");
const counterclose = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        res.cookie('jwt', '', { maxAge: 1 });
        req.body.userId = null;
        return res.json({ message: "Counter closed" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.counterclose = counterclose;
const getcurrentnext1 = () => __awaiter(void 0, void 0, void 0, function* () {
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
exports.getcurrentnext1 = getcurrentnext1;
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
//# sourceMappingURL=cusercontroller.js.map