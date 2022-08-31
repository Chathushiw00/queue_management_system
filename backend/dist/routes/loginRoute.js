"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logincontroller_1 = require("../controllers/logincontroller");
const logincontroller_2 = require("../controllers/logincontroller");
const router = (0, express_1.Router)();
router.post('/nuser/login', logincontroller_1.loginNuser);
router.post('/cuser/login', logincontroller_2.loginCuser);
exports.default = router;
//# sourceMappingURL=loginRoute.js.map