import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ReviewPage = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Mock appointment data
  const appointment = {
    caregiverName: "Maria Santos",
    date: "22 de Janeiro, 2025",
    duration: "4 horas",
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Por favor, selecione uma avaliação");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success("Avaliação enviada com sucesso!");
    navigate("/meus-agendamentos");
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Atendimento concluído!
              </h1>
              <p className="text-muted-foreground">
                Como foi sua experiência com {appointment.caregiverName}?
              </p>
            </div>

            <Card variant="elevated">
              <CardHeader className="text-center pb-2">
                <CardTitle>Sua avaliação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Appointment summary */}
                <div className="p-4 rounded-xl bg-muted/50 text-center">
                  <p className="font-medium text-foreground">{appointment.caregiverName}</p>
                  <p className="text-sm text-muted-foreground">
                    {appointment.date} • {appointment.duration}
                  </p>
                </div>

                {/* Star rating */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-3">Toque para avaliar</p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="p-1 transition-transform hover:scale-110"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                      >
                        <Star
                          className={`w-10 h-10 transition-colors ${
                            star <= (hoveredRating || rating)
                              ? "text-warning fill-warning"
                              : "text-muted stroke-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-sm font-medium text-foreground mt-2">
                      {rating === 5 && "Excelente!"}
                      {rating === 4 && "Muito bom!"}
                      {rating === 3 && "Bom"}
                      {rating === 2 && "Regular"}
                      {rating === 1 && "Ruim"}
                    </p>
                  )}
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Comentário (opcional)
                  </label>
                  <Textarea
                    placeholder="Conte como foi sua experiência..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={rating === 0 || isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar avaliação"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Sua avaliação será exibida após o cuidador também avaliar, 
                  ou após 48 horas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReviewPage;
