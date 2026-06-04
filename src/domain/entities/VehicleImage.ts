export class VehicleImage {
  constructor(
    public readonly id: string,
    public readonly imageUrl: string,
    public readonly vehicleId: string,
    public readonly createdAt?: Date
  ) {}
}
