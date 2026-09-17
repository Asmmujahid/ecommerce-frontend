import {
    TextField
} from "@mui/material";


const InventorySearch = ({
    search,
    setSearch
}) => {


    return (

        <TextField

            fullWidth

            label="Search inventory"

            value={search}

            onChange={(e)=>
                setSearch(e.target.value)
            }

        />

    );

};


export default InventorySearch;