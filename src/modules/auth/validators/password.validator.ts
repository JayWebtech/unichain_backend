import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({name: 'matchPassword',async :false})
export class MatchPassword implements ValidatorConstraintInterface {
    validate(value: any, validationArguments: ValidationArguments): Promise<boolean> | boolean {
        const [relatedPropertyName]= validationArguments.constraints; 
        const relatedValue = (validationArguments.object as any)[relatedPropertyName];
        return value === relatedValue;
    }

    defaultMessage(validationArguments: ValidationArguments): string {
        const [relatedPropertyName] = validationArguments.constraints;
        return `${relatedPropertyName} and password must match`;
    }
}