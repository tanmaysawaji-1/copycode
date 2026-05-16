const mongoose = require('mongoose');

const { HoldingSchema } = require('../backendschems/Holdingschema');
const Holdingmodel = mongoose.model('Holding', HoldingSchema);

module.exports = { Holdingmodel };