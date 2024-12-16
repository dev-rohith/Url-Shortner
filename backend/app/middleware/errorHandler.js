const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
  } else {
    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ error: err.name, message: "invalid url id" });
    }
    console.log(err.name, err.message);
    res
      .status(err.statusCode || 500)
      .json({ error: err.name, message: err.message });
  }

  if (process.env.NODE_ENV === "production") {
  }
};

export default errorHandler;
