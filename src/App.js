import React, { Component } from 'react';
import {Container, Col, Alert, Row, Button} from 'reactstrap';
import firebase from './utils/secrets';
import SearchInput from './components/searchTypeAhead';
import computeDummyItems from './utils/computeDummyItems';
import arrayMove from './utils/arrayMove';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


class App extends Component {

  state = {
    items:[],
    activeIndex:0
  }

  componentDidMount() {
    let key = window.localStorage.getItem("key");
    if(!key) {
      key = Math.random().toString(36).replace(/[^a-z]+/g,"");
      window.localStorage.setItem("key", key);
    }
    const db = firebase.firestore();
    db.settings({
      timestampsInSnapshots: true
    });
    this.itemsRef = db.collection("items").doc(key);
    this.itemsRef.get().then(doc => {
      if(doc.exists) {
        let {items} = doc.data();
        let dummyItems = computeDummyItems(items);
        this.setState({
          items: dummyItems,
          activeIndex:items.length
        })
      }else {
        this.itemsRef.set({items:[]})
        this.setState({
          items:computeDummyItems([]),
          activeIndex:0
        })
      }
    }).catch(console.error);
    // console.log(ref);
  }

  dragged = null;
  draggedIndex = null;

  renderLists() {
    let finalList = [[], []];
    let {items} = this.state;
    finalList[0] = items.slice(0,5);
    finalList[1] = items.slice(5);
    return (
      <Container>
        <Row>
          <Col>
            {
              finalList[0].map((val, index) => {
                // eslint-disable-next-line
                switch(val.type) {
                  case "data":
                    return (
                      <Alert className="draggable-item" onDragStart={e => this.dragStartCapture(e)} onDragEnd={e => this.dragEnd()} onDragOver={e => this.dragOverCapture(e)} index={index} draggable={true} key={`holderone-${index}`}>
                        <div index={index} draggable={false} className="skill-holder">
                          <span index={index} draggable={false}>{index+1}{". "}{val.val}</span>
                          <Button className="close-btn" onClick={e => this.cancelBtnClick(e, index)}>
                              <svg color="black" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x-circle" style={{opacity:0.8}}><circle cx="12" cy="12" r="10"></circle><path d="M15 9l-6 6M9 9l6 6"></path></svg>
                          </Button>
                        </div>
                      </Alert>
                    );
                  case "input":
                    return (
                      <Alert id="input-container" index={index} key={`holderone-${index}`}>
                        <SearchInput ref={ref => this.inputEle = ref} onAdd={data => this.addRecord(data)} />
                      </Alert>
                    );
                  case "disabled":
                    return (
                      <Alert color="dark" className="disabled" index={index} key={`holderone-${index}`}>
                        <div className="skill-holder">
                          <span>{index+1}{". "}{"Enter a skill"}</span>
                        </div>
                      </Alert>
                    );
                }
                return null;
              })
            }
          </Col>
          <Col>
            {
              finalList[1].map((val, index) => {
                // eslint-disable-next-line
                switch(val.type) {
                  case "data":
                    return (
                      <Alert className="draggable-item" onDragStart={e => this.dragStartCapture(e)} index={5 + index} onDragOver={e => this.dragOverCapture(e)} onDragEnd={e => this.dragEnd()} draggable={true} key={`holdertwo-${index}`}>
                        <div index={index} className="skill-holder" draggable={false}>
                          <span index={index} draggable={false}>{index+6}{". "}{val.val}</span>
                          <Button className="close-btn" onClick={e => this.cancelBtnClick(e, index+5)}>
                            <svg color="black" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x-circle" style={{opacity:0.8}}><circle cx="12" cy="12" r="10"></circle><path d="M15 9l-6 6M9 9l6 6"></path></svg>
                          </Button>
                        </div>
                      </Alert>
                    );
                  case "input":
                    return (<Alert index={5 + index} id="input-container" key={`holdertwo-${index}`}>
                        <SearchInput ref={ref => this.inputEle = ref} onAdd={data => this.addRecord(data)} />
                      </Alert>);
                  case "disabled":
                    return (
                      <Alert color="dark" className="disabled" index={5 + index} key={`holdertwo-${index}`}>
                        <div className="skill-holder">
                          <span>{6+index}{". "}{"Enter a skill"}</span>
                        </div>
                      </Alert>
                    );
                }
                return null
              })
            }
          </Col>
        </Row>
      </Container>
    )
  }

  cancelBtnClick(e, index) {
    const {items, activeIndex} = this.state;
    let finalItems = items.slice(0,index).concat(items.slice(index+1)).filter(f => f.type === "data").map(val => val.val);
    this.setState({
      items:computeDummyItems(finalItems),
      activeIndex: activeIndex - 1
    }, () => {
      this.itemsRef.update({items:finalItems})
    })
  }

  addRecord(record) {
    const {items, activeIndex} = this.state;
    let finalItems = Array.from(items);
    finalItems[activeIndex] = {type:"data", val:record};
    let networkItems = finalItems.filter(f => f.type === "data").map(val => val.val);
    console.log(computeDummyItems(networkItems), networkItems )
    this.setState({
      items:computeDummyItems(networkItems),
      activeIndex: activeIndex + 1
    }, 
      () => {
        this.inputEle.focus();
        this.itemsRef.update({items:networkItems})
      }
    )
  }

  dragOverCapture(e) {
    e.stopPropagation();
    let event = e.nativeEvent;
    if(event.target.className.includes("alert")) {
      let new_index = Number(event.target.attributes["index"].value);
      if(this.draggedIndex !== new_index) {
        const {items} = this.state;
        this.setState({
          items:arrayMove(items, this.draggedIndex, new_index)
        }, () => {
          this.draggedIndex = new_index;
        })
      }
    }
  }

  dragStartCapture(e) {
    // console.log(e.nativeEvent);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.dropEffect = "move";
    e.dataTransfer.setData('text/html',"");
    this.dragged = e.nativeEvent.target;
    this.draggedIndex = Number(this.dragged.attributes["index"].value);
    // console.dir(this.draggedIndex);
  }

  dragEnd() {
    const {items} = this.state;
    let finalItems = items.filter(f => f.type === "data").map(val => val.val);
    this.itemsRef.update({items:finalItems});
  }

  render() {
    // const {items} = this.state;
    return (
      <Container id="main-container">
        <p>Things you're good at!</p>
        <Container id="inner-container">
          <p>The skills you mention here will help hackathon organisers in assesing you as a participant</p>
          {this.renderLists()}
        </Container>
      </Container>
    );
  }
}

export default App;
