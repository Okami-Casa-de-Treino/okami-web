import { useEffect, useState } from 'react';
import { useModuleStore } from '../../../../stores/moduleStore';
import { Module } from '../../../../types';

export const useModuleManagement = () => {
  const {
    modules,
    loading,
    error,
    fetchModules,
    clearError,
  } = useModuleStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewDrawer, setShowViewDrawer] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const handleCreateClick = () => {
    setShowCreateModal(true);
  };

  const handleEditClick = (module: Module) => {
    setSelectedModule(module);
    setShowEditModal(true);
  };

  const handleDeleteClick = (module: Module) => {
    setSelectedModule(module);
    setShowDeleteModal(true);
  };

  const handleViewClick = (module: Module) => {
    setSelectedModule(module);
    setShowViewDrawer(true);
  };

  const handleCloseModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowViewDrawer(false);
    setSelectedModule(null);
  };

  const handleCreateSuccess = () => {
    handleCloseModals();
    fetchModules();
  };

  const handleEditSuccess = () => {
    handleCloseModals();
    fetchModules();
  };

  const handleDeleteSuccess = () => {
    handleCloseModals();
    fetchModules();
  };

  return {
    // State
    modules,
    loading,
    error,
    showCreateModal,
    showEditModal,
    showDeleteModal,
    showViewDrawer,
    selectedModule,

    // Actions
    handleCreateClick,
    handleEditClick,
    handleDeleteClick,
    handleViewClick,
    handleCloseModals,
    handleCreateSuccess,
    handleEditSuccess,
    handleDeleteSuccess,
    clearError,
  };
}; 