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
exports.GenarateQueueNum = void 0;
const Issue_1 = require("../models/Issue");
const index_1 = require("../index");
const Counter_1 = require("../models/Counter");
const GenarateQueueNum = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const countissue = [];
        for (let i = 1; i <= 3; i++) {
            const checkcounter = yield index_1.AppDataSource.getRepository(Counter_1.Counter)
                .createQueryBuilder("counter")
                .where("id = :id", { id: i })
                .getOne();
            let conline = checkcounter.isOnline;
            console.log(i);
            console.log(conline);
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
        console.log(countissue[0]);
        console.log(countissue[1]);
        console.log(countissue[2]);
        let a = countissue[0];
        let b = countissue[1];
        let c = countissue[2];
        if ((a == Infinity && b == Infinity && c == Infinity)) {
            return res.status(500).json({ message: 'No counter available' });
        }
        if (a < b && a < c) {
            freequeue = 1;
        }
        else if (b < c) {
            freequeue = 2;
        }
        else {
            freequeue = 3;
        }
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
        req.body.queueNo = issueRepository.max;
        req.body.counter = freequeue;
        return next();
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.GenarateQueueNum = GenarateQueueNum;
//# sourceMappingURL=GenerateQueue.js.map