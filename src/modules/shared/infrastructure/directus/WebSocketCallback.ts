type WebSocketCallback<T, Id extends string | number = string> = {
    type: "items";
    event: "init";
    data: T[];
} | {
    type: "items";
    event: "update";
    data: T[];
} | {
    type: "items";
    event: "delete";
    data: Array<Id>;
} | {
    type: "items";
    event: "create";
    data: T[];
}

export default WebSocketCallback;