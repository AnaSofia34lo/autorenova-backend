export class ContactMessage {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly message: string,
    public readonly createdAt?: Date
  ) {}
}
