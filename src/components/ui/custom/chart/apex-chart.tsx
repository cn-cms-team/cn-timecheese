'use client';

import dynamic from 'next/dynamic';

const ReactChart = dynamic(() => import('react-apexcharts'), { ssr: false });
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
  series?: ApexOptions['series'];
  type?: ApexChartType;
}

const ApexChart: React.FC<IProps> = ({
  height = undefined,
  options = {},
  series = [],
  type = undefined,
}) => {
  return <ReactChart options={options} series={series} type={type} height={height} />;
};

export default ApexChart;
