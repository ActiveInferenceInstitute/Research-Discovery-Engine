"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight,
  FaPaperPlane,
  FaFolder,
  FaMicrophone,
  FaPaperclip,
} from "react-icons/fa";
import { DefaultChatTransport, isTextUIPart } from "ai";
import { useChat } from "@ai-sdk/react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  Tooltip,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarRadiusAxis,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectOverviewModal } from "@/components/project-overview-modal";

const chatTransport = new DefaultChatTransport({ api: "/api_ts/chat" });

// Define a Project interface with all the properties used in the Collaboration section
interface Project {
  id: number;
  title: string;
  description: string;
  collaborators: number;
  status: string;
  tags: string[];
  match: number;
  matchColor: string;
}

function MainComponent() {
  const [isFirstMessage, setIsFirstMessage] = useState<boolean>(true);
  const [isChatVisible, setIsChatVisible] = useState<boolean>(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Add interface for Goal type
  interface Goal {
    id: string;
    name: string;
    progress: number;
    subgoals?: Goal[];
  }
  const [input, setInput] = useState("");
  const {
    messages: aiMessages,
    sendMessage,
    status,
  } = useChat({
    transport: chatTransport,
    onError: (error) => {
      console.error("Chat error:", error);
    },
  });
  const isLoading = status === "submitted" || status === "streaming";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    await sendMessage({ text });
  };

  const handleFirstMessageSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!input.trim()) return;
    await handleSubmit(e);
    setTimeout(() => {
      setIsFirstMessage(false);
    }, 300);
  };

  const researchTopicsData = [
    {
      id: 1,
      topic: "Advanced Materials",
      relevance: 85,
      publications: [
        { month: "Jan", count: 10 },
        { month: "Feb", count: 15 },
        { month: "Mar", count: 12 },
        { month: "Apr", count: 18 },
      ],
      description: "Study of novel materials with enhanced properties",
    },
    {
      id: 2,
      topic: "Quantum Computing",
      relevance: 75,
      publications: [
        { month: "Jan", count: 8 },
        { month: "Feb", count: 12 },
        { month: "Mar", count: 16 },
        { month: "Apr", count: 14 },
      ],
      description: "Exploration of quantum systems for computation",
    },
    {
      id: 3,
      topic: "Sustainable Energy",
      relevance: 90,
      publications: [
        { month: "Jan", count: 15 },
        { month: "Feb", count: 18 },
        { month: "Mar", count: 20 },
        { month: "Apr", count: 25 },
      ],
      description: "Research on renewable energy solutions",
    },
  ];

  const goalsData = [
    {
      id: "goal1",
      name: "Master Advanced Materials",
      progress: 65,
      subgoals: [
        {
          id: "goal1-1",
          name: "Understand Nanomaterials",
          progress: 80,
          subgoals: [
            { id: "goal1-1-1", name: "Study Carbon Nanotubes", progress: 90 },
            { id: "goal1-1-2", name: "Research Quantum Dots", progress: 70 },
          ],
        },
        {
          id: "goal1-2",
          name: "Smart Materials",
          progress: 50,
          subgoals: [
            { id: "goal1-2-1", name: "Shape Memory Alloys", progress: 60 },
            { id: "goal1-2-2", name: "Piezoelectric Materials", progress: 40 },
          ],
        },
      ],
    },
    {
      id: "goal2",
      name: "Quantum Computing Fundamentals",
      progress: 45,
      subgoals: [
        {
          id: "goal2-1",
          name: "Quantum Gates",
          progress: 55,
          subgoals: [
            { id: "goal2-1-1", name: "Single Qubit Gates", progress: 75 },
            { id: "goal2-1-2", name: "Multi-Qubit Operations", progress: 35 },
          ],
        },
      ],
    },
  ];

  const skillsData = [
    { subject: "Materials Science", A: 85, fullMark: 100 },
    { subject: "Quantum Physics", A: 65, fullMark: 100 },
    { subject: "Data Analysis", A: 90, fullMark: 100 },
    { subject: "Lab Techniques", A: 75, fullMark: 100 },
    { subject: "Programming", A: 80, fullMark: 100 },
    { subject: "Research Methods", A: 95, fullMark: 100 },
  ];

  const renderGoalTree = (goals: Goal[], depth = 0) => {
    return goals.map((goal) => (
      <motion.div
        key={goal.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className={`ml-${depth * 4} mb-3`}
      >
        <motion.div
          className={`p-4 rounded-lg cursor-pointer ${
            expandedGoal === goal.id
              ? "bg-[#2d2d2d] border-[#4f46e5] border"
              : "bg-[#1a1a1a] border border-[#2d2d2d] hover:bg-[#2d2d2d]"
          }`}
          onClick={() =>
            setExpandedGoal(expandedGoal === goal.id ? null : goal.id)
          }
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#4f46e5] flex items-center justify-center text-white">
                  {depth + 1}
                </div>
                <span className="font-roboto text-gray-300">{goal.name}</span>
              </div>
              <div className="mt-2">
                <div className="relative w-full h-2 bg-[#3d3d3d] rounded-full overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-[#4f46e5]"
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <span className="text-sm text-gray-400 mt-1">
                  {goal.progress}% Complete
                </span>
              </div>
            </div>
            {goal.subgoals && (
              <Badge variant="secondary" className="ml-2 bg-[#3d3d3d]">
                {goal.subgoals.length} Subgoals
              </Badge>
            )}
          </div>
        </motion.div>
        {expandedGoal === goal.id && goal.subgoals && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2"
            >
              {renderGoalTree(goal.subgoals, depth + 1)}
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    ));
  };

  if (isFirstMessage) {
    return (
      <div className="h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#121212] to-[#1a1a1a]">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2 font-roboto">
            Welcome to your Discovery Mentor
          </h1>
          <p className="text-gray-300 font-roboto">
            Your personal assistant for learning, research and collaboration
          </p>
        </div>
        <form
          onSubmit={handleFirstMessageSubmit}
          className="w-[600px] max-w-[90%]"
        >
          <div className="relative flex items-center">
            <FaMicrophone className="absolute left-2 text-gray-400" />
            <Input
              value={input}
              onChange={handleInputChange}
              className="w-full p-6 text-lg bg-[#2d2d2d] text-white border-[#3d3d3d] rounded-lg pl-10"
              placeholder="Describe your field of interest..."
            />
            <FaPaperclip className="absolute right-28 text-gray-400 cursor-pointer hover:text-gray-300" />
            <Button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-200 rounded-full"
            >
              <span>Start</span>
              <FaArrowRight className="ml-2" />
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] w-full relative bg-[#121212] overflow-hidden">
      {/* Avatar Symbol */}
      <div className="absolute top-4 right-4 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage
                src="/avatar.png"
                alt="@max"
                className="filter invert"
              />
              <AvatarFallback>Mad Max</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => console.log("Profile clicked")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Settings clicked")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Logout clicked")}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Panel view */}
      <ResizablePanelGroup orientation="horizontal" className="h-full">
        {/* Left/chat Panel */}
        <ResizablePanel
          defaultSize="50%"
          minSize="0%"
          maxSize="50%"
          style={{ display: isChatVisible ? "block" : "none" }}
        >
          <div className="h-full bg-[#1e1e1e] flex flex-col overflow-hidden relative">
            <div className="p-4 border-b border-[#2d2d2d] bg-[#1a1a1a] text-white">
              <h2 className="text-xl font-roboto font-bold">Chat History</h2>
            </div>
            <Button
              onClick={() => setIsChatVisible(!isChatVisible)}
              className="absolute right-0 top-1/2 -translate-y-1/2 rounded-l-full w-6 h-12 bg-[#2d2d2d] hover:bg-[#3d3d3d] z-50"
              size="icon"
            >
              <FaChevronLeft className="text-white" />
            </Button>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {aiMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <Alert
                    variant={message.role === "user" ? "default" : "default"}
                    className={`bg-[#2b2b2b] text-white ${
                      message.role === "user" ? "ml-8" : "mr-8"
                    }`}
                  >
                    <AlertDescription>
                      {message.parts
                        .filter(isTextUIPart)
                        .map((part) => part.text)
                        .join("")}
                    </AlertDescription>
                  </Alert>
                </div>
              ))}
              {isLoading && <div className="text-gray-400">Loading...</div>}
            </div>
            <div className="p-4 border-t border-[#2d2d2d] bg-[#1a1a1a]">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="relative flex items-center w-full">
                  <FaMicrophone className="absolute left-2 text-gray-400" />
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Write a message..."
                    className="bg-[#3b3b3b] text-white border-[#4b4b4b] rounded-lg pl-10 flex-grow"
                  />
                  <FaPaperclip className="absolute right-28 text-gray-400 cursor-pointer hover:text-gray-300" />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-white hover:bg-gray-200 ml-2"
                  >
                    <span>Send</span>
                    <FaPaperPlane className="ml-2" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </ResizablePanel>

        {/* Middle line */}
        <ResizableHandle
          withHandle
          className="bg-[#2d2d2d] hover:bg-[#3d3d3d] transition-colors"
        />

        {/* Right Panel */}
        <ResizablePanel defaultSize={isChatVisible ? "50%" : "100%"}>
          <div className="h-full bg-[#1e1e1e] flex flex-col">
            {!isChatVisible && (
              <Button
                onClick={() => setIsChatVisible(!isChatVisible)}
                className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full w-6 h-12 bg-[#2d2d2d] hover:bg-[#3d3d3d] z-50"
                size="icon"
              >
                <FaChevronRight className="text-white" />
              </Button>
            )}

            {/* Browser-style tabs navigation */}
            <div className="flex flex-col h-full">
              <Tabs
                defaultValue="profile"
                className="w-full h-full"
                value={isProjectModalOpen ? "project" : undefined}
                onValueChange={(value) => {
                  if (value !== "project") {
                    setIsProjectModalOpen(false);
                    setSelectedProject(null);
                  }
                }}
              >
                <div className="border-b border-[#2d2d2d] bg-[#1a1a1a] px-4 py-2">
                  <TabsList className="bg-[#2d2d2d]">
                    <TabsTrigger
                      value="profile"
                      className="data-[state=active]:bg-[#3d3d3d]"
                    >
                      Profile Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="discover"
                      className="data-[state=active]:bg-[#3d3d3d]"
                    >
                      Discover
                    </TabsTrigger>
                    {isProjectModalOpen && selectedProject && (
                      <TabsTrigger
                        value="project"
                        className="data-[state=active]:bg-[#3d3d3d] group relative max-w-[200px]"
                      >
                        <span className="truncate">
                          {selectedProject.title}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity absolute right-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsProjectModalOpen(false);
                            setSelectedProject(null);
                          }}
                        >
                          ×
                        </Button>
                      </TabsTrigger>
                    )}
                  </TabsList>
                </div>

                {/* Main content area with improved scrolling */}
                <div className="flex-1 overflow-hidden">
                  <TabsContent
                    value="profile"
                    className="h-full overflow-hidden flex flex-col"
                  >
                    {/* Sub-tabs with improved styling */}
                    <div className="border-b border-[#2d2d2d] bg-[#1a1a1a] px-4">
                      <Tabs defaultValue="goals" className="w-full h-full">
                        <TabsList className="bg-transparent h-12">
                          <TabsTrigger
                            value="goals"
                            className="data-[state=active]:bg-[#2d2d2d]"
                          >
                            Goals
                          </TabsTrigger>
                          <TabsTrigger
                            value="knowledge"
                            className="data-[state=active]:bg-[#2d2d2d]"
                          >
                            Skills
                          </TabsTrigger>
                        </TabsList>
                        <div className="flex-1 overflow-hidden">
                          <div className="h-[calc(100vh-12rem)] overflow-y-auto">
                            <TabsContent value="goals" className="mt-0 p-6">
                              <div className="space-y-4">
                                <div className="border border-[#2d2d2d] rounded-lg p-4">
                                  <h3 className="font-roboto font-semibold text-gray-300 mb-4 sticky top-0 bg-[#1a1a1a] py-2 z-10">
                                    Learning Goals
                                  </h3>
                                  <div className="space-y-2">
                                    {renderGoalTree(goalsData)}
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                            <TabsContent value="knowledge" className="mt-0 p-6">
                              <div className="space-y-4">
                                <div className="border border-[#2d2d2d] rounded-lg p-4">
                                  <h3 className="font-roboto font-semibold text-gray-300 mb-4 sticky top-0 bg-[#1a1a1a] py-2 z-10">
                                    Skills Overview
                                  </h3>
                                  <div className="h-[300px]">
                                    <ResponsiveContainer
                                      width="100%"
                                      height="100%"
                                    >
                                      <RadarChart data={skillsData}>
                                        <PolarGrid stroke="#3d3d3d" />
                                        <PolarAngleAxis
                                          dataKey="subject"
                                          tick={{ fill: "#9ca3af" }}
                                        />
                                        <PolarRadiusAxis stroke="#6b7280" />
                                        <Radar
                                          name="Skills"
                                          dataKey="A"
                                          stroke="#4f46e5"
                                          fill="#4f46e5"
                                          fillOpacity={0.3}
                                        />
                                        <Tooltip
                                          contentStyle={{
                                            backgroundColor: "#2d2d2d",
                                            border: "none",
                                            borderRadius: "8px",
                                            color: "#fff",
                                          }}
                                        />
                                      </RadarChart>
                                    </ResponsiveContainer>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pb-4">
                                  {skillsData.map((skill) => (
                                    <motion.div
                                      key={skill.subject}
                                      className="p-3 bg-[#1a1a1a] rounded-lg border border-[#2d2d2d]"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="font-roboto text-gray-300">
                                          {skill.subject}
                                        </span>
                                        <Badge
                                          variant="secondary"
                                          className="bg-[#4f46e5]"
                                        >
                                          {skill.A}%
                                        </Badge>
                                      </div>
                                      <div className="relative w-full h-2 bg-[#3d3d3d] rounded-full overflow-hidden">
                                        <motion.div
                                          className="absolute top-0 left-0 h-full bg-[#4f46e5]"
                                          initial={{ width: 0 }}
                                          animate={{ width: `${skill.A}%` }}
                                          transition={{
                                            duration: 1,
                                            ease: "easeOut",
                                          }}
                                        />
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            </TabsContent>
                          </div>
                        </div>
                      </Tabs>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="discover"
                    className="h-full overflow-hidden flex flex-col"
                  >
                    <div className="border-b border-[#2d2d2d] bg-[#1a1a1a] px-4">
                      <Tabs defaultValue="learning" className="w-full h-full">
                        <TabsList className="bg-transparent h-12">
                          <TabsTrigger
                            value="learning"
                            className="data-[state=active]:bg-[#2d2d2d]"
                          >
                            Learning Path
                          </TabsTrigger>
                          <TabsTrigger
                            value="research"
                            className="data-[state=active]:bg-[#2d2d2d]"
                          >
                            Research Topics
                          </TabsTrigger>
                          <TabsTrigger
                            value="collaboration"
                            className="data-[state=active]:bg-[#2d2d2d]"
                          >
                            Collaboration
                          </TabsTrigger>
                        </TabsList>
                        <div className="flex-1 overflow-hidden">
                          <div className="h-[calc(100vh-12rem)] overflow-y-auto">
                            <TabsContent value="learning" className="mt-0 p-6">
                              <div className="p-4 space-y-6">
                                <div className="border border-[#2d2d2d] rounded-lg p-4">
                                  <h3 className="font-roboto font-semibold mb-4 text-gray-300">
                                    Learning Path Steps
                                  </h3>
                                  <div className="space-y-4">
                                    {[
                                      "Fundamentals",
                                      "Advanced Concepts",
                                      "Practical Applications",
                                      "Expert Level",
                                    ].map((step, index) => (
                                      <motion.div
                                        key={step}
                                        className={`p-4 rounded-lg cursor-pointer transition-colors ${
                                          selectedStep === index
                                            ? "bg-[#3d3d3d] border-[#4f46e5] border"
                                            : "bg-[#2d2d2d] hover:bg-[#3d3d3d]"
                                        }`}
                                        onClick={() => setSelectedStep(index)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center space-x-3">
                                            <div
                                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                selectedStep === index
                                                  ? "bg-[#4f46e5]"
                                                  : "bg-[#3d3d3d]"
                                              }`}
                                            >
                                              {index + 1}
                                            </div>
                                            <span className="font-roboto text-gray-300">
                                              {step}
                                            </span>
                                          </div>
                                          <Badge
                                            variant="secondary"
                                            className={
                                              selectedStep === index
                                                ? "bg-[#4f46e5] text-white"
                                                : "bg-[#3d3d3d]"
                                            }
                                          >
                                            {index === 3
                                              ? "Final"
                                              : "In Progress"}
                                          </Badge>
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                className="ml-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border-red-500/20"
                                              >
                                                Get Help
                                              </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="bg-[#2d2d2d] border-[#3d3d3d]">
                                              <DropdownMenuItem className="text-gray-300 hover:bg-[#3d3d3d] cursor-pointer">
                                                Help me motivate
                                              </DropdownMenuItem>
                                              <DropdownMenuItem className="text-gray-300 hover:bg-[#3d3d3d] cursor-pointer">
                                                Change step
                                              </DropdownMenuItem>
                                              <DropdownMenuItem className="text-gray-300 hover:bg-[#3d3d3d] cursor-pointer">
                                                Find relatable people
                                              </DropdownMenuItem>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent value="research" className="mt-0 p-6">
                              <div className="p-4 space-y-6">
                                {researchTopicsData.map((topic, index) => (
                                  <motion.div
                                    key={topic.id}
                                    className={`border border-[#2d2d2d] rounded-lg p-4 ${
                                      selectedTopic === index
                                        ? "bg-[#2d2d2d]"
                                        : "bg-[#1a1a1a]"
                                    }`}
                                    onClick={() =>
                                      setSelectedTopic(
                                        selectedTopic === index ? null : index
                                      )
                                    }
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                  >
                                    <div className="flex justify-between items-start mb-4">
                                      <div>
                                        <h3 className="font-roboto font-semibold text-gray-300 mb-2">
                                          {topic.topic}
                                        </h3>
                                        <p className="text-gray-400 text-sm">
                                          {topic.description}
                                        </p>
                                      </div>
                                      <div className="flex items-center">
                                        <div className="w-16 h-16">
                                          <RadialBarChart
                                            width={64}
                                            height={64}
                                            cx={32}
                                            cy={32}
                                            innerRadius="65%"
                                            outerRadius="100%"
                                            data={[
                                              {
                                                value: topic.relevance,
                                                fill: "#4f46e5",
                                              },
                                            ]}
                                            startAngle={90}
                                            endAngle={-270}
                                          >
                                            <PolarAngleAxis
                                              type="number"
                                              domain={[0, 100]}
                                              angleAxisId={0}
                                              tick={false}
                                            />
                                            <RadialBar
                                              background
                                              dataKey="value"
                                              cornerRadius={30}
                                            />
                                          </RadialBarChart>
                                          <div className="text-center mt-1">
                                            <span className="text-sm text-gray-300">
                                              {topic.relevance}%
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {selectedTopic === index && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="mt-4"
                                      >
                                        <h4 className="font-roboto text-sm text-gray-400 mb-2">
                                          Concept Relationships & Exploration
                                          Path
                                        </h4>
                                        <div className="relative h-[300px] bg-[#1a1a1a] rounded-lg p-4">
                                          <svg
                                            width="100%"
                                            height="100%"
                                            viewBox="0 0 800 300"
                                          >
                                            {/* Define gradients */}
                                            <defs>
                                              <linearGradient
                                                id="pathGradient"
                                                x1="0%"
                                                y1="0%"
                                                x2="100%"
                                                y2="0%"
                                              >
                                                <stop
                                                  offset="0%"
                                                  stopColor="#4f46e5"
                                                  stopOpacity="0.8"
                                                />
                                                <stop
                                                  offset="100%"
                                                  stopColor="#22c55e"
                                                  stopOpacity="0.8"
                                                />
                                              </linearGradient>
                                            </defs>

                                            {/* Connection paths */}
                                            <path
                                              d="M 200,150 C 300,150 350,100 450,100"
                                              stroke="#3d3d3d"
                                              strokeWidth="2"
                                              fill="none"
                                            />
                                            <path
                                              d="M 200,150 C 300,150 350,200 450,200"
                                              stroke="#3d3d3d"
                                              strokeWidth="2"
                                              fill="none"
                                            />

                                            {/* Exploration path */}
                                            <path
                                              d="M 200,150 C 300,150 350,150 450,150 C 550,150 600,100 650,100"
                                              stroke="url(#pathGradient)"
                                              strokeWidth="3"
                                              fill="none"
                                              strokeDasharray="5,5"
                                            />

                                            {/* Current concept */}
                                            <circle
                                              cx="200"
                                              cy="150"
                                              r="40"
                                              fill="#4f46e5"
                                              opacity="0.8"
                                            />
                                            <text
                                              x="200"
                                              y="150"
                                              textAnchor="middle"
                                              fill="white"
                                              fontSize="12"
                                            >
                                              Current Topic
                                            </text>

                                            {/* Related concepts */}
                                            <circle
                                              cx="450"
                                              cy="100"
                                              r="30"
                                              fill="#6366f1"
                                              opacity="0.6"
                                            />
                                            <text
                                              x="450"
                                              y="100"
                                              textAnchor="middle"
                                              fill="white"
                                              fontSize="12"
                                            >
                                              Related 1
                                            </text>

                                            <circle
                                              cx="450"
                                              cy="200"
                                              r="30"
                                              fill="#6366f1"
                                              opacity="0.6"
                                            />
                                            <text
                                              x="450"
                                              y="200"
                                              textAnchor="middle"
                                              fill="white"
                                              fontSize="12"
                                            >
                                              Related 2
                                            </text>

                                            {/* Unexplored area */}
                                            <circle
                                              cx="650"
                                              cy="100"
                                              r="35"
                                              fill="#22c55e"
                                              opacity="0.8"
                                            />
                                            <text
                                              x="650"
                                              y="95"
                                              textAnchor="middle"
                                              fill="white"
                                              fontSize="12"
                                            >
                                              Unexplored
                                            </text>
                                            <text
                                              x="650"
                                              y="110"
                                              textAnchor="middle"
                                              fill="white"
                                              fontSize="10"
                                            >
                                              Area
                                            </text>
                                          </svg>

                                          {/* Steps legend */}
                                          <div className="absolute bottom-4 left-4 bg-[#2d2d2d] p-3 rounded-lg">
                                            <h5 className="text-sm font-semibold text-gray-300 mb-2">
                                              Exploration Steps:
                                            </h5>
                                            <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
                                              <li>
                                                Review current knowledge base
                                              </li>
                                              <li>
                                                Connect with related concepts
                                              </li>
                                              <li>Identify knowledge gaps</li>
                                              <li>Plan research methodology</li>
                                            </ol>
                                          </div>
                                        </div>
                                      </motion.div>
                                    )}
                                  </motion.div>
                                ))}
                              </div>
                            </TabsContent>

                            <TabsContent
                              value="collaboration"
                              className="mt-0 p-6"
                            >
                              <div className="space-y-4">
                                {[
                                  {
                                    id: 1,
                                    title: "Material Intelligence",
                                    description:
                                      "Advancing materials science through AI and machine learning",
                                    collaborators: 8,
                                    status: "Active",
                                    tags: [
                                      "Materials Science",
                                      "AI",
                                      "Sustainability",
                                    ],
                                    match: 85,
                                    matchColor: "#22c55e",
                                  },
                                  {
                                    id: 2,
                                    title: "Quantum Computing Research",
                                    description:
                                      "Exploring quantum algorithms for material simulations",
                                    collaborators: 6,
                                    status: "Active",
                                    tags: [
                                      "Quantum Computing",
                                      "Algorithms",
                                      "Simulation",
                                    ],
                                    match: 92,
                                    matchColor: "#4f46e5",
                                  },
                                  {
                                    id: 3,
                                    title: "Green Energy Solutions",
                                    description:
                                      "Developing sustainable energy storage technologies",
                                    collaborators: 12,
                                    status: "Active",
                                    tags: [
                                      "Energy",
                                      "Sustainability",
                                      "Innovation",
                                    ],
                                    match: 78,
                                    matchColor: "#0891b2",
                                  },
                                ].map((project) => (
                                  <div
                                    key={project.id}
                                    className="bg-[#2d2d2d] rounded-lg shadow-sm p-4"
                                  >
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                      <div className="flex items-center space-x-4 min-w-0 flex-1">
                                        <FaFolder className="text-3xl text-gray-300 flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                          <h3 className="font-roboto font-semibold text-lg truncate text-white">
                                            {project.title}
                                          </h3>
                                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                                            <span>
                                              {project.collaborators}{" "}
                                              Collaborators
                                            </span>
                                            <span>•</span>
                                            <span>{project.status}</span>
                                          </div>
                                          <div className="mt-2 flex flex-wrap gap-2">
                                            {project.tags.map((tag) => (
                                              <Badge
                                                key={tag}
                                                variant="secondary"
                                                className="bg-[#3d3d3d] text-gray-300"
                                              >
                                                {tag}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Add collaborator avatars */}
                                      <div className="hidden lg:flex -space-x-3 items-center mx-4">
                                        {[1, 2, 3].map((avatar) => (
                                          <Avatar
                                            key={avatar}
                                            className="border-2 border-[#2d2d2d] w-8 h-8 transition-transform hover:translate-y-[-2px]"
                                          >
                                            <AvatarImage
                                              src={`/avatar${avatar}.png`}
                                              alt={`Team Member ${avatar}`}
                                            />
                                            <AvatarFallback
                                              className="text-xs text-white"
                                              style={{
                                                backgroundColor:
                                                  avatar === 1
                                                    ? project.matchColor
                                                    : avatar === 2
                                                    ? "#0891b2"
                                                    : "#7c3aed",
                                              }}
                                            >
                                              TM{avatar}
                                            </AvatarFallback>
                                          </Avatar>
                                        ))}
                                        {project.collaborators > 3 && (
                                          <div className="bg-gray-600 text-white text-xs rounded-full w-8 h-8 flex items-center justify-center border-2 border-[#2d2d2d] translate-x-1">
                                            +{project.collaborators - 3}
                                          </div>
                                        )}
                                      </div>

                                      <div className="flex items-center gap-4">
                                        <div className="text-center">
                                          <div className="relative w-16 h-16">
                                            <RadialBarChart
                                              width={64}
                                              height={64}
                                              cx={32}
                                              cy={32}
                                              innerRadius="65%"
                                              outerRadius="100%"
                                              data={[{ value: project.match }]}
                                              startAngle={90}
                                              endAngle={-270}
                                            >
                                              <PolarAngleAxis
                                                type="number"
                                                domain={[0, 100]}
                                                angleAxisId={0}
                                                tick={false}
                                              />
                                              <RadialBar
                                                background
                                                dataKey="value"
                                                cornerRadius={30}
                                                fill={project.matchColor}
                                              />
                                            </RadialBarChart>
                                          </div>
                                          <div className="mt-1 flex flex-col items-center">
                                            <span className="font-roboto font-bold text-gray-300 text-sm">
                                              {project.match}%
                                            </span>
                                            <span className="text-xs text-gray-400">
                                              Match
                                            </span>
                                          </div>
                                        </div>

                                        <Button
                                          variant="secondary"
                                          onClick={() => {
                                            setSelectedProject(project);
                                            setIsProjectModalOpen(true);
                                          }}
                                        >
                                          Open
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </TabsContent>
                          </div>
                        </div>
                      </Tabs>
                    </div>
                  </TabsContent>

                  {isProjectModalOpen && (
                    <TabsContent
                      value="project"
                      className="h-full overflow-hidden"
                    >
                      <div className="h-[calc(100vh-12rem)] overflow-y-auto p-6">
                        <ProjectOverviewModal
                          isOpen={true}
                          project={selectedProject ?? undefined}
                          onOpenChange={(open) => {
                            if (!open) {
                              setIsProjectModalOpen(false);
                              setSelectedProject(null);
                            }
                          }}
                        />
                      </div>
                    </TabsContent>
                  )}
                </div>
              </Tabs>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default MainComponent;
