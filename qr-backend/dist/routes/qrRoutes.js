"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const qrController_js_1 = require("../controllers/qrController.js");
const router = express_1.default.Router();
router.get("/generate-qr", qrController_js_1.generateQR);
router.post("/verify-qr", qrController_js_1.verifyQR);
exports.default = router;
//# sourceMappingURL=qrRoutes.js.map