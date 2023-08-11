export const createError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export function errorHandler(err, req, res, next) {
  console.log(err);
  res.status(err.status || 500).send(err.message || "Something went wrong.");
}
