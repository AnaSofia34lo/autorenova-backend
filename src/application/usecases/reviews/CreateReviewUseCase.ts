import { ReviewRepository } from '../../../domain/repositories/ReviewRepository.js';
import { Review } from '../../../domain/entities/Review.js';
import { ValidationError } from '../../../domain/errors/DomainError.js';

export interface CreateReviewInput {
  rating: number;
  comment: string;
  userId: string;
}

export class CreateReviewUseCase {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async execute(input: CreateReviewInput): Promise<Review> {
    if (input.rating < 1 || input.rating > 5) {
      throw new ValidationError('La calificación debe estar entre 1 y 5 estrellas');
    }
    return this.reviewRepository.create({
      rating: input.rating,
      comment: input.comment,
      userId: input.userId
    });
  }
}
