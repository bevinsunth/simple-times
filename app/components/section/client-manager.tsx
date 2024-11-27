'use client';

import React, { useEffect } from 'react';
import { Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useClientStore } from '@/lib/client/store';
import { NewClientForm } from '../client-manager/new-client-form';
import { ProjectList } from '../client-manager/project-list';

export default function ClientProjectManager(): JSX.Element {
  const {
    clientAndProjectList,
    expandedClients,
    addClient,
    deleteClient,
    addProject,
    deleteProject,
    toggleClientExpanded,
    fetchClientAndProjectList,
  } = useClientStore();

  useEffect(() => {
    fetchClientAndProjectList();
  }, [fetchClientAndProjectList]);

  return (
    <div className="space-y-4 w-full max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Client and Project Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <NewClientForm
              onAddClient={async name => await addClient({ name })}
            />
          </div>

          <div className="space-y-2">
            {clientAndProjectList.map(({ client, projects }) => (
              <Collapsible
                key={client.id}
                open={expandedClients[client.id ?? '']}
                onOpenChange={() => toggleClientExpanded(client.id ?? '')}
              >
                <div className="flex items-center justify-between mb-2">
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="p-0 hover:bg-transparent"
                    >
                      {expandedClients[client.id ?? ''] ? (
                        <ChevronDown className="h-4 w-4 mr-2" />
                      ) : (
                        <ChevronRight className="h-4 w-4 mr-2" />
                      )}
                      {client.name}
                    </Button>
                  </CollapsibleTrigger>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={async () => await deleteClient(client.id ?? '')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CollapsibleContent>
                  <ProjectList
                    clientId={client.id ?? ''}
                    projects={projects.map(p => ({
                      id: p.id ?? '',
                      name: p.name,
                    }))}
                    onAddProject={async (clientId, name) =>
                      await addProject(clientId, { name, clientId })
                    }
                    onDeleteProject={async (clientId, projectId) =>
                      await deleteProject(clientId, projectId)
                    }
                  />
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
