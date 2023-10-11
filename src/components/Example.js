import React, { Component } from 'react'
import ParticlesBg from 'particles-bg'

class Example extends Component {
  render() {
    return (
      <>
        <ParticlesBg
          color={["#ffffff", "#1b83cf", "#1ecbb6", "#cb1e46"]}
          type="cobweb"
          bg={Object}
          num={120} />
      </>
    )
  }
}

export default Example;