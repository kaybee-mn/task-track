export type Log={
    type: "task"|"app update"|"mood";
    item_id:string; //task_id if task, mood_id if mood
    timestamp:number;
    
}