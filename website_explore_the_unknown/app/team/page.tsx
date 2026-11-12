import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BackgroundPaths from "@/components/kokonutui/background-paths";
import Image from "next/image";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const teamMembers = [
  {
    name: "Vladimir Baulin",
    role: "Technical project lead",
    image: "/active_inference.png",
    bio: "Researcher in computational soft matter physics and biophysics.",
    social: {
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Austin Cook",
    role: "AI Developer",
    image: "/active_inference.png",
    bio: "alignmentlab.ai",
    social: {
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Andrea Farias",
    role: "User Experience & Interface",
    image: "/active_inference.png",
    bio: "Passionate about Active Inference and research",
    social: {
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Daniel Friedman",
    role: "Executive Director",
    image: "/active_inference.png",
    bio: "Officer at Active Inference Institute",
    social: {
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Janna Lumiruusu",
    role: "User Experience & Interface",
    image: "/jana_avatar.png",
    bio: "Passionate about active inference and UI/UX",
    social: {
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Andrew Pashea",
    role: "Active Inference programmer",
    image: "/active_inference.png",
    bio: "Scientific Advisory Board at Active Inference Institute",
    social: {
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Shagor Rahman",
    role: "Project Manager",
    image: "/active_inference.png",
    bio: "10 + Years of PM Experience in Data Driven/AI/Analytical Software",
    social: {
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Benedikt Waldeck",
    role: "Active Inference programmer",
    image: "/ben_avatar.png",
    bio: "Passionate about developing transparent AI",
    social: {
      linkedin: "#",
      github: "#",
    },
  },
];

export default function TeamPage() {
  return (
    <>
      <BackgroundPaths title="Our Team" />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {teamMembers.map((member) => (
            <Card key={member.name} className="overflow-hidden">
              <div className="aspect-square relative">
                <div className="w-[75%] h-[75%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Image
                    src={member.image || "/active_inference.png"}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <CardHeader className="p-3">
                <CardTitle className="text-sm">{member.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </CardHeader>
              <CardContent className="p-3">
                <p className="text-xs text-muted-foreground mb-2">
                  {member.bio}
                </p>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <FaTwitter className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <FaGithub className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
