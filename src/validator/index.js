const InvariantError = require('../exceptions/InvariantError');
const { AlbumPayloadSchema, MusicPayloadSchema, PlaylistPayloadSchema, PlaylistSongPayloadSchema, CollaborationPayloadSchema} = require('./schema');

const AlbumValidator = {
    validateAlbumPayload: (payload) => {
        const validationResult = AlbumPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

const MusicValidator = {
    validateMusicPayload: (payload) => {
        const validationResult = MusicPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

const PlaylistValidator = {
    validatePlaylistPayload: (payload) => {
        const validationResult = PlaylistPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

const PlaylistSongValidator = {
    validatePlaylistSongPayload: (payload) => {
        const validationResult = PlaylistSongPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

const CollaborationValidator = {
    validateCollaborationPayload: (payload) => {
        const validationResult = CollaborationPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = { AlbumValidator, MusicValidator, PlaylistValidator, CollaborationValidator, PlaylistSongValidator };