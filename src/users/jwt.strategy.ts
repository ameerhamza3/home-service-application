import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your_secret_key', // Replace with your own secret key
    });
  }

  async validate(payload: JwtPayload) {
    // You can perform additional checks or retrieve user data from the payload
    return { userId: payload.userId, email: payload.email, role: payload.role };
  }
}
