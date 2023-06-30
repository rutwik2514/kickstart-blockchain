import React from 'react'
import Header from './header'
import { Container } from 'semantic-ui-react'
import "semantic-ui-css/semantic.min.css";

function Layout(props) {
  return (
   <Container style = {{marginTop : '10px'}} >
    <Header />
    {props.children}
    <h1>I am footer</h1>
   </Container>
  )
}

export default Layout