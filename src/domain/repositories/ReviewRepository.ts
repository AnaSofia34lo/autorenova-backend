import { Review } from '../entities/Review.js';

export interface ReviewRepository {
  findMany(): Promise<(Review & { user: { firstName: string; lastName: string } })[]>;
  create(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review>;
}
