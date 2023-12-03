const { celebrate, Joi } = require('celebrate');

const { URLRegExpression } = require('../utils/constants');

module.exports.cardValidateId = (celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24).alphanum(),
  }),
}));

module.exports.cardValidateInfo = (celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(new RegExp(URLRegExpression)),
  }),
}));

module.exports.validateDeleteLikeCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

module.exports.validatePutLikeCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});

module.exports.validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(URLRegExpression).required(),
  }),
});

module.exports.validateDeleteCardById = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex().required(),
  }),
});
