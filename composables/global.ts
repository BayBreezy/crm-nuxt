import { toast } from "vue3-toastify";
/**
 * Composable used to show toast message
 */
export const useToast = () => {
  return toast;
};

/**
 * Method used to format errors
 * @param error - error object
 */
export const useFormatError = (error: any) => {
  return error.data?.message
    ? error.data.message
    : error.error?.message
    ? error.error.message
    : error.data
    ? error.data
    : error.error
    ? error.error
    : error.message
    ? error.message
    : error;
};

// Helper function used to format currency
export const useFormatCurrency = (val: number | string = 0) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(val));
};

/**
 * Method used to scroll to a location on the page
 * @param options - ScrollToOptions
 */
export const useScrollTo = (options: ScrollToOptions) => {
  window.scrollTo(options);
};

/**
 * Composable used for yes & no dropdown options
 */
export const useYesNoOptions = () =>
  useState("yesNo", () => [
    { title: "Yes", value: true },
    { title: "No", value: false },
  ]);
