function acionarBotao() {

    var txtUsuario = document.getElementById('txtUsuario').value;
    var txtSenha = document.getElementById('txtSenha').value;


  if (txtUsuario == "")
    {

        alert("Preencha o Ususario, campo está incompleto!!");

    }
   
    else if (txtSenha == "")
    {
        alert("Preencha a Senha!!")
    }
   
    if (txtUsuario == "adm.10@outlook.com" && txtSenha == "JS_10") {
 alert("Login Concluido!")
       window.location.href = 'login.html';

    }
    else
    {
        alert("Incorreto o login!!")
       
    }

 
}