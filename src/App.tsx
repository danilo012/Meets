import { useState, useEffect, useCallback } from "react";
import { Auth } from "./components/Auth";
import Profile from "./components/Profile/Profile";
import Usersearch from "./components/userlist/Usersearch";
import Auser from "./components/anotheruserpage/Auser";
import LikedPosts from "./components/likedposts/LikedPosts";
import Chat from "./components/chat/Chat";
import Cookies from "universal-cookie";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  onSnapshot
} from "firebase/firestore";
import { db } from "./firebase-config";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/error/ErrorBoundary";
import { newPostsType } from "./context/GeneralContext";
import useGeneralContext from "./hooks/useGeneralContext";

export const cookies = new Cookies();

export type HandleNewPostData = {
  url: string,
  place: string
}

const App = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [userPicture, setUserPicture] = useState("");
  const [status, setStatus] = useState("Add status to profile");
  const [posts, setPosts] = useState<newPostsType[]>([]);

  const { isAuth } = useGeneralContext()

  const getPosts = useCallback(async () => {
    try {
      const userdoc = doc(db, "users", uid);
      const dataSnap = getDoc(userdoc);
      const dataset: any = (await dataSnap).data();
      const posts: newPostsType[] = await dataset.newPosts;
      return posts
    } catch (err) {
      throw `${err} in the App in the getPosts()`
    }
  }, [isAuth])

  useEffect(() => {
    getPosts().then(setPosts)
  }, [getPosts]);

  const getSetNameStatus = useCallback(async () => {
    try {
      const userdoc: any = doc(db, "users", uid);
      const dataSnap = getDoc(userdoc);
      const dataset: any = (await dataSnap).data();
      const status = await dataset.newStatus;
      const name = await dataset.name;
      setUsername(name);
      localStorage.setItem("username", name)
      setStatus(status);
    } catch (err) {
      console.error(err);
    }
  }, [username, status, posts])

  const getUserPicture = useCallback(async () => {
    try {
      const userdoc: any = doc(db, "users", uid);
      const dataSnap = getDoc(userdoc);
      const dataset: any = (await dataSnap).data();
      const picture = await dataset.imgurl
      setUserPicture(picture)
    } catch (err) {
      console.error(err)
    }
  }, [isAuth])

  const uid = localStorage.getItem("uid")!;

  onSnapshot(doc(db, "users", `${uid}`), () => {
    getSetNameStatus()
    getUserPicture()
  })

  const handleLike = async (id: number) => {
    const newPosts: Array<newPostsType> = posts.map((post) =>
      post.id == id ? { ...post, liked: !post.liked } : post
    );
    const newpostsdb = {
      newPosts: newPosts
    };
    const userdoc = doc(db, "users", `${uid}`);
    await updateDoc(userdoc, newpostsdb);
    getPosts().then(setPosts)
  };

  const usersDataRef = collection(db, "users");

  const handleNewPost = async (variables: HandleNewPostData) => {
    const usedoc = doc(db, "users", uid);
    const dataSnap = getDoc(usedoc);
    const dataset: any = (await dataSnap).data();
    const nposts = await dataset.newPosts;

    const id = nposts.length ? nposts[0].id + 1 : 1;
    const newPost = {
      city: variables.place,
      id,
      imgsrc: variables.url,
      liked: false,
      comments: []
    };
    const newPosts: Array<newPostsType> = [newPost, ...posts];

    const addPostPopup = document.querySelector(".popup-add-post");
    addPostPopup?.setAttribute("data-visible", "false");
    addPostPopup?.classList.remove("popup_opened");

    const newpostsdb = {
      newPosts: newPosts,
    };
    const userdoc = doc(db, "users", uid);
    await updateDoc(userdoc, newpostsdb);
    getPosts().then(setPosts)
  };

  const handleDelete = async (id: number) => {
    const newPosts = posts.filter((post) => post.id != id);
    const newpostsdb = {
      newPosts: newPosts,
    };
    const userdoc = doc(db, "users", uid);
    await updateDoc(userdoc, newpostsdb);
    getPosts().then(setPosts)
  };

  useEffect(() => {
    const getUsers = async () => {
      const data: any = await getDocs(usersDataRef);
      setUsers(data.docs.map((doc: any) => ({ ...doc.data() })));
    };
    getUsers();
  }, [isAuth]);

  if (!isAuth) {
    return (
      <ErrorBoundary>
        <Auth
          setPosts={setPosts}
          setStatus={setStatus}
          setUsername={setUsername}
          setUserPicture={setUserPicture}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Profile
                setStatus={setStatus}
                status={status}
                handleLike={handleLike}
                username={username}
                userPicture={userPicture}
                posts={posts}
                setUsername={setUsername}
                handleNewPost={handleNewPost}
                handleDelete={handleDelete}
              />
            }
          />
          <Route path="/usersearch" element={<Usersearch users={users} />} />
          <Route path="/user/:id" element={<Auser/>} />
          <Route path="/likedposts" element={<LikedPosts 
            userPicture={userPicture}
            username={username}
            status={status}
          />}/>
          <Route path="/chat" element={<Chat username={username} />}/>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
