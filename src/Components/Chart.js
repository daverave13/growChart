import React, { useEffect, useState } from "react";
import moment from "moment";
import { Card, Box, Typography } from "@mui/material";
import { experimentalStyled as styled } from "@mui/material/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: "white",
  paddingBottom: "2rem",
  fontSize: "2rem",
}));

const NumberCard = styled(Card)(({ theme }) => ({
  backgroundColor: "#bbbbfa",
  padding: "1rem"
}));

const Numbers = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-evenly",
}));

const Number = styled(Typography)(({ theme }) => ({
  color: "#ffffff",
  fontSize: "2rem",
  margin: "0 20px",
}));

const Chart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch("http://192.168.1.47:5000/users/", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const formattedData = JSON.parse(result).map((data) => {
          return {
            ...data,
            temperature: parseFloat(data.temperature),
            humidity: parseInt(data.humidity),
          };
        });
        setData(formattedData);
      })
      .catch((error) => console.log("error", error));
  }, []);

  if (data.length > 0)
    return (
      <Box>
        <Card
          sx={{
            backgroundColor: "#c2c2ff",
            padding: "5vh 0",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box>
            <StyledTypography sx={{fontSize: '3rem'}}>Temperature & Humidity</StyledTypography>
            <Box
              elevation={10}
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                marginBottom: '2rem'
              }}
            >
              <NumberCard>
                <StyledTypography>Current</StyledTypography>
                <Numbers>
                  <Number>
                    {parseInt(data[data.length - 1].temperature)}°
                  </Number>
                  <Number>{parseInt(data[data.length - 1].humidity)}%</Number>
                </Numbers>
              </NumberCard>
              <NumberCard>
                <StyledTypography>12 Hour</StyledTypography>
                <Numbers>
                  <Number>
                    {parseInt(
                      data
                        .slice(data.length - 145, data.length)
                        .map((ele) => ele.temperature)
                        .reduce((a, b) => a + b) /
                        data.slice(data.length - 145, data.length).length
                    )}
                    °
                  </Number>
                  <Number>
                    {parseInt(
                      data
                        .slice(data.length - 145, data.length)
                        .map((ele) => ele.humidity)
                        .reduce((a, b) => a + b) /
                        data.slice(data.length - 145, data.length).length
                    )}
                    %
                  </Number>
                </Numbers>
              </NumberCard>
            </Box>
            <LineChart
              width={1500}
              height={300}
              data={data.slice(data.length - 145, data.length)}
              margin={{
                top: 5,
                right: 40,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray='3 3' stroke='#ffffff' />
              <XAxis
                dataKey='timestamp'
                stroke='#ffffff'
                interval={11}
                tickFormatter={(tick) => moment(tick).format("H:mm")}
              />
              <YAxis stroke='#ffffff' />
              <Line
                dataKey='temperature'
                stroke='#f03c81'
                strokeWidth={6}
                dot={false}
              />
              <Line
                type='monotone'
                dataKey='humidity'
                stroke='#339CFF'
                strokeWidth={6}
                dot={false}
              />
            </LineChart>
          </Box>
        </Card>
      </Box>
    );
};

export default Chart;
