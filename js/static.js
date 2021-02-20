var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Dog = /** @class */ (function () {
    function Dog() {
    }
    Dog.bark = function () {
        console.log('汪汪汪...');
    };
    ;
    return Dog;
}());
var HSQ = /** @class */ (function (_super) {
    __extends(HSQ, _super);
    function HSQ() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return HSQ;
}(Dog));
HSQ.bark();
