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
router.put('/nextissuecalled/:id', issuecontroller_1.nextissuecalled);
router.put('/getnextissue/:id', issuecontroller_1.getnextissue);
router.put('/counterclose', cusercontroller_1.counterclose);
exports.default = router;
//# sourceMappingURL=counterUserRoutes.js.map