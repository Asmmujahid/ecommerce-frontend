// src/pages/seller/Analytics/TopProducts.jsx

import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";

import Inventory2Icon from "@mui/icons-material/Inventory2";

const TopProducts = ({ products = [] }) => {
  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        height: "100%",
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          fontWeight={700}
          gutterBottom
        >
          Top Selling Products
        </Typography>

        {products.length === 0 ? (
         <Box
    sx={{
        py: 6,
        textAlign: "center",
    }}
>
            <Inventory2Icon
              color="disabled"
              sx={{
                fontSize: 60,
                mb: 1,
              }}
            />

            <Typography
              color="text.secondary"
            >
              No sales data available.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {products.map((item, index) => (
              <Box key={item.product_id}>
                <ListItem
                  sx={{
                    px: 0,
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        width: 42,
                        height: 42,
                        fontWeight: 700,
                      }}
                    >
                      {index + 1}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Typography
                        fontWeight={600}
                      >
                        {item.product?.name ||
                          "Unknown Product"}
                      </Typography>
                    }
                    secondary={`Sold: ${item.total_quantity}`}
                  />
                </ListItem>

                {index !== products.length - 1 && (
                  <Divider />
                )}
              </Box>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default TopProducts;