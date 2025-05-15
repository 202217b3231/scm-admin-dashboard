import { Trash } from "lucide-react";

const SideBar = ({
  notes,
  oneAddNote,
  removeNote,
  activeNote,
  setActiveNote,
}) => {
  return (
    <div className="w-[30%] h-screen border-r-1">
      <div className="flex justify-between px-5 py-3">
        <input
          type="text"
          placeholder="Search Notes"
          className="border rounded-md px-2 py-1 w-[60%] bg-gray-100"
        />
        <button className="Btn w-[30%]" onClick={oneAddNote}>
          Add
        </button>
      </div>
      <div className="border-t-1 border-gray-200">
        {notes &&
          notes.map((note, index) => (
            <div
              key={index}
              className={`flex cursor-pointer justify-between ${
                activeNote === note ? "bg-blue-300" : ""
              } p-2 border-b-1 border-gray-200`}
              onClick={() => {
                setActiveNote(note);
              }}
            >
              <strong>{note.title}</strong>
              <Trash
                size={16}
                className="cursor-pointer text-red-500"
                onClick={() => {
                  removeNote(index);
                }}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default SideBar;
