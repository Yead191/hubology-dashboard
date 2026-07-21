import type { ReactNode } from "react";
import { Button, Drawer, Image, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { RatingStars } from "@/components/ui/RatingStars";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ProductRating } from "../types";

export function ProductDetailDrawer({
  open,
  onClose,
  title,
  subtitle,
  coverImage,
  price,
  description,
  rating,
  detailsSlot,
  onEdit,
  onDelete,
  onDeleteReview,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  coverImage: string;
  price: number;
  description: string;
  rating: ProductRating;
  detailsSlot: ReactNode;
  onEdit: () => void;
  onDelete: () => void;
  onDeleteReview: (reviewId: string) => void;
}) {
  return (
    <Drawer open={open} onClose={onClose} width={460} title="Product details" destroyOnHidden>
      <div className="overflow-hidden rounded-xl">
        <Image src={coverImage} alt={title} width="100%" height={180} style={{ objectFit: "cover" }} preview={{ mask: false }} />
      </div>

      <div className="mt-4">
        <h2 className="font-display text-lg font-semibold text-cloud-100">{title}</h2>
        <p className="text-sm text-mist-400">{subtitle}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-display text-xl font-semibold text-cloud-100">{formatCurrency(price)}</span>
          <RatingStars value={rating.average} />
          <span className="text-xs text-mist-600">
            {rating.average.toFixed(1)} ({rating.totalReviews})
          </span>
        </div>
      </div>

      <Section title="Description">
        <p className="text-sm leading-relaxed text-mist-400">{description}</p>
      </Section>

      <Section title="Details">{detailsSlot}</Section>

      <Section title={`Reviews (${rating.reviews.length})`}>
        {rating.reviews.length === 0 ? (
          <p className="text-sm text-mist-600">No reviews yet.</p>
        ) : (
          <div className="space-y-3">
            {rating.reviews.map((review) => (
              <div key={review.id} className="rounded-xl border border-navy-700/60 bg-navy-800/40 p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-medium text-cloud-100">{review.reviewerName}</div>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <RatingStars value={review.rating} size={11} />
                      <span className="text-[11px] text-mist-600">{formatDate(review.date)}</span>
                    </div>
                  </div>
                  <Popconfirm
                    title="Remove this review?"
                    description="This will also update the product's average rating."
                    okText="Remove"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => onDeleteReview(review.id)}
                  >
                    <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-mist-400">{review.text}</p>
              </div>
            ))}
          </div>
        )}
      </Section>

      <div className="mt-6 flex gap-2 border-t border-navy-700/60 pt-4">
        <Button icon={<EditOutlined />} block onClick={onEdit}>
          Edit
        </Button>
        <Button icon={<DeleteOutlined />} danger block onClick={onDelete}>
          Delete
        </Button>
      </div>
    </Drawer>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-5">
      <div className="mb-2 text-xs font-medium uppercase tracking-wide text-mist-600">{title}</div>
      {children}
    </div>
  );
}
