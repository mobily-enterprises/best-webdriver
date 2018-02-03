const Driver = require('../Driver')

/**
 * Class that adds a compatibility layer to the w3c Driver to work around Safari's
 * lack of full s3c support
 * It inherits from Driver, but tries to make the unsupported w3c calls actually work
 *
 * @extends Driver
 */
class SafariDriver extends Driver {
}

exports = module.exports = SafariDriver
