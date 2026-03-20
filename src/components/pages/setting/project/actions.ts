'use server';

import { auth } from '@/auth';
import { ExecuteAction } from '@/lib/execute-actions';
import prisma from '@/lib/prisma';

export async function handleAddProjectReportMember(projectId: string, userId: string) {
  const session = await auth();
  if (!session) {
    throw new Error('Unauthorized');
  }

  return ExecuteAction({
    actionFn: async () => {
      if (!projectId) {
        throw new Error('Project ID is required');
      }
      if (!userId) {
        throw new Error('User ID is required');
      }

      const [project, user] = await Promise.all([
        prisma.project.findFirst({
          where: {
            id: projectId,
            is_enabled: true,
          },
          select: { id: true },
        }),
        prisma.user.findFirst({
          where: {
            id: userId,
            is_enabled: true,
            is_active: true,
          },
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        }),
      ]);

      if (!project) {
        throw new Error('Project not found');
      }

      if (!user) {
        return {
          success: false,
          code: 'USER_NOT_AVAILABLE',
          message: 'Not found active user with the provided ID',
        };
      }

      const existingMember = await prisma.projectReportMember.findUnique({
        where: {
          project_id_user_id: {
            project_id: projectId,
            user_id: userId,
          },
        },
        select: {
          user_id: true,
        },
      });

      if (existingMember) {
        return {
          success: false,
          code: 'DUPLICATE_MEMBER',
          message: 'User already has report viewing permissions',
        };
      }

      await prisma.projectReportMember.create({
        data: {
          project_id: projectId,
          user_id: userId,
        },
      });

      return {
        user_id: user.id,
        name: `${user.first_name} ${user.last_name}`.trim(),
      };
    },
    successMessage: 'Created successfully',
  });
}

export async function handleRemoveProjectReportMember(projectId: string, userId: string) {
  const session = await auth();
  if (!session) {
    throw new Error('Unauthorized');
  }

  return ExecuteAction({
    actionFn: async () => {
      if (!projectId) {
        throw new Error('Project ID is required');
      }
      if (!userId) {
        throw new Error('User ID is required');
      }

      const deletedResult = await prisma.projectReportMember.deleteMany({
        where: {
          project_id: projectId,
          user_id: userId,
        },
      });

      if (deletedResult.count === 0) {
        return {
          success: false,
          code: 'MEMBER_NOT_FOUND',
          message: 'User not found in report viewing permissions',
        };
      }

      return { user_id: userId };
    },
    successMessage: 'Removed successfully',
  });
}
