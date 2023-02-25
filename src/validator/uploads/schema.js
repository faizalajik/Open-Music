const Joi = require('joi');
 
const CoverHeadersSchema = Joi.object({
  'content-type': Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp').required(),
  'size' : 512000,
}).unknown();
 
module.exports = { CoverHeadersSchema };