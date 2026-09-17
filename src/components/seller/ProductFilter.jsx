import { Filter, X } from "lucide-react";


const ProductFilter = ({
    category,
    setCategory,

    stock,
    setStock,

    categories = [],
}) => {


    const clearFilters = () => {

        setCategory("");

        setStock("");

    };



    return (

        <div className="
            flex
            flex-col
            md:flex-row
            gap-4
            items-center
            bg-white
            border
            rounded-lg
            p-4
        ">


            {/* Filter Icon */}

            <div className="
                flex
                items-center
                gap-2
                text-gray-700
                font-semibold
            ">

                <Filter size={20}/>

                <span>
                    Filters
                </span>

            </div>




            {/* Category Filter */}

            <select

                value={category}

                onChange={(e)=>setCategory(e.target.value)}

                className="
                    border
                    rounded-lg
                    px-4
                    py-2
                    w-full
                    md:w-48
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                "

            >

                <option value="">
                    All Categories
                </option>



                {
                    categories.map((item)=>(

                        <option

                            key={item.id}

                            value={item.id}

                        >

                            {item.name}

                        </option>

                    ))
                }


            </select>





            {/* Stock Filter */}

            <select

                value={stock}

                onChange={(e)=>setStock(e.target.value)}

                className="
                    border
                    rounded-lg
                    px-4
                    py-2
                    w-full
                    md:w-48
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                "

            >

                <option value="">
                    All Stock
                </option>


                <option value="in_stock">
                    In Stock
                </option>


                <option value="out_of_stock">
                    Out Of Stock
                </option>


                <option value="low_stock">
                    Low Stock
                </option>


            </select>





            {/* Clear Button */}

            {
                (category || stock) &&

                <button

                    type="button"

                    onClick={clearFilters}

                    className="
                        flex
                        items-center
                        gap-2
                        bg-red-500
                        text-white
                        px-4
                        py-2
                        rounded-lg
                        hover:bg-red-600
                    "

                >

                    <X size={18}/>

                    Clear

                </button>

            }



        </div>

    );

};


export default ProductFilter;