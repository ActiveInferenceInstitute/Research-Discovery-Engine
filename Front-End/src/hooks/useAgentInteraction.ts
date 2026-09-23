// src/hooks/useAgentInteraction.ts
*   **Purpose:** Hook to manage triggering agents (simulated API calls) and receiving agent messages.
*   **Logic:** Exposes a `triggerAgent` function and holds the `agentMessages` state.
*   **Integration:** Used by `App` and various components (`ContextPanel`, `ConceptDesigner`, `AgentConsole`) to send commands and receive updates.