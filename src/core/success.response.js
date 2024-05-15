'use strict'

const StatusCode = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204
}

const ReasonStatusCode = {
    CREATED: 'Created!',
    OK: 'Success!',
}

class SuccessResponse {
    /**
     * Create a SuccessResponse.
     * @param {Object} params - The response parameters.
     * @param {string} params.message - The response message.
     * @param {number} params.statusCode - The HTTP status code.
     * @param {string} params.reasonStatusCode - The reason status code.
     * @param {Object} params.metaData - The response metadata.
     */
    constructor({ message, statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metaData = null }) {
        this.message = message ?? reasonStatusCode
        this.statusCode = statusCode
        this.metaData = metaData
    }

        /**
     * Send the response.
     * @param {Object} params - The parameters.
     * @param {Object} params.res - The Express response object.
     * @param {Object} params.header - The response headers.
     */
    send({res, header = {}}){
        return res.status(this.statusCode).json(this)
    }
}

class OK extends SuccessResponse {
    constructor({ message, metaData }) {
        super({ message, statusCode: StatusCode.OK, reasonStatusCode: ReasonStatusCode.OK, metaData })
    }
}

class CREATED extends SuccessResponse {
    constructor({ message, metaData, options = {} }) {
        super({ message, statusCode: StatusCode.CREATED, reasonStatusCode: ReasonStatusCode.CREATED, metaData })
        this.options = options
    }
}

module.exports = {
    OK, CREATED, SuccessResponse
}