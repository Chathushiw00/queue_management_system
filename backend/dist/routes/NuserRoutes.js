"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Getqueue_1 = require("../libs/Getqueue");
const issuecontroller_1 = require("../controllers/issuecontroller");
const nusercontroller_1 = require("../controllers/nusercontroller");
const notificationcontroller_1 = require("../controllers/notificationcontroller");
const router = (0, express_1.Router)();
router.get('/havingissue', nusercontroller_1.issuehave);
router.post('/createissue', Getqueue_1.Getqueue, issuecontroller_1.issuecreate);
router.get('/getQueueDetails', issuecontroller_1.getissueQDetails);
router.delete('/cancelissue', issuecontroller_1.issuecancel);
router.get('/getnotifications', notificationcontroller_1.getNotifications);
exports.default = router;
//# sourceMappingURL=NuserRoutes.js.map