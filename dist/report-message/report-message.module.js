"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportMessageModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const report_message_entity_1 = require("./report-message.entity");
const report_message_service_1 = require("./report-message.service");
const report_message_controller_1 = require("./report-message.controller");
const upload_module_1 = require("../common/upload/upload.module");
const hacker_entity_1 = require("../hacker/hacker.entity");
const company_entity_1 = require("../company/company.entity");
const report_entity_1 = require("../report/report.entity");
let ReportMessageModule = class ReportMessageModule {
};
exports.ReportMessageModule = ReportMessageModule;
exports.ReportMessageModule = ReportMessageModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([report_message_entity_1.ReportMessage, hacker_entity_1.Hacker, company_entity_1.Company, report_entity_1.Report]), upload_module_1.UploadModule],
        controllers: [report_message_controller_1.ReportMessageController],
        providers: [report_message_service_1.ReportMessageService],
    })
], ReportMessageModule);
//# sourceMappingURL=report-message.module.js.map