import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import {
  ChartCanvas,
  Chart,
  CandlestickSeries,
  XAxis,
  YAxis,
  discontinuousTimeScaleProviderBuilder,
  BarSeries,
  LineSeries,
  CrossHairCursor,
  CurrentCoordinate,
} from "react-financial-charts";

const StyledChartContainer = styled.div`
  width: 100%;
  height: 500px;
  background-color: white;
  padding: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const margin = { left: 50, right: 50, top: 20, bottom: 30 };

const RealTimeCandleChart = () => {
  const [data, setData] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    // WebSocket 연결
    const socket = new WebSocket("wss://api.upbit.com/websocket/v1");
    socketRef.current = socket;

    socket.onopen = () => {
      const message = JSON.stringify([
        { ticket: "test" },
        { type: "ticker", codes: ["KRW-BTC"] },
      ]);
      socket.send(message);
    };

    socket.onmessage = async (event) => {
      try {
        const blob = event.data;
        const text = await blob.text();
        const rawData = JSON.parse(text);

        const candleData = {
          date: new Date(rawData.timestamp),
          open: rawData.opening_price,
          high: rawData.high_price,
          low: rawData.low_price,
          close: rawData.trade_price,
          volume: rawData.acc_trade_volume, // 거래량
        };

        setData((prevData) => {
          const updatedData = [...prevData, candleData];
          if (updatedData.length > 200) updatedData.shift();
          return updatedData;
        });
      } catch (error) {
        console.error("WebSocket 메시지 처리 오류:", error);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <StyledChartContainer>
      <CandleChart data={data} />
    </StyledChartContainer>
  );
};

const CandleChart = ({ data }) => {
  const validData =
    data.length > 0
      ? data
      : [{ date: new Date(), open: 0, high: 0, low: 0, close: 0, volume: 0 }];
  const xScaleProvider =
    discontinuousTimeScaleProviderBuilder().inputDateAccessor((d) => d.date);
  const {
    data: chartData,
    xScale,
    xAccessor,
    displayXAccessor,
  } = xScaleProvider(validData);

  const xExtents =
    chartData.length > 0
      ? [xAccessor(chartData[0]), xAccessor(chartData[chartData.length - 1])]
      : [0, 1];

  // 이동평균 계산 (예: 5일 및 20일 이동평균)
  const calculateMA = (data, windowSize) => {
    return data.map((_, index, array) => {
      if (index < windowSize - 1) return null;
      const slice = array.slice(index - windowSize + 1, index + 1);
      const average = slice.reduce((sum, d) => sum + d.close, 0) / windowSize;
      return { x: xAccessor(array[index]), y: average };
    });
  };

  const ma5 = calculateMA(chartData, 5);
  const ma20 = calculateMA(chartData, 20);

  return (
    <ChartCanvas
      height={500}
      width={800}
      ratio={window.devicePixelRatio}
      margin={margin}
      data={chartData}
      xScale={xScale}
      xAccessor={xAccessor}
      displayXAccessor={displayXAccessor}
      xExtents={xExtents}
    >
      <Chart id={1} yExtents={(d) => [d.high, d.low]}>
        <XAxis />
        <YAxis />

        {/* 캔들 차트 */}
        <CandlestickSeries
          fill={(d) => (d.close > d.open ? "red" : "blue")}
          wickStroke={(d) => (d.close > d.open ? "red" : "blue")}
        />

        {/* 이동평균선 */}
        <LineSeries yAccessor={(d) => d.close} data={ma5} strokeStyle="red" />
        <LineSeries
          yAccessor={(d) => d.close}
          data={ma20}
          strokeStyle="green"
        />

        {/* 거래량 바 차트 */}
        <BarSeries
          yAccessor={(d) => d.volume}
          fillStyle={(d) => (d.close > d.open ? "red" : "blue")}
        />

        {/* Y축 값 표시 */}
        <CurrentCoordinate yAccessor={(d) => d.close} />
      </Chart>
      <CrossHairCursor />
    </ChartCanvas>
  );
};

export default RealTimeCandleChart;
