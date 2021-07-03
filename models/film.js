const mongoose = require('mongoose');
var conn = mongoose.Collection;
var filmSchema = new mongoose.Schema({
    Name:{
      type:String,
      required:true
    },
    Description:{
        type:String,
        required:true
      },
    Release_Date:{
        type:String,
        required:true
      },
    Rating:{
      type:Number,
        required:true,
        min: 1, 
        max: 5
      },
    Ticket_Price:{
        type:Number,
        required:true
      },
    Country:{
        type:String,
        required:true
      },
    Genre: [{ type:String,
       required:true,
      }],
    Photo:{
        type:String,
        required:true
      },

});

var filmModel = mongoose.model('film', filmSchema);
module.exports = filmModel;