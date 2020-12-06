import React from 'react';
import './App.css';
import Header from './components/Header/Header';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Slider from './components/Slider/Slider';
import Orders from './components/Orders/Orders';
import Users from './components/Users/Users';
import Products from './components/Products/Products';
import Filtered from './components/Filtered/Filtered';
import Payment from './components/Payment/Payment';

export default function App() {
 
  return (
	<Router>
		<Header />
		<Switch>
			<Route exact path="/">
				<Slider />
			</Route>
			<Route path="/products">
				<Products />
			</Route>
			<Route path="/users">
				<Users />
			</Route>
			<Route path="/orders">
				<Orders />
			</Route>
			<Route path="/search">
				<Filtered />
			</Route>
			<Route path="/payment">
				<Payment/>
			</Route>
		</Switch>
	</Router>
  )
}