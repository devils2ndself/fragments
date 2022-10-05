const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse } = require('../../response');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  try {
    const userId = 'test';
    const fragment = await Fragment.byId(userId, req.params.id);
    const data = await fragment.getData();
    res.status(200).set({ 'Content-Type': fragment.type }).send(data);
  } catch (error) {
    if (error.message == 'No such fragment!') {
      res.status(404).json(createErrorResponse(404, 'No such fragment!'));
    } else {
      logger.warn(error);
      res.status(500).json(createErrorResponse(500, 'internal error'));
    }
  }
};
