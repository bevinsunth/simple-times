import type {} from "@redux-devtools/extension" // required for devtools typing
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface clientState {
  clients: string[]
  projects: string[]
  addclient: (client: string) => void
  addProject: (project: string) => void
}

const useClientStore = create<clientState>()(
  devtools(
    persist(
      (set) => ({
        clients: [],
        projects: [],
        addclient: (client) =>
          set((state) => ({
            clients: [...state.clients, client],
          })),
        addProject: (project) =>
          set((state) => ({
            projects: [...state.projects, project],
          })),
      }),
      {
        name: "client-storage",
      }
    )
  )
)
