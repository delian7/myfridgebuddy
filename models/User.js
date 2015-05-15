var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    email: {type: String},
});

module.exports = mongoose.model('User', userSchema);
