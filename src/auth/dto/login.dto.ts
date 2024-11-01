import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email không đúng  định dạng' })
  @ApiProperty() //dùng để show ra ngoài swagger
  email: string;

  @IsNotEmpty({ message: 'password không được để trống' })
  @ApiProperty()
  pass_word: string;
}
