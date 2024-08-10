import { toast, ToastContent, ToastOptions, Slide, Id } from "react-toastify";

// Defining the default toast options
export const defaultToastOptions: ToastOptions = {
    position: "top-center",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
    transition: Slide,
};

// Defining the Toast type
export type ToastType = "success" | "error" | "info" | "warning" | "default";

/**
 * Display toast
 *
 * @param {ToastType} type
 * @param {ToastContent} content
 * @param {ToastOptions} [options=defaultToastOption]
 * @return {Id}
 */
export const showToast = (
    type: ToastType,
    content: ToastContent,
    options: Partial<ToastOptions> = {},
): Id => {
    const optionsToApply = { ...defaultToastOptions, ...options };

    // Applying options based on the toast type
    switch (type) {
        case "success":
            return toast.success(content, optionsToApply);
        case "error":
            return toast.error(content, optionsToApply);
        case "info":
            return toast.info(content, optionsToApply);
        case "warning":
            return toast.warn(content, optionsToApply);
        case "default":
            return toast(content, optionsToApply);
        default:
            return toast(content, optionsToApply);
    }
};