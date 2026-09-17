// src/pages/seller/Analytics/AnalyticsCards.jsx

import {
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import PaidIcon from "@mui/icons-material/Paid";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Inventory2Icon from "@mui/icons-material/Inventory2";

const AnalyticsCards = ({ analytics }) => {
  const cards = [
    {
      title: "Total Sales",
      value: analytics?.total_sales ?? 0,
      icon: <PaidIcon sx={{ fontSize: 42 }} color="success" />,
      prefix: "Rs. ",
    },
    {
      title: "Total Orders",
      value: analytics?.total_orders ?? 0,
      icon: (
        <ShoppingCartIcon
          sx={{ fontSize: 42 }}
          color="primary"
        />
      ),
      prefix: "",
    },
    {
      title: "Total Products",
      value: analytics?.total_products ?? 0,
      icon: (
        <Inventory2Icon
          sx={{ fontSize: 42 }}
          color="warning"
        />
      ),
      prefix: "",
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid
    key={card.title}
    size={{
        xs: 12,
        sm: 6,
        md: 4,
    }}
>
          <Card
            elevation={3}
            sx={{
              borderRadius: 3,
              height: "100%",
            }}
          >
            <CardContent>
              <Stack
    direction="row"
    sx={{
        justifyContent: "space-between",
        alignItems: "center",
    }}
>
                <div>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {card.title}
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={700}
                    mt={1}
                  >
                    {card.prefix}
                    {Number(card.value).toLocaleString()}
                  </Typography>
                </div>

                {card.icon}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default AnalyticsCards;