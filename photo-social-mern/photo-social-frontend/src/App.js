import React, { useState, useEffect } from 'react';
import './App.css';

import axios from 'axios';

import { makeStyles } from '@mui/styles';
import Modal from '@mui/material/Modal';
import { Input, Button } from '@mui/material';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

import Post from './components/post/Post';
import ImageUpload from './components/imageUpload/ImageUpload';


function getModalStyle() {
  const top = 40;
  const left = 25;
  return {
    top: `${top}%`,
    left: `${left}%`,
    tranform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles({
  root: {
    backgroundColor: 'azure',
    position: 'absolute',
    width: 400,
    border: '2px solid #000',
    boxShadow: '2px 2px 12px #0000002c',
    padding: '2px 2px 2px 2px',
    color: '#000'
  }
})

function App() {
  /* Axios Area */
  const fetchPosts = async () => {
    await axios.get("http://localhost:9000/sync").then(response => setPosts(response.data))
  }

  useEffect(() => {
    fetchPosts()
  }, [])


  /* Styles Area */
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = useState(false);

  /*User  Area */
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSignIn, setOpenSignIn] = useState(false);

  /*Auth Area*/
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser)
      } else {
        setUser(null)
      }
    })
    return () => {
      unsubscribe();
    }
  }, [user, username])

  const signUp = async (e) => {
    e.preventDefault();

    try {

      const { user } = await createUserWithEmailAndPassword(auth, email, password)

      console.log(`User ${user.uid} created`)

      await updateProfile(user, {
        displayName: username
      })
      console.log('User Profile Update');
    } catch (error) {
      console.log(error);
    }
    setOpen(false);
  }

  const signIn = async (e) => {
    e.preventDefault();
    try {
      signInWithEmailAndPassword(email, password)
    } catch (err) {
      console.log(err);
    }
    setOpenSignIn(false);
  }

  /*Posts Area */
  const [posts, setPosts] = useState([
    {
      username: "FB_Shaulyb",
      caption: " Build a Messaging app with MERNStack",
      imageUrl: "https://www.techlifediary.com/wp-content/uploads/2020/06/react-js.png"
    },
    {
      username: "Alka_Lapse",
      caption: "Such a bautiful world",
      imageUrl: "https://quotefancy.com/media/wallpaper/3840x2160/126631-Charles-Dickens-Quote-And-a-beautiful-world-you-live-in-%0Awhen-it-is.jpg"
    }
  ])

  return (
    <div className="App">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.root}>

          <form className='app__signup'>
            <center>
              <img className='app__headerImahe' alt='Header' src={require("./components/assets/logo.png")} />
            </center>

            <Input
              placeholder='username'
              type='text'
              value={username}
              onChange={e => setUsername(e.target.value)}
            />

            <Input
              placeholder='email'
              type='text'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <Button type='submit' onClick={signUp}>
              Sign Up
            </Button>
          </form>

        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>

        <div style={modalStyle} className={classes.root}>
          <form className='app_signup'>
            <center>
              <img src={require("./components/assets/logo.png")} className="app__headerImage" alt='Header' />
            </center>

            <Input
              placeholder='email'
              type="text"
              value={email}
              onchange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type='submit' onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>

      </Modal>

      <div className='app__header'>
        <img src={require("./components/assets/logo.png")} alt="Header" className="app__headerImage" />

        {user ? <Button onClick={() =>
        auth.signOut()}>Logout</Button> : (
        <div className="app__loginContainer">
          <Button onClick={() =>
            setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={() => setOpen(true)}>Sign
            Up</Button>
        </div>)
      }
      </div>



      <div className='app__posts'>
        {posts.map(post => (
          <Post
            key={post._id}
            username={post.user}
            caption={post.caption}
            imageUrl={post.image}
          />
        ))}
      </div>
      {user?.displayName ? <ImageUpload username={user.displayName} /> : <h3 className='app__notLogin'>Need to Login to Upload</h3>}
    </div>
  );
}

export default App;
