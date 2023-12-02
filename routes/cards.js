const router = require('express').Router();
const { cardValidateId, cardValidateInfo } = require('../middlewares/cardValidation');

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
router.put('/cards/:cardId/likes', cardValidateId, likeCard);
router.delete('/cards/:cardId/likes', cardValidateId, dislikeCard);

module.exports = router;
