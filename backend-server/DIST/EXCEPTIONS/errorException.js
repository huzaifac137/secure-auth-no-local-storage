"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorException = void 0;
class errorException extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
        this.message = message;
    }
}
exports.errorException = errorException;
