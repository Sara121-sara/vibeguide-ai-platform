import { notFound } from "next/navigation";
import { getProjectDetails } from "@/lib/actions/project-actions";
import ProjectEditor from "./project-editor";

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const result = await getProjectDetails(id);

  if (!result.success) {
    notFound();
  }

  return <ProjectEditor project={result.project} />;
}