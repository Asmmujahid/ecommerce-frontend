import { ArrowDownUp } from "lucide-react";


const ProductSort = ({
    sort,
    setSort,

    direction,
    setDirection,
}) => {


    return (

        <div className="
            flex
            flex-col
            md:flex-row
            gap-3
            items-center
        ">


            {/* Sort Icon */}

            <div className="
                flex
                items-center
                gap-2
                text-gray-700
                font-semibold
            ">

                <ArrowDownUp size={20}/>

                <span>
                    Sort
                </span>

            </div>




            {/* Sort Field */}

            <select

                value={sort}

                onChange={(e)=>setSort(e.target.value)}

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
                    Sort By
                </option>


                <option value="price">
                    Price
                </option>


                <option value="stock">
                    Stock
                </option>


                <option value="created_at">
                    Latest Products
                </option>


                <option value="name">
                    Product Name
                </option>


            </select>





            {/* Direction */}

            <select

                value={direction}

                onChange={(e)=>setDirection(e.target.value)}

                className="
                    border
                    rounded-lg
                    px-4
                    py-2
                    w-full
                    md:w-40
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                "

            >

                <option value="asc">
                    Ascending
                </option>


                <option value="desc">
                    Descending
                </option>


            </select>



        </div>

    );

};


export default ProductSort;