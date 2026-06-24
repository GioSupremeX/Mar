import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useListGuestbookMessages, useCreateGuestbookMessage, getListGuestbookMessagesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { BookOpen, Sparkles, Heart, Star, Send } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name is too short").max(50, "Name is too long"),
  message: z.string().min(5, "Message is too short").max(300, "Message is too long"),
  emoji: z.string().optional(),
});

const cuteEmojis = ["✨", "💖", "🌸", "🎨", "🐉", "🦋", "🍄", "🌙"];

export default function Guestbook() {
  const { data: messages, isLoading } = useListGuestbookMessages();
  const createMessage = useCreateGuestbookMessage();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      message: "",
      emoji: "✨",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createMessage.mutate(
      { data: values },
      {
        onSuccess: () => {
          form.reset();
          queryClient.invalidateQueries({ queryKey: getListGuestbookMessagesQueryKey() });
          toast({
            title: "Message sent! ✨",
            description: "Thanks for visiting my sketchbook!",
          });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Oh no!",
            description: "Something went wrong. Please try again.",
          });
        },
      }
    );
  }

  return (
    <section id="guestbook" className="w-full max-w-4xl px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 text-center"
      >
        <div className="flex justify-center mb-4 text-[#C9B8F0]">
          <BookOpen className="h-12 w-12" />
        </div>
        <h2 className="font-display text-4xl font-black text-[#3D2C5E] md:text-5xl">Guestbook</h2>
        <p className="mt-4 text-lg text-[#3D2C5E]/70">Leave a little magic behind before you go!</p>
      </motion.div>

      <div className="grid gap-12 md:grid-cols-[1fr_1.5fr]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-panel rounded-[2rem] p-6 sm:p-8"
        >
          <h3 className="mb-6 font-display text-2xl font-bold text-[#3D2C5E]">Sign the book</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#3D2C5E]/80">Your Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Wandering Traveler..." 
                        {...field} 
                        className="rounded-xl border-white/50 bg-white/50 placeholder:text-[#3D2C5E]/40 focus-visible:ring-[#C9B8F0]"
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
                    <FormLabel className="text-[#3D2C5E]/80">Pick an icon</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {cuteEmojis.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => field.onChange(emoji)}
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-xl transition-all ${
                            field.value === emoji 
                              ? "bg-[#C9B8F0] shadow-md scale-110" 
                              : "bg-white/50 hover:bg-white hover:scale-105"
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#3D2C5E]/80">Your Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="I love your art! 🌸" 
                        className="min-h-[120px] resize-none rounded-xl border-white/50 bg-white/50 placeholder:text-[#3D2C5E]/40 focus-visible:ring-[#C9B8F0]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={createMessage.isPending}
                className="w-full rounded-xl bg-gradient-to-r from-[#C9B8F0] to-[#F7C5D5] py-6 text-lg font-bold text-[#3D2C5E] hover:shadow-lg transition-all hover:scale-[1.02]"
              >
                {createMessage.isPending ? "Sending Magic..." : (
                  <>
                    <Send className="mr-2 h-5 w-5" /> Leave Message
                  </>
                )}
              </Button>
            </form>
          </Form>
        </motion.div>

        <div className="space-y-6">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Sparkles className="h-8 w-8 animate-spin text-[#C9B8F0]" />
            </div>
          ) : messages && messages.length > 0 ? (
            messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="glass-panel relative rounded-2xl p-6"
              >
                <div className="absolute -left-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm text-xl">
                  {msg.emoji || "✨"}
                </div>
                <div className="ml-4">
                  <h4 className="font-display font-bold text-[#3D2C5E]">{msg.name}</h4>
                  <p className="mt-2 text-[#3D2C5E]/80 whitespace-pre-wrap">{msg.message}</p>
                  <p className="mt-4 text-xs text-[#3D2C5E]/40">
                    {new Date(msg.createdAt).toLocaleDateString(undefined, { 
                      year: 'numeric', month: 'short', day: 'numeric' 
                    })}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-[#C9B8F0]/50 p-8 text-center text-[#3D2C5E]/50">
              <Heart className="mb-4 h-12 w-12 text-[#F7C5D5]" />
              <p>It's quiet here... be the first to leave a message!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
