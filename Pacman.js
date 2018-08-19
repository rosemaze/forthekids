import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './Pacman_Jquery.css';
import { kickStartJqueryPacmanGame, removeJqueryPacmanEventListeners, kickStartJqueryPacmanGameWithBehaviour } from './Pacman_Jquery';
import { DropdownButton, MenuItem, Button, ButtonGroup, Glyphicon, Dropdown } from 'react-bootstrap';

export var globalShowDialog;

class PacmanApp extends Component {
  constructor(props){
	  super(props);
	  this.state = ({stringy: 'hello'});
  }
  
  componentDidMount(){
	  kickStartJqueryPacmanGame();
  }
  
  componentWillUnmount(){
	  removeJqueryPacmanEventListeners();
  }
  
  render() {
	//<GameMap /> --- insert back into gameDiv, remove all other child elements in pacmanContainer and block kickstartJquery fn to execute react implementation
    return (
		<div id="pacmanContainer">
			
			<div id="gameDiv">
				<div className="ghost left" id="ghostBlueDiv"></div>
				<div className="ghost left" id="ghostRedDiv"></div>
				<div className="ghost left" id="ghostPinkDiv"></div>
				<div className="ghost left" id="ghostOrangeDiv"></div>
				<div id="pacmanDiv"></div>
				<div id="mapDiv"></div>
			</div>
			<GhostButtonGroup />
			<div id="scoreDiv" ><div id="scoreIcon" className="statusIcon"></div><span id="scoreValue">&nbsp;0</span></div>
			<div id="livesDiv" ><div id="livesIcon" className="statusIcon"></div><span id="livesValue">&nbsp;2</span></div>
			<div id="stageDiv" ><span id="stageValue">Stage 1</span><div id="stageIcon" className="cherry statusIcon"></div></div>
		</div>
    );
  }
}

const dialogConfirmDisplayer = (action) => {
	switch (action.type){
		case 'DISPLAY':
			return {showConfirm: true};
			break;
		case 'HIDE':
			return {showConfirm: false};
			break;
		default:
			return {showConfirm: false};
	}
}

class GhostButtonGroup extends Component{
	constructor(props){
		super(props);
		
		this.state = dialogConfirmDisplayer({});
		
		// Temporary new behaviours to be confirmed
		this.behaviours = ['Aggressive', 'Ambush', 'Random', 'Random'];
		this.toBeSelectedBehaviours = this.behaviours.slice();
		
		this.showConfirmPanel = this.showConfirmPanel.bind(this);
		this.onClickYes = this.onClickYes.bind(this);
		this.onClickNo = this.onClickNo.bind(this);
	}
	
	componentWillMount(){
		globalShowDialog = () =>{
			// External function to show confirm dialog
			this.dispatch({ type: 'DISPLAY' });
		}
	}
	
	dispatch(action) {
		this.setState(dialogConfirmDisplayer(action));
	}

	showConfirmPanel(selectedItem, buttonIndex){
		//if (true || window.gameIsPaused){
			
		// ## Selected item doesn't get selected if the game hasn't started 
		// Quickfix: Just always reset the game even if its not paused
			this.toBeSelectedBehaviours = this.behaviours.slice();
			
			this.toBeSelectedBehaviours[buttonIndex] = selectedItem;
			
			this.dispatch({ type: 'DISPLAY' });
		/*}else{
			// No running game just change the behaviour array
			
			this.toBeSelectedBehaviours[buttonIndex] = selectedItem;
			this.behaviours = this.toBeSelectedBehaviours.slice();
			
			kickStartJqueryPacmanGameWithBehaviour(this.behaviours);
		}*/
		//26 October 2017 15:00
	}
	onClickYes(){
		this.dispatch({ type: 'HIDE' });
		this.behaviours = this.toBeSelectedBehaviours.slice();
		
		window.gameIsPaused = false;
		kickStartJqueryPacmanGameWithBehaviour(this.behaviours);
	}
	onClickNo(){
		this.dispatch({ type: 'HIDE' });
		
		this.toBeSelectedBehaviours = this.behaviours.slice();
	}
	
	render(){
		return ( 
			<div>
				<div className="ghostButtonConfirmContainer">
					<div className="confirmContainer" style={{display:(this.state.showConfirm) ? 'block' : 'none'}} >
						<div className="confirmDiv">
							<div className="confirmDivMessage">Do you want to start a new game?
								<ButtonGroup bsStyle="confirmButtons" vertical>
									<Button bsStyle="success" bsSize="large" active onClick={this.onClickYes}>YES</Button>
									<Button bsStyle="danger"  bsSize="large" active onClick={this.onClickNo}>NO</Button>
								</ButtonGroup>
							</div>
						</div>
					</div>
				</div>
				<GhostButton onUserSelect={this.showConfirmPanel} buttonIndex={0} colour="Red" behaviour={this.behaviours[0]} />
				<GhostButton onUserSelect={this.showConfirmPanel} buttonIndex={1} colour="Pink" behaviour={this.behaviours[1]} />
				<GhostButton onUserSelect={this.showConfirmPanel} buttonIndex={2} colour="Blue" behaviour={this.behaviours[2]} />
				<GhostButton onUserSelect={this.showConfirmPanel} buttonIndex={3} colour="Orange" behaviour={this.behaviours[3]} />
			</div>
		);
	}
}

class GhostButton extends Component{
	constructor(props){
		super(props);
		
		this.onSelect = this.onSelect.bind(this);
	}
	onSelect(eventKey){
		this.props.onUserSelect(eventKey, this.props.buttonIndex);
		
		this.hackFocusInput.focus();
	}
	render(){
		//className={"btn-ghost"+this.props.colour+" ghostGeneric"} 
		//bsStyle={"ghost"+this.props.colour+" ghostGeneric"}
		return (
			<div className="ghostButtonContainer" style={{position:'relative'}}>
				<input style={{position:'absolute',width:'10px',left:'0px'}}
				  ref={(input) => { this.hackFocusInput = input; }}
				/>
				<DropdownButton onSelect={this.onSelect} bsSize="small" bsStyle={"ghost"+this.props.colour+" ghostGeneric"}
					title={this.props.behaviour} id={'ghost-dropdown-0'} dropup >
					<MenuItem eventKey="Aggressive">Aggressive</MenuItem>
					<MenuItem eventKey="Ambush">Ambush</MenuItem>
					<MenuItem eventKey="Fickle" disabled >Fickle</MenuItem>
					<MenuItem eventKey="Sneaky" disabled >Sneaky</MenuItem>
					<MenuItem divider />
					<MenuItem eventKey="Random">Random</MenuItem>
				</DropdownButton>
			</div>
		);
	}
}

export default PacmanApp;