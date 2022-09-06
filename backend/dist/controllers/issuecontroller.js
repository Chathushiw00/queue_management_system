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
exports.getDoneNextissue = exports.issuedone = exports.issuecalled = exports.getsingleissue = exports.getcounterissues = exports.cancelissue = exports.getissueQDetails = exports.createissue = exports.doneandnext = exports.NotificationY = void 0;
const index_1 = require("../index");
const Issue_1 = require("../models/Issue");
const Counter_1 = require("../models/Counter");
const Notification_1 = require("../models/Notification");
class NotificationY {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.send('Hello!! Mister You are the next get ready');
        });
    }
}
exports.NotificationY = NotificationY;
const doneandnext = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const getnext = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder("Issue")
            .where("id = :id", { id: id })
            .getOne();
        return res.json(getnext);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.doneandnext = doneandnext;
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
const getissueQDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const issueRepository = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder("issue")
            .loadAllRelationIds()
            .where("issue.nuser = :nuser", { nuser: req.body.userId })
            .andWhere("issue.isDone = :isDone", { isDone: false })
            .getOne();
        const counterDetails = yield index_1.AppDataSource.getRepository(Counter_1.Counter)
            .createQueryBuilder("counter")
            .where("counter.id = :counter", { counter: issueRepository === null || issueRepository === void 0 ? void 0 : issueRepository.counter })
            .getOne();
        console.log(counterDetails);
        if ((issueRepository === null || issueRepository === void 0 ? void 0 : issueRepository.queueNo) == (counterDetails === null || counterDetails === void 0 ? void 0 : counterDetails.next_num)) {
            res.json({
                counter_num: counterDetails === null || counterDetails === void 0 ? void 0 : counterDetails.id,
                message: "You' re Next"
            });
        }
        else {
            res.json({
                counterNo: counterDetails === null || counterDetails === void 0 ? void 0 : counterDetails.id,
                current_num: counterDetails === null || counterDetails === void 0 ? void 0 : counterDetails.current_num,
                next_num: counterDetails === null || counterDetails === void 0 ? void 0 : counterDetails.next_num,
                my_num: issueRepository === null || issueRepository === void 0 ? void 0 : issueRepository.queueNo
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getissueQDetails = getissueQDetails;
const cancelissue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Issue_1.Issue.delete({ nuser: req.body.userId });
        if (result.affected === 0) {
            return res.status(404).json({ message: "user does not exists" });
        }
        res.cookie('jwt', '', { maxAge: 1 });
        req.body.userId = null;
        return res.json({ message: "successfully deleted and logged out " });
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});
exports.cancelissue = cancelissue;
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
        const issue = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder("issue")
            .loadAllRelationIds()
            .where("issue.id = :id", { id: parseInt(req.params.id) })
            .getOne();
        if (!issue)
            return res.status(404).json({ message: "issue does not exists" });
        const callnotify = new Notification_1.Notification();
        callnotify.message = "Please attend to the counter " + issue.counter + " now";
        callnotify.issue = issue;
        callnotify.nuser = issue.nuser;
        const savedissue = yield callnotify.save();
        const getNextIssue = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder("issue")
            .where("issue.queueNo > :qN", { qN: issue.queueNo })
            .andWhere("issue.isCalled = :called", { called: false })
            .andWhere("issue.isDone = :done", { done: false })
            .andWhere("issue.counterId = :counter", { counter: issue.counter })
            .getOne();
        if (!getNextIssue) {
            const updateCounter = yield index_1.AppDataSource.getRepository(Counter_1.Counter)
                .createQueryBuilder()
                .update(Counter_1.Counter)
                .set({ current_num: issue.queueNo, next_num: 0 })
                .where("id = :cid", { cid: issue.counter })
                .execute();
        }
        else {
            const nextnotify = new Notification_1.Notification();
            nextnotify.message = "please attend to the counter " + getNextIssue.counter + " now";
            nextnotify.issue = getNextIssue;
            nextnotify.nuser = getNextIssue.nuser;
            const savedissue = yield callnotify.save();
            const updateCounter = yield index_1.AppDataSource.getRepository(Counter_1.Counter)
                .createQueryBuilder()
                .update(Counter_1.Counter)
                .set({ current_num: issue.queueNo, next_num: getNextIssue === null || getNextIssue === void 0 ? void 0 : getNextIssue.queueNo })
                .where("id = :cid", { cid: issue.contact })
                .execute();
        }
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
const getDoneNextissue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const issueRepository = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder()
            .update(Issue_1.Issue)
            .set({ isDone: true })
            .where("id = :id", { id: id })
            .execute();
        const counterRepository = yield index_1.AppDataSource.getRepository(Counter_1.Counter)
            .createQueryBuilder("counter")
            .where("counter.cuser = :cuser", { cuser: req.body.userId })
            .getOne();
        console.log(counterRepository);
        const nextCall = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder()
            .update(Issue_1.Issue)
            .set({ isCalled: true })
            .where("queueNo = :queueNo", { queueNo: counterRepository === null || counterRepository === void 0 ? void 0 : counterRepository.next_num })
            .andWhere("counterId = :counter", { counter: counterRepository === null || counterRepository === void 0 ? void 0 : counterRepository.id })
            .execute();
        const nextissue = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder("issue")
            .where("issue.queueNo = :queueNo", { queueNo: counterRepository === null || counterRepository === void 0 ? void 0 : counterRepository.next_num })
            .andWhere("issue.counterId = :counter", { counter: counterRepository === null || counterRepository === void 0 ? void 0 : counterRepository.id })
            .getOne();
        console.log(nextissue);
        const nextnum = yield index_1.AppDataSource.getRepository(Issue_1.Issue)
            .createQueryBuilder("issue")
            .select("MIN(issue.queueNo)", "min")
            .where("issue.counterId = :counter", { counter: counterRepository === null || counterRepository === void 0 ? void 0 : counterRepository.id })
            .andWhere("issue.isCalled = :isCalled", { isCalled: false })
            .andWhere("issue.isDone = :isDone", { isDone: false })
            .getRawOne();
        let nextnumber = nextnum.min;
        const current = counterRepository === null || counterRepository === void 0 ? void 0 : counterRepository.next_num;
        if (nextnumber == null) {
            nextnumber = 0;
        }
        console.log(nextnumber);
        console.log(current);
        const counterassign = yield index_1.AppDataSource.getRepository(Counter_1.Counter)
            .createQueryBuilder()
            .update(Counter_1.Counter)
            .set({ current_num: current, next_num: nextnumber })
            .where("counter.id = :id", { id: counterRepository === null || counterRepository === void 0 ? void 0 : counterRepository.id })
            .execute();
        console.log(counterassign);
        res.json(nextissue);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getDoneNextissue = getDoneNextissue;
//# sourceMappingURL=issuecontroller.js.map