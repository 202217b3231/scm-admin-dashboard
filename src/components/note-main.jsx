const Main = ({ activeNote, onUpdateNote }) => {
  if (!activeNote)
    return <div className="flex flex-col gap-2 p-5">No active note</div>;
  return (
    <div className="w-full h-full">
      {activeNote && (
        <div className="flex flex-col gap-2 p-5">
          <input
            type="text"
            placeholder="Title"
            value={activeNote.title}
            onChange={(e) => {
              activeNote.title = e.target.value;
              onUpdateNote(activeNote);
            }}
            className="border-b-2 border-gray-500 rounded-sm p-2"
          />
          <textarea
            placeholder="Take a note..."
            value={activeNote.body}
            onChange={(e) => {
              activeNote.body = e.target.value;
              onUpdateNote(activeNote);
            }}
            className="border border-gray-500 h-full rounded-sm p-2"
          ></textarea>
        </div>
      )}
    </div>
  );
};

export default Main;
