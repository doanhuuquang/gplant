"use client";

import * as React from "react";
import { ArrowUpRight, Bot, Loader, LoaderCircle, Square } from "lucide-react";
import { AskChatBotRequest } from "@/types/chatbot";
import { AskChatBotRequestValidation } from "@/validations/chatbot";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { MessageRenderer } from "@/components/feature/chat/message-renderer";
import { useAskChatBot } from "@/lib/hooks/use-chatbot";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet,
  SheetCloseButton,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function ChatBot({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const { user } = useAuthStore();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const { ask, isStreaming, abort } = useAskChatBot();

  const form = useForm<AskChatBotRequest>({
    resolver: zodResolver(AskChatBotRequestValidation),
    defaultValues: { question: "" },
  });

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function onSubmit(values: AskChatBotRequest) {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: values.question,
      },
    ]);
    form.reset();

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: "assistant",
        content: "",
      },
    ]);

    await ask(
      values.question,
      (chunk) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, content: msg.content + chunk }
              : msg,
          ),
        );
      },
      () => {},
    );
  }

  return (
    <div className={className}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant={"outline"} className="aspect-square rounded-full">
            <Bot className="text-primary-foreground size-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          // side="bottom"
          className="z-101 h-full sm:max-w-xl bg-soft-peach flex flex-col gap-0"
        >
          <SheetDescription className="sr-only">
            Trò chuyện với trợ lý AI
          </SheetDescription>
          <SheetHeader className="gap-4 w-full max-w-xl mx-auto relative">
            <div className="w-full h-4 bg-linear-to-b from-soft-peach to-transparent absolute bottom-0 left-0 translate-y-full"></div>

            <div className="w-full grid grid-cols-4 items-center">
              <SheetCloseButton />
              <SheetTitle className="col-span-2 text-center">
                Xin chào, {user?.firstName} 👋
              </SheetTitle>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8 w-full max-w-xl mx-auto no-scrollbar">
            {messages.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center">
                <p>Hôm nay tôi có thể giúp gì cho bạn, {user?.firstName}?</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={cn(
                      "rounded-sm ",
                      message.role === "user"
                        ? "px-4 py-2 bg-primary text-primary-foreground"
                        : "",
                    )}
                  >
                    {message.role === "assistant" ? (
                      <>
                        {isStreaming &&
                          index === messages.length - 1 &&
                          message.content === "" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="24"
                              height="24"
                            >
                              <circle cx="4" cy="12" r="3" fill="currentColor">
                                <animate
                                  id="SVGKiXXedfO"
                                  attributeName="cy"
                                  begin="0;SVGgLulOGrw.end+0.25s"
                                  calcMode="spline"
                                  dur="0.6s"
                                  keySplines=".33,.66,.66,1;.33,0,.66,.33"
                                  values="12;6;12"
                                />
                              </circle>
                              <circle cx="12" cy="12" r="3" fill="currentColor">
                                <animate
                                  attributeName="cy"
                                  begin="SVGKiXXedfO.begin+0.1s"
                                  calcMode="spline"
                                  dur="0.6s"
                                  keySplines=".33,.66,.66,1;.33,0,.66,.33"
                                  values="12;6;12"
                                />
                              </circle>
                              <circle cx="20" cy="12" r="3" fill="currentColor">
                                <animate
                                  id="SVGgLulOGrw"
                                  attributeName="cy"
                                  begin="SVGKiXXedfO.begin+0.2s"
                                  calcMode="spline"
                                  dur="0.6s"
                                  keySplines=".33,.66,.66,1;.33,0,.66,.33"
                                  values="12;6;12"
                                />
                              </circle>
                            </svg>
                          )}
                        <MessageRenderer content={message.content} />
                      </>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <SheetFooter className="w-full max-w-xl mx-auto relative">
            <div className="w-full h-4 bg-linear-to-t from-soft-peach to-transparent absolute top-0 left-0 -translate-y-full"></div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <FormField
                  control={form.control}
                  name="question"
                  disabled={isStreaming}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputGroup>
                          <InputGroupTextarea
                            {...field}
                            placeholder="Hãy hỏi tôi bất kỳ điều gì..."
                            className="bg-background rounded-tl-sm rounded-tr-sm"
                          />
                          <InputGroupAddon
                            align={"block-end"}
                            className="flex justify-end bg-background rounded-bl-sm rounded-br-sm"
                          >
                            {isStreaming ? (
                              <Button
                                size={"icon"}
                                type="button"
                                variant="outline"
                                onClick={abort}
                              >
                                <Square className="size-4 text-destructive fill-destructive" />
                              </Button>
                            ) : (
                              <Button
                                size={"icon"}
                                type="submit"
                                disabled={!field.value.trim()}
                              >
                                <ArrowUpRight className="size-5" />
                              </Button>
                            )}
                          </InputGroupAddon>
                        </InputGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
