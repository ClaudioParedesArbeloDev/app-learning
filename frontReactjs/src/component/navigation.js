import React, { Component } from 'react'
import axios from 'axios'

export default class navigation extends Component {

    async componentDidMount(){
        const res = await axios.get('http://localhost:4000/api/users');
        console.log(res)
    }
  render() {
    return (
      <div>
        Navigation
      </div>
    )
  }
}
