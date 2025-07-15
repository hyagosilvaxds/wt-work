import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    console.log("PATCH /api/superadmin/lessons/[id] - ID:", id);
    console.log("PATCH /api/superadmin/lessons/[id] - Body:", body);

    // Validar se o ID é válido
    if (!id) {
      return NextResponse.json(
        { error: "ID da aula é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar aula existente
    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
    });

    if (!existingLesson) {
      return NextResponse.json(
        { error: "Aula não encontrada" },
        { status: 404 }
      );
    }

    // Preparar dados para atualização
    const updateData: any = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.startDate !== undefined) updateData.startDate = new Date(body.startDate);
    if (body.endDate !== undefined) updateData.endDate = new Date(body.endDate);
    if (body.status !== undefined) updateData.status = body.status;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.observations !== undefined) updateData.observations = body.observations;
    if (body.instructorId !== undefined) updateData.instructorId = body.instructorId;
    if (body.clientId !== undefined) updateData.clientId = body.clientId;
    if (body.classId !== undefined) updateData.classId = body.classId;

    console.log("Update data:", updateData);

    // Atualizar aula
    const updatedLesson = await prisma.lesson.update({
      where: { id },
      data: updateData,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        class: {
          select: {
            id: true,
            title: true,
            startDate: true,
            endDate: true,
            training: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    console.log("Updated lesson:", updatedLesson);

    return NextResponse.json(updatedLesson, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao atualizar aula:", error);
    
    // Tratar erros específicos do Prisma
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Aula não encontrada" },
        { status: 404 }
      );
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Violação de restrição única" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro interno do servidor", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "ID da aula é obrigatório" },
        { status: 400 }
      );
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        class: {
          select: {
            id: true,
            title: true,
            startDate: true,
            endDate: true,
            training: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: "Aula não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(lesson, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao buscar aula:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "ID da aula é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se a aula existe
    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
    });

    if (!existingLesson) {
      return NextResponse.json(
        { error: "Aula não encontrada" },
        { status: 404 }
      );
    }

    // Deletar aula
    await prisma.lesson.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Aula deletada com sucesso" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erro ao deletar aula:", error);
    
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Aula não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Erro interno do servidor", details: error.message },
      { status: 500 }
    );
  }
}
