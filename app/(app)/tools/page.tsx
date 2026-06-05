import { Card, CardContent } from "@/components/ui/card";
import { Wrench } from "lucide-react";

export default function ToolsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tools</h1>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
          <Wrench className="h-12 w-12 text-muted-foreground/50" />
          <p className="font-medium">Coming Soon</p>
          <p className="text-sm text-muted-foreground text-center">
            Tools tambahan seperti parafrase, cek grammar, dan konversi format akan segera hadir.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
