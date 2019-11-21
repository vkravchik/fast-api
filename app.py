from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

import uvicorn

app = FastAPI()

class EditTask(BaseModel):
    title: str
    description: str
    done: bool

class CreateTask(BaseModel):
    title: str
    description: str

class Task(BaseModel):
    id: int
    title: str
    description: str
    done: bool = None

tasks = [
    {
        'id': 1,
        'title': 'Buy groceries',
        'description': 'Milk, Cheese, Pizza, Fruit, Tylenol', 
        'done': False
    },
    {
        'id': 2,
        'title': 'Learn Python',
        'description': 'Need to find a good Python tutorial on the web', 
        'done': False
    }
]

my_task: List[Task] = tasks

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/tasks", response_model=List[Task])
def read_task():
    return my_task

@app.get("/tasks/{task_id}", response_model=Task)
def save_task(task_id: int):
    task = list(filter(lambda t: t['id'] == task_id, tasks))
    return task[0]

@app.post("/tasks", response_model=Task, status_code=201)
def create_task(t: CreateTask):
    task = {
        'id': tasks[-1]['id'] + 1,
        'title': t.title,
        'description': t.description,
        'done': False
    }
    tasks.append(task)
    return task

@app.put("/tasks/{task_id}", response_model=Task)
def edit_task(task_id, t: EditTask):
    newTask = {
        'id': task_id,
        'title': t.title,
        'description': t.description,
        'done': t.done
    }
    return newTask

@app.delete("/tasks/{task_id}", response_model=List[Task], status_code=201)
def delete_task(task_id: int):
    task = list(filter(lambda t: t['id'] != task_id, tasks))
    return task