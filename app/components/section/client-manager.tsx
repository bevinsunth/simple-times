'use client';

import React, { useState } from 'react';
import { PlusCircle, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface Project {
  id: string;
  name: string;
}

interface Client {
  id: string;
  name: string;
  projects: Project[];
}

export default function ClientProjectManager(): JSX.Element {
  const [clients, setClients] = useState<Client[]>([]);
  const [newClientName, setNewClientName] = useState('');
  const [expandedClients, setExpandedClients] = useState<
    Record<string, boolean>
  >({});

  const addClient = (): void => {
    if (newClientName.trim()) {
      const newClient: Client = {
        id: Date.now().toString(),
        name: newClientName.trim(),
        projects: [],
      };
      setClients(prevClients => [...prevClients, newClient]);
      setNewClientName('');
    }
  };

  const deleteClient = (clientId: string): void => {
    setClients(prevClients =>
      prevClients.filter(client => client.id !== clientId)
    );
  };

  const addProject = (clientId: string, projectName: string): void => {
    if (projectName.trim()) {
      setClients(prevClients =>
        prevClients.map(client => {
          if (client.id === clientId) {
            return {
              ...client,
              projects: [
                ...client.projects,
                { id: Date.now().toString(), name: projectName.trim() },
              ],
            };
          }
          return client;
        })
      );
    }
  };

  const deleteProject = (clientId: string, projectId: string): void => {
    setClients(prevClients =>
      prevClients.map(client => {
        if (client.id === clientId) {
          return {
            ...client,
            projects: client.projects.filter(
              project => project.id !== projectId
            ),
          };
        }
        return client;
      })
    );
  };

  const toggleClientExpanded = (clientId: string): void => {
    setExpandedClients(prev => ({
      ...prev,
      [clientId]: !prev[clientId],
    }));
  };

  return (
    <div className="space-y-4 w-full max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Client and Project Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              placeholder="New client name"
              value={newClientName}
              onChange={e => setNewClientName(e.target.value)}
            />
            <Button onClick={addClient}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </div>
          {clients.map(client => (
            <Collapsible
              key={client.id}
              open={expandedClients[client.id]}
              onOpenChange={() => toggleClientExpanded(client.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="p-0 hover:bg-transparent">
                    {expandedClients[client.id] ? (
                      <ChevronDown className="h-4 w-4 mr-2" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-2" />
                    )}
                    {client.name}
                  </Button>
                </CollapsibleTrigger>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteClient(client.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CollapsibleContent>
                <div className="pl-6 border-l-2 border-gray-200 ml-2 mt-2 space-y-2">
                  {client.projects.map(project => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between"
                    >
                      <span>{project.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteProject(client.id, project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <Input
                      placeholder="New project name"
                      onKeyPress={e => {
                        if (e.key === 'Enter') {
                          addProject(client.id, e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button
                      onClick={e => {
                        const input = e.currentTarget
                          .previousElementSibling as HTMLInputElement;
                        addProject(client.id, input.value);
                        input.value = '';
                      }}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Project
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
