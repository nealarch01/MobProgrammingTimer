const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("TimerWidgetBridge", {
    moveTopLeft: () => ipcRenderer.invoke("moveTopLeft"),
    moveBottomRight: () => ipcRenderer.invoke("moveBottomRight"),
    moveTopRight: () => ipcRenderer.invoke("moveTopRight"),
    moveBottomLeft: () => ipcRenderer.invoke("moveBottomLeft")
});

contextBridge.exposeInMainWorld("TimerControllerBridge", {
    startTimer: (minimize) => ipcRenderer.invoke("startTimer", { minimize }),
    stopTimer: () => ipcRenderer.invoke("stopTimer"),
    skipBreak: (postponeBy) => ipcRenderer.invoke("skipBreak", { postponeBy }),
    isActive: () => ipcRenderer.invoke("isActive"),
    renderTimerText: () => ipcRenderer.invoke("renderTimerText"),
    getAllMembers: () => ipcRenderer.invoke("getAllMembers"),
    updateConfigs: (configs) => ipcRenderer.invoke("updateConfigs", { configs }),
    updateSelectedTeam: (timerConfigs, teamMembers) => ipcRenderer.invoke("updateSelectedTeam", { timerConfigs, teamMembers }),
    swapMembers: (member1, member2) => ipcRenderer.invoke("swapMembers", { member1, member2 }),
});

contextBridge.exposeInMainWorld("TeamControllerBridge", {
    saveTeamConfigs: (timerConfig) => ipcRenderer.invoke("saveTeamConfigs", timerConfig),
    teamNamePrompt: async (title, name) => ipcRenderer.invoke("teamNamePrompt", { title, name }),
    createTeam: async (teamName) => ipcRenderer.invoke("createTeam", { teamName }),
    getAllTeams: async () => ipcRenderer.invoke("getAllTeams"),
    getCurrentTeam: async () => ipcRenderer.invoke("getCurrentTeam"),
    setCurrentTeam: async (selectedIndex, membersToAdd, membersToRemove) => ipcRenderer.invoke("setCurrentTeam", { selectedIndex, membersToAdd, membersToRemove }),
    addTeam: async (teamName) => ipcRenderer.invoke("addTeam", { teamName }),
    renameTeam: async (teamName) => ipcRenderer.invoke("renameTeam", { teamName }),
    removeTeam: async (teamName) => ipcRenderer.invoke("removeTeam", teamName), // TODO: Change parameter to index
    retrieveQueue: async () => ipcRenderer.invoke("retrieveQueue"),
    addMember: (memberName) => ipcRenderer.invoke("addMember", { memberName }),
    removeMember: (memberName) => ipcRenderer.invoke("removeMember", { memberName }),
});

contextBridge.exposeInMainWorld("Quotes", {
    random: () => ipcRenderer.invoke("randomQuote"),
});

contextBridge.exposeInMainWorld("Utilities", {
    confirmPrompt: async (message) => ipcRenderer.invoke("confirmPrompt", { message }),
});