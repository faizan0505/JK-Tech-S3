const ERROR_RESPONSE = (res, error) => {
    console.log("Error", error);
    return res.status(400).json({
      status: false,
      message: error.message,
      error
    });
  };
  
  module.exports = ERROR_RESPONSE;