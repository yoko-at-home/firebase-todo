import React, { useState, useEffect } from 'react';
import styles from './App.module.css';
import { FormControl, List, TextField } from '@material-ui/core';
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos"
import { makeStyles } from "@material-ui/styles"
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { db, auth } from './firebase';
import TaskItem from "./TaskItem";


const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  field: {
    marginTop: 30,
    marginBottom: 20,
    // margin: 80,
    color: 'rgb(85, 14, 24)!important',
  },
  list: {
    margin: 'auto',
    width: '100%',
  },
});

const App: React.FC = (props:any) => {
  const [tasks, setTasks] = useState([{ id: '', title: '' }]);
  const [input, setInput] = useState("")
  const classes = useStyles();
  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      !user && props.history.push('login');
    });
    return ()=> unSub()
})

  useEffect(() => {
    const unSub = db.collection("tasks").onSnapshot((snapshot) => {
      setTasks(
        snapshot.docs.map((doc) => ({ id: doc.id, title: doc.data().title }))
      );
    });
    return () => unSub();
  }, []);

  const newTask = (e: React.MouseEvent<HTMLButtonElement>) => {
    db.collection("tasks").add({ title: input });
    setInput("");
  };
  return (
    <div className={styles.app__root}>
      <h1>Todo App by React/Firebase</h1>
      <button
        className={styles.app__logout}
        onClick={async () => {
          try {
            await auth.signOut();
            props.history.push('login');
          } catch (error) {
            alert(error.message);
          }
        }}
      >
        <ExitToAppIcon />
      </button>
      <br />
      <div className={classes.wrapper}>
        <FormControl>
          <TextField
            className={classes.field}
            InputLabelProps={{
              shrink: true,
            }}
            label='次のタスクは?'
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInput(e.target.value)
            }
          />
        </FormControl>
        <button
          className={styles.app__icon}
          disabled={!input}
          onClick={newTask}
        >
          <AddToPhotosIcon />
        </button>
      </div>
      <List className={classes.list}>
        {tasks.map((task) => (
          <TaskItem key={task.id} id={task.id} title={task.title} />
        ))}
      </List>
    </div>
  );
};

export default App;
