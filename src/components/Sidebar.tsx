import type { Collection } from "@prisma/client";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import React, { type FormEvent, useState } from "react";
import { api } from "~/utils/api";

interface Props {
  selectedCollection: Collection | null;
  handleCollectionSelect: (arg0: Collection | null) => void;
}

const Sidebar: NextPage<Props> = ({
  selectedCollection,
  handleCollectionSelect,
}) => {
  const { data: sessionData } = useSession();
  const [collectionTitle, setCollectionTitle] = useState("");

  const { data: collections, refetch: refetchCollections } =
    api.collection.getAll.useQuery(
      undefined, // no input
      {
        enabled: sessionData?.user !== undefined,
        onSuccess: (collections) => {
          handleCollectionSelect(selectedCollection ?? collections[0] ?? null);
        },
      }
    );

  const createCollection = api.collection.create.useMutation({
    onSuccess: () => {
      void refetchCollections();
    },
  });
  const deleteCollection = api.collection.delete.useMutation({
    onSuccess: () => {
      void refetchCollections();
    },
  });

  const handleCollectionSubmit = (e: FormEvent) => {
    e.preventDefault();
    setCollectionTitle('')
    createCollection.mutate({
      title: collectionTitle,
    });
  };

  const handleCollectionDelete = (collection: Collection) => {
    if (selectedCollection?.id === collection.id && collections) {
      handleCollectionSelect(collections[0] ?? null);
    }

    deleteCollection.mutate({
      id: collection.id,
    });
  };

  return (
    <div className="w-96 bg-slate-100 p-8 drop-shadow-md">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-bold text-slate-800">Collections</h3>
        {collections?.map((collection, i) => (
          <div
            key={collection.id}
            className={`${
              collection.id === selectedCollection?.id ? "bg-slate-200" : ""
            } text-md duration-250 group flex cursor-pointer items-center justify-between rounded text-slate-800 transition-all hover:bg-slate-200 `}
          >
            <button
              onClick={() => handleCollectionSelect(collections[i] ?? null)}
              className="w-full p-3 text-left"
            >
              {collection.title}
            </button>
            <button
              onClick={() => handleCollectionDelete(collection)}
              className={`btn-error btn-sm btn m-2 text-sm  opacity-0 group-hover:opacity-100`}
            >
              ✕
            </button>
          </div>
        ))}

        <form
          onSubmit={handleCollectionSubmit}
          className="relative flex rounded bg-transparent p-3 text-slate-900 placeholder-slate-500 outline outline-1 outline-slate-500"
        >
          <input
            type="text"
            name="title"
            value={collectionTitle}
            onChange={(e) => setCollectionTitle(e.target.value)}
            placeholder="untitled collection"
            className="text-md w-full bg-transparent pr-2 outline-0 focus:outline-none"
          />
          <button type="submit" className=" btn-accent btn-sm btn rounded">
            add
          </button>
        </form>
      </div>
    </div>
  );
};

export default Sidebar;
