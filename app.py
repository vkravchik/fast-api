from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

import uvicorn

app = FastAPI()

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

if __name__ == "__main__":
    uvicorn.run("app:app", host="py-v-f.herokuapp.com", port=5000, log_level="info")