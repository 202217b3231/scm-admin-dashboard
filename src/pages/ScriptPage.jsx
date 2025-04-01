import { useState, useEffect } from "react";
import { Copy, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import useLocalStorage from "@/hooks/useLocalStorage";

const ScriptPage = () => {
  const [notes, setNotes] = useLocalStorage("notes", []);
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

  const removeNote = (index) => {
    const removedNote = notes[index];
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
    toast("Note removed!", {
      action: {
        label: "Undo",
        onClick: () => {
          setNotes((prevNotes) => [
            ...prevNotes.slice(0, index),
            removedNote,
            ...prevNotes.slice(index),
          ]);
        },
      },
    });
  };

  const fetchNotesFromLink = async () => {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/202217b3231/scm-admin-dashboard/refs/heads/master/src/assets/scripts.json"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }
      const data = await response.json();
      const fetchedNotes = data.map(({ title, body, tags }) => ({
        title,
        body,
        tag: tags.join(", "),
      }));

      setNotes((prevNotes) => {
        const existingTitles = new Set(prevNotes.map((note) => note.title));
        const uniqueFetchedNotes = fetchedNotes.filter(
          (note) => !existingTitles.has(note.title)
        );
        return [...prevNotes, ...uniqueFetchedNotes];
      });
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Failed to fetch notes");
    }
  };

  useEffect(() => {
    fetchNotesFromLink();
  }, []);

  return (
    <div className="ml-5">
      <Breadcrumb className="mt-1 mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/">Home</Link>
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
          <Button
            variant="secondary"
            onClick={fetchNotesFromLink}
            className="mb-4"
          >
            Refresh Notes
          </Button>
          <Label className="m-3 text-sm bg-amber-200 px-2 py-1 rounded-full whitespace-nowrap">
            <span className="text-blue-600 font-medium">Ctrl+D</span> to add
            bookmark
          </Label>
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
                className="cursor-pointer bg-gray-50 hover:bg-blue-100 transition-colors"
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
                      <Copy className="text-green-600" />
                    </Button>
                    <Button
                      variant="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        editNote(index);
                      }}
                    >
                      <Edit className="text-blue-600" />
                    </Button>
                    <Button
                      variant="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNote(index);
                      }}
                    >
                      <Trash2 className="text-red-600" />
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
