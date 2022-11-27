const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createSuccessResponse, createErrorResponse } = require('../../response');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  try {
    const userId = req.user;
    const expand = req.query.expand === 1;
    const fragments = await Fragment.byUser(userId, expand);
    res.status(200).json(createSuccessResponse({ fragments: fragments }));
  } catch (error) {
    logger.warn(error);
    res.status(500).json(createErrorResponse(500, 'internal error'));
  }
};
