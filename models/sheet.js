const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SheetSchema = new Schema({
    title: String,
    name: String,
    description: String,
    ancestry: String,
    level: Number,
    novice: String,
    expert: String,
    master: String,
    professions: String,
    talents: String,
    magic: String,
    weapons: String,
    equipment: String,
    strength: Number,
    agility: Number,
    health: Number,
    intellect: Number,
    will: Number,
    size: Number,
    speed: Number,
    insanity: Number,
    perception: Number,
    defense: Number,
    healingRate: Number,
    corruption: Number,
    power: Number,
    damage: Number,
    notes: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Sheet', SheetSchema)