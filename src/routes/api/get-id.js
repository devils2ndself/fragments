const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse } = require('../../response');
const md = require('markdown-it')();
const sharp = require('sharp');

const extensionMap = {
  txt: 'text/plain',
  md: 'text/markdown',
  json: 'application/json',
  html: 'text/html',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
};

async function parseContent(data, fragment, newTypeExt) {
  let type = fragment.mimeType;
  if (newTypeExt) {
    let newType = extensionMap[newTypeExt];

    if (!newType || !fragment.formats.includes(newType)) {
      throw Error('Unsupported type!');
    }

    if (type == newType) {
      type = fragment.type;
    } else if ((fragment.isText || type == 'application/json') && newType == 'text/plain') {
      type = newType;
    } else if (type == 'text/markdown' && newType == 'text/html') {
      type = newType;
      data = Buffer.from(md.render(data.toString()));
    }  else if (type.startsWith('image/') && newType.startsWith('image/')) {
      type = newType;
      switch (newType) {
        case 'image/jpeg':
          data = await sharp(data)
            .jpeg({
              quality: 100,
              chromaSubsampling: '4:4:4'
            }).toBuffer();
          break;
        case 'image/png':
          data = await sharp(data)
            .png()
            .toBuffer();
          break;
        case 'image/webp':
          data = await sharp(data)
            .webp({ lossless: true })
            .toBuffer();
          break;
        case 'image/gif':
          data = await sharp(data)
            .gif()
            .toBuffer();
          break;
        default:
          throw Error('Unsupported type!');
      }
    } else {
      throw Error('Unsupported type!');
    }
  } else {
    type = fragment.type;
  }
  return { data, type };
}

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  try {
    const userId = req.user;
    const fragment = await Fragment.byId(userId, req.params.id);
    const parsed = await parseContent(await fragment.getData(), fragment, req.params.ext);
    res.status(200).set({ 'Content-Type': parsed.type }).send(parsed.data);
  } catch (error) {
    if (error.message == 'No such fragment!') {
      res.status(404).json(createErrorResponse(404, 'No such fragment!'));
    } else if (error.message == 'Unsupported type!') {
      res.status(415).json(createErrorResponse(415, 'Unsupported type!'));
    } else {
      logger.warn(error);
      res.status(500).json(createErrorResponse(500, 'internal error'));
    }
  }
};
