import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { isTextUIPart, type UIMessage } from "ai";

interface ChatInterfaceProps {
  messages: UIMessage[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export default function ChatInterface({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: ChatInterfaceProps) {
  return (
    <Card className="w-full bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Chat with AI Tutor</CardTitle>
      </CardHeader>
      <CardContent className="h-[60vh] overflow-y-auto">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`mb-4 ${m.role === "user" ? "text-right" : "text-left"}`}
          >
            <span
              className={`inline-block p-2 rounded-lg ${
                m.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-200"
              }`}
            >
              {m.parts
                .filter(isTextUIPart)
                .map((part) => part.text)
                .join("")}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="text-left">
            <span className="inline-flex items-center gap-2 p-2 rounded-lg bg-gray-800 text-gray-200">
              <Loader2 className="w-4 h-4 animate-spin" />
              Thinking...
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about a topic you want to learn..."
            className="flex-grow bg-gray-800 text-white border-gray-700"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send"}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
