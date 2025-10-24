import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async createPasswordHash(password: string) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  comparePassword(password: string, dbPassword: string) {
    return bcrypt.compare(password, dbPassword);
  }

  getToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload);
  }
}
