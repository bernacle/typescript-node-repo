"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    driver: process.env.MAIL_DRIVER || "ethereal",
    defaults: {
        from: {
            email: "dev@brunosimplicio.com",
            name: "Bruno Simplicio",
        },
    },
};
