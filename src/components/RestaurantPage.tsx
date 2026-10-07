import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Clock, Instagram, MapPin, Phone, Star } from "lucide-react";
import { RestaurantStatus } from "@/hooks/useRestaurantStatus";
import { getAllCategories, getCategoryMeta } from "@/lib/categoryMeta";
import { StoredReview } from "@/lib/localStore";

interface RestaurantPageProps {
  restaurant: {
    id: string;
    name: string;
    category: string;
    categories?: string[];
    image: string;
    hours: string;
    location: string;
    phone: string;
    instagram?: string;
    menuUrl?: string;
    description?: string;
    status?: RestaurantStatus;
    opensIn?: string;
    menuCategories?: { name: string; items: string[]; price: string }[];
  };
  favorite: boolean;
  reviews: StoredReview[];
  onClose: () => void;
  onToggleFavorite: () => void;
  onSaveReview: (review: { name: string; comment: string; stars: number }) => void;
}

const statusLabel = (status?: RestaurantStatus, opensIn?: string) => {
  if (status === "open") return "Abierto";
  if (status === "opening-soon") return opensIn ? `Abre en ${opensIn}` : "Abre pronto";
  if (status === "closed") return opensIn || "Cerrado";
  return "";
};

const RestaurantPage = ({
  restaurant,
  favorite,
  reviews,
  onClose,
  onToggleFavorite,
  onSaveReview,
}: RestaurantPageProps) => {
  const mine = reviews[0];
  const [stars, setStars] = useState(mine?.stars || 0);
  const [name, setName] = useState(mine?.name || "");
  const [comment, setComment] = useState(mine?.comment || "");
  const [error, setError] = useState("");

  useEffect(() => {
    setStars(mine?.stars || 0);
    setName(mine?.name || "");
    setComment(mine?.comment || "");
    setError("");
  }, [mine?.id, mine?.stars, mine?.name, mine?.comment]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const average = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length;
  }, [reviews]);

  const categories = getAllCategories(restaurant.category, restaurant.categories);
  const instagram = (restaurant.instagram || "").trim();
  const instagramUrl = instagram
    ? /^https?:\/\//i.test(instagram)
      ? instagram
      : `https://instagram.com/${instagram.replace(/^@/, "")}`
    : "";

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (stars < 1) {
      setError("Elige de 1 a 5 estrellas.");
      return;
    }
    if (!name.trim() || !comment.trim()) {
      setError("Escribe tu nombre y un comentario.");
      return;
    }
    onSaveReview({ name: name.trim(), comment: comment.trim(), stars });
    setError("");
  };

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-background">
      <div className="relative h-56 bg-muted sm:h-72">
        {restaurant.image ? (
          <img src={restaurant.image} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-primary/15">
            <img src="/brand/mark-original.png" alt="" className="h-16 w-16 object-contain" />
          </div>
        )}
        <button
          type="button"
          onClick={onClose}
          className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm"
          aria-label="Volver"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="relative mx-auto max-w-lg px-4 pb-28">
        <div className="-mt-10 flex items-end justify-between">
          <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-background bg-card shadow-sm">
            {restaurant.image ? (
              <img src={restaurant.image} alt="" className="h-full w-full object-cover" />
            ) : (
              <img src="/brand/mark-original.png" alt="" className="h-full w-full object-contain p-2" />
            )}
          </div>
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-pressed={favorite}
            className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card"
            aria-label={favorite ? "Quitar de favoritos" : "Guardar en favoritos"}
          >
            <Star className={`h-5 w-5 ${favorite ? "fill-[#47542f] text-[#47542f] dark:fill-[#709a2d] dark:text-[#709a2d]" : "text-[#47542f] dark:text-[#e6d7c8]"}`} />
          </button>
        </div>

        <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground">{restaurant.name}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {average > 0 && (
            <span className="inline-flex items-center gap-1 font-medium text-foreground">
              <Star className="h-4 w-4 fill-[#47542f] text-[#47542f] dark:fill-[#709a2d] dark:text-[#709a2d]" />
              {average.toFixed(1)}
            </span>
          )}
          {categories.map((category) => (
            <span key={category} className="rounded-full bg-muted px-2 py-0.5 text-xs">
              {getCategoryMeta(category).emoji} {category}
            </span>
          ))}
          {restaurant.status && (
            <span className="text-xs font-medium text-foreground">{statusLabel(restaurant.status, restaurant.opensIn)}</span>
          )}
        </div>

        {restaurant.description && (
          <p className="mt-4 text-sm leading-relaxed text-foreground/80">{restaurant.description}</p>
        )}

        <dl className="mt-5 space-y-3 text-sm">
          {restaurant.location && (
            <div className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <dd>{restaurant.location}</dd>
            </div>
          )}
          {restaurant.hours && (
            <div className="flex gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <dd>{restaurant.hours}</dd>
            </div>
          )}
          {restaurant.phone && (
            <div className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <a className="underline-offset-2 hover:underline" href={`https://wa.me/${restaurant.phone}`} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </div>
          )}
          {instagramUrl && (
            <div className="flex gap-2">
              <Instagram className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <a className="underline-offset-2 hover:underline" href={instagramUrl} target="_blank" rel="noreferrer">
                {instagram}
              </a>
            </div>
          )}
        </dl>

        {restaurant.menuUrl && (
          <a
            href={restaurant.menuUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex text-sm font-medium text-primary"
          >
            Ver menú
          </a>
        )}

        {!!restaurant.menuCategories?.length && (
          <section className="mt-6">
            <h2 className="text-sm font-semibold text-foreground">Menú</h2>
            <ul className="mt-2 space-y-3">
              {restaurant.menuCategories.map((group) => (
                <li key={group.name}>
                  <p className="text-sm font-medium">{group.name}</p>
                  <p className="text-xs text-muted-foreground">{group.items.join(", ")}</p>
                  {group.price && <p className="text-xs text-foreground/70">{group.price}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-8 border-t border-border pt-6">
          <h2 className="text-base font-semibold text-foreground">Reseñas</h2>
          {reviews.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">Todavía no hay reseñas. Sé el primero.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {reviews.map((review) => (
                <li key={review.id} className="rounded-2xl bg-muted/60 px-3 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{review.name}</p>
                    <span className="inline-flex">
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star
                          key={index}
                          className={`h-3.5 w-3.5 ${index < review.stars ? "fill-[#47542f] text-[#47542f] dark:fill-[#709a2d] dark:text-[#709a2d]" : "text-[#47542f]/40 dark:text-[#e6d7c8]/40"}`}
                        />
                      ))}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-foreground/80">{review.comment}</p>
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={submit} className="mt-5 space-y-3">
            <p className="text-sm font-medium">{mine ? "Editar tu reseña" : "Dejar una reseña"}</p>
            <div className="flex gap-1" role="radiogroup" aria-label="Calificación">
              {Array.from({ length: 5 }, (_, index) => {
                const value = index + 1;
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={stars === value}
                    aria-label={`${value} estrella${value === 1 ? "" : "s"}`}
                    onClick={() => setStars(value)}
                    className="rounded-md p-1"
                  >
                    <Star className={`h-7 w-7 ${value <= stars ? "fill-[#47542f] text-[#47542f] dark:fill-[#709a2d] dark:text-[#709a2d]" : "text-[#47542f]/45 dark:text-[#e6d7c8]/45"}`} />
                  </button>
                );
              })}
            </div>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={40}
              placeholder="Tu nombre"
              className="h-11 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-primary"
            />
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              maxLength={280}
              rows={3}
              placeholder="Un comentario corto"
              className="w-full resize-none rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button type="submit" className="h-11 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">
              {mine ? "Guardar cambios" : "Publicar reseña"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default RestaurantPage;
