import { useEffect, useState}from "react"
import Sidebar from "./Components/Sidebar"
import Editor from "./Components/Editor"
import Split from "react-split"
import {nanoid} from "nanoid"
// on snapshot listens for changes on the firebase databsse
// and acts locally on the host
import { addDoc, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore"
import { db, notesCollection } from "../Firebase"

export default function App() {
    const [notes, setNotes] = useState([])
    const [currentNoteId, setCurrentNoteId] = useState(
        (notes[0] && notes[0].id) || ""
    )
    

    // sorts notes based on the most recent update to be on top
    const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)
        
    useEffect(() => {
      const unsubscribe = onSnapshot(notesCollection, function(snapshot) {
        // sync up our local notes array with the snapshot data
        const notesArr = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }))
        setNotes(notesArr)
      })
      return unsubscribe
    }, [])

    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        // push our notes to firebase
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
    }
    
    async function updateNote(text) {
        const docRef = doc(db, "notes", currentNoteId)
        await setDoc(docRef, { body: text, updatedAt: Date.now() }, { merge: true })
         // try to rearrange the most recently-modified
         // note to be at the top
         // uses local storage
        // setNotes(oldNotes => {
        //     const newArray = []
        //     for(let i = 0; i < oldNotes.length; i++) {
        //         const oldNote = oldNotes[i]
        //         if(oldNote.id === currentNoteId) {
        //             newArray.unshift({ ...oldNote, body: text })
        //         } else {
        //             newArray.push(oldNote)
        //         }
        //     }
        //     return newArray
        // })
    }
    // this does not rearrange the notes
    // function updateNote(text) {
    //     setNotes(oldNotes => oldNotes.map(oldNote => {
    //         return oldNote.id === currentNoteId
    //             ? { ...oldNote, body: text }
    //             : oldNote
    //     }))
    // }

    async function deleteNote(noteId) {
       const docRef = doc(db, "notes", noteId)
       await deleteDoc(docRef)
    }

    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={sortedNotes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <h3>Welcome to Drew's Note</h3>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
