import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useGlobalState } from "@/app/context/globalProvider";
import Button from "../Button/Button";
import { add } from "@/app/utils/Icons";

interface Props {
  user_id: string;
  task: {
    id: string;
    title: string;
    description: string;
    date: string;
    isCompleted: boolean;
    isImportant?: boolean;
  };
  isOpen: boolean;
  onClose: () => void;
}

const EditTaskModal: React.FC<Props> = ({ user_id, task, isOpen, onClose }) => {
  const { updateCompleteTask, theme } = useGlobalState();
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [date, setDate] = useState(task.date);
  const [completed, setCompleted] = useState(task.isCompleted);
  const [important, setImportant] = useState(task.isImportant);
  const modalRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
    setDate(task.date);
    setCompleted(task.isCompleted);
    setImportant(task.isImportant);
  }, [task]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleChange = (name: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    switch (name) {
      case "title":
        setTitle(e.target.value);
        break;
      case "description":
        setDescription(e.target.value);
        break;
      case "date":
        setDate(e.target.value);
        break;
      case "completed":
        if (e.target instanceof HTMLInputElement) {
          setCompleted(e.target.checked);
        }
        break;
      case "important":
        if (e.target instanceof HTMLInputElement) {
          setImportant(e.target.checked);
        }
        break;
      default:
        break;
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedTask = {
      id: task.id,
      title,
      description,
      date,
      isCompleted: completed,
      isImportant: important,
      user_id: user_id
    };

    updateCompleteTask(updatedTask);
    onClose();
  };

  if (!isOpen) return null;
  return (
    <ModalOverlay>
      <EditTaskModalStyled ref={modalRef} onSubmit={handleSave} theme={theme}>
        <h1>Edit Task</h1>
        <div className="input-control">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            name="title"
            onChange={handleChange("title")}
            placeholder="e.g.,Add Task Headline"
          />
        </div>
        <div className="input-control">
          <label htmlFor="description">Description</label>
          <textarea
            value={description}
            onChange={handleChange("description")}
            name="description"
            id="description"
            rows={4}
            placeholder="e.g., Add Subnotes Here"
          ></textarea>
        </div>
        <div className="input-control">
          <label htmlFor="date">Date</label>
          <input
            value={date}
            onChange={handleChange("date")}
            type="date"
            name="date"
            id="date"
          />
        </div>
        <div className="input-control toggler">
          <label htmlFor="completed">Toggle Completed</label>
          <input
            checked={completed}
            onChange={handleChange("completed")}
            type="checkbox"
            name="completed"
            id="completed"
          />
        </div>
        <div className="input-control toggler">
          <label htmlFor="important">Toggle Important</label>
          <input
            checked={important}
            onChange={handleChange("important")}
            type="checkbox"
            name="important"
            id="important"
          />
        </div>
        <div className="submit-btn flex justify-end">
          <Button
            type="submit"
            name="Save Task"
            icon={add}
            padding={"0.8rem 2rem"}
            borderRad={"0.8rem"}
            fw={"500"}
            fs={"1.2rem"}
            background={"rgb(0, 163, 255)"}
          />
        </div>
      </EditTaskModalStyled>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EditTaskModalStyled = styled.form`
  background: black;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.01rem;
  max-width: 700px; 
  width: 100%;

  > h1 {
    font-size: clamp(1.2rem, 5vw, 1.6rem);
    font-weight: 600;
  }

  color: ${(props) => props.theme.colorGrey1};

  .input-control {
    position: relative;
    margin: 1.6rem 0;
    font-weight: 500;

    @media screen and (max-width: 450px) {
      margin: 1rem 0;
    }

    label {
      margin-bottom: 0.5rem;
      display: inline-block;
      font-size: clamp(0.9rem, 5vw, 1.2rem);

      span {
        color: ${(props) => props.theme.colorGrey3};
      }
    }

    input,
    textarea {
      width: 100%;
      padding: 1rem;

      resize: none;
      background-color: ${(props) => props.theme.colorGreyDark};
      color: ${(props) => props.theme.colorGrey2};
      border-radius: 0.5rem;
    }
  }

  .submit-btn button {
    transition: all 0.35s ease-in-out;

    @media screen and (max-width: 500px) {
      font-size: 0.9rem !important;
      padding: 0.6rem 1rem !important;

      i {
        font-size: 1.2rem !important;
        margin-right: 0.5rem !important;
      }
    }

    i {
      color: ${(props) => props.theme.colorGrey0};
    }

    &:hover {
      background: ${(props) => props.theme.colorPrimaryGreen} !important;
      color: ${(props) => props.theme.colorWhite} !important;
    }
  }

  .toggler {
    display: flex;
    align-items: center;
    justify-content: space-between;

    cursor: pointer;

    label {
      flex: 1;
    }

    input {
      width: initial;
    }
  }
`;

export default EditTaskModal;
