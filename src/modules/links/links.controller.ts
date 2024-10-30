import { Controller, Post, Get, Put, Body, Param, Query, Res, NotFoundException, UnauthorizedException, GoneException } from '@nestjs/common';
import { LinksService } from './links.service';
import { Response } from 'express';
import { CreateLinkDTO } from './links.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';

@ApiTags('Links')
@Controller()
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post('create')
  @ApiOperation({ summary: 'Crear un nuevo enlace enmascarado' })
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        target: 'https://www.fierrastudio.com',
        link: 'http://localhost:8080/aBsJu',
        valid: true,
      },
    },
  })
  @ApiBody({ type: CreateLinkDTO })
  createLink(@Body() createLinkDTO: CreateLinkDTO) {
    const expDate = createLinkDTO.expirationDate
      ? new Date(createLinkDTO.expirationDate)
      : undefined;
    return this.linksService.createLink(
      createLinkDTO.url,
      createLinkDTO.password,
      expDate,
    );
  }

  @Get(':link')
  @ApiOperation({ summary: 'Redirigir a la URL original desde un enlace enmascarado' })
  @ApiParam({ name: 'link' })
  @ApiQuery({
    name: 'password',
    required: false,
  })
  @ApiResponse({ status: 302, description: 'Redirección a la URL original' })
  @ApiResponse({ status: 401, description: 'Contraseña incorrecta' })
  @ApiResponse({ status: 404, description: 'Enlace no encontrado o inválido' })
  @ApiResponse({ status: 410, description: 'Enlace expirado' })
  async redirect(
    @Param('link') link: string,
    @Query('password') password: string,
    @Res() res: Response,
  ) {
    try {
      const originalUrl = this.linksService.getLink(link, password);
      res.redirect(originalUrl);
    } catch (error) {
      if (error.status === 401) {
        throw new UnauthorizedException('Contraseña incorrecta');
      } else if (error.status === 410) {
        throw new GoneException('Enlace expirado');
      } else {
        throw new NotFoundException('Enlace no encontrado o inválido');
      }
    }
  }

  @Get(':link/stats')
  @ApiOperation({ summary: 'Obtener estadísticas de un enlace enmascarado' })
  @ApiParam({ name: 'link', description: 'Enlace único' })
  @ApiResponse({
    status: 200,
    description: 'Cantidad de redirecciones del enlace',
    schema: { example: { views: 10 } },
  })
  getLinkStats(@Param('link') link: string) {
    return this.linksService.getLinkStats(link);
  }

  @Put(':link')
  @ApiOperation({ summary: 'Invalidar un enlace enmascarado' })
  @ApiParam({ name: 'link', description: 'Enlace único' })
  @ApiResponse({
    status: 200,
    description: 'Enlace invalidado exitosamente',
    schema: { example: { message: 'Enlace invalidado exitosamente' } },
  })
  @ApiResponse({ status: 404, description: 'Enlace no encontrado' })
  invalidateLink(@Param('link') link: string) {
    return this.linksService.invalidateLink(link);
  }
}
