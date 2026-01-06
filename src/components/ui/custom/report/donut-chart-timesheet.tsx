'use client';
import { ApexOptions } from 'apexcharts';
import ApexChart from '../chart/apex-chart';

interface IProps {
  chartOption: ApexOptions;
  donutHeight?: number;
}

const DonutChartTimesheet = ({ chartOption = {}, donutHeight = 300 }: IProps) => {
  return (
    <div className="w-full mt-4 border rounded-md p-3">
      <header></header>
      <main className="grid lg:grid-cols-2 grid-cols-1">
        <ApexChart options={chartOption} type="donut" height={donutHeight} />
        <div className="w-full py-4">
          <h3 className="font-semibold">ประเภทงาน</h3>
          <div className="grid grid-cols-2">{/* ประเภทงาน */}</div>
        </div>
      </main>
    </div>
  );
};
export default DonutChartTimesheet;
