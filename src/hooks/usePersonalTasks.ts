import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService, CreateTaskRequest, Task } from '@/services/taskService';
import { toast } from 'sonner';

export const usePersonalTasks = () => {
    const queryClient = useQueryClient();

    // Create Personal Task
    const createPersonalTask = useMutation({
        mutationFn: (taskData: Partial<CreateTaskRequest> & { title: string }) =>
            taskService.createPersonalTask(taskData),
        onSuccess: (data) => {
            toast.success('Personal task created successfully');
            queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to create task: ${error.message}`);
        }
    });

    // Update Personal Task
    const updatePersonalTask = useMutation({
        mutationFn: ({ taskId, data }: { taskId: string; data: Partial<Task> }) =>
            taskService.updatePersonalTask(taskId, data),
        onSuccess: () => {
            toast.success('Personal task updated successfully');
            queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to update task: ${error.message}`);
        }
    });

    // Update Personal Task Status (special case if needed, or just use updatePersonalTask)
    const updatePersonalTaskStatus = useMutation({
        mutationFn: ({ taskId, status }: { taskId: string; status: 'to-do' | 'inprogress' | 'completed' }) =>
            taskService.updatePersonalTaskStatus(taskId, status),
        onSuccess: () => {
            // Don't toast here to avoid spamming if dragged/dropped or quick check
            queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to update status: ${error.message}`);
        }
    });

    // Delete Personal Task
    const deletePersonalTask = useMutation({
        mutationFn: (taskId: string) => taskService.deletePersonalTask(taskId),
        onSuccess: () => {
            toast.success('Personal task deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['my-tasks'] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to delete task: ${error.message}`);
        }
    });

    return {
        createPersonalTask,
        updatePersonalTask,
        updatePersonalTaskStatus,
        deletePersonalTask
    };
};
