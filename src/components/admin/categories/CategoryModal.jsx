import { FaTimes } from "react-icons/fa";

const CategoryModal = ({
    open,
    title = "",
    children,
    onClose,
    size = "max-w-2xl",
}) => {
    if (!open) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
            <div
                className={`bg-white rounded-xl shadow-2xl w-full ${size} max-h-[90vh] overflow-hidden animate-fadeIn`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">

                    <h2 className="text-xl font-bold text-gray-800">
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition"
                    >
                        <FaTimes
                            size={18}
                            className="text-gray-600"
                        />
                    </button>

                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto max-h-[75vh]">

                    {children}

                </div>

            </div>
        </div>
    );
};

export default CategoryModal;