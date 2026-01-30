import { ClientLayout } from "@/components/client/ClientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Star, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface PendingReview {
  id: number;
  caregiverName: string;
  date: string;
  type: string;
  avatar: string;
}

interface CompletedReview {
  id: number;
  caregiverName: string;
  date: string;
  rating: number;
  comment: string;
  avatar: string;
}

const pendingReviews: PendingReview[] = [
  {
    id: 1,
    caregiverName: "Carla Mendes",
    date: "20 Jan 2025",
    type: "Cuidado integral",
    avatar: "CM",
  },
];

const completedReviews: CompletedReview[] = [
  {
    id: 1,
    caregiverName: "Maria Silva",
    date: "18 Jan 2025",
    rating: 5,
    comment: "Excelente profissional! Muito atenciosa e carinhosa com minha mãe.",
    avatar: "MS",
  },
  {
    id: 2,
    caregiverName: "Ana Santos",
    date: "15 Jan 2025",
    rating: 4,
    comment: "Ótimo atendimento, pontual e profissional.",
    avatar: "AS",
  },
];

const ClientReviews = () => {
  const { toast } = useToast();
  const [pending, setPending] = useState(pendingReviews);
  const [completed, setCompleted] = useState(completedReviews);
  const [reviewingId, setReviewingId] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmitReview = (review: PendingReview) => {
    if (rating === 0) {
      toast({
        title: "Selecione uma nota",
        description: "Por favor, selecione uma nota de 1 a 5 estrelas.",
        variant: "destructive",
      });
      return;
    }

    const newReview: CompletedReview = {
      id: Date.now(),
      caregiverName: review.caregiverName,
      date: review.date,
      rating,
      comment,
      avatar: review.avatar,
    };

    setCompleted([newReview, ...completed]);
    setPending(pending.filter(p => p.id !== review.id));
    setReviewingId(null);
    setRating(0);
    setComment("");

    toast({
      title: "Avaliação enviada",
      description: "Sua avaliação foi registrada com sucesso. Obrigado pelo feedback!",
    });
  };

  const renderStars = (currentRating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setRating(star)}
            className={`${interactive ? "cursor-pointer hover:scale-110" : ""} transition-transform`}
          >
            <Star
              className={`w-6 h-6 ${
                star <= currentRating
                  ? "text-warning fill-warning"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <ClientLayout title="Avaliações" subtitle="Avalie os atendimentos finalizados">
      <div className="max-w-3xl space-y-6">
        {/* Pending Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Avaliações Pendentes
              {pending.length > 0 && (
                <Badge variant="secondary">{pending.length}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pending.length > 0 ? (
              pending.map((review) => (
                <div
                  key={review.id}
                  className="p-4 rounded-xl border border-border bg-card"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-primary">{review.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{review.caregiverName}</h3>
                      <p className="text-sm text-muted-foreground">{review.date} - {review.type}</p>

                      {reviewingId === review.id ? (
                        <div className="mt-4 space-y-4">
                          <div>
                            <p className="text-sm font-medium text-foreground mb-2">Sua nota:</p>
                            {renderStars(rating, true)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground mb-2">Seu comentário (opcional):</p>
                            <Textarea
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Conte como foi sua experiência..."
                              rows={3}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => handleSubmitReview(review)}>
                              Enviar avaliação
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => {
                                setReviewingId(null);
                                setRating(0);
                                setComment("");
                              }}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          className="mt-3"
                          size="sm"
                          onClick={() => setReviewingId(review.id)}
                        >
                          <Star className="w-4 h-4 mr-2" />
                          Avaliar atendimento
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 mx-auto text-success mb-4" />
                <p className="text-muted-foreground">Todas as avaliações foram enviadas!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Avaliações Enviadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {completed.length > 0 ? (
              completed.map((review) => (
                <div
                  key={review.id}
                  className="p-4 rounded-xl bg-muted/50"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-secondary-foreground">{review.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">{review.caregiverName}</h3>
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{review.date}</p>
                      {review.comment && (
                        <p className="text-sm text-foreground bg-background p-3 rounded-lg">
                          "{review.comment}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhuma avaliação enviada ainda</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default ClientReviews;
