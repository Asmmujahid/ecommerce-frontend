const StatCard = ({
    title,
    value,
    icon,
    color = "blue",
}) => {

    const colors = {
        blue: {
            bg: "bg-blue-100",
            text: "text-blue-600",
        },
        green: {
            bg: "bg-green-100",
            text: "text-green-600",
        },
        purple: {
            bg: "bg-purple-100",
            text: "text-purple-600",
        },
        orange: {
            bg: "bg-orange-100",
            text: "text-orange-600",
        },
        red: {
            bg: "bg-red-100",
            text: "text-red-600",
        },
        yellow: {
            bg: "bg-yellow-100",
            text: "text-yellow-600",
        },
        pink: {
            bg: "bg-pink-100",
            text: "text-pink-600",
        },
        teal: {
            bg: "bg-teal-100",
            text: "text-teal-600",
        },
        indigo: {
            bg: "bg-indigo-100",
            text: "text-indigo-600",
        },
        gray: {
            bg: "bg-gray-100",
            text: "text-gray-600",
        },
    };

    const selectedColor = colors[color] || colors.blue;

    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 p-6">

            <div className="flex items-center justify-between">

                <div>

                    <h3 className="text-sm font-medium text-gray-500">
                        {title}
                    </h3>

                    <h2 className="mt-3 text-3xl font-bold text-gray-800">
                        {value}
                    </h2>

                </div>

                <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center ${selectedColor.bg} ${selectedColor.text}`}
                >
                    <span className="text-2xl">
                        {icon}
                    </span>
                </div>

            </div>

        </div>
    );
};

export default StatCard;