import React, { Component } from "react"
import Particles from 'react-particles-js';
import Navigation from "./Navigation"; 
import ImageLinkForm from "./ImageLinkForm";
import Rank from "./Rank";
import './App.css';
import SignIn from "./SignIn";
import FaceRcognition from "./FaceRecognition"
import Register from "./Register"


      

const particlesOptions={
    particles: {
      number: {
        value: 200,
        density: {
          enable: true,
          value_area: 800
        }
      }
    },
    line_linked: {
        enable: true,
        distance: 100,
        color: '#fff',
        opacity: 1,
        width: 1
      },
    move: {
        enable: true,
        speed: 2,
        direction: 'none',
        random: false,
        straight: false,
        out_mode: 'out',
        bounce: false,
        attract: {
          enable: false,
          rotateX: 3000,
          rotateY: 3000
        }
      },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: true,
          mode: 'repulse'
        }
      }

        },
    modes: {   
        repulse:{
          distance: 400,
          duration: 0.4
        },
        

      },

};
             
const initialState={
      input:"",
      imageUrl:"",
      box:{},
      route:"signin",
      isSignedIn:false,
      user:{
        id:"",
        name:"",
        email:"",
        entry: 0,
        joined:""
        }
      }

class App extends Component {
  constructor(){
    super();
    this.state=initialState
  }
      

  loadUser=(data)=>{ 
    this.setState({user:{
      id:data.id,
      name:data.name,
      email:data.email,
      entry:data.entry,
      joined:data.joined

      }})
  }


calculateFaceLocation=(data)=>{
 const clarifaiFace= data.outputs[0].data.regions[0].region_info.bounding_box
 const image=document.getElementById("inputimage")
 const width = Number(image.width);
 const height=Number(image.height);
 return{
  leftCol:clarifaiFace.left_col*width,
  topRow:clarifaiFace.top_row*height,
  rightCol:width-(clarifaiFace.right_col*width),
  bottomRow:height-(clarifaiFace.bottom_row*height)

 }
}

displayFaceBox=(box)=>{
  console.log(box)
  this.setState({box: box});

}

onInputChange=(event)=>{
  this.setState({input: event.target.value});
}

onSubmit=()=>{
  this.setState({imageUrl: this.state.input});
    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response=>response.json())
    .then(response => {
      if (response) {
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user,{entry:count}))
            
          })
          .catch(console.log)
        }

         this.displayFaceBox(this.calculateFaceLocation(response))
      })
    .catch(err => console.log(err))
}

onRouteChange=(route)=>{
  if(route==="signout"){
    this.setState(initialState)
  }else if(route==="home"){
    this.setState({isSignedIn:true})
  }

  this.setState({route: route});
}


  render(){
    const{isSignedIn,imageUrl,route,box} = this.state;
    return(
      <div className="App">
         <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === "home"
          ? <div>
              <Rank
                name={this.state.user.name}
                entry={this.state.user.entry}
              />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onSubmit={this.onSubmit}
              />
              <FaceRcognition box={box} imageUrl={imageUrl} />
            </div>
          : (
             route === 'signin'
             ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
             : <Register loadUser={this.loadUser} 
                          onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}



export default App;