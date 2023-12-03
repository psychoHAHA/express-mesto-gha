const { celebrate, Joi } = require('celebrate');

const { URLRegExpression } = require('../utils/constants');

module.exports.cardValidateId = (celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().length(24).alphanum(),
  }),
}));

module.exports.cardValidateInfo = (celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(new RegExp(URLRegExpression)),
  }),
}));
