import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
const ScriptPage = () => {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [tagSuggestions] = useState([
    "Python",
    "Bookmarklet",
    "Javascript",
    "Todo",
  ]);
  const [filteredTags, setFilteredTags] = useState([]);
  const addOrUpdateNote = () => {
    if (title.trim() && body.trim()) {
      if (editMode) {
        const updatedNotes = [...notes];
        updatedNotes[editIndex] = { title, body, tag };
        setNotes(updatedNotes);
      } else {
        setNotes([...notes, { title, body, tag }]);
      }
      setTitle("");
      setBody("");
      setTag("");
      setModalOpen(false);
      setEditMode(false);
    }
  };

  function fetchNotes() {
    const storedNotes = localStorage.getItem("notes");
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast("Copied to clipboard!");
  };

  const editNote = (index) => {
    setTitle(notes[index].title);
    setBody(notes[index].body);
    setTag(notes[index].tag);
    setEditIndex(index);
    setEditMode(true);
    setModalOpen(true);
  };
  const handleTagChange = (e) => {
    const value = e.target.value;
    setTag(value);
    setFilteredTags(
      tagSuggestions.filter((t) =>
        t.toLowerCase().includes(value.toLowerCase())
      )
    );
  };
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && filteredTags.length > 0) {
      e.preventDefault();
      setTag(filteredTags[0]);
      setFilteredTags([]);
    }
  };
  return (
    <div className="ml-5">
      <Breadcrumb className="mt-1 mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Scripts</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="p-4 flex flex-col min-w-[60vw]">
        <div className="flex gap-5 ">
          <Input
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4"
          />
          <Button
            variant="secondary"
            onClick={() => {
              setModalOpen(true);
              setEditMode(false);
            }}
            className="mb-4"
          >
            Create Note
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {notes
            .filter(
              (note) =>
                note.title.toLowerCase().includes(search.toLowerCase()) ||
                note.tag.toLowerCase().includes(search.toLowerCase())
            )
            .map((note, index) => (
              <Card
                key={index}
                onClick={() => setSelectedNote(note)}
                className="cursor-pointer "
              >
                <CardContent>
                  <h3 className="font-bold text-lg">{note.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {note.body}
                  </p>
                  {note.tag && (
                    <span className="text-xs text-blue-500">#{note.tag}</span>
                  )}
                  <div className="mt-2 flex gap-2">
                    <Button
                      variant="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(note.body);
                      }}
                    >
                      <Copy />
                    </Button>
                    <Button
                      variant="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        editNote(index);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="min-w-[60vw] min-h-[80vh] m-0 bg-white ">
            <DialogHeader>
              <DialogTitle>
                {editMode ? "Edit Note" : "Create Note"}
              </DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="Body"
              className="min-h-[60vh]"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />

            <div className="relative">
              <Input
                placeholder="Tag (optional)"
                value={tag}
                onChange={handleTagChange}
                onKeyDown={handleTagKeyDown}
              />
              {filteredTags.length > 0 && (
                <div className="absolute z-10 bg-white border rounded w-full">
                  {filteredTags.map((t, index) => (
                    <div
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => {
                        setTag(t);
                        setFilteredTags([]);
                      }}
                    >
                      {t}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button variant="secondary" onClick={addOrUpdateNote}>
              {editMode ? "Update Note" : "Add Note"}
            </Button>
          </DialogContent>
        </Dialog>

        <Dialog
          open={!!selectedNote}
          onOpenChange={() => setSelectedNote(null)}
        >
          <DialogContent className="min-w-[70vw] bg-white max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>{selectedNote?.title}</DialogTitle>
            </DialogHeader>
            {selectedNote?.body && (
              <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
                {selectedNote.body}
              </SyntaxHighlighter>
            )}
            {selectedNote?.tag && (
              <span className="text-xs text-blue-500">#{selectedNote.tag}</span>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
export default ScriptPage;
