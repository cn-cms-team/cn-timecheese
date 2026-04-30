'use client';

import { useMemo, useState } from 'react';
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { PomodoroTask } from '../types';

interface TasksModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasks: PomodoroTask[];
  onAddTask: (title: string) => void;
  onEditTask: (id: string, title: string) => void;
  onDeleteTask: (id: string) => void;
  onToggleTaskComplete: (id: string) => void;
}

const TasksModal = ({
  open,
  onOpenChange,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTaskComplete,
}: TasksModalProps) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const completedCount = useMemo(() => tasks.filter((task) => task.isCompleted).length, [tasks]);

  const handleAddTask = () => {
    const title = newTaskTitle.trim();
    if (!title) {
      return;
    }

    onAddTask(title);
    setNewTaskTitle('');
  };

  const startEdit = (id: string, title: string) => {
    setEditingTaskId(id);
    setEditingTitle(title);
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingTitle('');
  };

  const saveEdit = () => {
    if (!editingTaskId) {
      return;
    }

    const title = editingTitle.trim();
    if (!title) {
      return;
    }

    onEditTask(editingTaskId, title);
    cancelEdit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Tasks</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {completedCount}/{tasks.length} completed
          </p>
        </DialogHeader>

        <div className="flex gap-2" data-pomodoro-tour="tasks-input">
          <Input
            value={newTaskTitle}
            onChange={(event) => setNewTaskTitle(event.target.value)}
            placeholder="Add a task..."
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleAddTask();
              }
            }}
          />
          <Button onClick={handleAddTask} disabled={!newTaskTitle.trim()}>
            <Plus />
            Add
          </Button>
        </div>

        <div className="max-h-90 space-y-2 overflow-auto pr-1" data-pomodoro-tour="tasks-list">
          {tasks.length === 0 && (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              No tasks yet. Add your first task to begin.
            </div>
          )}

          {tasks.map((task) => {
            const isEditing = editingTaskId === task.id;

            return (
              <div key={task.id} className="flex items-center gap-2 rounded-lg border p-2 sm:p-3">
                <button
                  type="button"
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full border transition-colors',
                    task.isCompleted
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground/40 text-transparent hover:text-muted-foreground'
                  )}
                  onClick={() => onToggleTaskComplete(task.id)}
                  aria-label={task.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  <Check className="h-4 w-4" />
                </button>

                <div className="min-w-0 flex-1">
                  {isEditing ? (
                    <Input
                      value={editingTitle}
                      onChange={(event) => setEditingTitle(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          saveEdit();
                        }
                        if (event.key === 'Escape') {
                          event.preventDefault();
                          cancelEdit();
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <p
                      className={cn(
                        'truncate text-sm font-medium sm:text-base',
                        task.isCompleted && 'text-muted-foreground line-through'
                      )}
                    >
                      {task.title}
                    </p>
                  )}
                </div>

                {isEditing ? (
                  <>
                    <Button variant="secondary" size="icon-sm" onClick={saveEdit}>
                      <Check />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={cancelEdit}>
                      <X />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      size="icon-sm"
                      onClick={() => startEdit(task.id, task.title)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon-sm"
                      onClick={() => {
                        if (editingTaskId === task.id) {
                          cancelEdit();
                        }
                        onDeleteTask(task.id);
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <DialogFooter showCloseButton>
          <></>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TasksModal;
