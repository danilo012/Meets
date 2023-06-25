import { useEffect } from "react";
import useChatContext from "../../../hooks/useContextHooks/useChatContext";
import { auth, db } from "../../../firebase-config";
import { useLocation } from "react-router-dom";
import {
  FieldValue,
  serverTimestamp,
  collection,
  addDoc,
} from "firebase/firestore";
import format from "date-fns/format";
import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type PropsType = {
  username: string;
};

type SubmitMutation = {
  e: React.FormEvent<HTMLFormElement>;
  username: string;
  image: string | null | undefined;
  newMessage: string;
  timestamp: FieldValue;
  normaluserpair: string;
};

const SubmitMessage = ({ username }: PropsType) => {
  const { setNewMessage, newMessage, handleSubmit } = useChatContext();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();
  const { state } = useLocation();

  const image: string | null | undefined = auth.currentUser?.photoURL;
  const name = state?.name;
  const timestamp: FieldValue = serverTimestamp();

  const normaluserpair: string = `${username}-${name}`;
  const reverseduserpair: string = `${name}-${username}`;

  useEffect(() => {
    localStorage.setItem("userpair", normaluserpair);
    localStorage.setItem("reversed", reverseduserpair);
  });

  const submitMessage = async (variables: SubmitMutation) => {
    const { username, newMessage, normaluserpair, e } = variables;
    e.preventDefault();
    const docref = collection(db, "messages");
    const displayDate = `${format(new Date(), "MMMM dd, yyyy pp")}`;
    await addDoc(docref, {
      username,
      image,
      newMessage,
      timestamp,
      normaluserpair,
      displayDate,
      id: "",
    });
    setNewMessage("");
  };

  const submitMutation = useMutation({
    mutationFn: (variables: SubmitMutation) => submitMessage(variables),
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
    },
  });

  return (
    <section className="chat__form">
      <form
        onSubmit={(e) =>
          submitMutation.mutate({
            e,
            username,
            image,
            newMessage,
            timestamp,
            normaluserpair,
          })
        }
      >
        <input
          ref={inputRef}
          className="chat__send"
          placeholder="Type your message here..."
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
      </form>
    </section>
  );
};

export default SubmitMessage;
