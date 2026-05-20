import { UrlRepository } from "../repositories/url.repository";

import { VisitRepository } from "../repositories/visit.repository";

export class RedirectService {
  urlRepository = new UrlRepository();

  visitRepository = new VisitRepository();

  async getOriginalUrl(id: string) {
    const item = await this.urlRepository.getById(id);

    if (!item) {
      throw new Error("URL no encontrada");
    }

    await this.visitRepository.saveVisit(id);

    console.log("Visita guardada");

    return item.originalUrl;
  }
}
