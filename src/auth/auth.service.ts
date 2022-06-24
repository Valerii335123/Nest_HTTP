import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import RegistrationDto from './dto/registration.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login({ email, password }) {
    const user = await this.userService.findOneByEmail(email);
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (user && isMatch) {
      const payload = { email: user.email, id: user.id };
      return {
        token: this.jwtService.sign(payload),
      };
    }
    return {
      message: 'Incorrect login or password',
    };
  }

  async registration(registrationDto: RegistrationDto) {
    const saltOrRounds = 10;
    const password_hash = await bcrypt.hash(
      registrationDto.password,
      saltOrRounds,
    );

    const user = await this.userService.create(registrationDto, password_hash);

    const payload = { email: user.email, id: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
