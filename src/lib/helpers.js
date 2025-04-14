"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getID = void 0;
exports.getID = (function () {
    var id = 0;
    return function () {
        return id++;
    };
})();
