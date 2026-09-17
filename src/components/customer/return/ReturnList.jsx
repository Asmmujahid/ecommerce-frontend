import {
    Grid,
    Typography,
    Alert,
    Box,
} from "@mui/material";

import ReturnCard from "./ReturnCard";

const ReturnList = ({
    returnRequests = [],
    onCancel,
    cancelling = false,
}) => {
    if (!returnRequests.length) {
        return (
            <Alert severity="info">
                You have not submitted any return
                requests yet.
            </Alert>
        );
    }

    return (
        <Grid
            container
            spacing={3}
        >
            {returnRequests.map(
                (returnRequest) => (
                    <Grid
                        item
                        xs={12}
                        md={6}
                        lg={4}
                        key={returnRequest.id}
                    >
                        <ReturnCard
                            returnRequest={
                                returnRequest
                            }
                            onCancel={onCancel}
                            cancelling={
                                cancelling
                            }
                        />
                    </Grid>
                )
            )}
        </Grid>
    );
};

export default ReturnList;