import { beachBarReviewRatingMaxValue } from "@/constants/_index";
import { softRemove } from "@/utils/softRemove";
import { errors, TABLES } from "@beach_bar/common";
import { Dayjs } from "dayjs";
import {
  BaseEntity,
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { BeachBar } from "./BeachBar";
import { Customer } from "./Customer";
import { Payment } from "./Payment";
// import { ReviewAnswer } from "./ReviewAnswer";
import { ReviewVisitType } from "./ReviewVisitType";
import { ReviewVote } from "./ReviewVote";
import { ReviewVoteType } from "./ReviewVoteType";
import { MonthTime } from "./Time";
import { User } from "./User";

@Entity({ name: "beach_bar_review", schema: "public" })
@Check(`"ratingValue" >= 0 AND "ratingValue" <= ${beachBarReviewRatingMaxValue}`)
export class BeachBarReview extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id: bigint;

  @Column({ type: "integer", name: "beach_bar_id" })
  beachBarId: number;

  @Column({ type: "integer", name: "customer_id" })
  customerId: number;

  @Column({ type: "integer", name: "payment_id" })
  paymentId: number;

  @Column({ type: "smallint", name: "rating_value" })
  ratingValue: number;

  @Column({ type: "integer", name: "visit_type_id", nullable: true })
  visitTypeId?: number;

  @Column({ type: "integer", name: "month_id", nullable: true })
  monthId?: number;

  @Column({ type: "text", name: "positive_comment", nullable: true })
  positiveComment?: string;

  @Column({ type: "text", name: "negative_comment", nullable: true })
  negativeComment?: string;

  @Column({ type: "text", name: "body", nullable: true })
  body?: string;

  @Column({ type: "text", name: "answer", nullable: true })
  answer?: string;

  @OneToMany(() => ReviewVote, vote => vote.review, { nullable: false, cascade: ["soft-remove", "recover"] })
  votes: ReviewVote[];

  @ManyToOne(() => BeachBar, beachBar => beachBar.reviews, { nullable: false, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "beach_bar_id" })
  beachBar: BeachBar;

  @ManyToOne(() => Customer, customer => customer.reviews, { nullable: false, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "customer_id" })
  customer: Customer;

  @ManyToOne(() => Payment, payment => payment.reviews, { nullable: false, cascade: ["soft-remove", "recover"] })
  @JoinColumn({ name: "payment_id" })
  payment: Payment;

  @ManyToOne(() => ReviewVisitType, reviewVisitType => reviewVisitType.reviews, { nullable: true })
  @JoinColumn({ name: "visit_type_id" })
  visitType?: ReviewVisitType | null;

  @ManyToOne(() => MonthTime, monthTime => monthTime.reviews, { nullable: true })
  @JoinColumn({ name: "month_id" })
  month?: MonthTime | null;

  // @OneToOne(() => ReviewAnswer, reviewAnswer => reviewAnswer.review, { nullable: true })
  // answer?: ReviewAnswer;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at", default: () => `NOW()` })
  updatedAt: Dayjs;

  @CreateDateColumn({ type: "timestamptz", name: "timestamp", default: () => `NOW()` })
  timestamp: Dayjs;

  @DeleteDateColumn({ type: "timestamptz", name: "deleted_at", nullable: true })
  deletedAt: Dayjs;

  async update(
    options: Pick<Partial<BeachBarReview>, "ratingValue" | "positiveComment" | "negativeComment" | "body" | "answer"> & {
      visitTypeId?: string;
      monthId?: string;
    }
  ): Promise<BeachBarReview> {
    const { ratingValue, visitTypeId, monthId, positiveComment, negativeComment, body, answer } = options;
    try {
      if (ratingValue && ratingValue !== this.ratingValue && ratingValue >= 1 && ratingValue <= beachBarReviewRatingMaxValue) {
        this.ratingValue = ratingValue;
      }
      if (visitTypeId && visitTypeId !== String(this.visitTypeId)) {
        if (visitTypeId.toLowerCase() === "none") this.visitType = null;
        else {
          const visitType = await ReviewVisitType.findOne(visitTypeId);
          if (!visitType) throw new Error();
          this.visitType = visitType;
        }
      }
      if (monthId && monthId !== String(this.monthId)) {
        if (monthId.toLowerCase() === "none") this.month = null;
        else {
          const monthTime = await MonthTime.findOne(monthId);
          if (!monthTime) throw new Error();
          this.month = monthTime;
        }
      }
      if (positiveComment && positiveComment !== this.positiveComment) this.positiveComment = positiveComment;
      if (negativeComment && negativeComment !== this.negativeComment) this.negativeComment = negativeComment;
      if (body && body !== this.body) this.body = body;
      if (answer !== this.answer) this.answer = answer?.trim().length === 0 ? undefined : answer;
      await this.save();
      await this.beachBar.updateRedis();
      return this;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async vote(userId: number, upvote?: boolean, downvote?: boolean): Promise<void> {
    const user = await User.findOne({ where: { id: userId }, relations: ["reviewVotes"] });
    if (!user) throw new Error(errors.USER_NOT_FOUND_MESSAGE);
    const userVoteForThisReview = await ReviewVote.findOne({
      where: { reviewId: this.id, userId },
      relations: ["review", "type", "user"],
    });

    try {
      const typeId = userVoteForThisReview?.typeId.toString();
      if (!userVoteForThisReview) await ReviewVote.create({ typeId: upvote ? 1 : 2, userId, review: this }).save();
      else if ((typeId === "1" && upvote) || (typeId === "2" && downvote)) await userVoteForThisReview.softRemove();
      else if (upvote || downvote) {
        const type = TABLES.REVIEW_VOTE_TYPE.find(({ value }) => value === (upvote ? "upvote" : "downvote"));
        if (type) {
          userVoteForThisReview.type = type as ReviewVoteType;
          await userVoteForThisReview.save();
        }
      }
      await this.beachBar.updateRedis();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async softRemove(): Promise<any> {
    // const findOptions: any = { reviewId: this.id };
    // await softRemove(BeachBarReview, { id: this.id }, [ReviewAnswer], findOptions);
    await softRemove(BeachBarReview, { id: this.id });
    await this.beachBar.updateRedis();
  }
}
