import { NextResponse } from "next/server";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { generateTaskStream, type TaskInput, type TaskType, type WordCountOption } from "@/lib/ai/gemini";
import { z } from "zod";

const generateSchema = z.object({
  taskType: z.enum([
    "makalah",
    "essay",
    "laporan",
    "matematika",
    "presentasi",
    "book-report",
    "soal-jawaban",
    "rangkuman",
    "proposal",
    "karya-ilmiah",
  ]),
  title: z.string().min(1, "Judul harus diisi"),
  educationLevel: z.enum(["sma", "kuliah"]),
  subject: z.string().optional(),
  major: z.string().optional(),
  wordCount: z.enum(["singkat", "standar", "panjang"]).default("standar"),
  instructions: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    // 1. Validate session
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Validate input
    const body = await request.json();
    const parsed = generateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Input tidak valid", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const input = parsed.data;
    const serviceClient = createServiceRoleClient();

    // 3. Create task record
    const { data: task, error: taskError } = await serviceClient
      .from("tasks")
      .insert({
        user_id: user.id,
        title: input.title,
        task_type: input.taskType,
        subject: input.subject || null,
        education_level: input.educationLevel,
        major: input.major || null,
        instructions: input.instructions || null,
        status: "generating",
        credits_used: 1,
      })
      .select("id")
      .single();

    if (taskError || !task) {
      return NextResponse.json(
        { error: "Gagal membuat task" },
        { status: 500 }
      );
    }

    // 4. Deduct credit atomically
    const { error: creditError } = await serviceClient.rpc(
      "deduct_credit_atomic",
      {
        p_user_id: user.id,
        p_task_id: task.id,
        p_amount: 1,
        p_description: `Generate ${input.taskType}: ${input.title}`,
      }
    );

    if (creditError) {
      // Clean up the task
      await serviceClient.from("tasks").delete().eq("id", task.id);

      if (creditError.message.includes("INSUFFICIENT_CREDITS")) {
        return NextResponse.json(
          { error: "Kredit tidak cukup. Silakan beli kredit terlebih dahulu." },
          { status: 402 }
        );
      }
      return NextResponse.json(
        { error: "Gagal memproses kredit" },
        { status: 500 }
      );
    }

    // 5. Generate with AI (non-streaming for now, save result)
    const taskInput: TaskInput = {
      taskType: input.taskType as TaskType,
      title: input.title,
      subject: input.subject,
      educationLevel: input.educationLevel,
      major: input.major,
      instructions: input.instructions,
      wordCount: input.wordCount as WordCountOption,
    };

    // Start generation in background
    generateAndSave(serviceClient, task.id, taskInput);

    // 6. Return task ID immediately
    return NextResponse.json({ taskId: task.id });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal" },
      { status: 500 }
    );
  }
}

async function generateAndSave(
  serviceClient: ReturnType<typeof createServiceRoleClient>,
  taskId: string,
  input: TaskInput
) {
  try {
    const result = generateTaskStream(input);
    const response = await result;
    const fullText = await response.text;

    // Count words
    const wordCount = fullText.split(/\s+/).filter(Boolean).length;

    // Update task with result
    await serviceClient
      .from("tasks")
      .update({
        content: fullText,
        status: "completed",
        word_count: wordCount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId);
  } catch (error) {
    console.error("AI generation error:", error);
    // Mark task as failed
    await serviceClient
      .from("tasks")
      .update({
        status: "failed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId);
  }
}
