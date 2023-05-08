const { contextBridge, ipcRenderer } = require("electron");

// TimerWidgetBridge
contextBridge.exposeInMainWorld("TimerWidgetBridge", {
    moveTopLeft: () => ipcRenderer.invoke("moveTopLeft"),
    moveBottomRight: () => ipcRenderer.invoke("moveBottomRight"),
    moveTopRight: () => ipcRenderer.invoke("moveTopRight"),
    moveBottomLeft: () => ipcRenderer.invoke("moveBottomLeft")
});

// TimerControllerBridge
contextBridge.exposeInMainWorld("TimerControllerBridge", {
    startTimer: (minimize) => ipcRenderer.invoke("startTimer", { minimize }),
    stopTimer: () => ipcRenderer.invoke("stopTimer"),
    resetTimer: () => ipcRenderer.invoke("resetTimer"),
    skipBreak: (postponeBy) => ipcRenderer.invoke("skipBreak", { postponeBy }),
    isActive: () => ipcRenderer.invoke("isActive"),
    renderTimerText: () => ipcRenderer.invoke("renderTimerText"),
    renderCircleTimer: () => ipcRenderer.invoke("renderCircleTimer"),
    getAllMembers: () => ipcRenderer.invoke("getAllMembers"),
    updateConfigs: (configs) => ipcRenderer.invoke("updateConfigs", { configs }),
    updateSelectedTeam: (timerConfigs, teamMembers) => ipcRenderer.invoke("updateSelectedTeam", { timerConfigs, teamMembers }),
    swapMembers: (member1, member2) => ipcRenderer.invoke("swapMembers", { member1, member2 }),
    setMemberActive: (memberName) => ipcRenderer.invoke("setMemberActive", { memberName }),
    setMemberInactive: (memberName) => ipcRenderer.invoke("setMemberInactive", { memberName }),
    updateRoles: () => ipcRenderer.invoke("updateRoles"),
});

// TeamControllerBridge
contextBridge.exposeInMainWorld("TeamControllerBridge", {
    teamNamePrompt: async (title, name) => ipcRenderer.invoke("teamNamePrompt", { title, name }),
    createTeam: async (teamName) => ipcRenderer.invoke("createTeam", { teamName }),
    getAllTeams: async () => ipcRenderer.invoke("getAllTeams"),
    getCurrentTeam: async () => ipcRenderer.invoke("getCurrentTeam"),
    setCurrentTeam: async (selectedIndex, membersToAdd, membersToRemove, timerConfig) => ipcRenderer.invoke("setCurrentTeam", { selectedIndex, membersToAdd, membersToRemove, timerConfig }),
    addTeam: async (teamName) => ipcRenderer.invoke("addTeam", { teamName }),
    renameTeam: async (teamName) => ipcRenderer.invoke("renameTeam", { teamName }),
    removeTeam: async (selectedIndex) => ipcRenderer.invoke("removeTeam", { selectedIndex }), // TODO: Change parameter to index
    retrieveQueue: async () => ipcRenderer.invoke("retrieveQueue"),
    addMember: (memberName) => ipcRenderer.invoke("addMember", { memberName }),
    removeMember: (memberName) => ipcRenderer.invoke("removeMember", { memberName }),
});

// Quotes
contextBridge.exposeInMainWorld("Quotes", {
    random: () => ipcRenderer.invoke("randomQuote"),
});

// Utilities
contextBridge.exposeInMainWorld("Utilities", {
    confirmPrompt: async (message) => ipcRenderer.invoke("confirmPrompt", { message }),
});