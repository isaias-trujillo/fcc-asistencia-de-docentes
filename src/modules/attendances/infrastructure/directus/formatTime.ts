export const formatTime = (time: string) => {
    return time.split(":").map((t) => `0${t.trim()}`.slice(-2)).join(":");
};