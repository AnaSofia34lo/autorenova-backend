export type VehicleStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD';

export class Vehicle {
  constructor(
    public readonly id: string,
    public readonly brand: string,
    public readonly model: string,
    public readonly year: number,
    public readonly mileage: number,
    public readonly price: number,
    public readonly marketPrice: number | null,
    public readonly description: string,
    public readonly status: VehicleStatus = 'AVAILABLE',
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}
}
