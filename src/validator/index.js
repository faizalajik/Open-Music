const InvariantError = require('../exceptions/InvariantError');
const { AlbumPayloadSchema, MusicPayloadSchema } = require('./schema');

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

module.exports = { AlbumValidator, MusicValidator };