import React, { useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';

class Note {
  constructor(content) {
    this.createdAt = new Date();
    this.content = content;
    this.id = crypto.randomUUID();
  }
};

function Button({ className, onClick, iconName }) {
  return (
    <button className={className} onClick={onClick}>
      <FontAwesomeIcon icon={iconName} />
    </button>
  )
}

function ListPreview({notes, onSelect}) {

  return (
    <ul className="list-preview">
      {notes.map(note => <li key={note.id} onClick={() => onSelect(note.id)}>{note.content.slice(0, 15)}...</li>
      )}
    </ul>
  )
}

function Sidebar({notes, onSelect}) {

  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  function toggleSidebar() {
    setIsSidebarVisible(prev => !prev)
  }

  return (
    <div className="sidebar-container">
      <Button className="hide-btn btn-style" onClick={toggleSidebar} iconName={faAnglesLeft}/>
      <div className={`sidebar background-border-design ${isSidebarVisible ? "show" : "hide"}`}>
        <ListPreview notes={notes} onSelect={onSelect}/>
      </div>
    </div>
  )
}

function NoteInterface({add, deleteNote, notes, noteID, setNotes}) {
  let selected = notes.find(n => n.id === noteID);

  return (
    <div className="note background-border-design">
      <Button className="btn-style" iconName={faPlus} onClick={add} />
      <textarea value={selected.content} onChange={e => {
        setNotes(prev => prev.map(n => {
          if (n.id === noteID) {
            return {...n, content: e.target.value}
          }

          return n;
        }))
      }}>
        
      </textarea>
      <Button className="btn-style" iconName={faTrashCan} onClick={() => {deleteNote(noteID)}}/>
    </div>
  )
}

function App() {
  const [notes, setNotes] = useState([
  new Note("Shower thoughts: if pigs could fly"),
  new Note("Movies I need to watch: Sinners, Interstellar, The Boy and the heron"),
  new Note("Grocery list: eggs, milk, parsley, cheese")
]);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const [selectedNote, setSelectedNote] = useState(() => {
    if (notes[0].id === undefined) {
      addNote();
    }

    return notes[0].id;
  });

  function handleSelect(id) {
    setSelectedNote(id)
  }

  function addNote() {
    setNotes(prev => [...prev, new Note("abc")])
  }

  function deleteNote(id) {
    const index = notes.findIndex(n => n.id === id);

    const nextNotes = notes.filter(n => n.id !== id);
    let nextSelected;

    if (nextNotes.length === 0) {
      nextNotes.push(new Note(" "));
      nextSelected = nextNotes[0].id;
    } else if (index === 0) {
      nextSelected = nextNotes[0].id;
    } else {
      nextSelected = nextNotes[index - 1].id;
    }

    setNotes(nextNotes);
    setSelectedNote(nextSelected);
  }

  return (
    <div className="app-container">
      <Sidebar notes={notes} onSelect={handleSelect}/>
      <NoteInterface add={addNote} notes={notes} noteID={selectedNote} deleteNote={deleteNote} setNotes={setNotes}/>
    </div>
  )
}

export default App;