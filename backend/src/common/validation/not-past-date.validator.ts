import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

function startOfToday(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

@ValidatorConstraint({ async: false })
export class NotPastDateConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    if (value === undefined || value === null || value === '') return true;
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return false;
    return date.getTime() >= startOfToday().getTime();
  }

  defaultMessage(args?: ValidationArguments) {
    return `${args?.property || 'date'} must be today or a future date`;
  }
}

export function NotPastDate(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: NotPastDateConstraint,
    });
  };
}


