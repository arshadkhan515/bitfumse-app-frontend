import React, { useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Paper } from "@mantine/core";
import { useState } from "react";
import Cookies from "js-cookie";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Monthly Chart",
    },
  },
};

const TransactionChart = ({getTransactions}) => {
  const [ChartData,setChartData] = useState([]);
  const token = Cookies.get('token');
  // get transactions
  const getChartData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/transactionChart/get`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseData = await response.json();
      setChartData(responseData.data);
      console.log(responseData.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getChartData();
  }, [getTransactions]);


  const labels = ChartData.map((item) => {
    const date = new Date();
    date.setMonth(item._id - 1);
    return date.toLocaleString("default", { month: "long" });
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Yearly Chart",
        data: ChartData.map((item) => item.totalExpenses),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <Paper
      radius="md"
      sx={{ width: "60%" }}
      p="md"
      m="md"
      shadow="xl"
      justify="center"
      withBorder
    >
      <Bar options={options} data={data} />
    </Paper>
  );
};

export default TransactionChart;
