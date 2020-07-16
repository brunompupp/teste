import React,{useState,useEffect} from 'react';
import api from './services/api';
import qs from 'qs';
import axios from 'axios';

function App() {
 const [client_id,setClientId] = useState('');
 const [redirect_uri, setUri] = useState('');
 const [code, setCode] = useState('');
 const [client_secret, setSecret] = useState('');
 const [token, setToken] = useState('');
 const [user_id, setUserId] = useState('');
 const [linkAuth, setlinkAuth] = useState('');
 const [refresh, setRefresh] = useState('');
 const [tokenAntigo, setTokenAntigo] = useState('');
 const [expiraNew, setExpiraNew] = useState('');
 const [erro, setErro] = useState('');

const geraCodigo = async(e)=>{
  e.preventDefault();
  setlinkAuth(`https://www.instagram.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=user_profile,user_media&response_type=code`);

}

const geraToken = async(e)=>{
  e.preventDefault();
  if(!client_secret || !client_id || !redirect_uri || !code){
    setErro('Preencha todas as informações para continuar');
    return alert('Preencha todas as informações para continuar')
  }
  let grant_type = 'authorization_code';
  let {data} = await axios({
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
  setUserId(data.user_id);

  let access_token = data.access_token;
  
  grant_type= "ig_exchange_token";
  let dados = await api.get(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${client_secret}&access_token=${access_token}`)
  /* let {data} = await axios({
    method: 'get',
    url: 'https://api.instagram.com/oauth/access_token',
    data: qs.stringify({
      grant_type,
      client_secret,
      access_token,
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  }) */
  setToken(dados.data.access_token);
  let expira = dados.data.expires_in;
  console.log(dados,expira)

}


const refreshToken = async(e)=>{
  e.preventDefault();
  try{
    let data = await api.get(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${tokenAntigo}`)

    console.log('refresh', data);
    setRefresh(data.access_token);
    setExpiraNew(data.expires_in)
    
  }catch(e){
    setRefresh('Token inválido, verifique se está correto, ou tente gerar um novo!');
    //IGQVJXbVRYVjlSN3JhMWFzQUNlemxpbEdHeDVYUlZAsdVAtd29NQzVWOENQZAFk4ZAjFneGp4WUVCVmN1WU5OcUtBZAkJRWGJaanh6MXIwN1ZAtdzdya253aV9fLVVPVEFYbXJ1QlRYUzVB
    console.log(e)
  }


}
const setUrl = (url)=>{
  let newUrl = url.split('code=');
  newUrl = newUrl[1].split('#_');
  console.log('url: ',newUrl[0])
  setCode(newUrl[0]);
}

 useEffect(()=>{

 },[])

  return (
    <div className="App">
      <header>
        <h1>Gerar Token INSTAGRAM</h1>
      </header>
      <form onSubmit={geraCodigo}>
        <input type="text" placeholder="Cliente iD" onBlur={e => setClientId(e.target.value)}/>
        <input type="text" placeholder="URI" onBlur={e => setUri(e.target.value)}/>
        <button type="submit">Gerar Codigo</button>
      </form>


      <div className="frame teste">
        {linkAuth && <a href={linkAuth} target="_blank" rel="noopener noreferrer">Link</a>}
      </div>

      <div className="token">
        <form onSubmit={geraToken}>
          <input type="text" value={client_id} placeholder="Cliente ID" onBlur={e => setClientId(e.target.value)}/>
          <input type="text" placeholder="Client Secret" onBlur={e => setSecret(e.target.value)}/>
          <input type="text" placeholder="Redirect URI" value={redirect_uri} onBlur={e => setUri(e.target.value)}/>
          <input type="text" placeholder="URL gerada" onBlur={e => setUrl(e.target.value)}/>

          <button type="submit">Gerar Token</button>
        </form>
      </div>

      <div className="resultado">
        <div className="group">
          <label htmlFor="token">Seu Token</label>
          <input type="text" id="token" value={token}/>
        </div>


        <div className="group">
          <label htmlFor="user">Seu User ID</label>
          <input type="text" id="user" value={user_id}/>
        </div>

      </div>


      <div className="refresh">
        <h2>Refresh</h2>

        <form onSubmit={refreshToken}>
          <input type="text" placeholder="Token Antigo" onChange={e=> setTokenAntigo(e.target.value)}/>

          <button type="submit">Refresh Token</button>

        </form>

        <div className="resultado-refresh">
          <p><b>Token: </b>{refresh}</p>
          <p><b>Expira: </b> {expiraNew}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
