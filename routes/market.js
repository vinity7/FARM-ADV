const express = require('express');
const router = express.Router();

const mockPrices = {
    rice: "₹45/kg",
    banana: "₹30/kg",
    coconut: "₹25/piece",
    rubber: "₹160/kg",
    pepper: "₹500/kg"
};

router.get('/:crop', (req, res) => {
    const crop = req.params.crop.toLowerCase();
    const price = mockPrices[crop];
    if (price) {
        res.json({ crop, price, date: new Date().toISOString() });
    } else {
        res.status(404).json({ message: "Crop price not found" });
    }
});

module.exports = router;
