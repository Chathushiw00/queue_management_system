"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GenerateQueue_1 = require("../libs/GenerateQueue");
const issuecontroller_1 = require("../controllers/issuecontroller");
const nusercontroller_1 = require("../controllers/nusercontroller");
const router = (0, express_1.Router)();
router.post('/createissue', GenerateQueue_1.GenarateQueueNum, issuecontroller_1.createissue);
router.get('/havingissue', nusercontroller_1.havingissue);
router.post('/getissue', issuecontroller_1.getissue);
router.delete('/deleteissue', issuecontroller_1.deleteissue);
exports.default = router;
//# sourceMappingURL=normalUserRoutes.js.map