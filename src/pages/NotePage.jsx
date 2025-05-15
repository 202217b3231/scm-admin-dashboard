import SideBar from "@/components/note-sidebar";
import Main from "@/components/note-main";
import { useState } from "react";
export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState();
  const oneAddNote = () => {
    const newNote = {
      title: "Untitled",
      body: "Untitled",
    };
    setNotes([...notes, newNote]);
  };

  const onUpdateNote = (index) => {
    const newNotes = [...notes];
    newNotes[index] = activeNote;
    setNotes(newNotes);
  };

  const removeNote = (index) => {
    const newNotes = [...notes];
    if (confirm("Are you sure you want to delete this note?")) {
      newNotes.splice(index, 1);
      setNotes(newNotes);
    }
  };

  return (
    <div className="flex w-full h-screen">
      <SideBar
        notes={notes}
        oneAddNote={oneAddNote}
        removeNote={removeNote}
        activeNote={activeNote}
        setActiveNote={setActiveNote}
      />
      <Main
        activeNote={activeNote}
        setActiveNote={setActiveNote}
        onUpdateNote={onUpdateNote}
      />
    </div>
  );
}
