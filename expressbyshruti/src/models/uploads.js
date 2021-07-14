const mongoose = require('mongoose');
 
const FileSchema = new mongoose.Schema({
    type: String,
    fname: String,
    data: Buffer
    
    

    
});


module.exports = mongoose.model('FILEDATA', FileSchema);