"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const issuecontroller_1 = require("../controllers/issuecontroller");
const cusercontroller_1 = require("../controllers/cusercontroller");
const router = (0, express_1.Router)();
router.get('/getcounterissues', issuecontroller_1.getcounterissues);
router.put('/issuecalled/:id', issuecontroller_1.issuecalled);
router.get('/issue/:id', issuecontroller_1.getsingleissue);
router.get('/issuedone/:id', issuecontroller_1.issuedone);
router.put('/getDoneNextissue/:id', issuecontroller_1.getDoneNextissue);
router.get('/counterclose', cusercontroller_1.counterclose);
exports.default = router;
//# sourceMappingURL=CuserRoutes.js.map