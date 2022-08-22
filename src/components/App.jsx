import React, { Component } from 'react';
import logo from '../assets/images/logo.svg';
import { ethers } from 'ethers';
const axios = require('axios').default;

// TODO: 
// 1. replace alert to inpage message.
// 2. Call joint mining api
// 3. UI design & update.
// 4. axios request url should be configurable.

class App extends Component {
    btnhandler = async () => {
      if (!window.ethereum) {
        alert('install metamask extension!')
        return
      }

      // const addr = await window.ethereum.request({method: "eth_requestAccounts"})
  
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      window.ethereum.enable();
      const signer = provider.getSigner();
      const messageToSign = "Verify me on SAO joint mining!";
      const signature = await signer.signMessage(messageToSign);
      const signerAddr = await ethers.utils.verifyMessage(messageToSign, signature)
      // validate address if in sao joint mining.
      const {data} = await axios.get(`https://api.sao.network/sao-admin/api/admin/getUserDetailByAddress?address=${signerAddr}`, {
        headers: {
          'Authorization': 'Bearer 9GMjzTRtkK6DdqqdenOeJ7FIhHS2ghUV34D'
        }
      });
      if (data.code == "200") {
        const queryParam = new URLSearchParams(window.location.search);
        const discordUserId = queryParam.get("user");
        axios.post(`https://api.sao.network/discord/verify`, {
          discordUserId: discordUserId,
          roles: data.data.joinedProductList
        })
        .then(res => {
          alert('verify succeed. grant roles.');
          console.log(res);
        }).catch(e => alert(e))
      } else {
        alert("validate address failed.", data.msg);
      }
    };

    render() {
        return (
            <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" onClick={this.btnhandler}/>
              <h1 className="App-title">Welcome to React</h1>
            </header>
            <p className="App-intro">
              To get started, edit <code>src/App.js</code> and save to reload.
            </p>
          </div>
        );
    }
} 

export default App;
