export class RestorationHistory {
  constructor(
    public readonly id: string,
    public readonly repairsPerformed: string,
    public readonly replacedParts: string,
    public readonly repairDate: Date,
    public readonly observations: string | null,
    public readonly vehicleId: string,
    public readonly createdAt?: Date
  ) {}
}
