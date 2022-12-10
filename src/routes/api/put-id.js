const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');
const logger = require('../../logger');
const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  try {
    const userId = req.user;
    const fragment = await Fragment.byId(userId, req.params.id);
    if (Buffer.isBuffer(req.body) !== true) {
      res.status(415).json(createErrorResponse(415, 'Content-Type not supported!'));
      return;
    }
    if (fragment.type !== contentType.parse(req).type) {
      res.status(400).json(createErrorResponse(400, 'Mismatched Content-Type!'));
      return;
    }
    await fragment.setData(req.body);
    res
      .status(200)
      .json(createSuccessResponse({ fragment: fragment }));
  } catch (error) {
    logger.warn(error);
    if (error.message == 'No such fragment!') {
        res.status(404).json(createErrorResponse(404, 'No such fragment!'));
    } else {
        res.status(500).json(createErrorResponse(500, error ? error.toString() : 'Internal Error.'));
    }
  }
};
