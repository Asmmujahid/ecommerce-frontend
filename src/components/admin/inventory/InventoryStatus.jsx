import {
    Alert
} from "@mui/material";


const InventoryStatus = ({
    type
}) => {


    return (

        <Alert
            severity={
                type === "in"
                ?
                "success"
                :
                "error"
            }
        >

            {type === "in"
                ?
                "Stock Added"
                :
                "Stock Removed"
            }

        </Alert>

    );

};


export default InventoryStatus;