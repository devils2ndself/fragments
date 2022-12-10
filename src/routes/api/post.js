const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');
const logger = require('../../logger');
const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  try {
    if (Buffer.isBuffer(req.body) !== true) {
      res.status(415).json(createErrorResponse(415, 'Content-Type not supported!'));
      return;
    }
    const userId = req.user;
    const newFragment = new Fragment({ ownerId: userId, type: contentType.parse(req).type });
    await newFragment.save();
    await newFragment.setData(req.body);
    const location = 'http://' + req.headers.host + '/v1/fragments/' + newFragment.id;
    res
      .status(201)
      .set({ Location: location })
      .json(createSuccessResponse({ fragment: newFragment }));
  } catch (error) {
    logger.warn(error);
    res.status(500).json(createErrorResponse(500, error ? error.toString() : 'Internal Error.'));
  }
};
