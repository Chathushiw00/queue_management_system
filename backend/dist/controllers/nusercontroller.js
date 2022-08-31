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
exports.havingissue = void 0;
const index_1 = require("../index");
const Issue_1 = require("../models/Issue");
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
//# sourceMappingURL=nusercontroller.js.map