import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLinkDTO {
  @ApiProperty({ description: 'URL original que será enmascarada' })
  url: string;

  @ApiPropertyOptional({ description: 'Contraseña para proteger el enlace' })
  password?: string;

  @ApiPropertyOptional({
    description: 'Fecha de expiración del enlace',
    type: String,
    format: 'date-time',
  })
  expirationDate?: string;
}
