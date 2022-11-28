const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  try {
    const userId = req.user;
    await Fragment.byId(userId, req.params.id);
    await Fragment.delete(userId, req.params.id);
    res
      .status(200)
      .json(createSuccessResponse({}));
  } catch (error) {
    logger.warn(error);
    if (error.message == 'No such fragment!') {
        res.status(404).json(createErrorResponse(404, 'No such fragment!'));
    } else {
        res.status(500).json(createErrorResponse(500, error ? error.toString() : 'Internal Error.'));
    }
  }
};
