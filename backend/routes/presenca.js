const express = require('express');
const router = express.Router();
const presencaController = require('../controllers/presencaController');

router.get('/', presencaController.getAllPresenca);
router.post('/', presencaController.createPresenca);
router.put('/:id', presencaController.updatePresenca);
router.delete('/:id', presencaController.deletePresenca);

module.exports = router;
