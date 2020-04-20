export class Product {
  public imageFeaturedUrl?;

  constructor(
    public id: number = 1,
    public userId?: number,
    public name: string = '',
    public description: string = '',
    public price: number = 0,
    public idCatalogue: number = 0,
    public imageURLs: string[] = [],
    public imageRefs: string[] = [],
  ) {
  }
}
