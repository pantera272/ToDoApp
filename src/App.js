import React from 'react';
import io from 'socket.io-client';
import shortid from 'shortid';

class App extends React.Component {
  state = {
    tasks : [],
    taskAdd : ''
  }
  
  componentDidMount(){
    this.socket = io('localhost:8000');
    this.socket.on('updateDate', data => this.updateTask(data));
    this.socket.on('addTask', dataAdd => this.addTask(dataAdd));
    this.socket.on('removeTask', id => this.removeTask(id));
  }

  updateTask = data => {
    this.setState({tasks : data});
  }

  addTask = ({id, name}) => {
    this.setState( prevState => ({
      tasks: [...prevState.tasks,  {id:id, name:name}]
    }));
  }

  removeTask = (id , userLocal = false) => {
    const array = this.state.tasks;
    this.setState({tasks : array.filter(item => item.id !== id)}); 
    if (userLocal){
      this.socket.emit('removeTask' , id);
    }    
  }

  submitForm = e => {
    e.preventDefault();
    if (this.state.taskAdd !== ''){
      const add = {name : this.state.taskAdd, id : shortid()}
      this.addTask(add);
      this.socket.emit('addTask', add);
      this.setState({taskAdd : ''});
    } else {
      alert('Proszę wprowadzić nazwę');
    }  
  }

  render() {
    return (
      <div className="App">

        <header>
          <h1>ToDoList.app</h1>
        </header>
    
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
    
          <ul className="tasks-section__list" id="tasks-list">
            {this.state.tasks.map(({id, name}) => (
              <li key={id} className="task">
                {name}
                <button className="btn btn--red" onClick={() => this.removeTask(id, true)}>Remove</button>
              </li>
            ))}
          </ul>
    
          <form id="add-task-form" onSubmit={e => this.submitForm(e)}>
            <input
              className="text-input"
              autocomplete="off"
              type="text"
              placeholder="Type your description"
              id="task-name"
              onChange={e => this.setState({taskAdd : e.target.value})}
              value={this.state.taskAdd}
            />
            <button className="btn" type="submit">Add</button>
          </form>

        </section>

      </div>
    );
  };

};

export default App;