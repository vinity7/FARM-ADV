const express = require('express');
const router = express.Router();

const mockCalendar = {
    "palakkad": [
        { crop: "Paddy", season: "Kharif", sowing: "June-July", harvest: "October-November" },
        { crop: "Paddy", season: "Rabi", sowing: "November-December", harvest: "February-March" }
    ],
    "idukki": [
        { crop: "Pepper", season: "Perennial", sowing: "May-June", harvest: "December-January" },
        { crop: "Cardamom", season: "Perennial", sowing: "June-July", harvest: "August-February" }
    ],
    "kottayam": [
        { crop: "Rubber", season: "Year-round", tapping: "June-January" },
        { crop: "Tapioca", season: "Kharif", sowing: "April-May", harvest: "December-January" }
    ]
};

router.get('/:district', (req, res) => {
    const district = req.params.district.toLowerCase();
    const schedule = mockCalendar[district];
    if (schedule) {
        res.json({ district, schedule });
    } else {
        res.status(404).json({ message: "No schedule found for this district. Try Palakkad, Idukki, or Kottayam." });
    }
});

module.exports = router;
