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
exports.Notification = void 0;
const typeorm_1 = require("typeorm");
const Nuser_1 = require("./Nuser");
const Issue_1 = require("./Issue");
let Notification = class Notification extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Notification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Notification.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Issue_1.Issue, (issue) => issue.notifications),
    __metadata("design:type", Issue_1.Issue)
], Notification.prototype, "issue", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Nuser_1.Nuser, (nuser) => nuser.notifications),
    __metadata("design:type", Nuser_1.Nuser)
], Notification.prototype, "nuser", void 0);
Notification = __decorate([
    (0, typeorm_1.Entity)()
], Notification);
exports.Notification = Notification;
//# sourceMappingURL=Notification.js.map