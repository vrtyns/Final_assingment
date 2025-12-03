const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');
const authMiddleware = require('../middleware/auth');

// All rental routes require authentication
router.use(authMiddleware);

router.post('/', rentalController.createRental);
router.get('/active', rentalController.getActiveRentals);
router.get('/history', rentalController.getRentalHistory);
router.get('/stats', rentalController.getRentalStats);
router.put('/:rental_id/extend', rentalController.extendRental);

module.exports = router;