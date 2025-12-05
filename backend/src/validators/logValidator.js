export const validateLogInput = (data) => {
  const errors = {};

  if (!data.level || !["info", "warning", "error"].includes(data.level)) {
    errors.level = "Invalid log level";
  }

  if (!data.message || data.message.trim() === "") {
    errors.message = "Message is required";
  }

  if (!data.service || data.service.trim() === "") {
    errors.service = "Service name is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
