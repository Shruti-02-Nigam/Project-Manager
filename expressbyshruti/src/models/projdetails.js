const mongoose = require('mongoose');
 
const TeamSchema = new mongoose.Schema({
    projectname : {
        type: String,
        required:true
    },
    desc :{
        type: String
    },

    membername1 : {
        type: String,
        required:true
    },
    membername2: {
        type: String
        
        
    },
    membername3: {
        type: String
        
    },
    membername4: {
        type: String
        
    }
});
    
    
module.exports = mongoose.model('TEAMDATA', TeamSchema);