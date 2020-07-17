import React,{useState} from 'react';
import api from './services/api';
import qs from 'qs';
import moment from 'moment';
import axios from 'axios';

import './App.css';

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
  const [erroUrl, setErroUrl] = useState('');
  const [erroToken, setErroToken] = useState('');
  const [erroRefresh, setErroRefresh] = useState('');

  const geraCodigo = async(e)=>{
    e.preventDefault();
    console.log(client_id, redirect_uri)
    if(!client_id || !redirect_uri){
      if(linkAuth){
        setlinkAuth('')
      }
      setErroUrl('Preencha os campos para continuar!')
      return;
    }
    setlinkAuth(`https://www.instagram.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=user_profile,user_media&response_type=code`);
    return
  }

  const geraToken = async(e)=>{
    e.preventDefault();
    if(!client_secret || !client_id || !redirect_uri || !code){
      setErroToken('Preencha todos os campos para continuar');
      return
    }
    let grant_type = 'authorization_code';


    try{
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
      setUserId(data.user_id);
      let access_token = data.access_token;
      grant_type= "ig_exchange_token";
      setErroToken('');


      try{
        let dados = await api.get(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${client_secret}&access_token=${access_token}`)
        setToken(dados.data.access_token);
        let expira = dados.data.expires_in;
        console.log(dados,expira)
        setErroToken('');
      }catch(e){
        console.log(e)
        setErroToken('Não foi possível concluir a autenticação, verifique se todas as informações estão corretas.');  
      }


      
    }catch(e){
      console.log(e);
      setErroToken('Não foi possível concluir a autenticação, verifique se todas as informações estão corretas.');
      return
    }

  }


  const refreshToken = async(e)=>{
    e.preventDefault();
    if(!tokenAntigo){
      setErroRefresh('Insira seu token antigo para gerar um novo!');
      return
    }
    try{
      let data = await api.get(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${tokenAntigo}`)

      console.log('refresh', data.data.expires_in, data.data.access_token);
      setRefresh(data.data.access_token);
      setExpiraNew(moment().seconds(data.data.expires_in).format('DD/MM/yyyy'));


      setErroRefresh('');
      
    }catch(e){
      setErroRefresh('Token inválido, verifique se está correto, ou tente gerar um novo!');
      //IGQVJXbVRYVjlSN3JhMWFzQUNlemxpbEdHeDVYUlZAsdVAtd29NQzVWOENQZAFk4ZAjFneGp4WUVCVmN1WU5OcUtBZAkJRWGJaanh6MXIwN1ZAtdzdya253aV9fLVVPVEFYbXJ1QlRYUzVB
      console.log(e)
    }


  }
  const setUrl = (url)=>{
    if(!url){
      return
    }
    try{
      let newUrl = url.split('code=');
      newUrl = newUrl[1].split('#_');
      console.log('url: ',newUrl[0])
      setCode(newUrl[0]);

    }catch(e){
      setCode(url);

      console.log(e)
    }
  }

  return (
    <div className="App">
      <header>
        <h1>Gerar Token INSTAGRAM</h1>
      </header>

      <div className="gera-url">
        <h2>Gerar Url com o código de acesso</h2>
        <form onSubmit={geraCodigo}>
          {erroUrl && <p className="erro">{erroUrl}</p>}
          <input type="text" placeholder="Cliente iD" onChange={e => setClientId(e.target.value)}/>
          <input type="text" placeholder="URI" onChange={e => setUri(e.target.value)}/>
          <button type="submit">Gerar Codigo</button>
        </form>

        
        
        {linkAuth && <div className="linkUrl"><a href={linkAuth} target="_blank" rel="noopener noreferrer">Link</a></div>}
        

      </div>

      <div className="gera-token">
        
        <h2>Gerar Token de Longa Duração</h2>
        <p>O token de longa duração expira em 60 dias.</p>
        
        <form onSubmit={geraToken}>
          {erroToken && <p className="erro">{erroToken}</p>}
          <input type="text" value={client_id} placeholder="Cliente ID" onChange={e => setClientId(e.target.value)}/>
          <input type="text" placeholder="Client Secret" onChange={e => setSecret(e.target.value)}/>
          <input type="text" placeholder="Redirect URI" value={redirect_uri} onChange={e => setUri(e.target.value)}/>
          <input type="text" placeholder="URL gerada" onChange={e => setUrl(e.target.value)}/>

          <button type="submit">Gerar Token</button>
        </form>

      
        {token && <div className="resultado"><p className="token">Aqui está seu Token:</p><p>{token}</p></div>}
        {user_id && <div className="resultado"><p className="user">Aqui está seu User ID:</p><p>{user_id}</p></div>}
      
      </div>

      <div className="refresh">
        <h2>Atualizar seu Token expirado</h2>
        <form onSubmit={refreshToken}>
          <input type="text" placeholder="Token Antigo" onChange={e=> setTokenAntigo(e.target.value)}/>

          <button type="submit">Refresh Token</button>

        </form>

        {erroRefresh && <p className="erro">{erroRefresh}</p>}

        {refresh && <div className="resultado-refresh"><p className="token"><b>Aqui está seu novo Token: </b></p><p>{refresh}</p></div>}
        {expiraNew&& <div className="resultado-refresh"><p className="token"><b>Expira em: </b></p><p>{expiraNew}</p></div>}
      
      </div>
    </div>
  );
}

export default App;
