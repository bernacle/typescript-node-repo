"use strict";

var _tsyringe = require("tsyringe");

var _mail = _interopRequireDefault(require("../../../../config/mail"));

var _EherealMailProvider = _interopRequireDefault(require("./implementations/EherealMailProvider"));

var _SESMailprovider = _interopRequireDefault(require("./implementations/SESMailprovider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const providers = {
  ethereal: _tsyringe.container.resolve(_EherealMailProvider.default),
  ses: _tsyringe.container.resolve(_SESMailprovider.default)
};

_tsyringe.container.registerInstance("MailProvider", providers[_mail.default.driver]);