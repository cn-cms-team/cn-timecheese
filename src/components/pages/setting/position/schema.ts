import z from 'zod';

const basePositionSchema = z.object({
  name: z
    .string()
    .trim()
    .transform((val) => val.replace(/\s+/g, ' '))
    .pipe(
      z.string().min(1, 'กรุณากรอกชื่อตำแหน่ง')
    ),
  description: z.string().trim().optional(),
  levels: z.array(
    z.object({
      name: z
        .string()
        .trim()
        .transform((val) => val.replace(/\s+/g, ' '))
        .pipe(
          z.string().min(1, 'กรุณากรอกชื่อตำแหน่ง')
        ),
      description: z.string().optional(),
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
