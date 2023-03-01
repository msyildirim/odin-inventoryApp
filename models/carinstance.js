const mongoose = require('mongoose');

const schema = mongoose.Schema;
mongoose.set('debug', true);

const CarInstanceSchema = new schema({
    plate: { type: String, maxLength: 9, required: true },
    model: { type: schema.Types.ObjectId, ref: "Model", required: true },
    year: { type: Number, max: 2023, min: 1900}

})

CarInstanceSchema.virtual("url").get(function () {
    return `/catalog/${this.make.name}/${this.model.name}/${this._id}`;
})

module.exports = mongoose.model("CarInstance", CarInstanceSchema)