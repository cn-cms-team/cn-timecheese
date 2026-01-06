'use client';
import ReactChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

type ApexChartType =
  | 'line'
  | 'area'
  | 'bar'
  | 'pie'
  | 'donut'
  | 'radialBar'
  | 'scatter'
  | 'bubble'
  | 'heatmap'
  | 'candlestick'
  | 'boxPlot'
  | 'radar'
  | 'polarArea'
  | 'rangeBar'
  | 'rangeArea'
  | 'treemap'
  | undefined;

interface IProps {
  height?: number;
  options?: ApexOptions;
  serires?: ApexOptions['series'];
  type?: ApexChartType;
}

const ApexChart: React.FC<IProps> = ({
  height = undefined,
  options = {},
  serires = [],
  type = undefined,
}) => {
  return <ReactChart options={options} series={serires} type={type} height={height} />;
};

export default ApexChart;
