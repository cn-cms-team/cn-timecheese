import z from 'zod';

const basePositionSchema = z.object({
  name: z
    .string()
    .trim()
    .transform((val) => val.replace(/\s+/g, ' '))
    .pipe(
      z.string().min(1, 'กรุณากรอกชื่อตำแหน่ง').max(100, 'ห้ามกรอกชื่อตำแหน่งเกิน 100 ตัวอักษร')
    ),
  description: z.string().trim().max(255, 'ห้ามกรอกชื่อตำแหน่งเกิน 255 ตัวอักษร').optional(),
  levels: z.array(
    z.object({
      name: z
        .string()
        .trim()
        .transform((val) => val.replace(/\s+/g, ' '))
        .pipe(
          z.string().min(1, 'กรุณากรอกชื่อตำแหน่ง').max(100, 'ห้ามกรอกชื่อตำแหน่งเกิน 100 ตัวอักษร')
        ),
      description: z.string().max(255, 'ห้ามกรอกชื่อตำแหน่งเกิน 255 ตัวอักษร').optional(),
    })
  ),
});

const createPositionSchema = basePositionSchema;
const editPositionSchema = basePositionSchema;

type CreatePositionSchema = z.infer<typeof createPositionSchema>;
type EditPositionSchema = z.infer<typeof editPositionSchema>;

export {
  createPositionSchema,
  editPositionSchema,
  type CreatePositionSchema as CreatePositionSchemaType,
  type EditPositionSchema as EditPositionSchemaType,
};
