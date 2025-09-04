import { IsEmail, IsNotEmpty, MinLength, Matches, MaxLength, IsString } from 'class-validator';

export class SignupDto {
  @IsNotEmpty({ message: 'Please provide your First name.' })
  @Matches(/^[A-Za-z]+$/, { message: 'First name should contain only letters.' })
  firstName: string;

  @IsNotEmpty({ message: 'Please provide your Last name.' })
  @Matches(/^[A-Za-z]+$/, { message: 'Last name should contain only letters.' })
  lastName: string;

  @IsNotEmpty({ message: 'Please provide your Email.' })
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  email: string;

  @IsNotEmpty({ message: 'Please provide your Password.' })
  @IsString({ message: 'Password must be a text value.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @MaxLength(20, { message: 'Password must be at most 20 characters long.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,20}$/, {
    message: 'Password must include 1 uppercase, 1 lowercase, 1 number, and 1 special character.',
  })
  password: string;

  @IsNotEmpty()
  @Matches(/^\+?[0-9]{7,15}$/, { message: 'Mobile number must be 7-15 digits (may start with +).' })
  mobileNumber: string;
}


