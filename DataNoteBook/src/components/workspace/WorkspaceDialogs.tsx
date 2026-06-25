"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface WorkspaceDialogsProps {
  isCreateProjectOpen: boolean;
  setIsCreateProjectOpen: (open: boolean) => void;
  projectName: string;
  setProjectName: (val: string) => void;
  handleCreateProject: () => Promise<void> | void;
  createProjectLoading: boolean;
  locationsLoading: boolean;
  selectedLocation: any;

  isCreateFolderOpen: boolean;
  setIsCreateFolderOpen: (open: boolean) => void;
  newFolderNameInput: string;
  setNewFolderNameInput: (val: string) => void;
  handleCreateFolder: () => Promise<void> | void;
  createFolderLoading: boolean;

  isPrerequisiteOpen: boolean;
  setIsPrerequisiteOpen: (open: boolean) => void;
  prerequisiteStep: "project" | "folder";
  newProjectName: string;
  setNewProjectName: (val: string) => void;
  newFolderName: string;
  setNewFolderName: (val: string) => void;
  handlePrerequisiteCreateProject: () => Promise<void> | void;
  handlePrerequisiteCreateFolder: () => Promise<void> | void;
}

export default function WorkspaceDialogs({
  isCreateProjectOpen,
  setIsCreateProjectOpen,
  projectName,
  setProjectName,
  handleCreateProject,
  createProjectLoading,
  locationsLoading,
  selectedLocation,

  isCreateFolderOpen,
  setIsCreateFolderOpen,
  newFolderNameInput,
  setNewFolderNameInput,
  handleCreateFolder,
  createFolderLoading,

  isPrerequisiteOpen,
  setIsPrerequisiteOpen,
  prerequisiteStep,
  newProjectName,
  setNewProjectName,
  newFolderName,
  setNewFolderName,
  handlePrerequisiteCreateProject,
  handlePrerequisiteCreateFolder,
}: WorkspaceDialogsProps) {
  return (
    <>
      {/* Create Project Dialog */}
      <Dialog open={isCreateProjectOpen} onOpenChange={(open) => !open && setIsCreateProjectOpen(false)}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="project-name-input-main" className="text-slate-400 mb-2 block">Project Name</Label>
              <Input
                id="project-name-input-main"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-emerald-500"
                placeholder="e.g. Project - 7"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setIsCreateProjectOpen(false)} className="hover:bg-slate-800 text-slate-400 hover:text-slate-200">
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCreateProject}
              disabled={createProjectLoading || !projectName.trim() || locationsLoading || !selectedLocation}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold"
            >
              {createProjectLoading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Folder Dialog */}
      <Dialog open={isCreateFolderOpen} onOpenChange={(open) => !open && setIsCreateFolderOpen(false)}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="folder-name-input-main" className="text-slate-400 mb-2 block">Folder Name</Label>
              <Input
                id="folder-name-input-main"
                value={newFolderNameInput}
                onChange={(e) => setNewFolderNameInput(e.target.value)}
                className="bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-emerald-500"
                placeholder="e.g. Datasets"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setIsCreateFolderOpen(false)} className="hover:bg-slate-800 text-slate-400 hover:text-slate-200">
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCreateFolder}
              disabled={createFolderLoading || !newFolderNameInput.trim()}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold"
            >
              {createFolderLoading ? "Creating..." : "Create Folder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Prerequisite Project/Folder Creation Dialog */}
      <Dialog open={isPrerequisiteOpen} onOpenChange={(open) => !open && setIsPrerequisiteOpen(false)}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle>
              {prerequisiteStep === "project" ? "Step 1: Create Project" : "Step 2: Create Folder"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {prerequisiteStep === "project" ? (
              <div>
                <Label htmlFor="prereq-project-name" className="text-slate-400 mb-2 block">
                  You need to create a project first before uploading. Enter Project Name:
                </Label>
                <Input
                  id="prereq-project-name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-emerald-500"
                  placeholder="e.g. Project Alpha"
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="prereq-folder-name" className="text-slate-400 mb-2 block">
                  Now create a folder under your project. Enter Folder Name:
                </Label>
                <Input
                  id="prereq-folder-name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-slate-100 focus-visible:ring-emerald-500"
                  placeholder="e.g. Datasets"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setIsPrerequisiteOpen(false)} className="hover:bg-slate-800 text-slate-400 hover:text-slate-200">
              Cancel
            </Button>
            {prerequisiteStep === "project" ? (
              <Button
                size="sm"
                onClick={handlePrerequisiteCreateProject}
                disabled={createProjectLoading || !newProjectName.trim() || locationsLoading || !selectedLocation}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold"
              >
                {createProjectLoading ? "Creating..." : "Create Project"}
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handlePrerequisiteCreateFolder}
                disabled={createFolderLoading || !newFolderName.trim()}
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold"
              >
                {createFolderLoading ? "Creating..." : "Create Folder"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
