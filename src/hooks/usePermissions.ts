import { useState, useEffect } from 'react';
import { permissionService, UserPermissions, PermissionsInfo } from '@/services/permissionService';

interface UsePermissionsReturn {
  currentUser: UserPermissions | null;
  permissionsInfo: PermissionsInfo | null;
  loading: boolean;
  error: string | null;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  isAdmin: boolean;
  refreshUserPermissions: () => Promise<void>;
}

/**
 * Custom hook for managing user permissions throughout the application
 * This hook provides permission checking utilities and current user information
 */
export function usePermissions(): UsePermissionsReturn {
  const [currentUser, setCurrentUser] = useState<UserPermissions | null>(null);
  const [permissionsInfo, setPermissionsInfo] = useState<PermissionsInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch current user permissions and permissions info
  const fetchUserPermissions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get permissions info
      const infoResponse = await permissionService.getPermissionsInfo();
      setPermissionsInfo(infoResponse.data);
      
      // TODO: Get current user ID from auth context or localStorage
      // For now, we'll need to implement this based on your auth system
      // const currentUserId = getCurrentUserId(); // You need to implement this
      // if (currentUserId) {
      //   const userResponse = await permissionService.getUserPermissions(currentUserId);
      //   setCurrentUser(userResponse.data.user);
      // }
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load permissions');
      console.error('Error loading permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    return currentUser.permissions.includes(permission);
  };

  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!currentUser) return false;
    return permissions.some(permission => currentUser.permissions.includes(permission));
  };

  // Check if user has all of the specified permissions
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!currentUser) return false;
    return permissions.every(permission => currentUser.permissions.includes(permission));
  };

  // Check if user is admin
  const isAdmin = currentUser?.role === 'ADMIN';

  // Refresh user permissions
  const refreshUserPermissions = async () => {
    await fetchUserPermissions();
  };

  // Load permissions on mount
  useEffect(() => {
    fetchUserPermissions();
  }, []);

  return {
    currentUser,
    permissionsInfo,
    loading,
    error,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    refreshUserPermissions,
  };
}

/**
 * Higher-order component for protecting routes/components based on permissions
 */
export function withPermission(
  WrappedComponent: React.ComponentType<any>,
  requiredPermission: string,
  fallbackComponent?: React.ComponentType<any>
) {
  return function PermissionProtectedComponent(props: any) {
    const { hasPermission, loading } = usePermissions();

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!hasPermission(requiredPermission)) {
      return fallbackComponent ? <fallbackComponent {...props} /> : <div>Access Denied</div>;
    }

    return <WrappedComponent {...props} />;
  };
}

/**
 * Component for conditionally rendering content based on permissions
 */
interface PermissionGateProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGate({ permission, children, fallback }: PermissionGateProps) {
  const { hasPermission, loading } = usePermissions();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!hasPermission(permission)) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}

/**
 * Component for conditionally rendering content based on multiple permissions (any)
 */
interface AnyPermissionGateProps {
  permissions: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AnyPermissionGate({ permissions, children, fallback }: AnyPermissionGateProps) {
  const { hasAnyPermission, loading } = usePermissions();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!hasAnyPermission(permissions)) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}

/**
 * Component for conditionally rendering content based on multiple permissions (all)
 */
interface AllPermissionsGateProps {
  permissions: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AllPermissionsGate({ permissions, children, fallback }: AllPermissionsGateProps) {
  const { hasAllPermissions, loading } = usePermissions();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!hasAllPermissions(permissions)) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}
