"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const QueueGenerate_1 = require("../libs/QueueGenerate");
const issuecontroller_1 = require("../controllers/issuecontroller");
const nusercontroller_1 = require("../controllers/nusercontroller");
const notificationcontroller_1 = require("../controllers/notificationcontroller");
const router = (0, express_1.Router)();
router.get('/havingissue', nusercontroller_1.havingissue);
router.post('/createissue', QueueGenerate_1.genarateQueueNum, issuecontroller_1.createissue);
router.get('/getQueueDetails', issuecontroller_1.getissueQDetails);
router.delete('/cancelissue', issuecontroller_1.cancelissue);
router.get('/getnotifications', notificationcontroller_1.getNotifications);
exports.default = router;
//# sourceMappingURL=NuserRoutes.js.map