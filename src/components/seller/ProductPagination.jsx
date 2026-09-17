import { ChevronLeft, ChevronRight } from "lucide-react";


const ProductPagination = ({
    currentPage,
    lastPage,
    setPage,
    total = 0,
}) => {


    const handlePrevious = () => {

        if (currentPage > 1) {

            setPage(currentPage - 1);

        }

    };



    const handleNext = () => {

        if (currentPage < lastPage) {

            setPage(currentPage + 1);

        }

    };



    return (

        <div className="
            flex
            flex-col
            md:flex-row
            justify-between
            items-center
            gap-4
            mt-6
            bg-white
            border
            rounded-lg
            p-4
        ">


            {/* Total Products */}

            <div className="text-gray-600">

                Total Products:

                <span className="font-semibold ml-1">

                    {total}

                </span>

            </div>




            {/* Pagination Buttons */}

            <div className="
                flex
                items-center
                gap-3
            ">


                {/* Previous */}

                <button

                    type="button"

                    onClick={handlePrevious}

                    disabled={currentPage === 1}

                    className={`
                        flex
                        items-center
                        gap-1
                        px-4
                        py-2
                        rounded-lg
                        text-white

                        ${
                            currentPage === 1
                            ?
                            "bg-gray-400 cursor-not-allowed"
                            :
                            "bg-blue-600 hover:bg-blue-700"
                        }
                    `}

                >

                    <ChevronLeft size={18}/>

                    Previous

                </button>





                {/* Page Info */}

                <span className="
                    px-4
                    py-2
                    border
                    rounded-lg
                    font-semibold
                ">

                    {currentPage} / {lastPage}

                </span>





                {/* Next */}

                <button

                    type="button"

                    onClick={handleNext}

                    disabled={currentPage === lastPage}

                    className={`
                        flex
                        items-center
                        gap-1
                        px-4
                        py-2
                        rounded-lg
                        text-white

                        ${
                            currentPage === lastPage
                            ?
                            "bg-gray-400 cursor-not-allowed"
                            :
                            "bg-blue-600 hover:bg-blue-700"
                        }
                    `}

                >

                    Next

                    <ChevronRight size={18}/>

                </button>



            </div>



        </div>

    );

};


export default ProductPagination;