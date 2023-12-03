const router = require('express').Router();
const { cardValidateId, cardValidateInfo, validatePutLikeCard, validateDeleteLikeCard } = require('../middlewares/cardValidation');

const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', cardValidateInfo, createCard);
router.delete('/cards/:cardId', cardValidateId, deleteCard);
router.put('/cards/:cardId/likes', validatePutLikeCard, likeCard);
router.delete('/cards/:cardId/likes', validateDeleteLikeCard, dislikeCard);

module.exports = router;
