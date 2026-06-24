import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useListGuestbookMessages, useCreateGuestbookMessage, getListGuestbookMessagesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, "Name required").max(50),
  message: z.string().min(5, "Message required").max(300),
  emoji: z.string().optional(),
});

const emojis = ["✨", "🌸", "🎨", "🐉", "🦋", "🌙"];

export default function Guestbook() {
  const { data: messages, isLoading } = useListGuestbookMessages();
  const createMessage = useCreateGuestbookMessage();
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", message: "", emoji: "✨" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createMessage.mutate(
      { data: values },
      {
        onSuccess: () => {
          form.reset();
          queryClient.invalidateQueries({ queryKey: getListGuestbookMessagesQueryKey() });
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        },
      }
    );
  }

  return (
    <section id="guestbook" className="w-full py-24 max-w-4xl mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="font-display text-4xl font-semibold text-[var(--ink)]">Guestbook</h2>
        <p className="mt-2 text-[var(--ink-muted)] font-sans">Leave a mark before you go.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white/40 p-8 rounded-2xl shadow-sm border border-[var(--glass-border)] h-fit"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} className="bottom-border-input text-lg font-sans placeholder:text-[var(--ink-muted)]/50 text-[var(--ink)]" />
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
                        placeholder="Your Message..." 
                        {...field} 
                        className="bottom-border-input text-lg font-sans placeholder:text-[var(--ink-muted)]/50 text-[var(--ink)] resize-none min-h-[100px]" 
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
                    <div className="flex gap-3 mt-4">
                      {emojis.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => field.onChange(emoji)}
                          className={`text-xl p-2 rounded-full transition-all ${field.value === emoji ? 'bg-[var(--app-accent)]/30 scale-110' : 'hover:bg-black/5 opacity-50 hover:opacity-100'}`}
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
                className="w-full bg-[var(--ink)] text-white py-4 rounded-xl font-medium font-sans hover:bg-[var(--ink)]/90 transition-colors disabled:opacity-50 mt-4"
              >
                {createMessage.isPending ? "Sending..." : success ? "Sent!" : "Sign Guestbook"}
              </button>
            </form>
          </Form>
        </motion.div>

        <div className="relative">
          {/* Lined paper effect background */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none rounded-xl"
            style={{ 
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 39px, var(--app-accent) 40px)',
              backgroundSize: '100% 40px' 
            }} 
          />
          
          <div className="space-y-8 relative z-10 pt-2 h-[500px] overflow-y-auto pr-4 custom-scrollbar">
            {isLoading ? (
              <div className="text-center text-[var(--ink-muted)]">Loading messages...</div>
            ) : messages?.length ? (
              messages.map((msg, i) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="pb-4 border-b border-transparent"
                >
                  <p className="font-sans text-[var(--ink)] text-lg leading-relaxed mb-2">
                    {msg.emoji} {msg.message}
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="font-display font-semibold text-[var(--ink)] text-xl">— {msg.name}</span>
                    <span className="font-handwriting text-[var(--ink-muted)] text-xl">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center text-[var(--ink-muted)] font-handwriting text-2xl mt-10">
                Be the first to sign!
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
