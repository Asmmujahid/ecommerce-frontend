import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


import {
    Box,
    Button,
    CircularProgress,
    Typography
} from "@mui/material";

import {
    Add
} from "@mui/icons-material";


import {
    getInventories,
    deleteInventory
} from "../../../redux/admin/inventorySlice";


import InventoryTable from "../../../components/admin/inventory/InventoryTable";
import InventorySearch from "../../../components/admin/inventory/InventorySearch";


const InventoryList = () => {


    const dispatch = useDispatch();

    const navigate = useNavigate();


    const {
        inventories,
        loading,
        error
    } = useSelector(
        state => state.adminInventory
    );


    const [search,setSearch] = useState("");



    useEffect(()=>{

        dispatch(
            getInventories()
        );

    },[dispatch]);




    const handleDelete = (id)=>{


        if(
            window.confirm(
                "Delete this inventory record?"
            )
        ){

            dispatch(
                deleteInventory(id)
            );

        }

    };




    const filteredInventories =
        inventories?.filter((item)=>

            item.product?.name
            ?.toLowerCase()
            .includes(
                search.toLowerCase()
            )

        );



return (

<Box>


<Box
display="flex"
justifyContent="space-between"
mb={3}
>


<Typography
variant="h4"
>
Inventory Management
</Typography>



<Button

variant="contained"

startIcon={<Add />}

onClick={()=>navigate(
"/admin/inventory/create"
)}

>

Add Inventory

</Button>


</Box>



<InventorySearch

search={search}

setSearch={setSearch}

/>



<Box mt={3}>


{
loading ?

(
<CircularProgress />
)

:

(

<InventoryTable

inventories={
filteredInventories
}

onEdit={(id)=>

navigate(
`/admin/inventory/edit/${id}`
)

}

onDelete={handleDelete}

/>

)

}


</Box>



</Box>

);

};


export default InventoryList;