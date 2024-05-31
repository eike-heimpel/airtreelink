// src/lib/types/cardTemplates.ts
import { createEmptyField } from '$lib/types/fields';
import type { TextField, AddressField } from '$lib/types/fields';

export function getTemplate(type: string) {
  switch (type) {
    case 'info':
      return {
        content_fields: [createEmptyField('text') as TextField],
        description: '',
        type: 'info'
      };
    case 'recommendation':
      return {
        content_fields: [createEmptyField('text') as TextField, createEmptyField('address') as AddressField],
        description: '',
        type: 'recommendation'
      };
    case 'home':
      return {
        content_fields: [createEmptyField('text') as TextField, createEmptyField('address') as AddressField],
        description: '',
        type: 'home'
      };
    default:
      throw new Error(`Unsupported card type: ${type}`);
  }
}
