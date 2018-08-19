import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import './bootstrap.css';
import './bootstrap-theme.css';
import './scales.css';
import './bubbles.css';
import PacmanApp from './Pacman';

import { Grid } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Navbar, Nav, NavItem, MenuItem, NavDropdown } from 'react-bootstrap';
import { kickStartAnimateScales, detectScrollPosition } from './parallax';

var createReactClass = require('create-react-class');
var ScrollWrapper = createReactClass({
    propTypes: {
        onWindowScroll: PropTypes.func
    },

    handleScroll: function(event) {
        // Do something generic, if you have to
        //console.log("ScrollWrapper's handleScroll");

        // Call the passed-in prop
        if (this.props.onWindowScroll) this.props.onWindowScroll(event);
    },

    render: function () {
        return this.props.children;
    },

    componentDidMount: function() {
        if (this.props.onWindowScroll){ 
			window.addEventListener("scroll", this.handleScroll);
			//window.addEventListener("wheel", this.handleScroll);
		}
    },

    componentWillUnmount: function() {
        if (this.props.onWindowScroll) {
			window.removeEventListener("scroll", this.handleScroll);
			//window.removeEventListener("wheel", this.handleScroll);
		}
    }
});

const CELL_GREY = 'scaleColGrey';
const CELL_GREY_NO_ANIM = 'bgGrey noAnimation';
const CELL_BLUSH = 'scaleColBlush';
const CELL_AQUA = 'scaleColAqua';
const CELL_NO_ANIM = 'noAnimation';

const PacmanCell = (props) => {
	return <ShortcutPacman onUserClick={props.handleClick}/>;
}

const RegularCell = (props) => {
	let scaleColColor = (props.darker) ? 'scaleColDarker' : 'scaleColGreen';
	scaleColColor = (props.cssColor && props.cssColor!=='') ? props.cssColor : scaleColColor;
	const scaleColClass = 'scaleCol' + props.row;
	
	return (
		<div id={"scaleCol"+props.row+"_"+props.col} className={`scaleCol ${scaleColColor} ${scaleColClass}`} >{props.children}</div>
	);
}

const HalfEndCell = (props) => {
	const scaleColClass = 'scaleCol' + props.row;
	var sideClass, col;
	[sideClass, col] = (props.side==='right') ? ['scaleCellRightHalf', 7] : ['scaleCellLeftHalf', 1];
	
	return (
		<div id={"scaleCol"+props.row+"_"+col} className={sideClass + " " + scaleColClass} ></div>
	);
}

const RegularRow = (props) => {
	const overlapClass = (props.row > 2) ? 'overlap' : '';
	const className = `scaleRow ${overlapClass} scaleRegularRowGridContainer`;
	return(
		<div className={className} bsClass={"scaleRow"+overlapClass}>
			<RegularCell cssColor={props.ColColors[0]} row={props.row} col={1} darker={props.darker}/>
			<RegularCell cssColor={props.ColColors[1]} row={props.row} col={2} darker={props.darker}/>
			<RegularCell cssColor={props.ColColors[2]} row={props.row} col={3} darker={props.darker}></RegularCell>
			<RegularCell cssColor={props.ColColors[3]} row={props.row} col={4} darker={props.darker}/>
			<RegularCell cssColor={props.ColColors[4]} row={props.row} col={5} darker={props.darker}/>
			<RegularCell cssColor={props.ColColors[5]} row={props.row} col={6} darker={props.darker}/>
		</div>
	)
}

const HalfEndsRow = (props) => {
	const specialClass = (props.specialClass) ? ' '+props.specialClass : '';
	return (
		<div className="scaleRow overlap scaleHalfEndsRowGridContainer" bsClass={"scaleRow altColour overlap"+specialClass}>
			<HalfEndCell row={props.row} side='left' />
			<RegularCell cssColor={props.ColColors[1]} row={props.row} col={2} />
			<RegularCell cssColor={props.ColColors[2]} row={props.row} col={3}>
				{props.handlePacmanClick && <PacmanCell handleClick={props.handlePacmanClick}/>}
			</RegularCell>
			<RegularCell cssColor={props.ColColors[3]} row={props.row} col={4} />
			<RegularCell cssColor={props.ColColors[4]} row={props.row} col={5} />
			<RegularCell cssColor={props.ColColors[5]} row={props.row} col={6} />
			<HalfEndCell row={props.row} side='right' />
		</div>
	)
}

