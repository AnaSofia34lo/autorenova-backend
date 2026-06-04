import { Review } from '../../domain/entities/Review.js';
import { ReviewRepository } from '../../domain/repositories/ReviewRepository.js';
import { prisma } from '../prisma-client/prisma.js';

export class PrismaReviewRepository implements ReviewRepository {
  async findMany(): Promise<any[]> {
    const list = await prisma.review.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return list.map(item => ({
      id: item.id,
      rating: item.rating,
      comment: item.comment,
      userId: item.userId,
      createdAt: item.createdAt,
      user: {
        firstName: item.user.firstName,
        lastName: item.user.lastName
      }
    }));
  }

  async create(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const dbReview = await prisma.review.create({
      data: {
        rating: review.rating,
        comment: review.comment,
        userId: review.userId
      }
    });
    return new Review(dbReview.id, dbReview.rating, dbReview.comment, dbReview.userId, dbReview.createdAt);
  }
}
