import { Schema } from 'mongoose';

/**
 * Garante que uma variável de ambiente (ou outro valor opcional) exista,
 * lançando um erro descritivo caso contrário. Usado para "forçar" que
 * valores obrigatórios de configuração estejam presentes antes do boot.
 */
export function forceString(value: string | undefined | null, varName?: string): string {
  if (value === undefined || value === null || value === '') {
    throw new Error(
      `Variável de ambiente obrigatória ausente${varName ? `: ${varName}` : ''}`,
    );
  }
  return value;
}

/**
 * Aplica um transform padrão de toJSON em um schema do Mongoose:
 * - troca "_id" por "id" (string)
 * - remove "__v"
 * - permite remover campos sensíveis extras (ex.: password)
 */
export function applyToJSONTransform(schema: Schema, omitFields: string[] = []): void {
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret: Record<string, any>) => {
      ret.id = ret._id?.toString();
      delete ret._id;
      for (const field of omitFields) {
        delete ret[field];
      }
      return ret;
    },
  });
}
