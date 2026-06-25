import { useState } from "react";
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

const formSchema = z.object({
  name: z.string().min(2, "Name required").max(50),
  message: z.string().min(5, "Message required").max(300),
  emoji: z.string().optional(),
});

const emojis = ["🐾", "✨", "🌸", "🎨", "🐈", "🌙", "🦋", "💜"];

export default function Guestbook() {
  const { data: messages, isLoading } = useListGuestbookMessages();
  const createMessage = useCreateGuestbookMessage();
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", message: "", emoji: "🐾" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createMessage.mutate(
      { data: values },
      {
        onSuccess: () => {
          form.reset({ name: "", message: "", emoji: "🐾" });
          queryClient.invalidateQueries({ queryKey: getListGuestbookMessagesQueryKey() });
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        },
      }
    );
  }

  return (
    <section id="guestbook" className="w-full py-24 max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <p className="font-handwriting text-xl text-[var(--ink-muted)] mb-1">say hi before you go 🐾</p>
        <h2 className="font-display text-4xl font-semibold text-[var(--ink)]">Guestbook</h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-10 md:gap-16">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-8 h-fit"
          style={{ background: "rgba(255,255,255,0.55)" }}
        >
          {success && (
            <div className="mb-5 text-center glass-panel py-3 px-4" style={{ background: "rgba(179,157,219,0.2)" }}>
              <span className="font-handwriting text-xl text-[var(--ink)]">Left a paw print! 🐾✨</span>
            </div>
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
              <button
                type="submit"
                disabled={createMessage.isPending}
                className="w-full rounded-2xl py-4 text-white font-medium font-sans text-base transition-all duration-300 disabled:opacity-50 hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: "linear-gradient(135deg, var(--app-accent), var(--app-accent-pink))" }}
              >
                {createMessage.isPending ? "Signing..." : "Leave a Paw Print 🐾"}
              </button>
            </form>
          </Form>
        </motion.div>

        {/* Messages */}
        <div className="relative">
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
                    <span className="font-handwriting text-[var(--ink-muted)] text-base">
                      {new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center mt-12">
                <p className="text-5xl mb-4">🐾</p>
                <p className="font-handwriting text-2xl text-[var(--ink-muted)]">Be the first to sign!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
