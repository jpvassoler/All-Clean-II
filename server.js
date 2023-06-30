const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2');
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


//PASTAS

const path = require('path')
app.use('/pages/assets', express.static('/pages/assets'))
app.use('/images', express.static('images'))
app.use('/js', express.static('js'))
app.use('/pages', express.static('pages'))

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'all clean',
});

connection.connect(function (err) {
  if (!err){
    console.log("Conexão como o Banco realizada com sucesso!!!");
  } else{
    console.log("Erro: Conexão NÃO realizada", err);
  }
});

//--------INDEX--------

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

//--------LOGIN--------

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/pages/login.html')
})

//--------CADASTRO--------

app.get('/cadastro', (req, res) => {
  res.sendFile(__dirname + '/pages/cadastro.html')
})
 
//--------AGENDAMENTO--------

app.get('/agendamento', (req, res) => {
  res.sendFile(__dirname + '/pages/agendamento.html')
})

//--------CONTATO--------

app.get('/contato', (req, res) => {
  res.sendFile(__dirname + '/pages/contato.html')
})

//--------EFETUAR KIT--------

app.get('/efetuarkit', (req, res) => {
  res.sendFile(__dirname + '/pages/efetuarkit.html')
})

//--------ESQUECEU SENHA--------

app.get('/esqueceusenha', (req, res) => {
  res.sendFile(__dirname + '/pages/esqueceusenha.html')
})

//--------HISTORICO--------

app.get('/historico', (req, res) => {
  res.sendFile(__dirname + '/pages/historico.html')
})

//--------PAGAMENTO EFETUADO--------

app.get('/pagamentoefet', (req, res) => {
  res.sendFile(__dirname + '/pages/pagamentoefet.html')
})

//--------PAGINA INICIAL--------

app.get('/paginainicial', (req, res) => {
  res.sendFile(__dirname + '/pages/paginainicial.html')
})

//--------PERFIL--------

app.get('/perfil', (req, res) => {
  res.sendFile(__dirname + '/pages/perfil.html')
})

//--------RECUPERAR SENHA--------

app.get('/recuperarsenha', (req, res) => {
  res.sendFile(__dirname + '/pages/recuperarsenha.html')
})

//--------STATUS ATIVO--------

app.get('/statusativo', (req, res) => {
  res.sendFile(__dirname + '/pages/statusativo.html')
})

//--------STATUS INATIVO--------

app.get('/statusinativo', (req, res) => {
  res.sendFile(__dirname + '/pages/statusinativo.html')
})



//-----------------------LOGIN--------------------

app.post('/login', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  connection.query("SELECT * FROM usuario where email = '" + email + "'" , function (err, rows, fields) {
    console.log("Results:", rows);
    if (!err) {
      if (rows.length > 0) {
        
        if ( rows[0].senha === password) {
          
          res.redirect('http://localhost:3000/paginainicial');  

            } else {
             res.send('Senha incorreta');
            }
        
      } else {
        res.send('Login Falhou - Email não cadastrado');
      }
    } else {
      console.log("Falha no login", rows);
    }
  });
});

//---------------------CADASTRO----------------------------
  
app.post('/cadastro', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let name = req.body.name;
  let number = req.body.number;
  let rua = req.body.rua;
  let bairro = req.body.bairro;

  connection.query("INSERT INTO `usuario`(`nome`, `email`, `celular`, `rua`, `bairro`, `senha`) VALUES ('" + name + "', '" + email + "', '" + number + "', '" + rua + "', '" + bairro + "', '" + password + "')",
    function (err, rows, fields) {
      if (err) {
        console.log("Erro ao inserir no banco de dados:", err);
        res.send("Erro ao cadastrar usuário", err);
      } else {
        console.log("Usuário cadastrado com sucesso:", rows);
        res.redirect('http://localhost:3000/login');
      }
    }
  );
});

//----------------------MENSAGEM----------------------

app.post('/mensagem', (req, res) => {
  let email = req.body.email;
  let name = req.body.name;
  let assunto = req.body.assunto;
  let outroass = req.body.outroass;
  let mensagem = req.body.mensagem;

  connection.query("SELECT id_usuario FROM usuario WHERE usuario.email = '" + email + "'", (err, rows, fields) => {
    if (err) {
      console.log("Erro ao obter o ID do usuário:", err);
      return;
    }

    const id_usuario = rows[0].id_usuario;

    connection.query("INSERT INTO `ajuda`(`mensagem`, `outroass`, `assunto`, `id_usuario`) VALUES ('" + mensagem + "','" + outroass + "','" + assunto + "','" + id_usuario + "')", (err, rows, fields) => {
      if (err) {
        console.log("Falha ao enviar mensagem:", err);
      } else {
        console.log("Mensagem enviada com sucesso!");
      }
    });
  });
});



app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000!')
})