class App extends Component {
	constructor(props){
		super(props);
		
		this.state = ({
			showPacmanModal: false,
			navBarClass: 'navBarShow'
		});
		
		this.lastScrollTop = window.scrollTop;
		
		this.handleNavSelect = this.handleNavSelect.bind(this);
		this.handlePacmanClick = this.handlePacmanClick.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.hidePacmanModal = this.hidePacmanModal.bind(this);
	}
	
	componentDidMount(){
		kickStartAnimateScales();
		window.addEventListener('scroll', this.handleScroll);
	}
	
	handleNavSelect(selectedKey){
		switch (selectedKey){
			case 1:
				this.setState({showPacmanModal: true});
				break;
		}
	}
	
	handlePacmanClick(e){
		this.setState({showPacmanModal: true});
	}
	
	handleScroll(event){
		var currentY = window.pageYOffset;
		if (this.lastScrollTop > window.pageYOffset){
			// Scrolling up, show navbar
			this.setState({navBarClass: ''});
		}else{
			// Scrolling down, hide navbar
			this.setState({navBarClass: 'navBarHide'});
		}
		this.lastScrollTop = currentY;
	}
	
	hidePacmanModal(){
		if (window.confirm('Are you sure you want to leave this game?')){
			this.setState({showPacmanModal: false});
		}
	}
	
	render() {
		var innerDivCount = 0;
		
		return (
			<div id='bodyDiv'>
				<Navbar inverse collapseOnSelect fixedTop className={this.state.navBarClass + ' navBar'}>
					<Navbar.Header>
						<Navbar.Brand>
							<a href="#" id="btnHome">For the Kids</a>
						</Navbar.Brand>
						<Navbar.Toggle />
					</Navbar.Header>
					<Navbar.Collapse>
						<Nav onSelect={this.handleNavSelect}>
							<NavItem eventKey={1} href="#">pacman</NavItem>
							<NavDropdown eventKey={3} title="Tech" id="basic-nav-dropdown">
							<MenuItem eventKey={3.1}>Javascript</MenuItem>
							<MenuItem eventKey={3.2}>&nbsp; React</MenuItem>
							<MenuItem eventKey={3.3}>&nbsp; jQuery</MenuItem>
							<MenuItem divider />
							<MenuItem eventKey={3.4}>CSS</MenuItem>
							<MenuItem eventKey={3.5}>&nbsp; SCSS</MenuItem>
							<MenuItem divider />
							<MenuItem eventKey={3.6}>HTML5</MenuItem>
							<MenuItem divider />
							<MenuItem eventKey={3.7}>Backend</MenuItem>
							<MenuItem eventKey={3.8}>&nbsp; Node.js</MenuItem>
							</NavDropdown>
						</Nav>
						<Nav pullRight>
							<NavItem eventKey={1} href="#">lam.meisze@gmail.com</NavItem>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
				
				<DialogPacman show={this.state.showPacmanModal} onUserHideModal={this.hidePacmanModal} />
				
				<div id="bubbles1"/>
				<div id="bubbles2"/>
				<div id="bubbles3"/>
				<Fish show={!this.state.showPacmanModal}/>
				<ScrollWrapper onWindowScroll={this.handleScroll}>
					<div id="introBackground">
						<div id="parallaxDarken"></div>
						<div id="sky" />
						<Grid fluid={true} className="scaleContainer">
							<RegularRow row={1} ColColors={['', '', CELL_GREY, CELL_GREY, CELL_BLUSH, CELL_AQUA]} />
							<HalfEndsRow row={2} ColColors={['', CELL_GREY, CELL_GREY_NO_ANIM, '', '', CELL_BLUSH, '']} handlePacmanClick={this.handlePacmanClick} />
							<RegularRow row={3} ColColors={['', '', CELL_AQUA, '', CELL_NO_ANIM, '']} />
							<HalfEndsRow row={4} ColColors={['', CELL_AQUA, CELL_AQUA, CELL_GREY, '', '', '']} />
							<RegularRow row={5} ColColors={['', CELL_AQUA, '', '', CELL_GREY, '']} />
							<HalfEndsRow row={6} ColColors={['', '', CELL_AQUA, CELL_AQUA, CELL_BLUSH, CELL_GREY, '']} />
							<RegularRow row={7} ColColors={['', '', '', '', '', '']} darker={true}/>
						</Grid>
						<div id="contentBackground">
							<div id="bottomWaveDarkMargin"></div>
							<div id="gradientDisappearBubble"/>
							<PacmanSection onUserClick={this.handlePacmanClick} show={!this.state.showPacmanModal}/>
						</div>
					</div>
				</ScrollWrapper>
			</div>
		);
	}
}

