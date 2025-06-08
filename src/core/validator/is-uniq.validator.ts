// src/core/validators/is-unique.validator.ts
// This is a more advanced validator that needs a service/repository to check uniqueness in DB
// You'd typically inject a service into this validator.
import { Injectable } from '@nestjs/common';
import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';
  // import { UsersService } from '../../users/users.service'; // Example: Injecting a service
  
  @ValidatorConstraint({ async: true })
  @Injectable() // Mark as injectable if you need to inject services
  export class IsUniqueConstraint implements ValidatorConstraintInterface {
	// constructor(private readonly usersService: UsersService) {} // Inject service here
  
	async validate(value: any, args: ValidationArguments) {
	  // This is a placeholder. In a real scenario, you'd query your database.
	  // const [entityClass, field] = args.constraints;
	  // const exists = await this.usersService.checkIfEmailExists(value); // Example
	  // return !exists;
	  return true; // Always return true for now, replace with actual logic
	}
  
	defaultMessage(args: ValidationArguments) {
	  return `${args.property} must be unique.`;
	}
  }
  
  export function IsUnique(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
	  registerDecorator({
		target: object.constructor,
		propertyName: propertyName,
		options: validationOptions,
		constraints: [], // You can pass constraints here if needed, e.g., [User, 'email']
		validator: IsUniqueConstraint,
	  });
	};
  }