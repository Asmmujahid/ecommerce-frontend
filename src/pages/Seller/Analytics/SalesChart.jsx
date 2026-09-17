// src/pages/seller/Analytics/SalesChart.jsx

import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const SalesChart = ({ monthlySales = [] }) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Convert API response into chart format
  const chartData = monthNames.map((month, index) => {
    const found = monthlySales.find(
      (item) => Number(item.month) === index + 1
    );

    return {
      month,
      sales: found ? Number(found.total_sales) : 0,
    };
  });

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
          Monthly Sales
        </Typography>

        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="month"
            />

            <YAxis />

            <Tooltip
              formatter={(value) => [
                `Rs. ${Number(value).toLocaleString()}`,
                "Sales",
              ]}
            />

            <Legend />

            <Bar
              dataKey="sales"
              name="Sales"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SalesChart;