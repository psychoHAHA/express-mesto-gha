const { celebrate, Joi } = require('celebrate');
const { URLRegExpression } = require('../utils/constants');

module.exports.userValidateId = (celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24).alphanum(),
  }),
}));

module.exports.userValidateInfo = (celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}));

module.exports.userValidateAvatar = (celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(new RegExp(URLRegExpression)),
  }),
}));

module.exports.userValidateAuth = (celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp(URLRegExpression)),
  }),
}));
