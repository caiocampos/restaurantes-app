import { Schema } from "mongoose"

export const forceNumber = (num: unknown): number => Number(num) || 0

export const forceString = (str: unknown): string => String(str) || ""

export function applyToJSONTransform(
  schema: Schema,
  omitFields: string[] = []
): void {
  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret: Record<string, any>) => {
      ret.id = ret._id?.toString()
      delete ret._id
      for (const field of omitFields) {
        delete ret[field]
      }
      return ret
    },
  })
}
