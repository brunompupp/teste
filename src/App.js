import React,{useState,useEffect} from 'react';
import api from './services/api';
import qs from 'qs';
import axios from 'axios';

function App() {
 const [client_id,setClientId] = useState();
 const [redirect_uri, setUri] = useState();
 const [code, setCode] = useState();
 const [client_secret, setSecret] = useState();
 const [token, setToken] = useState();
 const [user_id, setUserId] = useState();
 const [linkAuth, setlinkAuth] = useState();
 const [grant_type, setType] = useState('authorization_code')

const geraCodigo = async(e)=>{
  e.preventDefault();
  setlinkAuth(`https://www.instagram.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=user_profile,user_media&response_type=code`);

}

const geraToken = async(e)=>{
  e.preventDefault();
  console.log(client_id)
  console.log(client_secret)
  console.log(redirect_uri)
  console.log(code)
  console.log(grant_type)
  const resposta = await axios({
    method: 'post',
    url: 'https://api.instagram.com/oauth/access_token',
    data: qs.stringify({
      client_id,
      client_secret,
      redirect_uri,
      code,
      grant_type
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  })
  //const resposta = await api.post('/', {client_id,client_secret,redirect_uri,code,grant_type});

  console.log(resposta)

}

 useEffect(()=>{

 },[])

  return (
    <div className="App">
      <form onSubmit={geraCodigo}>
        <input type="text" placeholder="Cliente iD" onBlur={e => setClientId(e.target.value)}/>
        <input type="text" placeholder="URI" onBlur={e => setUri(e.target.value)}/>
        <button type="submit">Gerar Codigo</button>
      </form>


      <div className="frame">
        {linkAuth && <a href={linkAuth} target="_blank" rel="noopener noreferrer">Link</a>}
      </div>

      <div className="token">
        <form onSubmit={geraToken}>
          <input type="text" value={client_id} placeholder="Cliente ID" onBlur={e => setClientId(e.target.value)}/>
          <input type="text" placeholder="Client Secret" onBlur={e => setSecret(e.target.value)}/>
          <input type="text" placeholder="Redirect URI" value={redirect_uri} onBlur={e => setUri(e.target.value)}/>
          <input type="text" placeholder="URL gerada" onBlur={e => setCode(e.target.value)}/>

          <button type="submit">Gerar Token</button>
        </form>
      </div>
    </div>
  );
}

export default App;
