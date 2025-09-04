import type { ValidationError } from 'class-validator';

const constraintToMessage: Record<string, (property: string, constraints?: any) => string> = {
  isEmail: () => 'Please enter a valid email address.',
  isNotEmpty: (property) => `Please provide your ${toHuman(property)}.`,
  minLength: (property, constraints) => {
    const min = (constraints && (constraints.min ?? (Array.isArray(constraints) ? constraints[0] : constraints))) || 0;
    return `${toHuman(property)} must be at least ${min} characters long.`;
  },
  maxLength: (property, constraints) => {
    const max = (constraints && (constraints.max ?? (Array.isArray(constraints) ? constraints[0] : constraints))) || 0;
    return `${toHuman(property)} must be at most ${max} characters long.`;
  },
  matches: (property) => `${toHuman(property)} format looks incorrect.`,
  isString: (property) => `${toHuman(property)} must be a text value.`,
  isNumber: (property) => `${toHuman(property)} must be a number.`,
  isPhoneNumber: () => 'Please enter a valid phone number.',
};

function toHuman(property: string): string {
  return property
    .replace(/([A-Z])/g, ' $1')
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

const priorityOrder = [
  'isNotEmpty',
  'isString',
  'minLength',
  'maxLength',
  'isEmail',
  'matches',
  'isNumber',
  'isPhoneNumber',
];

export function formatValidationErrors(errors: ValidationError[]): string[] {
  const messages: string[] = [];

  const walk = (errs: ValidationError[]) => {
    for (const err of errs) {
      if (err.constraints) {
        // Choose the highest-priority constraint for this field
        const keys = Object.keys(err.constraints);
        const selectedKey = keys.sort((a, b) => {
          const ai = priorityOrder.indexOf(a);
          const bi = priorityOrder.indexOf(b);
          return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
        })[0];

        if (selectedKey) {
          const original = err.constraints[selectedKey];
          // Prefer custom message provided in decorator
          if (original && typeof original === 'string') {
            messages.push(original);
          } else {
            const formatter = constraintToMessage[selectedKey];
            if (formatter) {
              const constraintArgs = (err as any).constraintsArgs?.[selectedKey] ?? undefined;
              messages.push(formatter(err.property, constraintArgs));
            } else {
              messages.push(String(original ?? `${toHuman(err.property)} is invalid.`));
            }
          }
        }
      }
      if (err.children && err.children.length) {
        walk(err.children);
      }
    }
  };

  walk(errors);
  // Return only the first most relevant message
  const unique = Array.from(new Set(messages));
  return unique.length > 0 ? [unique[0]] : [];
}


