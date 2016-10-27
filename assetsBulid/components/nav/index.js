"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define("components/nav/index.js", function (require, exports, module) {
    "use strict";

    var React = require('react');
    var react_router_1 = require('react-router');
    var antd_1 = require('antd');

    var Component = function (_React$Component) {
        _inherits(Component, _React$Component);

        function Component() {
            _classCallCheck(this, Component);

            return _possibleConstructorReturn(this, (Component.__proto__ || Object.getPrototypeOf(Component)).apply(this, arguments));
        }

        _createClass(Component, [{
            key: "render",
            value: function render() {
                return React.createElement(antd_1.Menu, { theme: "dark", mode: "horizontal", style: { lineHeight: '64px' } }, React.createElement(antd_1.Menu.Item, { key: "1" }, React.createElement(react_router_1.Link, { to: "/react" }, "react")), React.createElement(antd_1.Menu.Item, { key: "2" }, React.createElement(react_router_1.Link, { to: "/redux" }, "redux")), React.createElement(antd_1.Menu.Item, { key: "3" }, React.createElement(react_router_1.Link, { to: "/antd" }, "antd")));
            }
        }]);

        return Component;
    }(React.Component);

    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Component;
});
//# sourceMappingURL=index.js.map
