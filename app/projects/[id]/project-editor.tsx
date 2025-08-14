"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  FileText,
  Download,
  Save,
  Edit
} from "lucide-react";
import { useRouter } from "next/navigation";
import { 
  generateAIQuestions, 
  generateAIDocuments, 
  saveProject 
} from "@/lib/actions/project-actions";

const steps = [
  { id: 1, title: "描述项目", description: "详细描述您的项目需求" },
  { id: 2, title: "深入需求", description: "回答AI生成的具体问题" },
  { id: 3, title: "创建文档", description: "生成并下载开发文档" },
];

interface ProjectEditorProps {
  project: any;
}

export default function ProjectEditor({ project }: ProjectEditorProps) {
  const [currentStep, setCurrentStep] = useState(project.documents ? 3 : 1);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [projectData, setProjectData] = useState({
    title: project.title || "",
    description: project.description || "",
    step1Data: project.step1Data || "",
    step2Data: project.step2Data || "",
    aiQuestions: [] as string[],
    documents: project.documents || null,
    projectId: project.id,
  });
  const router = useRouter();

  const handleStep1Next = async () => {
    if (projectData.step1Data.length < 20) {
      alert("请至少输入20个字的项目描述");
      return;
    }

    setLoading(true);
    try {
      const result = await generateAIQuestions(projectData.step1Data);
      if (result.success) {
        setProjectData(prev => ({ ...prev, aiQuestions: result.questions }));
        setCurrentStep(2);
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("生成问题失败:", error);
      alert("生成问题失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Next = () => {
    if (projectData.step2Data.length < 10) {
      alert("请回答AI生成的问题");
      return;
    }
    setCurrentStep(3);
  };

  const regenerateDocuments = async () => {
    setLoading(true);
    try {
      // 先检查用户点数
      const { checkUserCredits } = await import('@/lib/actions/project-actions');
      const creditsResult = await checkUserCredits();
      if (!creditsResult.success) {
        if (creditsResult.needsRecharge) {
          if (confirm("您的点数不足，无法重新生成文档。\n\n是否前往充值？")) {
            router.push('/pricing');
          }
        } else {
          alert(creditsResult.error);
        }
        setLoading(false);
        return;
      }

      // 点数足够，开始重新生成文档
      const result = await generateAIDocuments(
        projectData.step1Data,
        projectData.step2Data
      );
      
      if (result.success) {
        setProjectData(prev => ({ ...prev, documents: result.documents }));
      } else {
        if (result.needsOpenRouterRecharge) {
          if (confirm(result.error + "\n\n是否前往OpenRouter充值页面？")) {
            window.open('https://openrouter.ai/settings/credits', '_blank');
          }
        } else {
          // 如果是点数不足错误，提示充值应用内点数
          if (result.error.includes('点数不足')) {
            if (confirm("您的点数不足，无法重新生成文档。\n\n是否前往充值？")) {
              router.push('/pricing');
            }
          } else {
            alert(result.error);
          }
        }
      }
    } catch (error) {
      console.error("重新生成文档失败:", error);
      alert("重新生成文档失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProject = async () => {
    setLoading(true);
    try {
      const result = await saveProject({
        title: projectData.title,
        description: projectData.description,
        step1Data: projectData.step1Data,
        step2Data: projectData.step2Data,
        documents: projectData.documents,
        projectId: project.id,
      });

      if (result.success) {
        alert("项目保存成功！");
        setEditing(false);
        router.refresh();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("保存项目失败:", error);
      alert("保存项目失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  // 下载所有文档为ZIP
  const downloadAllDocuments = async () => {
    if (!projectData.documents) return;
    
    try {
      // 动态导入JSZip
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      const documentTypes = [
        { key: 'userJourney', label: '用户旅程地图' },
        { key: 'prd', label: '产品需求PRD' },
        { key: 'frontend', label: '前端设计文档' },
        { key: 'backend', label: '后端设计文档' },
        { key: 'database', label: '数据库设计' },
      ];

      // 添加文档到ZIP
      documentTypes.forEach((type) => {
        if (projectData.documents[type.key]) {
          zip.file(`${type.label}.md`, projectData.documents[type.key]);
        }
      });

      // 生成并下载ZIP文件
      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `${projectData.title || '项目文档'}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('下载ZIP失败:', error);
      alert('下载失败，请重试');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{project.title || "未命名项目"}</h1>
          <p className="text-muted-foreground mt-2">
            项目详情和文档管理
          </p>
          <Badge 
            variant={project.status === 'completed' ? 'default' : 'secondary'}
            className="mt-2"
          >
            {project.status === 'completed' ? '已完成' : '草稿'}
          </Badge>
        </div>
        <Button 
          onClick={() => setEditing(!editing)}
          variant="outline"
        >
          <Edit className="h-4 w-4 mr-2" />
          {editing ? '取消编辑' : '编辑项目'}
        </Button>
      </div>

      {/* Steps Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep > step.id ? 'bg-primary text-primary-foreground border-primary' :
                  currentStep === step.id ? 'border-primary text-primary' :
                  'border-muted-foreground text-muted-foreground'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="ml-3">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {step.description}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        {currentStep === 1 && (
          <div>
            <CardHeader>
              <CardTitle>项目描述</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">项目标题</Label>
                <Input
                  id="title"
                  placeholder="为您的项目起个名字"
                  value={projectData.title}
                  onChange={(e) => setProjectData(prev => ({ ...prev, title: e.target.value }))}
                  disabled={!editing}
                />
              </div>
              <div>
                <Label htmlFor="description">项目描述</Label>
                <Textarea
                  id="description"
                  placeholder="请详细描述您的项目需求"
                  className="min-h-[200px]"
                  value={projectData.step1Data}
                  onChange={(e) => setProjectData(prev => ({ ...prev, step1Data: e.target.value }))}
                  disabled={!editing}
                />
                {editing && (
                  <div className="text-sm text-muted-foreground mt-2">
                    已输入 {projectData.step1Data.length} 字，最少需要 20 字
                  </div>
                )}
              </div>
              {editing && (
                <div className="flex justify-end">
                  <Button 
                    onClick={handleStep1Next}
                    disabled={loading || projectData.step1Data.length < 20}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        生成问题中...
                      </>
                    ) : (
                      <>
                        下一步 <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <CardHeader>
              <CardTitle>深入需求分析</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">AI生成的问题：</h4>
                <div className="space-y-2">
                  {projectData.aiQuestions.map((question, index) => (
                    <div key={index} className="text-sm">
                      <Badge variant="outline" className="mr-2">{index + 1}</Badge>
                      {question}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="answers">回答内容</Label>
                <Textarea
                  id="answers"
                  placeholder="请详细回答AI生成的问题"
                  className="min-h-[200px]"
                  value={projectData.step2Data}
                  onChange={(e) => setProjectData(prev => ({ ...prev, step2Data: e.target.value }))}
                  disabled={!editing}
                />
              </div>
              
              {editing && (
                <div className="flex justify-between">
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    上一步
                  </Button>
                  <Button 
                    onClick={handleStep2Next}
                    disabled={projectData.step2Data.length < 10}
                  >
                    下一步 <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <CardHeader>
              <CardTitle>项目文档</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {projectData.documents ? (
                <div>
                  <DocumentViewer documents={projectData.documents} onDownloadAll={downloadAllDocuments} />
                  <div className="flex justify-between mt-6">
                    {editing && (
                      <>
                        <Button 
                          variant="outline"
                          onClick={() => setCurrentStep(2)}
                        >
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          上一步
                        </Button>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline"
                            onClick={regenerateDocuments}
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                重新生成中...
                              </>
                            ) : (
                              '重新生成文档'
                            )}
                          </Button>
                          <Button onClick={handleSaveProject} disabled={loading}>
                            {loading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                保存中...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                保存项目
                              </>
                            )}
                          </Button>
                        </div>
                      </>
                    )}
                    {!editing && (
                      <div className="flex gap-2 ml-auto">
                        <Button variant="outline" onClick={downloadAllDocuments}>
                          <Download className="h-4 w-4 mr-2" />
                          下载ZIP
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">暂无文档</h3>
                  <p className="text-muted-foreground mb-6">
                    请先完成项目描述和需求分析，然后生成文档
                  </p>
                </div>
              )}
            </CardContent>
          </div>
        )}
      </Card>
    </div>
  );
}

// 文档查看器组件（复用之前的代码）
function DocumentViewer({ documents, onDownloadAll }: { documents: any, onDownloadAll?: () => void }) {
  const [viewMode, setViewMode] = useState<'markdown' | 'preview'>('markdown');
  
  const documentTypes = [
    { key: 'userJourney', label: '用户旅程地图' },
    { key: 'prd', label: '产品需求PRD' },
    { key: 'frontend', label: '前端设计文档' },
    { key: 'backend', label: '后端设计文档' },
    { key: 'database', label: '数据库设计' },
  ];

  // 下载单个文档
  const downloadDocument = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">项目文档</h3>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'markdown' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('markdown')}
          >
            Markdown
          </Button>
          <Button
            variant={viewMode === 'preview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('preview')}
          >
            预览
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue={documentTypes[0].key} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {documentTypes.map((type) => (
            <TabsTrigger key={type.key} value={type.key} className="text-xs">
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {documentTypes.map((type) => (
          <TabsContent key={type.key} value={type.key}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">{type.label}</CardTitle>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => downloadDocument(documents[type.key] || '', type.label)}
                >
                  <Download className="h-3 w-3 mr-1" />
                  下载
                </Button>
              </CardHeader>
              <CardContent>
                {viewMode === 'markdown' ? (
                  <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
                    {documents[type.key] || '暂无内容'}
                  </pre>
                ) : (
                  <div 
                    className="prose prose-sm max-w-none max-h-96 overflow-y-auto"
                    dangerouslySetInnerHTML={{ 
                      __html: markdownToHtml(documents[type.key] || '暂无内容') 
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// Markdown转HTML函数（简单实现）
function markdownToHtml(markdown: string): string {
  return markdown
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}