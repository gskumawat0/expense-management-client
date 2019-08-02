import React from 'react';
import {Switch, Route} from 'react-router-dom';
import './App.css';
import Navbar from '../component/Navbar'
import Setting from './Setting';
import Profile from './Profile';
import Expenses from './Expenses';

function App() {
	return (
		<div className="App">
			
			<aside className='side-nav'>
				<Navbar />
			</aside>
			<div className='main'>
				<Switch>
					<Route exact path='/' component={Expenses} />
					<Route exact path='/settings' component={Setting} />
					<Route exact path='/profile' component={Profile} />

				</Switch>
			</div>
		</div>
	);
}

export default App;
