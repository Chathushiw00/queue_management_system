"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Issue = void 0;
const typeorm_1 = require("typeorm");
const Counter_1 = require("./Counter");
const Nuser_1 = require("./Nuser");
const Notification_1 = require("./Notification");
let Issue = class Issue extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Issue.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 100,
    }),
    __metadata("design:type", String)
], Issue.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Issue.prototype, "contact", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Issue.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Issue.prototype, "issue", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Issue.prototype, "queueNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Issue.prototype, "isCalled", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Issue.prototype, "isDone", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Nuser_1.Nuser, (nuser) => nuser.issues),
    __metadata("design:type", Nuser_1.Nuser)
], Issue.prototype, "nuser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Counter_1.Counter, (counter) => counter.issues),
    __metadata("design:type", Counter_1.Counter)
], Issue.prototype, "counter", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Notification_1.Notification, (notification) => notification.issue),
    __metadata("design:type", Array)
], Issue.prototype, "notifications", void 0);
Issue = __decorate([
    (0, typeorm_1.Entity)()
], Issue);
exports.Issue = Issue;
//# sourceMappingURL=Issue.js.map