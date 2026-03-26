'use client';

import { useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { fetcher } from '@/lib/fetcher';
import { Button } from '@/components/ui/button';
import { getDaysInMonth } from 'date-fns';
import { IReportProjectMonthly } from '@/types/report';

interface ReportProjectGenerateExcelProps {
  projectId: string;
  selectedMonth: number;
  selectYear: number;
}

export default function ReportProjectGenerateExcel({
  projectId,
  selectedMonth,
  selectYear,
}: ReportProjectGenerateExcelProps) {
  const prefix = process.env.NEXT_PUBLIC_APP_URL;
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateExcel = async () => {
    await fetcher<IReportProjectMonthly>(
      `${prefix}/api/v1/report/project/${projectId}/monthly-report?month=${selectedMonth}&year=${selectYear}`
    ).then((res) => {
      generateExcel(res);
    });
  };

  const generateExcel = async (data: IReportProjectMonthly) => {
    setIsGenerating(true);
    try {
      // 1. Create a blank workbook from scratch
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Monthly Report');

      const daysInMonth = getDaysInMonth(new Date(data.year, data.month, 1));
      // 2. Build the Headers
      const titleRow = worksheet.addRow(['รายงานสรุปการลงเวลาประจำเดือน']);
      titleRow.height = 50;
      titleRow.font = {
        bold: true,
        size: 20,
        color: { argb: 'FF00B0F0' },
      };
      titleRow.alignment = {
        vertical: 'middle',
      };
      worksheet.addRow(['โครงการ :', data.project_name]).font = {
        bold: true,
      };
      worksheet.addRow(['รหัสโครงการ :', data.project_code]).font = {
        bold: true,
      };
      worksheet.addRow(['ประจำเดือน :', `${data.month + 1}/${data.year}`]).font = {
        bold: true,
      };
      worksheet.addRow(['เดือนนี้มีทั้งหมด(วัน) :', `${daysInMonth}`]).font = {
        bold: true,
      };
      worksheet.addRow([]);

      // 3. Build Table Headers
      const headerRow = worksheet.addRow([
        'รายชื่อสมาชิกในโครงการ',
        'ทีม',
        'เวลาที่ใช้ในโครงการ (ชั่วโมง)',
        'จำนวนชั่วโมงทั้งหมด / เดือน',
        'กรอกเงินเดือน',
        'เงินเดือน (รายชั่วโมง)',
        'ค่าใช้จ่ายต่อเดือน',
      ]);
      headerRow.font = { bold: true };
      headerRow.eachCell((cell) => {
        // 1. Set the Background Color
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF00' }, // FF + FFFF00 (Yellow)
        };

        // 2. Set the Font Color to Black for readability
        cell.font = {
          color: { argb: 'FF000000' }, // Solid Black
          bold: true,
        };

        // 3. (Optional) Add a border to make it look crisp
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      // 4. Inject Data
      const startRow = 8; // Data starts at row 9
      data.members.forEach((member, index) => {
        const currentRow = startRow + index;
        const totalHours = member.timeSheets / 3600;
        worksheet.addRow([member.user_name, member.team_name, totalHours, 0, 0]);

        worksheet.getCell(`D${currentRow}`).value = {
          formula: `B5 * 8`,
        };

        worksheet.getCell(`E${currentRow}`).numFmt = '#,##0.00';
        // Add FORMULA for Column F (Hourly Rate = Salary / Total Hours)
        worksheet.getCell(`F${currentRow}`).numFmt = '#,##0.00';
        worksheet.getCell(`F${currentRow}`).value = {
          formula: `E${currentRow}/D${currentRow}`,
        };

        // Add FORMULA for Column G (Monthly Cost = Hourly Rate * TimeSheets)
        worksheet.getCell(`G${currentRow}`).numFmt = '#,##0.00';
        worksheet.getCell(`G${currentRow}`).value = {
          formula: `F${currentRow}*D${currentRow}`,
        };
      });

      const totalRow = worksheet.addRow(['', '', '', '', '', 'รวม (Total)']);
      totalRow.getCell('G').numFmt = '#,##0.00';
      totalRow.getCell('G').value = {
        formula: `SUM(G${startRow}:G${startRow + data.members.length - 1})`,
      };
      totalRow.font = { bold: true };
      totalRow.alignment = {
        vertical: 'middle',
        horizontal: 'right',
      };

      worksheet.getColumn(1).width = 30;
      worksheet.getColumn(2).width = 25;

      // // 5. Generate Chart Image (Since we can't build native charts from scratch)
      // const chartConfig = {
      //   type: 'pie',
      //   data: {
      //     labels: data.members.map((m) => m.user_name),
      //     datasets: [
      //       {
      //         data: data.members.map((m) => m.timeSheets),
      //         backgroundColor: ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f'],
      //       },
      //     ],
      //   },
      // };

      // const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}&w=500&h=300`;
      // const response = await fetch(chartUrl);
      // const imageBuffer = await response.arrayBuffer();

      // // 6. Attach Image to the bottom of the data
      // const imageId = workbook.addImage({
      //   buffer: imageBuffer,
      //   extension: 'png',
      // });

      // const startImageRow = 8 + data.members.length + 2;
      // worksheet.addImage(imageId, {
      //   tl: { col: 0, row: startImageRow },
      //   ext: { width: 500, height: 300 },
      // });
      // --- AUTO FIT COLUMNS ---
      worksheet.columns.forEach((column) => {
        let maxLength = 0;

        // Loop through all cells in this column
        column.eachCell!({ includeEmpty: true }, (cell) => {
          let columnLength = 10; // Default minimum width

          if (cell.value) {
            // Check if the cell has a formula object
            if (typeof cell.value === 'object' && cell.formula) {
              columnLength = cell.result ? cell.result.toString().length : 15;
            } else {
              // Normal text or number
              columnLength = cell.value.toString().length;
            }
          }

          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });

        // Set the column width to the max length + 5 spaces of padding.
        // (Padding is especially helpful for making Thai characters look good)
        column.width = maxLength < 10 ? 10 : maxLength + 5;
      });

      // 7. Save File
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const monthShort = new Date(new Date().setMonth(data.month)).toLocaleString('en-US', {
        month: 'short',
      });
      saveAs(blob, `Report-${data.project_code}-${data.year}-${monthShort}.xlsx`);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleGenerateExcel}
      disabled={isGenerating}
      style={{
        padding: '10px 20px',
        backgroundColor: isGenerating ? '#cccccc' : '#217346', // Excel Green
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: isGenerating ? 'not-allowed' : 'pointer',
      }}
    >
      {isGenerating ? 'Generating...' : 'นำออกรายงาน'}
    </Button>
  );
}
