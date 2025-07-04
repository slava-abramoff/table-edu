import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto, TokenDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private verifyToken(token: string) {
    try {
      const verified = this.jwtService.verify(token);
      return verified;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  private issueTokens(id: number, role: string) {
    const data = { id, role };
    const accessToken = this.jwtService.sign(data, { expiresIn: '7d' });
    const refreshToken = this.jwtService.sign(data, { expiresIn: '30d' });
    return { accessToken, refreshToken };
  }

  private async validateUser(dto: LoginDto) {
    const user = await this.usersService.getOne(dto.username);
    if (!user) throw new NotFoundException('User not found');
    if (user.password !== dto.password)
      throw new NotFoundException('Not active');

    return user;
  }

  async login(dto: LoginDto) {
    const { password, ...user } = await this.validateUser(dto);
    const tokens = this.issueTokens(user.id, user.role);
    return { user, ...tokens };
  }

  async refresh(dto: TokenDto) {
    const data = this.verifyToken(dto.refreshToken);
    const user = await this.usersService.getById(data.id);
    if (!user) throw new NotFoundException('User not found');
    const tokens = this.issueTokens(user.id, user.role || 'viewer');
    const { password, ...userData } = user;
    return { user: userData, ...tokens };
  }
}
