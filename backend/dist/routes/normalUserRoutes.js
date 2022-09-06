"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GenerateQueue_1 = require("../libs/GenerateQueue");
const issuecontroller_1 = require("../controllers/issuecontroller");
const nusercontroller_1 = require("../controllers/nusercontroller");
const notificationcontroller_1 = require("../controllers/notificationcontroller");
const router = (0, express_1.Router)();
router.get('/havingissue', nusercontroller_1.havingissue);
router.post('/createissue', GenerateQueue_1.genarateQueueNum, issuecontroller_1.createissue);
router.get('/getissue', issuecontroller_1.getissueDetails);
router.delete('/deleteissue', issuecontroller_1.cancelissue);
router.get('/getnotifications', notificationcontroller_1.getNotifications);
exports.default = router;
//# sourceMappingURL=normalUserRoutes.js.map