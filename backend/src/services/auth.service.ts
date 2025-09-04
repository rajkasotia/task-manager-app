import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from '../schemas/user.schema';
import { SignupDto } from '../dto/auth/signup.dto';
import { LoginDto } from '../dto/auth/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(payload: SignupDto) {
    const existing = await this.userModel.findOne({ email: payload.email.toLowerCase() }).lean();
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);

    let created: UserDocument;
    try {
      created = await this.userModel.create({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email.toLowerCase(),
        passwordHash,
        mobileNumber: payload.mobileNumber,
      });
    } catch (error: any) {
      if (error && (error.code === 11000 || error.code === '11000')) {
        throw new ConflictException('Email already in use');
      }
      throw error;
    }

    return {
      id: created._id,
      firstName: created.firstName,
      lastName: created.lastName,
      email: created.email,
      mobileNumber: created.mobileNumber,
    };
  }

  async login(payload: LoginDto) {
    const user = await this.userModel.findOne({ email: payload.email.toLowerCase() });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(payload.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.jwtService.signAsync({ sub: user._id.toString(), email: user.email });
    return { accessToken: token, firstName: user.firstName, lastName: user.lastName, email: user.email, userId: user._id };
  }

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).lean();
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobileNumber: user.mobileNumber,
    };
  }
}


