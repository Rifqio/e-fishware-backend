const BaseResponse = (res) => {
    return {
        success: (message = null) => {
            return res.status(200).json({
                status: true,
                message: message || 'Success',
            });
        },
        successWithData: (data, message = null) => {
            return res.status(200).json({
                status: true,
                message: message || 'Success',
                data: data,
            });
        },
        created: (message = null) => {
            return res.status(201).json({
                status: true,
                message: message || 'Success',
            });
        },
        createdWithData: (data, message = null) => {
            return res.status(201).json({
                status: true,
                message: message || 'Success',
                data: data,
            });
        },
        badRequest: (message = null) => {
            return res.status(400).json({
                status: false,
                message: message || 'Bad Request',
            });
        },
        unauthorized: (message = null) => {
            return res.status(401).json({
                status: false,
                message: message || 'Unauthorized',
            });
        },
        forbidden: (message = null) => {
            return res.status(403).json({
                status: false,
                message: message || 'Forbidden',
            });
        },
        internalServerError: (message = null) => {
            return res.status(500).json({
                status: false,
                message: message || 'Internal Server Error',
            });
        }
    };
};

module.exports = BaseResponse