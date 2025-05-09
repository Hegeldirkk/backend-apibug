"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HackerModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const hacker_entity_1 = require("./hacker.entity");
const hacker_service_1 = require("./hacker.service");
const hacker_controller_1 = require("./hacker.controller");
const user_entity_1 = require("../user/user.entity");
const common_module_1 = require("../common/common.module");
let HackerModule = class HackerModule {
};
exports.HackerModule = HackerModule;
exports.HackerModule = HackerModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([hacker_entity_1.Hacker, user_entity_1.User]), common_module_1.CommonModule],
        controllers: [hacker_controller_1.HackerController],
        providers: [hacker_service_1.HackerService],
        exports: [hacker_service_1.HackerService],
    })
], HackerModule);
//# sourceMappingURL=hacker.module.js.map