import z from 'zod';

const teamSchema = z.object({
  name: z.string().nonempty('กรุณากรอกชื่อทีมของคุณ'),
  description: z.string().nonempty('กรุณากรอกคำอธิบาย'),
  isActive: z.boolean().optional(),
});

type TeamSchemaType = z.infer<typeof teamSchema>;

export { teamSchema, type TeamSchemaType };
