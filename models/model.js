const mongoose = require('mongoose');

const schema = mongoose.Schema;

const ModelSchema = new schema({
    name: {type: String, required: true},
    make: { type: schema.Types.ObjectId, ref: "Make", required: true }
})

ModelSchema.virtual("url").get(function () {
    return `/catalog/${this.make.name}/${this.name}}`
})

module.exports = mongoose.model('Model', ModelSchema);