import { Injectable, NotFoundException, UnauthorizedException, GoneException } from '@nestjs/common';

@Injectable()
export class LinksService {
  private links = new Map<
    string,
    {
      originalUrl: string;
      link: string;
      valid: boolean;
      views: number;
      password?: string;
      expirationDate?: Date;
    }
  >();

  private generateLink() {
    const linkCode = Math.random().toString(36).substring(2, 7);
    return `http://localhost:${process.env.PORT || 3000}/${linkCode}`
  }

  createLink(originalUrl: string, password?: string, expirationDate?: Date) {
    const link = this.generateLink();
    this.links.set(link, {
      originalUrl,
      link,
      valid: true,
      views: 0,
      password,
      expirationDate,
    });
    return {
      target: originalUrl,
      link,
      valid: true,
    };
  }

  getLink(link: string, password?: string) {
    const linkFound = this.links.get(link);

    if (!linkFound || !linkFound.valid) {
      throw new NotFoundException();
    }
    if (linkFound.password && linkFound.password !== password) {
      throw new UnauthorizedException();
    }
    if (linkFound.expirationDate && linkFound.expirationDate < new Date()) {
      throw new GoneException();
    }

    linkFound.views++;
    return linkFound.originalUrl;
  }

  getLinkStats(link: string) {
    const linkFound = this.links.get(link);
    if (!linkFound) throw new NotFoundException('Enlace no encontrado');
    return { views: linkFound.views };
  }

  invalidateLink(link: string) {
    const linkFound = this.links.get(link);
    if (!linkFound) throw new NotFoundException('Enlace no encontrado');
    linkFound.valid = false;
    return { message: 'Enlace invalidado exitosamente' };
  }
}
