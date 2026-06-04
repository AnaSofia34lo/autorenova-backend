import { ReviewRepository } from '../../../domain/repositories/ReviewRepository.js';

export class ListReviewsUseCase {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async execute(): Promise<any[]> {
    return this.reviewRepository.findMany();
  }
}
