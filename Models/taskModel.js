const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true, default: Date.now },
    status: { type: String, default: 'pending' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true } 
}, {
    versionKey: false
});


const taskModel = mongoose.model("task", taskSchema)


module.exports = {
    taskModel
}