import z from 'zod';

const okrKeyResultSchema = z
  .object({
    id: z.string().uuid().optional(),
    title: z.string().trim().nonempty('กรุณากรอกชื่อ Key Result'),
    start_date: z.coerce.date({ error: 'กรุณาเลือกวันที่เริ่มต้น' }),
    end_date: z.coerce.date({ error: 'กรุณาเลือกวันที่สิ้นสุด' }),
    target: z.coerce.number().min(0, 'ค่าเป้าหมายต้องมากกว่าหรือเท่ากับ 0'),
    progress: z.coerce.number().min(0, 'ค่าความคืบหน้าต้องมากกว่าหรือเท่ากับ 0'),
    unit: z.string().trim().max(50, 'หน่วยต้องไม่เกิน 50 ตัวอักษร').nullable().optional(),
  })
  .refine((value) => value.end_date >= value.start_date, {
    message: 'วันที่สิ้นสุดต้องไม่น้อยกว่าวันที่เริ่มต้น',
    path: ['end_date'],
  });

const okrObjectiveSchema = z.object({
  title: z.string().trim().nonempty('กรุณากรอกชื่อ Objective'),
  keyResults: z.array(okrKeyResultSchema).min(1, 'กรุณาเพิ่ม Key Result อย่างน้อย 1 รายการ'),
});

type OkrObjectiveSchemaType = z.infer<typeof okrObjectiveSchema>;
type OkrKeyResultSchemaType = z.infer<typeof okrKeyResultSchema>;

export {
  okrKeyResultSchema,
  okrObjectiveSchema,
  type OkrObjectiveSchemaType,
  type OkrKeyResultSchemaType,
};
