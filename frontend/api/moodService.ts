import { getToken } from "./tokenService";

const logMood = async (mood: number) => {
  const token = await getToken();
  if (!token) {
    console.warn("No token found.");
    return;
  }
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/mood`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body:JSON.stringify({mood})
  });
  const moodData = await response.json();
  return moodData;
};
const addMoodNote = async(note:string|undefined,moodId:string)=>{
    const token = await getToken();
  if (!token) {
    console.warn("No token found.");
    return;
  }
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/mood/${moodId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body:JSON.stringify({note})
  });
}

export {logMood,addMoodNote}