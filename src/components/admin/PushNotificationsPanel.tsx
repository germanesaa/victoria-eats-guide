import { useCallback, useEffect, useState } from "react";
import { Bell, Send, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type HistoryRow = {
  id: string;
  title: string;
  body: string;
  sent_count: number;
  failed_count: number;
  created_at: string;
};

const PushNotificationsPanel = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("/");
  const [image, setImage] = useState("");
  const [sending, setSending] = useState(false);
  const [devices, setDevices] = useState(0);
  const [history, setHistory] = useState<HistoryRow[]>([]);

  const load = useCallback(async () => {
    const { count } = await supabase
      .from("push_subscriptions" as any)
      .select("id", { count: "exact", head: true });
    setDevices(count ?? 0);

    const { data } = await supabase
      .from("push_notifications" as any)
      .select("id, title, body, sent_count, failed_count, created_at")
      .order("created_at", { ascending: false })
      .limit(10);
    setHistory((data as unknown as HistoryRow[]) || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) {
      toast({ title: "Campos requeridos", description: "Título y mensaje son obligatorios.", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-push", {
        body: { title: title.trim(), body: body.trim(), url: url.trim() || "/", image: image.trim() },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast({
        title: "Notificación enviada",
        description: `Enviada a ${(data as any)?.sent ?? 0} dispositivos.`,
      });
      setTitle("");
      setBody("");
      setImage("");
      setUrl("/");
      load();
    } catch (e: any) {
      toast({ title: "Error al enviar", description: e?.message || "No se pudo enviar.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="mb-6 border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Notificaciones Push
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3 text-sm">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span>
            <strong>{devices}</strong> dispositivo(s) suscrito(s)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Título</Label>
            <Input
              value={title}
              maxLength={100}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="🔥 ¡2x1 en pizzas hoy!"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Enlace al abrir (opcional)</Label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="/"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label>Mensaje</Label>
          <Textarea
            value={body}
            maxLength={300}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Promoción válida solo hoy en restaurantes seleccionados."
            className="mt-1"
          />
        </div>

        <div>
          <Label>URL de imagen (opcional)</Label>
          <Input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
            className="mt-1"
          />
        </div>

        <Button onClick={handleSend} disabled={sending} className="bg-green-600 hover:bg-green-700">
          <Send className="w-4 h-4 mr-2" />
          {sending ? "Enviando..." : "Enviar notificación"}
        </Button>

        {history.length > 0 && (
          <div className="space-y-2 pt-2">
            <Label className="text-sm">Últimas notificaciones</Label>
            {history.map((h) => (
              <div key={h.id} className="rounded-lg border bg-muted/20 px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium truncate">{h.title}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(h.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{h.body}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Enviadas: {h.sent_count} · Fallidas: {h.failed_count}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PushNotificationsPanel;
