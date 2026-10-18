import { Brand } from "@/components/brand";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthShell({ title, description, children, footer }: { title: string; description: string; children: React.ReactNode; footer: React.ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[var(--cream)] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center"><Brand /></div>
        <Card>
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription className="pt-1 leading-6">{description}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-2">{children}</CardContent>
        </Card>
        <p className="mt-5 text-center text-sm text-[var(--muted)]">{footer}</p>
      </div>
    </main>
  );
}
