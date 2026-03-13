require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MONGO DB CONNECTED!');
    
    // Test: Create & save a farmer
    const FarmerSchema = new mongoose.Schema({
      name: String, phone: String, district: String
    });
    const Farmer = mongoose.model('Farmer', FarmerSchema);
    
    Farmer.create({name: 'Test Vinit', phone: '9999999999', district: 'Ernakulam'})
      .then(() => console.log('✅ FARMER SAVED!'))
      .catch(console.error)
      .finally(() => mongoose.connection.close());
  })
  .catch(err => console.error('❌ DB ERROR:', err.message));
