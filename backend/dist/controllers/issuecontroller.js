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
exports.nextissuecalled = exports.getnextissue = exports.issuedone = exports.issuecalled = exports.getsingleissue = exports.getcounterissues = exports.deleteissue = exports.getissue = exports.createissue = void 0;
const index_1 = require("../index");
const Issue_1 = require("../models/Issue");
const Counter_1 = require("../models/Counter");
const createissue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, contact, email, issue, counter, userId, queueNo } = req.body;
        const issues = new Issue_1.Issue();
        issues.name = name;
        issues.contact = contact;
        issues.email = email;
        issues.issue = issue;
        issues.nuser = userId;
        issues.counter = counter;
        issues.queueNo = queueNo;
        const savedissue = yield issues.save();
        res.json(savedissue);
    }
    catch (error) {
        res.status(500).json({ messae: error.messae });
    }
});
exports.createissue = createissue;
const getissue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const issueRepository = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder("issue")
            .where("issue.nuser = :nuser", { nuser: req.body.userId })
            .andWhere("issue.isDone = :isDone", { isDone: false })
            .getMany();
        res.json(issueRepository.length);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getissue = getissue;
const deleteissue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Issue_1.Issue.delete({ nuser: req.body.userId });
        if (result.affected === 0) {
            return res.status(404).json({ message: "user does not exists" });
        }
        return res.json({ message: "successfully deleted " });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});
exports.deleteissue = deleteissue;
const getcounterissues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const perPage = 5;
    const skip = (page - 1) * perPage;
    try {
        const counterRepository = yield index_1.AppDataSource.getRepository(Counter_1.Counter)
            .createQueryBuilder("counter")
            .where("counter.cuser = :cuser", { cuser: req.body.userId })
            .getRawOne();
        const issueRepository = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder("issue")
            .where("issue.counter = :counter", { counter: counterRepository.counter_id })
            .andWhere("issue.isDone =:isDone", { isDone: false })
            .orderBy("issue.queueNo", "ASC")
            .limit(perPage)
            .offset(skip)
            .getManyAndCount();
        res.json({
            issues: issueRepository[0],
            page: page,
            total: issueRepository[1],
            totalIssues: issueRepository[1],
            lastPage: Math.ceil(issueRepository[1] / perPage)
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getcounterissues = getcounterissues;
const getsingleissue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const issueRepository = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder("issue")
            .where("issue.id = :id", { id: parseInt(id) })
            .getOne();
        res.json(issueRepository);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getsingleissue = getsingleissue;
const issuecalled = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield Issue_1.Issue.findOneBy({ id: parseInt(req.params.id) });
        if (!user)
            return res.status(404).json({ message: "issue does not exists" });
        const issueRepository = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder()
            .update(Issue_1.Issue)
            .set({ isCalled: true })
            .where("id = :id", { id: id })
            .execute();
        return res.json({ message: " successfully updated " });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.issuecalled = issuecalled;
const issuedone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield Issue_1.Issue.findOneBy({ id: parseInt(req.params.id) });
        if (!user)
            return res.status(404).json({ message: "issue does not exists" });
        const issueRepository = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder()
            .update(Issue_1.Issue)
            .set({ isDone: true })
            .where("id = :id", { id: id })
            .execute();
        return res.json({ message: "successfully updated " });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.issuedone = issuedone;
const getnextissue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const issueRepository = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder()
            .update(Issue_1.Issue)
            .set({ isDone: true })
            .where("id = :id", { id: id })
            .execute();
        console.log(id);
        console.log(req.body.userId);
        const counterRepository = yield index_1.AppDataSource.getRepository(Counter_1.Counter)
            .createQueryBuilder("counter")
            .where("counter.cuser = :cuser", { cuser: req.body.userId })
            .getRawOne();
        console.log(counterRepository.counter_next_num);
        const doiscalled = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder()
            .update(Issue_1.Issue)
            .set({ isCalled: true })
            .where("queueNo = :queueNo", { queueNo: counterRepository.counter_nextNum })
            .andWhere("counter = :counter", { counter: counterRepository.counter_id })
            .execute();
        console.log(doiscalled);
        const nextissue = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder("issue")
            .where("issue.queueNo = :queueNo", { queueNo: counterRepository.counter_nextNum })
            .andWhere("issue.counter = :counter", { counter: counterRepository.counter_id })
            .getOne();
        console.log(nextissue);
        const nextnum = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder("issue")
            .select("MIN(issue.queueNo)", "min")
            .where("issue.counter = :counter", { counter: counterRepository.counter_id })
            .andWhere("issue.isCalled = :isCalled", { isCalled: false })
            .andWhere("issue.isDone = :isDone", { isDone: false })
            .getRawOne();
        let nextnum1 = nextnum.min;
        const current = counterRepository.counter_next_num;
        if (nextnum1 == null) {
            nextnum1 = 0;
        }
        console.log(nextnum1);
        console.log(current);
        const counterassign = yield index_1.AppDataSource.getRepository(Counter_1.Counter)
            .createQueryBuilder()
            .update(Counter_1.Counter)
            .set({ current_num: current, next_num: nextnum1 })
            .where("counter.id = :id", { id: counterRepository.counter_id })
            .execute();
        console.log(counterassign);
        res.json(nextissue);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getnextissue = getnextissue;
const nextissuecalled = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const counterRepository = yield index_1.AppDataSource.getRepository(Counter_1.Counter)
            .createQueryBuilder("counter")
            .where("counter.cuser = :cuser", { cuser: req.body.userId })
            .getRawOne();
        console.log(counterRepository.counter_id);
        const nextnum = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder("issue")
            .select("MIN(issue.queueNo)", "min")
            .where("issue.counter = :counter", { counter: counterRepository.counter_id })
            .andWhere("issue.isCalled = :isCalled", { isCalled: false })
            .andWhere("issue.isDone = :isDone", { isDone: false })
            .getRawOne();
        let nextnum1 = nextnum.min;
        const current = parseInt(req.params.id);
        if (nextnum1 == null) {
            nextnum1 = 0;
        }
        const counterassign = yield index_1.AppDataSource.getRepository(Counter_1.Counter)
            .createQueryBuilder()
            .update(Counter_1.Counter)
            .set({ current_num: current, next_num: nextnum1 })
            .where("counter.id = :id", { id: counterRepository.counter_id })
            .execute();
        res.json(counterassign);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.nextissuecalled = nextissuecalled;
//# sourceMappingURL=issuecontroller.js.map