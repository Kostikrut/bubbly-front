import toast from "react-hot-toast";

const setErrorToast = (err, defaultMessage) => {
  const message =
    err?.response?.data?.message ||
    defaultMessage ||
    "An error occurred, please check your credentials and try again.";

  return toast.error(message);
};

export default setErrorToast;
