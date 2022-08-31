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
exports.getcurrentnext4 = exports.getcurrentnext3 = exports.getcurrentnext2 = exports.counterclose = void 0;
const index_1 = require("../index");
const Counter_1 = require("../models/Counter");
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