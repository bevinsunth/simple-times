'use client';

import React, { useEffect } from 'react';
import { Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
    <div className="mx-auto w-full max-w-2xl space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Client and Project Manager</CardTitle>
          <CardDescription>
            {!clientAndProjectList ||
            clientAndProjectList.length === 0 ||
            !clientAndProjectList[0].projects ||
            clientAndProjectList[0].projects.length === 0
              ? 'Create your first client and project to start'
              : 'Add or delete clients and projects.'}
          </CardDescription>
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
                <div className="mb-2 flex items-center justify-between">
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="p-0 hover:bg-transparent"
                    >
                      {expandedClients[client.id ?? ''] ? (
                        <ChevronDown className="mr-2 size-4" />
                      ) : (
                        <ChevronRight className="mr-2 size-4" />
                      )}
                      {client.name}
                    </Button>
                  </CollapsibleTrigger>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={async () => await deleteClient(client.id ?? '')}
                  >
                    <Trash2 className="size-4" />
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
