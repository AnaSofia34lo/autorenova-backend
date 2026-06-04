export class DamageRecord {
  constructor(
    public readonly id: string,
    public readonly damageType: string,
    public readonly affectedParts: string,
    public readonly acquisitionDate: Date,
    public readonly vehicleId: string,
    public readonly createdAt?: Date
  ) {}
}
