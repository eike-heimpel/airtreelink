// src/lib/types/cardTemplates.ts
import { createEmptyField } from '$lib/types/fields';
import type { TextField, AddressField } from '$lib/types/fields';

export function getTemplate(type: string) {
  switch (type) {
    case 'home':
      return {
        content_fields: [createEmptyField('text') as TextField],
        description: '',
        type: type
      };
    case 'recommendation':
      return {
        content_fields: [createEmptyField('text') as TextField, createEmptyField('address') as AddressField],
        description: '',
        type: type
      };
    case 'arrival':
      return {
        content_fields: [createEmptyField('text') as TextField],
        description: '',
        type: type
      };
    default:
      throw new Error(`Unsupported card type: ${type}`);
  }
}
