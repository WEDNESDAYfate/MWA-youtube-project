const mongoose = require("mongoose");

const playlistSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    numberOfVideos: {
        type: Number,
        min: 0,
        default: 0
    },
});


const channelSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    numberOfSubscribers: {
        type: Number,
        min: 0,
        default: 0,

    },
    startYear: {
        type: Number,
        require: true,
    },
    playlist: [playlistSchema],

});

mongoose.model(process.env.DB_CHANNEL_MODEL, channelSchema, process.env.DB_CHANNEL_COLLECTION);