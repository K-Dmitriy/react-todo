import React, { Component } from 'react';

import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';
import ItemAddForm from '../item-add-form';

import './app.css';

export default class App extends Component {

	maxId = 100;

	state = {
		todoData: [
			this.createTodoItem('Drink Coffee'),
			this.createTodoItem('Make Awesome App'),
			this.createTodoItem('Have a lunch')
		],
		term: ''
	};

	createTodoItem(label) {
		return {
			label,
			done: false,
			important: false,
			id: this.maxId++
		};
	}

	deleteItem = (id) => {
		
		this.setState(({ todoData }) => {
			const idx = todoData.findIndex(el => el.id === id);
			const newArray = [
				...todoData.slice(0, idx),
				...todoData.slice(idx + 1)
			];

			return {
				todoData: newArray
			};
		});
	};

	addItem = (text) => {
		const newItem = this.createTodoItem(text);

		this.setState(({ todoData }) => {
			const newArray = [
				...todoData,
				newItem
			];

			return {
				todoData: newArray
			};
		});
	};

	toggleProperty(arr, id, propName) {
		const idx = arr.findIndex(el => el.id === id);
		const oldItem = arr[idx];
		const newItem = {...oldItem, [propName]: !oldItem[propName]};

		return [
			...arr.slice(0, idx),
			newItem,
			...arr.slice(idx + 1)
		];
	}

	onToggleImportant = (id) => {
		this.setState(({ todoData }) => {
			return {
				todoData: this.toggleProperty(todoData, id, 'important')
			};
		});
	};

	onToggleDone = (id) => {
		this.setState(({ todoData }) => {
			return {
				todoData: this.toggleProperty(todoData, id, 'done')
			};
		});
	};

	searchPosts(items, term) {
		if (term.length === 0) {
			return items;
		}

		return items.filter(item => {
			return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1;
		});
	};

	onUpdateSearch = (term) => {
		this.setState({ term });
	}

	render() {
		const { todoData, term } = this.state;
		const doneCount = todoData.filter((el) => el.done).length;
		const todoCount = todoData.length - doneCount;
		const visiblePosts = this.searchPosts(todoData, term);

		return (
			<div className="todo-app">
				<AppHeader toDo={todoCount} done={doneCount} />
				<div className="top-panel d-flex">
					<SearchPanel onUpdateSearch={ this.onUpdateSearch } />
					<ItemStatusFilter />
				</div>

				<TodoList
					todos={ visiblePosts }
					onDeleted={ this.deleteItem }
					onToggleImportant={ this.onToggleImportant }
					onToggleDone={ this.onToggleDone } />

				<ItemAddForm
					onAdded={ this.addItem }/>
			</div>
		);
	}
};