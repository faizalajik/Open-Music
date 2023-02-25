const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
    name: Joi.string().required(),
    year: Joi.number().required()
});
const PlaylistPayloadSchema = Joi.object({
    name: Joi.string().required(),
    owner: Joi.string()
});
const PlaylistSongPayloadSchema = Joi.object({
    playlistId: Joi.string(),
    songId: Joi.string().required()
});
const CollaborationPayloadSchema = Joi.object({
    playlistId: Joi.string(),
    userId: Joi.string()
});
const MusicPayloadSchema = Joi.object({
    title: Joi.string().required(),
    year: Joi.number().required(),
    genre: Joi.string().required(),
    performer: Joi.string().required(),
    duration: Joi.number(),
    albumId: Joi.string(),
});

module.exports = {
    AlbumPayloadSchema,
    MusicPayloadSchema,
    CollaborationPayloadSchema,
    PlaylistPayloadSchema,
    PlaylistSongPayloadSchema
};