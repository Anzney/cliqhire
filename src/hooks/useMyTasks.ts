import { useQuery } from '@tanstack/react-query';
import { taskService, MyTasksResponse } from '@/services/taskService';

export const useMyTasks = () => {
    return useQuery<MyTasksResponse, Error>({
        queryKey: ['my-tasks'],
        queryFn: () => taskService.getMyTasks(),
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 2,
    });
};