class PacmanSection extends Component{
	constructor(props){
		super(props);
		
		this.onClick = this.onClick.bind(this);
	}
	onClick(e){
		this.props.onUserClick(e);
	}
	render(){
		if (!this.props.show) {
			return null;
		}
		return(
			<section id="pacmanSection">
				<div>
					<div id="pacmanSectionBubble">
					</div>
					<div id="animatedPacmanContainer" onClick={this.onClick}>
						<div id="animatedPacmanTop">
							<div id="animatedPacmanEye"></div>
						</div>
						<div id="animatedPacmanBottom"></div>
					</div>
					<ChatBubble chat="Click me to play !!!" showImage={false}/>
				</div>
			</section>
		);
	}
}

class ChatBubble extends Component{
	constructor(props){
		super(props);
	}
	render(){
		return(
			<div id={this.props.assignId} className="chatBubbleContainer">
				<div className="chatBubbleText">{this.props.chat}</div>
				{this.props.showImage && <div className="chatBubbleImage" >
					<div className="chatBubbleImg"/>
					<div className="chatBubbleImg"/>
					<div className="chatBubbleImg"/>
					<div className="chatBubbleImg"/>
					<div className="chatBubbleImg"/>
					<div className="chatBubbleImg"/>
					<div className="chatBubbleImg"/>
					<div className="chatBubbleImg"/>
				</div>}
			</div>
		);
	}
}

class ShortcutCupcake extends Component{
	constructor(props){
		super(props);
	}
	render(){
		return <span className='shortcutSpan'>
					<a id='shortcutCupcakeLink'>
					</a><div id='shortcutCupcakeDiv' className='shortcutDiv'></div>
			   </span>;
	}
}

class ShortcutPacman extends Component{
	constructor(props){
		super(props);
		
		this.onClick = this.onClick.bind(this);
	}
	onClick(e){
		this.props.onUserClick(e);
		//<div id='shortcutPacmanDiv' className='shortcutDiv'></div>
	}
	render(){
		return <span className='shortcutSpan' onClick={this.onClick}>
					<a id='shortcutPacmanLink'>
						<div id="shortcutPacmanDiv" className="shortcutDiv" onClick={this.onClick}>
							<div id="shortcutPacmanAnimatedTop">
								<div id="shortcutPacmanEye"/>
							</div>
							<div id="shortcutPacmanAnimatedBottom"></div>
						</div>
					</a>
					<ChatBubble assignId="chat-pacman" chat="" showImage={true}/>
			   </span>;
	}
}

class MainDescription extends Component{
	render(){
		return (
		<div className="mainDescContainer">
			<section className="mainDesc">
				<h2>An Implementation of </h2>
				<h1>PACMAN in JAVASCRIPT</h1>
				<div className="scallopedEdges top"></div>
				<p>Click on the Pacman below to start.</p> 
				<p>Change the ghost's behaviour to aggressive for a harder workout. </p>
				<p>Enjoy!</p>
				<div className="scallopedEdges bottom"></div>
			</section>
		</div>);
	}
}

class DialogPacman extends Component{
	constructor(props){
		super(props);
		
		this.state = ({show : false});
		
		this.hideModal = this.hideModal.bind(this);
	}
	componentWillReceiveProps(nextProps){
		this.setState({'show' : nextProps.show});
	}
	hideModal(e) {
		this.props.onUserHideModal();
	}
	render() {
		return (
				<Modal
				  {...this.props}
				  show={this.state.show}
				  onHide={this.hideModal}
				  dialogClassName="pacman-modal"
				>
					<Modal.Header closeButton>
					</Modal.Header>
					<Modal.Body>
						<PacmanApp />
					</Modal.Body>
					<Modal.Footer>
					</Modal.Footer>
				</Modal>
		);
	}
}

class Fish extends Component{
	constructor(props){
		super(props);
	}
	componentDidUpdate(){
		// If we have just hid the fish on modal show
		// we need to make sure fish is animated again if user is at the right scroll position
		//detectScrollPosition();
	}
	render(){
		if (!this.props.show) return null;
		
		return(
			<div id="fish" className="fish">
				<div id="fish-direction" className="fish-direction">
					<div className="fishTail"/>
					<div className="fishBody"/>
					<div className="fishFin"/>
					<div className="fishGill"/>
				</div>
				<ChatBubble assignId="chat-fish" chat="" showImage={true}/>
			</div>
		)
	}
}

export default App;
