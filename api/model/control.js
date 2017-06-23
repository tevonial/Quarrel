/**
 * Created by tevonial on 6/22/2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var controlSchema = new Schema({
    name: String
});
controlSchema.set('collection', 'control');

mongoose.model('Control', controlSchema);
