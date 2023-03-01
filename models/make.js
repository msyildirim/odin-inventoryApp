const mongoose = require('mongoose');

const schema = mongoose.Schema;

const MakeSchema = new schema({
    name: { type: String, required: true, maxLength: 100}
})

MakeSchema.virtual("url").get(function () {
    return `/catalog/make/${this.name}`
})

module.exports = mongoose.model("Make", MakeSchema)