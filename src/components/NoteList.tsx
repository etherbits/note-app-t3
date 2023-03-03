import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import type { Collection } from "@prisma/client";
import ReactCodeMirror from "@uiw/react-codemirror";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import React, { type FormEvent, useState } from "react";
import ReactMarkdown from "react-markdown";
import { api } from "~/utils/api";

interface Props {
  selectedCollection: Collection | null;
}

const NoteList: NextPage<Props> = ({ selectedCollection }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data: sessionData } = useSession();

  const { data: notes, refetch: refetchNotes } = api.note.getAll.useQuery(
    {
      collectionId: selectedCollection?.id ?? "",
    },
    { enabled: sessionData?.user !== undefined && selectedCollection !== null }
  );

  const createNote = api.note.create.useMutation({
    onSuccess: () => {
      void refetchNotes();
    },
  });

  const deleteNote = api.note.delete.useMutation({
    onSuccess: () => {
      void refetchNotes();
    },
  });

  const handleCreateNote = (e: FormEvent) => {
    e.preventDefault();
    setTitle('')
    setContent('')
    createNote.mutate({
      title,
      content,
      collectionId: selectedCollection?.id ?? "",
    });
  };

  const handleDeleteNote = (id: string) => {
    deleteNote.mutate({
      id,
    });
  };

  return (
    <div className="flex w-full flex-col items-center gap-16 bg-slate-200 p-16">
      {selectedCollection && (
        <>
          <h1 className="text-4xl font-extrabold text-slate-800">
            {selectedCollection?.title} notes
          </h1>

          {notes?.map((note) => (
            <div key={note.id} className={"w-4/5"}>
              <div className="mb-6 flex h-fit min-h-[300px] flex-col gap-8 rounded-xl bg-slate-50 p-8 text-2xl text-slate-800 drop-shadow-lg">
                <h3>{note.title}</h3>
                <article className="prose lg:prose-xl">
                  <ReactMarkdown>{note.content}</ReactMarkdown>
                </article>
              </div>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="btn-error btn-wide btn-lg btn float-right drop-shadow-lg"
              >
                DELETE
              </button>
            </div>
          ))}

          <form
            onSubmit={handleCreateNote}
            className="block h-fit min-h-[300px] w-4/5 "
          >
            <div className="mb-6 flex w-full flex-col gap-8 rounded-xl bg-slate-50  p-8 text-slate-800 drop-shadow-lg">
              <input
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="untitled note"
                className="w-full rounded bg-transparent p-3 text-2xl placeholder-slate-500 outline outline-1 outline-slate-500 "
              />
              <div className="overflow-hidden rounded outline outline-1 outline-slate-400">
                <ReactCodeMirror
                  value={content}
                  height="300px"
                  extensions={[
                    markdown({
                      base: markdownLanguage,
                      codeLanguages: languages,
                    }),
                  ]}
                  onChange={(value) => setContent(value)}
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn-accent btn-wide btn-lg btn float-right drop-shadow-lg"
            >
              add
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default NoteList;
