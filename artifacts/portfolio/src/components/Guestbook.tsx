import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useListGuestbookMessages,
  useCreateGuestbookMessage,
  getListGuestbookMessagesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TextReveal, FadeIn } from "./TextReveal";
import { ConfettiContainer, useConfetti } from "./Confetti";

const formSchema = z.object({
  name: z.string().min(2, "Name required").max(50),
  message: z.string().min(5, "Message required").max(300),
  emoji: z.string().optional(),
});

const emojis = ["✦", "✨", "✏️", "🐉", "🌸", "🎨", "⭐", "🎮"];

export default function Guestbook() {
  const { data: messages, isLoading } = useListGuestbookMessages();
  const createMessage = useCreateGuestbookMessage();
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);
  const [challenge, setChallenge] = useState<{ q: string; a: string } | null>(null);
  const [challengeAnswer, setChallengeAnswer] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const [postCooldownSec, setPostCooldownSec] = useState(0);
  const { pieces, burst, clear } = useConfetti();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", message: "", emoji: "✦" },
  });

  useEffect(() => {
    fetchChallenge();
  }, []);

  useEffect(() => {
    if (cooldownLeft <= 0) return;
    const timer = setInterval(() => setCooldownLeft(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldownLeft]);

  async function fetchChallenge() {
    try {
      const res = await fetch("/api/guestbook/challenge");
      const data = await res.json();
      setChallenge({ q: data.challenge, a: String(data.expiresAt) });
    } catch {
      setChallenge({ q: "2 + 3", a: "5" });
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setErrorMsg("");
    if (!challengeAnswer) {
      setErrorMsg("Please solve the math challenge.");
      return;
    }

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          answer: challengeAnswer,
          challenge: challenge?.q || "",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 429 && data.cooldownSeconds) {
          setCooldownLeft(data.cooldownSeconds);
          setPostCooldownSec(data.cooldownSeconds);
        }
        setErrorMsg(data.error || "Failed to send message.");
        return;
      }

      const data = await res.json();
      const cooldown = data.cooldownSeconds || 60;
      setPostCooldownSec(cooldown);
      setCooldownLeft(cooldown);
      form.reset({ name: "", message: "", emoji: "✦" });
      setChallengeAnswer("");
      setSuccess(true);
      burst(50);
      queryClient.invalidateQueries({ queryKey: getListGuestbookMessagesQueryKey() });
      setTimeout(() => {
        setSuccess(false);
        clear();
      }, 4000);

      // Refresh challenge
      fetchChallenge();
    } catch {
      setErrorMsg("Something went wrong. Try again.");
    }
  }

  return (
    <section id="guestbook" className="w-full py-24 max-w-4xl mx-auto px-4">
      <ConfettiContainer pieces={pieces} />

      <div className="text-center mb-14">
        <TextReveal as="div" className="text-[var(--ink-muted)] font-handwriting text-xl mb-1">
          say hi before you go
        </TextReveal>
        <TextReveal as="h2" className="font-display text-4xl font-semibold text-[var(--ink)]">
          Guestbook
        </TextReveal>
      </div>

      <div className="grid md:grid-cols-2 gap-10 md:gap-16">
        {/* Form */}
        <FadeIn direction="left" className="glass-panel p-8 h-fit" style={{ background: "rgba(255,255,255,0.55)" }}>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 text-center py-3 px-4 rounded-xl text-sm"
              style={{ background: "rgba(179,157,219,0.2)" }}
            >
              <span className="font-sans font-medium text-[var(--ink)]">Message sent! ✦</span>
            </motion.div>
          )}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-5 text-center py-3 px-4 rounded-xl text-sm"
              style={{ background: "rgba(244,100,100,0.1)" }}
            >
              <span className="font-sans font-medium text-red-500">{errorMsg}</span>
            </motion.div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Your name..."
                        {...field}
                        className="bottom-border-input text-lg font-sans placeholder:text-[var(--ink-muted)]/40 text-[var(--ink)]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Leave a message..."
                        {...field}
                        className="bottom-border-input text-lg font-sans placeholder:text-[var(--ink-muted)]/40 text-[var(--ink)] resize-none min-h-[90px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emoji"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {emojis.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => field.onChange(emoji)}
                          className={`text-xl p-2 rounded-xl transition-all duration-200 ${
                            field.value === emoji
                              ? "bg-[var(--app-accent)]/25 scale-110 shadow-sm"
                              : "hover:bg-black/5 opacity-50 hover:opacity-100"
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </FormItem>
                )}
              />

              {/* Challenge */}
              <div className="flex items-center gap-3">
                <div className="bg-white/60 rounded-xl px-3 py-2 text-sm font-sans text-[var(--ink)] border border-[var(--glass-border)]">
                  {challenge?.q || "2 + 3"}
                </div>
                <span className="text-[var(--ink-muted)] text-sm">=</span>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="?"
                  value={challengeAnswer}
                  onChange={(e) => setChallengeAnswer(e.target.value)}
                  className="bottom-border-input text-lg font-sans text-center w-16 text-[var(--ink)]"
                />
              </div>

              {cooldownLeft > 0 && (
                <div className="text-center text-sm text-[var(--ink-muted)] font-sans">
                  Please wait <span className="font-semibold text-[var(--app-accent)] tabular-nums">{cooldownLeft}s</span> before posting again
                </div>
              )}
              <motion.button
                type="submit"
                disabled={createMessage.isPending || cooldownLeft > 0}
                whileHover={cooldownLeft > 0 ? {} : { y: -2, boxShadow: "0 14px 40px rgba(179,157,219,0.3)" }}
                whileTap={cooldownLeft > 0 ? {} : { scale: 0.97 }}
                className="w-full rounded-2xl py-4 text-white font-medium font-sans text-base transition-all duration-300 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, var(--app-accent), var(--app-accent-pink))" }}
              >
                {cooldownLeft > 0 ? `Wait ${cooldownLeft}s` : (createMessage.isPending ? "Sending..." : "Send Message")}
              </motion.button>
            </form>
          </Form>
        </FadeIn>

        {/* Messages */}
        <FadeIn direction="right" delay={0.15} className="relative">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none rounded-xl"
            style={{
              backgroundImage: "repeating-linear-gradient(transparent, transparent 39px, var(--app-accent) 40px)",
            }}
          />
          <div className="space-y-7 relative z-10 pt-2 h-[460px] overflow-y-auto pr-3 custom-scrollbar">
            {isLoading ? (
              <div className="flex gap-1.5 justify-center mt-10">
                {["var(--app-accent)", "var(--app-accent-pink)", "var(--app-accent-blue)"].map((c, i) => (
                  <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: c, animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            ) : messages?.length ? (
              messages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="pb-5 border-b border-[var(--glass-border)]/60 last:border-0"
                >
                  <p className="font-sans text-[var(--ink)] text-base leading-relaxed mb-2">
                    {msg.emoji} {msg.message}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display font-semibold text-[var(--ink)] text-lg">— {msg.name}</span>
                    <span className="font-sans text-[var(--ink-muted)] text-sm">
                      {new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center mt-12">
                <p className="text-4xl mb-4">✏️</p>
                <p className="font-handwriting text-2xl text-[var(--ink-muted)]">Be the first to write!</p>
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
