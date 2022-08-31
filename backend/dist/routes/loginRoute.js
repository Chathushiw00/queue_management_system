"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nusercontroller_1 = require("../controllers/nusercontroller");
const cusercontroller_1 = require("../controllers/cusercontroller");
const router = (0, express_1.Router)();
router.post('/nuser/login', nusercontroller_1.loginNuser);
router.post('/cuser/login', cusercontroller_1.loginCuser);
exports.default = router;
//# sourceMappingURL=loginRoute.js.map