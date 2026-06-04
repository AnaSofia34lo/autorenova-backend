export class Review {
  constructor(
    public readonly id: string,
    public readonly rating: number,
    public readonly comment: string,
    public readonly userId: string,
    public readonly createdAt?: Date
  ) {}
}
