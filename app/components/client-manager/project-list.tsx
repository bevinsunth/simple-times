'use client';

import { PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

interface ProjectListProps {
  clientId: string;
  projects: Array<{ id: string; name: string }>;
  onAddProject: (clientId: string, name: string) => Promise<void>;
  onDeleteProject: (clientId: string, projectId: string) => Promise<void>;
}

export function ProjectList({
  clientId,
  projects,
  onAddProject,
  onDeleteProject,
}: ProjectListProps) {
  const form = useForm({
    defaultValues: { newProject: '' },
  });

  const handleAddProject = async (projectName: string) => {
    if (projectName.trim()) {
      await onAddProject(clientId, projectName.trim());
      form.reset();
    }
  };

  return (
    <div className="ml-2 mt-2 space-y-2 border-l-2 border-gray-200 pl-6">
      {projects.map(project => (
        <div key={project.id} className="flex items-center justify-between">
          <span>{project.name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteProject(clientId, project.id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}

      <Form {...form}>
        <form className="flex space-x-2">
          <FormField
            control={form.control}
            name="newProject"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="New project name"
                    {...field}
                    onKeyPress={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddProject(field.value);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            onClick={() => handleAddProject(form.getValues('newProject'))}
          >
            <PlusCircle className="mr-2 size-4" />
            Add Project
          </Button>
        </form>
      </Form>
    </div>
  );
}
