import { Search, X } from "lucide-react";


const ProductSearch = ({
    search,
    setSearch,
}) => {


    const handleClear = () => {
        setSearch("");
    };


    return (

        <div className="relative w-full md:w-96">


            {/* Search Icon */}

            <Search
                size={20}
                className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                "
            />



            {/* Input */}

            <input

                type="text"

                placeholder="Search products..."

                value={search}

                onChange={(e)=>setSearch(e.target.value)}

                className="
                    w-full
                    border
                    border-gray-300
                    rounded-lg
                    pl-10
                    pr-10
                    py-2
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                "

            />



            {/* Clear Button */}

            {
                search &&

                <button

                    type="button"

                    onClick={handleClear}

                    className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-gray-500
                        hover:text-red-500
                    "

                >

                    <X size={18}/>


                </button>

            }


        </div>

    );

};


export default ProductSearch;