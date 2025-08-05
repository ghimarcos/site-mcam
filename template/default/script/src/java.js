/*******************************************************************
 * Copyright (C) 2006 Thiago Caetano
  ************************
  thiagocae @ gmail.com
********************************************************************/

// Gerador de Classes
function Class(props) {
	var F = function () {};
	F.prototype = props;
	F = new F;
	if(typeof F.__construct == 'function') { 
		F.__construct();
	}
    return F;
};

/********************************************************
* Produtos
********************************************************/
var Produtos = Class({
	__construct: function(){
		this.tempo = false;
		this.imagem = false;
		this.tempofoto = false;
		this.sub_ativo = false;
	},
	PosicaoMostra: function(){
		var central = MyLib.CentralArea(500,380);
		var pos = MyLib.getScrollXY();
		var topo = central[1]+(pos[1]-110);
		$('#mostra_produto').css('top', topo+'px');
		this.tempo=setTimeout('Produtos.PosicaoMostra()',100);
	},
	// Abre o box para editar o tamanho
	Ver: function(cod,comprar){
		var mais = "";
		this.PosicaoMostra();
		MyLib.Aguarde(1);
		if(comprar) mais += "&esconde_comprar=1";
		$.ajax({
			url : SUBPASTA+'/index.php',
			data: "ajax=1&t=produtos&cod="+cod+mais,
			type: 'GET',
			success: function(t){
				var texto = MyLib.decode(t);
				$('#mostra_produto').html(texto);
				$('#mostra_produto').show();
				MyLib.Aguarde(0);
			}
		});
		return false;
	},
	// Comprar
	Comprar: function(cod){
		// ve se colocou a mensagem configurada
		if($('#opcao_lista').length){
			if(!$F('opcao_personalizado')){
				$('html,body').animate({scrollTop: $('#opcao_lista').offset().top }, 500, function() { 
					VerForm.MostraErro('opcao_personalizado',TRAD("Campo Obrigatório"),0); 
				});
				return false;
			}
		}
		if($F('frete_person') && $F('total_carrinho')>0){
			if(!confirm('Esse produto utiliza um frete especial e somente pode ser enviado sozinho.\nAo continuar os produtos no seu carrinho serão removidos, podendo ser comprados depois em uma nova compra.\nDeseja continuar adicionando esse produto ao carrinho?')) return false;
		}
		document.produtos.submit();
		return false;
		// esse funcionava antes com o ajax
/*		var quantidade = $F('fquantidade');
		var cores = $F('fcores');
		var tamanhos = $F('ftamanhos');
		var sabores = $F('fsabores');
		var outros = $F('foutros');
		MyLib.Aguarde(1);
		$.ajax({
			url : SUBPASTA+'/index.php',
			data: "ajax=1&t=carrinho/adicionar/"+cod+"&quantidade="+quantidade+"&cores="+cores+"&sabores="+sabores+"&outros="+outros+"&tamanhos="+tamanhos,
			type: 'GET',
			success: function(t){
				var texto = MyLib.decode(t);
				$('#confirma_compra').html(texto);
				MyLib.Aguarde(0);
			}
		});*/
		return false;
	},
	// Fechar
	Fechar: function(){
		$('#mostra_produto').hide();
		clearTimeout(this.tempo);
	},
	// Mostra as fotos
	Fotos: function(produto,primeira){
		var altura = document.body.clientHeight;
		$('#fotos').css('height', altura+'px');
		MyLib.Aguarde(1);
		$.ajax({
			url : SUBPASTA+'/index.php',
			data: "ajax=1&t=produtos/"+produto+"/imagens/"+primeira,
			type: 'GET',
			success: function(t){
				var texto = MyLib.decode(t);
				$('#fotos').html(texto);
				Produtos.CentralFotos();
				$('#fotos').show();
				MyLib.Aguarde(0);
			}
		})
	},
	// Fechar Fotos
	FechaFoto: function(){
		//this.PosicaoMostra();
		Produtos.CentralFotos(0);
		$('#fotos').hide();
		$('#fotos').html("");
	},
	// Muda a foto
	VerFoto: function(imagem){
		document.fimg.src=imagem;
		this.imagem = true;
	},
	Alerta: function(){
		if(!this.imagem) return;
		MyLib.Aguarde(0);
	},
	ComprasOk: function(){
		$('#comprar').hide();
		$('#mostra_produto').hide();
	},
	Carrinho: function(){
		MyLib.Aguarde(0);
		location.href=SUBPASTA+"/carrinho";
	},
	// Centraliza as fotos
	CentralFotos: function(modo){
		if(modo){
			clearTimeout(this.tempofoto);
			if(this.tempofoto) this.CentralFotos(1);
		}
		else{
			var central = MyLib.CentralArea(400,400);
			var pos = MyLib.getScrollXY();
			var topo = central[1]+(pos[1]);
			$('#fotoscont').css({ 'top':topo+'px', 'left':central[0]+'px'});
			clearTimeout(this.tempofoto);
			//this.tempofoto=setTimeout('Produtos.CentralFotos(0)',100);
		}
	},
	// Mostra mais informa
	MaisInfo: function(cod,fecha){
		if(fecha){
			$("#maisinfo_"+cod).hide();
		}
		else{
			$("#maisinfo_"+cod).show();
		}
	},
	// Mostra mais informa
	MaisInfoSub: function(cod,fecha){
		if(fecha){
			//$("#maissub_mostra").html('').hide();
			$("#maissub_mostra").html('').hide();
		}
		else{
			var central = MyLib.CentralizaBox("#maissub_mostra");
			$("#maissub_mostra").html($("#maissub_"+cod).html()).css({'left': central[0]+'px', 'top':central[1]+'px' }).show();
		}
	},
	// Adicionar um sub-produto
	SubComprar: function(cod,ativa,atual){
		var form = document.produtos;
		var nome = "sub_produtos["+cod+"]";
		var ativo = form[nome].checked;
		if(ativa && atual){
			ativo = true;
		}
		else if(ativa){
			ativo = false;
		}
		else if(!ativa){
			var ativo = (form[nome].checked) ? false : true;
		}
		if(ativo){
			$("#color_"+cod).addClass("ativo");
			form[nome].checked = true;
			$('#sub_nome_botao_'+cod).html("Desmarcar");
		}
		else{
			$("#color_"+cod).removeClass("ativo");
			form[nome].checked=false;
			$('#sub_nome_botao_'+cod).html("Comprar junto");
		}
		this.MaisInfoSub(cod,1);
	},
	// Recomendar o produto
	Recomendar: function(cod){
		var larg = 400;
		var alt = 450;
		var tam = MyLib.Central(larg,alt);
		window.open(SUBPASTA+"/produtos/recomendar/"+cod,"recomendar","width="+larg+",height="+alt+",top="+tam[1]+",left="+tam[0]+",scrollbars=1");
	},
	// Escolhe a quantidade 
	Quantidade: function(quantidade,quantidade_maxima){
		quantidade = parseInt(quantidade, 10);
		quantidade_maxima = parseInt(quantidade_maxima, 10);
		if(quantidade>quantidade_maxima){
			var texto = TRAD("Só é possível comprar %qtd% produtos");
			texto = texto.replace("%qtd%",quantidade_maxima);
			alert(texto);
			quantidade = quantidade_maxima;
			document.produtos.fquantidade.value=quantidade
		}
	},
	// Marca uma opção para ser selecionada (das personalizadas)
	OpcaoPerson: function(cod,val,editar){
		document.produtos.opcao_personalizado.value=val;
		$('.opcoes_person a').each(function(){
			$(this).removeClass('on');
		});
		if(editar=='n'){
			$('#opcper'+cod).addClass('on');
		}
		else{
			$('#opcao_personalizado').removeClass('msg_person_on').addClass('msg_person_on').animate({'backgroundColor': '#F156B4'}, 500, function() { $('#opcao_personalizado').animate({'backgroundColor': '#FFFFFF'}, 500, function(){ $('#opcao_personalizado').removeClass('msg_person_on');  })});
			//
		}
		return false;
	},
	PaginacaoMigalhas: function(){
		$('.migalha').find('ul li').each(function() {
			$(this).bind('mouseenter',function(){ $(this).find('span').show(); }).bind('mouseleave',function(){ $(this).find('span').hide();});
		});
	},
	// Arruma o tamanho das fotos na lista, para evitar que fique muito larga 
	ArrumaTamanhoFotos: function(){
		$('.produto').find('.imgprod').each(function(){
			$(this).load(function(){ 
				var tam_max = 240;
				var tam = $(this).width();
				if(tam<tam_max) return;
				var coi = (tam/tam_max);
				tam = tam_max;
				var alt = parseInt($(this).height()/coi);
				$(this).css({'width': tam+'px', 'height': alt+'px'}); 
			});
		});
	},
});


/********************************************************
* Carrinho
********************************************************/
var Carrinho = Class({
	// Mudar a quantidade
	Quantidade: function(produto,quantidade,estoque){
		quantidade = parseInt(quantidade, 10);
		if(!quantidade){
			alert(TRAD("A quantidade precisa ser maior que 1"));
			quantidade = 1;
		}
		else if(quantidade>estoque){
			var texto = TRAD("Desculpe, mas só temos %estoque% produtos.");
			texto = texto.replace("%estoque%",estoque);
			alert(texto);
			quantidade = estoque;
		}
		else if(quantidade>QTD_MAX){
			var texto = TRAD("Só é possível comprar %qtd% produtos");
			texto = texto.replace("%qtd%",QTD_MAX);
			alert(texto);
			quantidade = QTD_MAX;
		}
		this.Ajax('quantidade',produto,quantidade);
	},
	// Remover
	Remover: function(produto){
		this.Ajax('remover',produto);
	},
	// Calcular frete
	Frete: function(){
		var destino = $F("cep_destino");
		if(!destino){
			alert(TRAD("Você precisa digitar um CEP"));
			return;
		}
		var peso = $F("peso");
		var msg_fora_area = TRAD("Desculpe, mas infelizmente não entregamos na sua região.");
		var msg_cep_invalido = TRAD("Desculpe, mas infelizmente não entregamos na sua região.");
		MyLib.Aguarde(1);
		$.ajax({
			url: SUBPASTA+'/index.php',
			data: "t=carrinho/frete&cepDestino="+destino+"&peso="+peso,
			type: 'POST',
			success: function(t){
				var texto = MyLib.decode(t);
				var entregador = Carrinho.Retorna('ENTREGADOR',texto);
				var pac = Carrinho.Retorna('PAC',texto);
				var prazo_pac = Carrinho.Retorna('PRAZO_PAC',texto);
				var sedex = Carrinho.Retorna('SEDEX',texto);
				var prazo_sedex = Carrinho.Retorna('PRAZO_SEDEX',texto);
				if(sedex==undefined) sedex = 0;
				if(pac==undefined) pac = 0;
				if(entregador==undefined) entregador = 0;
				if(pac || entregador){
					Carrinho.Ajax('listar','fretecompac',pac,sedex,entregador,prazo_pac,prazo_sedex);
					return;
				}
				var qb = texto.split('=');
				if(qb[0]=="erro" || (!sedex && !pac && !entregador)){
					if(qb[1]=="Fora_Area"){
						alert(msg_fora_area);
					}
					else{
						alert(msg_cep_invalido);
					}
					MyLib.Aguarde(0);
					return
				}
				else{
					if(qb[1]==0) qb[1] = "0.0";
					Carrinho.Ajax('listar','frete',qb[1]);
				}
			}
		});
	},
	// Retorna apenas o campo selecionado da busca de frete
	Retorna: function(campo,valores){
		var busca, qb, i, v;
		busca = new RegExp(campo, 'ig');
		if(!valores.match(busca)) return;
		qb = valores.split(';');
		for(i=0;i<qb.length;i++){
			if(qb[i]==undefined) continue;
			if(!qb[i].match(busca)) continue;
			v = qb[i].split('=');
			return v[1];
		}
		return;
	},
	Ajax: function(modo,produto,valor,valor2,valor3,valor4,valor5){
		var mais = "";
		if($F('cep_destino')) mais += "&cep_destino="+$F('cep_destino');
		if(modo=="quantidade"){
			if(!valor) valor=1;
			mais += "&quantidade="+valor;
		}
		if(produto=="frete") mais += "&frete="+valor;
		else if(produto=="fretecompac") mais += "&fretepac="+valor+"&fretesedex="+valor2+"&freteentregador="+valor3;
		else if(produto) mais += "&produto="+produto;
		if(valor4) mais += "&prazo_pac="+valor4;
		if(valor5) mais += "&prazo_sedex="+valor5;
		if(modo!="listar") MyLib.Aguarde(1);
		var mais = "&modo="+modo+mais;
		$.ajax({
			url : SUBPASTA+'/index.php',
			data: "ajax=1&t=carrinho"+mais,
			type: 'POST',
			success: function(t){
				var texto = MyLib.decode(t);
				if(texto=="vazio"){
					location.href=SUBPASTA+"/carrinho";
					return;
				}
				$('#carrinho').html(texto);
				if(produto=="fretecompac"){
					document.post.tipo_frete.value='pac';
				}
				MyLib.Aguarde(0);
			}
		});
	},
	// Abre o box com o historico
	VerHistorico: function(cod){
		var mais = "";
		//this.PosicaoHistorico();
		MyLib.Aguarde(1);
		$.ajax({
			url : SUBPASTA+'/index.php',
			data: "ajax=1&t=carrinho/historico/"+cod,
			type: 'GET',
			success: function(t){
				var texto = MyLib.decode(t);
				$('#historico').html(texto);
				$('#historico').show();
				MyLib.Aguarde(0);
			}
		});
		return false;
	},
	PosicaoHistorico: function(){
		var central = MyLib.CentralArea(500,280);
		var pos = MyLib.getScrollXY();
		var topo = central[1]+(pos[1]-110);
		$('#historico').css('top', topo+'px');
		this.tempo=setTimeout('Carrinho.PosicaoHistorico()',100);
	},
	// Fechar
	Fechar: function(){
		$('#historico').hide();
		clearTimeout(this.tempo);
	},
	// Cancelar
	Cancelar: function(cod){
		if(confirm(TRAD("Você tem certeza que deseja cancelar essa compra?"))){
			location.href=SUBPASTA+"/carrinho/historico/cancelar?cod="+cod;
		}
	},
	// Ativa outro frete
	AtivaFrete: function(modo){
		console.log(modo);
		var atual = $F('frete_sel_atual');
		if(atual==modo) return;
		$("#box_"+modo).addClass("mdfon");
		$('#ok_'+modo).show();
		$('#ok_'+atual).hide();
		$("#box_"+atual).removeClass("mdfon");
		document.post.tipo_frete.value=modo;
		document.post.frete_sel_atual.value=modo;
		// 
		var total = parseInt($F('total_sem_frete'))+parseInt($F(modo+'_valor'));
		$('#total_com_frete').html("&nbsp;R$ "+this.Preco(total));
	},
	// Ativa outro frete
	AtivaFreteCor: function(modo){
	},
	Preco: function(val){
		if(!val) return "0";
		val = ""+val;
		if(val.length==1) val = "00"+val;
		else if(val.length==2) val = "0"+val;
		//
		val = val.replace(/\D/gi,"");
		var dec = val.substr(-2, 2);
		var tam = val.length-2;
		var pri = val.substr(0, tam);
		if(!pri) pri = "0";
		return pri+","+dec;
	}
});




/********************************************************
* Logar
********************************************************/
var Login = Class({
	Entrar: function(){
		MyLib.Aguarde(1);
		var login = $F("flogin");
		var senha = $F("fsenha");
		var erro = $F("ferrol");
		if(erro){
			document.login.submit();
			return;
		}
		$.ajax({
			url: SUBPASTA+'/index.php',
			data: "ajax=1&t=login&flogin="+login+"&fsenha="+senha,
			type: 'POST',
			success: function(t){
				var texto = MyLib.decode(t);
				$('#login').html(texto);
				MyLib.Aguarde(0);
			}
		});
		return false;
	},
	Padrao: function(nome,mais){
		var form = document.login;
		var valor = form[nome].value;
		var padrao = form[nome].defaultValue;
		if(mais){
			if(!valor) form[nome].value=padrao;
		}
		else if(valor==padrao) form[nome].value='';
	}
});





/********************************************************
* Finalizar Compra
********************************************************/
var Comprar = Class({
	__construct: function(){
		this.ativo= false;
		this.forma_cartao_atual = "";
		this.ativofrete = false;
	},
	// Inicio
	Inicio: function(){
		// ve se ja esta logado
		if($F('flogado')==1) document.post.submit();
		else{
			var central = MyLib.CentralizaBox("#box_login");
			$("#box_login").css({'left': central[0]+'px', 'top':central[1]+'px' }).show();
			//location.href="#logar";
		}
		return false;
	},
	// Muda o endereco
	Endereco: function(tipo,valor){
		MyLib.Aguarde(1);
		$.ajax({
			url: SUBPASTA+'/index.php',
			data: "ajax=1&t=comprar/endereco&codigo="+valor,
			type: 'POST',
			success: function(t){
				var texto = MyLib.decode(t);
				$('#box_'+tipo).html(texto);
				MyLib.Aguarde(0);
			}
		});
	},
	Mostra: function(tipo){
		if(tipo==1) $('#box_login_info').hide();
		else $('#box_login_info').show();
	},
	// escolhe o modo da compra
	EscolherModo: function(valor){
		var form = document.comprar;
		if(valor==this.ativo) return;
		form.forma.value=valor;
		if(this.ativo){
			$('#md_'+this.ativo).removeClass('mdon');
			$('#fim_'+this.ativo).hide();
			$('#modo_'+this.ativo).show();
		}
		$('#md_'+valor).addClass('mdon');
		$('#fim_'+valor).show();
		$('#modo_'+valor).hide();
		this.ativo = valor;
		location.href="#"+valor;
	},
	// Mostra o parcelamento
	ModoCartao: function(valor){
		if(valor=='visaelectron'){
			$('#parcelamento').hide();
			$('#sem_parcelas').show();
		}
		else{
			$('#parcelamento').show();
			$('#sem_parcelas').hide();
		}
		$('#a_'+valor).addClass('on');
		if(this.forma_cartao_atual) $('#a_'+this.forma_cartao_atual).removeClass('on');
		document.comprar.forma_cartao.value=valor;
		this.forma_cartao_atual = valor;
		$('#botao_fim').show();
	},
	// Verifica se tem dados no cartao
	VerCartao: function(){
		var form = document.comprar;
		if(form.forma.value!='cielo') return true;
		//
		if(!form.forma_cartao.value){
			alert(TRAD("Você precisa escolher qual cartão será utilizado."));
			return false;
		}
		return true;
	},
	// escolhe o modo do frete
	EscolherFrete: function(valor,tipo,preco,pode){
		if(pode==0) return;
		var form = document.comprar;
		var campo = "forma_frete["+tipo+"]";
		var atual = form[campo].value;
		if(valor==atual) return;
		if(atual){
			$('#md_frete_'+tipo+'_'+atual).removeClass('mdon');
		}
		$('#md_frete_'+tipo+'_'+valor).addClass('mdon');
		form[campo].value=valor;
		//
		if(tipo=='cielo') this.NovoParcelamento(preco);
		if(tipo=='rede') this.NovoParcelamentoRede(preco);
	},
	// Faz novo parcelamento para o cartao de credito
	NovoParcelamento: function(valor){
		$.ajax({
			url: SUBPASTA+'/index.php',
			data: "ajax=1&t=comprar/novo_parcelamento/&val="+valor,
			type: 'POST',
			success: function(t){
				var texto = MyLib.decode(t);
				//alert(texto);
				$('#info_parcelamento').html(texto);
				document.comprar.forma_cartao.value='';
				$('#botao_fim').hide();
				Comprar.forma_cartao_atual = false;
			}
		});
	},
	// Faz novo parcelamento para o cartao de credito
	NovoParcelamentoRede: function(valor){
		$.ajax({
			url: SUBPASTA+'/index.php',
			data: "ajax=1&t=comprar/novo_parcelamento_rede/&val="+valor,
			type: 'POST',
			success: function(t){
				var texto = MyLib.decode(t);
				//alert(texto);
				$('#redeparcelas').html(texto);
			}
		});
	},
	// Abre o formulario para editar o endereco
	EditarEndereco: function(tipo){
		var n = 'end_mudou['+tipo+']';
		document.comprar[n].value=1;
		$('#info_'+tipo).hide();
		$('#edita_'+tipo).show();
		VerForm.VerCampos();
	},
	// Numero maximo de carateres do cartao
	CaracteresCartao: function(caracteres,texto){
		var form, tam, novo_texto, atual, i;
		form = document.comprar;
		atual = form.msg_cartao.value;
		tam = atual.length;
		if(tam>caracteres){
			novo_texto = "";
			for(i=0;i<caracteres;i++) novo_texto += atual[i];
			form.msg_cartao.value = novo_texto;
			tam = caracteres;
		}
		$('#msg_cartao_caracteres').html(texto.replace("%caracteres%","<b>"+(caracteres-tam)+"</b>"));
	}
});



/********************************************************
* Cadastrar
********************************************************/
var Cadastro = Class({
	__construct: function(){
		this.erro = new Object();
		this.loginat = "";
		this.cpfat = "";
	},
	// VE o CPF
	VerCPF: function(modo){
		VerForm.Limpa('cpf');
		if($F('cod')){
			if($F('cpf')==$F('cpf_old')) return VerForm.Correto('cpf');
		}
		var cpf = $F("cpf");
		if(!cpf) return VerForm.MostraErro('cpf',TRAD("Você precisa digitar um CPF/CNPJ"));
		if(this.cpfat==cpf){
			return VerForm.Correto('cpf');
		}
		this.cpfat = "";
		var msg_cpf_incorreto = TRAD("Esse CPF/CNPJ está incorreto.");
		VerForm.Carregando('cpf');
		$.ajax({
			url : SUBPASTA+'/index.php',
			data: "ajax=1&t=cadastro/vercpf&cpf="+cpf,
			type: 'POST',
			success: function(t){
				var texto = MyLib.decode(t);
				if(texto=="ok"){
					// tipo
 					var ncpf = MyLib.SoNum(cpf);
 					if(ncpf.length==11){
 						$('#campo_inscricao').hide();
 						$('#campo_rg').show();
 					}
 					else{
 						$('#campo_inscricao').show();
 						$('#campo_rg').hide();
 					}
					Cadastro.cpfat = cpf;
					VerForm.Correto('cpf');
				}
				else if(texto=="erro") VerForm.MostraErro('cpf',msg_cpf_incorreto);
			}
		});
	},
	// Inicio
	VerEmail: function(modo){
		VerForm.Limpa('email');
		if($F('cod')){
			if($F('email')==$F('email_old')){
				return VerForm.Correto('email');
			}
		}
		var email = $F("email");
		if(!email) return VerForm.MostraErro('email',TRAD("Você precisa digitar um e-mail"));
		if(this.loginat==email){
			return VerForm.Correto('email');
		}
		this.loginat = "";
		var msg_email_cadastrado = TRAD("Esse e-mail já está cadastrado");
		var msg_email_incorreto = TRAD("Esse e-mail está incorreto.");
		VerForm.Carregando('email');
		$.ajax({
			url : SUBPASTA+'/index.php',
			data: "ajax=1&t=cadastro/veremail&email="+email,
			type: 'POST',
			success: function(t){
				var texto = MyLib.decode(t);
				if(texto=="nao"){
					Cadastro.loginat = email;
					VerForm.Correto('email');
				}
				else if(texto=="tem") VerForm.MostraErro('email',msg_email_cadastrado);
				else if(texto=="erro") VerForm.MostraErro('email',msg_email_incorreto);
			}
		});
	},
	VerSenha: function(modo,anima){
		if(!anima) anima = 0;
		VerForm.Limpa('senha');
		var senha = $F('senha');
		var resenha = $F('resenha');
		if(!senha && $F('cod')) return;
		if(senha.length<5){
			return VerForm.MostraErro('senha',TRAD("A senha precisa ter no mínimo 5 caracteres"), anima);
		}
		if(modo==1 && senha!=resenha){
			document.post.resenha.value="";
			return VerForm.MostraErro('senha',TRAD("As duas senhas estão diferentes"), anima);
		}
		VerForm.Correto('senha');
		return 1;
	},
	// Envia os dados
	Enviar: function(){
		var erro = false, anima = 1;
		if($('#nome').length){
			VerForm.Limpa('nascimento');
			if(!this.Maior()){
				var texto = TRAD("Desculpe, mas não será possível continuar. Você é menor de %idade%");
				texto = texto.replace("%idade%",$F('MENOR'));
				VerForm.MostraErro('nascimento',texto, 1);
				return false;
			}
			var campos = new Array('nome','cpf');
			var cp = "";
			for(var i=0;i<campos.length;i++){
				cp = campos[i];
				if(!$F(cp)){
					VerForm.MostraErro(cp,TRAD("Campo Obrigatório"), anima);
					erro = true;
					anima = 0;
				}
				else if(VerForm.TemErro(cp, 1, 1)){
					erro = true;
					anima = 0;
				}
				else VerForm.Limpa(cp);
			}
		}
		if(!erro && $('#email').length){
			var campos = new Array('email');
			var cp = "";
			for(var i=0;i<campos.length;i++){
				cp = campos[i];
				if(!$F(cp)){
					VerForm.MostraErro(cp,TRAD("Campo Obrigatório"), anima);
					erro = true;
					anima = 0;
				}
				else if(VerForm.TemErro(cp, 1, 1)){
					erro = true;
					anima = 0;
				}
				else VerForm.Limpa(cp);
			}
			if(!erro && $('#senha').length){
				erro = (!this.VerSenha(1,1)) ? true : false;
				if(erro) anima = 0;
				else VerForm.Limpa('senha');
			}
		}
		if(!erro && $('#end_ficha_cod').length){
			//'end[1][cep]','end[2][cep]',
			var campos = new Array('end[1][responsavel]','end[1][rua]','end[2][rua]');
			for(var i=0;i<campos.length;i++){
				cp = campos[i];
				if(!this.Existe(cp)) continue;
				if(!$F(cp)){
					var nome = (i>2) ? TRAD("Endereço Pagamento") : TRAD("Endereço Entrega");
					var texto = TRAD("Você precisa digitar um %nome_campo%");
					texto = texto.replace("%nome_campo%",nome);
					VerForm.MostraErro(cp,texto, anima);
					erro = true;
					anima = 0;
					break;
				}
				else if(VerForm.TemErro(cp, 1, 1)){
					erro = true;
					anima = 0;
				}
				else VerForm.Limpa(cp);
			}
		}
		if(erro){
			//alert(TRAD("Você tem erros nos campos, verifique antes de enviar"));
			return false;
		}
		document.post.submit();
	},
	// Verifica se e maior
	Maior: function(){
		if($F('MENOR')=='0') return 1;
		var dia = MyLib.GetSelect('post','nascimento[Date_Day]');
		var mes = MyLib.GetSelect('post','nascimento[Date_Month]')-1;
		var ano = MyLib.GetSelect('post','nascimento[Date_Year]');
		var data = new Date();
		var hdia = data.getDate();
		var hmes = data.getMonth();
		var hano = data.getFullYear();
		var calc = hano - ano;
		if(hmes < mes) calc -= 1;
		else if(hmes == mes) {
			if(hdia < dia) calc -= 1;
		}
		return (calc>=$F('MENOR')) ? 1 : 0;
	},
	// Verifica o CEP
	VerificaCEP: function(cod){
		var nome = 'end['+cod+'][cep]';
		VerForm.Limpa(nome);
		var cep = document.post[nome].value;
		//var cep = $F(nome);
		cep = ''+MyLib.SoNum(cep);
		document.post[nome].value=cep;
		if(cep.length!=8){
			return VerForm.MostrErro(nome,TRAD("O CEP informado está incorreto"));
		}
		var msg_cep_nao_encontrado = TRAD("CEP não encontrado");
		VerForm.Carregando(nome);
		$.ajax({
			url : SUBPASTA+'/index.php',
			data: "t=cadastro/verifica_cep&cep="+cep+"&cod="+cod,
			type: 'POST',
			success: function(t){
				var texto = MyLib.decode(t);
				var qb = texto.split('=');
				if(qb[0]=="erro"){
					VerForm.MostrErro(nome,msg_cep_nao_encontrado);
					var mod = "end["+cod+"][rua]";
					texto = "<input type=\"hidden\" name=\""+mod+"\" id=\""+mod+"\" value=\"\" />\n";
				}
				else{
					var cp = 'end['+cod+'][mostra]';
					document.post[cp].value=1;
					VerForm.Correto(nome);
				}
				$('#tab_end_'+cod).html(texto);
			}
		});
	},
	// Envia os dados
	MudaSenha: function(){
		var erro = false;
		if(erro){
			alert(TRAD("Você tem erros nos campos, verifique antes de enviar"));
			return false;
		}
		document.post.submit();
	},
	// Deixa os dados de cobranca iguais aos de entrega
	MudaNome: function(frete_person){
		if(!$F('nome')){
			VerForm.MostraErro('nome',TRAD("Você precisa digitar o seu nome"));
		}
		else{
			VerForm.Correto('nome');
		}
		if(frete_person) return;
		if(!this.D(1,'responsavel')){
			var nome = document.post.nome.value;
			if(nome) this.D(1,'responsavel',nome)
		}
	},
	// Deixa os dados de cobranca iguais aos de entrega
	Iguais: function(){
		document.post.iguais.checked=false;
		var i, o, x, p, cp, erro_msg;
		i = "1";
		o = "2";
		//
		//(this.Existe('end[1][cep]') && !this.D(i,'cep')) || cep nao é mais obrigatorio
		if(!this.D(i,'rua') || !this.D(i,'numero')){
			erro_msg = TRAD("Campo Obrigatório");
			//if(this.Existe('end[1][cep]') && !this.D(i,'cep')) VerForm.MostraErro('end[1][cep]',erro_msg);
			if(!this.D('1','rua')) VerForm.MostraErro('end[1][rua]',erro_msg);
			if(!this.D('1','numero')) VerForm.MostraErro('end[1][numero]',erro_msg);
			alert(TRAD("Você precisa preencher os dados de entrega primeiro"));
			return false;
		}
		var campos = new Array("cep", "rua", "bairro", "cidade", "estado", "pais", "numero", "complemento");
		var linha = "";
		for(x=0;x<campos.length;x++){
			cp = campos[x];
			p = this.D(i,cp);
			this.D('2',cp,p);
		}
		VerForm.Limpa('end[2][rua]');
		//if(this.Existe('end[2][cep]')) VerForm.Limpa('end[2][cep]');
		VerForm.Limpa('end[2][numero]');
		return false;
	},
	// Verifica se existe o campo
	Existe: function(campo){
		if(typeof document.post[campo] != 'undefined') return 1;
	},
	// Pega os dados
	D: function(cod,campo,valor){
		var form = document.post;
		var campo = "end["+cod+"]["+campo+"]";
		if(!this.Existe(campo)) return;
		if(valor) form[campo].value=valor;
		else return form[campo].value;
	},
	// Procura o Endereco
	ProcuraEnderecoPorCep: function(tipo,form){
		var qb, form, texto, name, i;
		var cep = $F('end['+tipo+'][cep]');
		cep = ''+MyLib.SoNum(cep);
		VerForm.Limpa(cep);
		if(!cep){
			return VerForm.MostraErro('end['+tipo+'][cep]',TRAD("Você precisa digitar um CEP"));
		}
		else if(cep.length!=8){
			return VerForm.MostraErro('end['+tipo+'][cep]',TRAD("O CEP informado está incorreto"));
		}
		var erro_cep = TRAD('CEP não encontrado');
		MyLib.Aguarde(1);
		$.ajax({
			url: SUBPASTA+'/index.php',
			data: "ajax=1&t=cadastro/procura_end/cep&cep="+cep,
			type: 'POST',
			success: function(t){
				form = document[form];
				texto = MyLib.decode(t,1);
				texto = texto.split('\n');
				for(i=0;i<texto.length;i++){
					if(!texto[i]) continue;
					qb = texto[i].split('=');
					if(qb[0]=='erro'){
						alert(erro_cep);
						break;
					}
					if(qb[0]=='complemento' || qb[0]=='cep') continue;
					name = 'end['+tipo+']['+qb[0]+']';
					form[name].value = qb[1];
					VerForm.Limpa('end['+tipo+'][rua]');
					VerForm.Limpa('end['+tipo+'][responsavel]');
					VerForm.Limpa('end['+tipo+'][cep]');
					VerForm.Limpa('end['+tipo+'][numero]');
				}
				MyLib.Aguarde(0);
			}
		});
	},
	// Abre o box para procurar um cep
	BoxProcurarEnd: function(tipo,formname){
		if(this.tipo_end){
			this.CancelarBuscaCep();
		}
		this.tipo_end = tipo;
		this.formna = formname;
		$('#busca_cep_'+this.tipo_end).show();
	},
	// Procura um cep por endereco
	ProcurarCepPorEnd: function(){
		var qb, form, texto, name, i;
		var tipo = this.tipo_end;
		var uf = $F('busca_estado_'+tipo);
		var cidade = MyLib.encode($F('busca_cidade_'+tipo),1);
		if(!cidade){
			alert(TRAD('Você precisa digitar uma cidade antes de fazer a busca'));
			return;
		}
		var rua = MyLib.encode($F('busca_rua_'+tipo),1);
		if(!rua){
			alert(TRAD('Você precisa digitar uma rua antes de fazer a busca'));
			return;
		}
		MyLib.Aguarde(1);
		$.ajax({
			url: SUBPASTA+'/index.php',
			data: "ajax=1&t=cadastro/procura_end/end&rua="+rua+"&uf="+uf+"&cidade="+cidade+"",
			type: 'POST',
			success: function(t){
				texto = MyLib.decode(t,1);
				$('#resultado_busca_'+tipo).html(texto);
				$('#resultado_busca_'+tipo).show();
				VerForm.Limpa('end['+tipo+'][rua]');
				VerForm.Limpa('end['+tipo+'][responsavel]');
				VerForm.Limpa('end['+tipo+'][cep]');
				VerForm.Limpa('end['+tipo+'][numero]');
				MyLib.Aguarde(0);
			}
		});
	},
	// Procura um cep por endereco
	EnderecoCEP: function(cep,rua,bairro,cidade,estado){
		var name;
		form = document[this.formna];
		name = 'end['+this.tipo_end+'][cep]';
		form[name].value = cep;
		name = 'end['+this.tipo_end+'][bairro]';
		form[name].value = bairro;
		name = 'end['+this.tipo_end+'][cidade]';
		form[name].value = cidade;
		name = 'end['+this.tipo_end+'][estado]';
		form[name].value = estado;
		name = 'end['+this.tipo_end+'][rua]';
		form[name].value = rua;
		name = 'end['+this.tipo_end+'][pais]';
		form[name].value = 'BRA';
		this.CancelarBuscaCep();
	},
	// fecha o box
	CancelarBuscaCep: function(){
		$('#busca_cep_'+this.tipo_end).hide();
		$('#resultado_busca_'+this.tipo_end).hide();
		this.tipo_end = '';
		this.formna = '';
	},
	// Adiciona novos campos de lembretes
	AdicionaLembrete: function(){
		var atual = parseInt($F('total'),10);
		var prox = atual+1;
		var valor = $F('val_add_mais');
		var m = new RegExp('%COD%','g');
		valor = valor.replace(m,prox);
		valor = valor.replace("&lt;","<");
		valor += '<div id="add_mais_'+prox+'"></div>';
		$('#add_mais_'+atual).html(valor);
		document.post.total.value=prox;
	},
	// Remove o campo do lembrete
	RemoveLembrete: function(cod){
		var nome;
		var form = document.post;
		nome = 'l['+cod+'][quem]';
		form[nome].value='';
		nome = 'l['+cod+'][oque]';
		form[nome].value='';
	},
	// auto completa a rua, cidade, bairro
	Completa: function(campo){
		if(campo){
			loadScript(BASETPL+'/script/lib/jquery-ui-1.8.17.custom.min.js', function(){
				$('#'+FS(campo)).autocomplete({
					source: function(request, response){
						var info = Cadastro._Auto_Completa(campo,request,response);
						if(!info) return;
						$.ajax(info);
					},
					minLength: 1,
					focus : function(event, ui) {
						$(".forms-search-result").parents("ul").addClass("myClass");
						return false;
					},
					open : function(event, ui) {
						$(".forms-search-result").parents("ul").addClass("myClass");
					}
				});
			});
			return;
		}
		$('.auto_complete').each(function(){
			var id = $(this).attr('id');
			$(this).autocomplete({
				source: function(request, response){
					//
					var info = Cadastro._Auto_Completa(id,request,response);
					if(!info) return;
					$.ajax(info);
				},
				minLength: 1,
				focus : function(event, ui) {
					$(".forms-search-result").parents("ul").addClass("myClass");
					return false;
				},
				open : function(event, ui) {
					$(".forms-search-result").parents("ul").addClass("myClass");
				}
			});
		});
		return;
	},
	// Arruma os campos
	_Auto_Completa: function(id, request, response){
		var match = false, url, cidade, estado, bairro, rua;
		// pega o codigo
		match = id.match(/\[([a-z0-9]*)\]\[(bairro|cidade|estado|rua)\]/i);
		//
		estado = MyLib.encode($F('end['+match[1]+'][estado]'));
		bairro = MyLib.encode($F('end['+match[1]+'][bairro]'));
		cidade = MyLib.encode($F('end['+match[1]+'][cidade]'));
		rua    = MyLib.encode($F('end['+match[1]+'][rua]'));
		//
		if(match[2]=="rua" && (!estado || !cidade)) return;
		if(match[2]=="cidade" && (!estado || !cidade)) return;
		if(match[2]=="estado" && (!estado)) return;
		//
		return {
			url: SUBPASTA+'/index.php',
			dataType: 'json',
			type: 'POST',
			data: 't=cadastro/auto_complete&type=json&modo='+match[2]+'&bairro='+bairro+'&cidade='+cidade+'&estado='+estado+'&rua='+rua,
			success: function(data) {
				var val = $.map(data, function(item) {
					return {
						label: item.label,
						value: item.value
					}
				});
				response(val);
			}
		}
	}
});



/********************************************************
* Verificacao de formulario
* Feito em 27/01/12
* Ultima alteracao 31/01/12
********************************************************/
var VerForm = Class({
	__construct: function(){
		this.tempo_animacao = 1000;
		this.campo = new Object();
		this.ver_campos = new Object();
	},
	// Adiciona o campo de msg
	Init: function(id){
		var el = this._ConvID(id);
		if(!el) return;
		if(!el['div'].find('.cicon').length){
			el['div'].append('<div class="cicon"></div>');
		}
		if(!el['div'].find('.cmsg').length){
			el['div'].append('<div class="cmsg"></div>');
			el['div'].find('.cmsg').hide();
		}
		return el;
	},
	// Varre os campos procurando os que precisam verificar
	// tipos : numeros
	// tipos : numeros&pontos
	// tipos : letras
	// tipos : vazio
	VerCampos: function(){
		var modo, qb, qbc, qbd, qbe, i, md, acao, tipo, j, n, id, form, cp, el, tem = false;
		var modos = {
			'onchange' : 'change',
			'onmouseover' : 'mouseenter',
			'onmouseout' : 'mouseleave',
			'onfocus' : 'focus',
			'onblur' : 'blur'
		};
		$('form.form,comprar.form').find('.cinput').each(function(){
			// verifica se tem erro
			if($(this).find('.cmsg').length){
				id = $(this).find('input,textarea').attr('id');
				el = VerForm.Init(id);
				md = $(this).find('.cmsg').html();
				VerForm._MostraErro(id,md);
			}
			modo = $(this).attr('longdesc');
			if(!modo) return;
			tem = 1;
			// retira a longa desc
			$(this).attr('longdesc','');
			// id
			id = $(this).find('input,textarea').attr('id')
			// verifica as acoes
			qb = modo.split(',');
			for(i=0;i<qb.length;i++){
				qbc = qb[i].match(/([a-z|]*)\=(.*)/i);
				// se o padrao esta incorreto
				if(!qbc[1]) continue;
				// a acao
				qbe = qbc[1].split('|');
				// cada tipo de acao
				for(j=0;j<qbe.length;j++){
					acao = qbe[j];
					if(!modos[acao]) continue;
					acao = acao.replace(acao,modos[acao]);
					//
					qbd = qbc[2].split('|');
					if(qbd[0]=='vazio' || qbd[0]=='numeros'){
						VerForm.VerificaCampo($(this).find('input,textarea,select').attr('id'),acao,qbd[0]);
					}
				}
			}
		});
		if(tem){
			// verifica se tem o submit, se nao tiver, entao acrescenta
			if(!$('form.form,comprar.form').attr('onsubmit')){
				// nome do formulario
				$('form.form,comprar.form').bind('submit', function(){ return VerForm.Enviar();  });
			}
		}
	},
	// Adiciona o campo para 'escuta'
	VerificaCampo: function(id,acao,tipo){
		if(tipo=='vazio'){
			$(FS(id)).bind(acao, function(){ VerForm._Ver_Vazio(id); });
		}
		else{
			$(FS(id)).bind(acao, function(){ VerForm._Ver_Numeros(id); });
		}
		VerForm.ver_campos[id] = tipo;
	},
	// verifica se o campo tem algum erro ativo
	TemErro: function(id, mostrar_novamente, anima){
		var el = this.Init(id);
		if(!el) return;
		if(!el['div'].find('.ciconerro').length) return false;
		if(mostrar_novamente && anima){
			$('html,body').animate({scrollTop: $(el['id']).offset().top }, this.tempo_animacao, function(){
				VerForm._MostraMensagem(id);
			});
		}
		else if(mostrar_novamente){
			this._MostraMensagem(id);
		}
		return 1;
	},
	// faz a animaçao para mostrar a mensagem de erro
	MostraErro: function(id,mensagem, anima){
		var el = this.Init(id);
		if(!el) return;
		if(anima){
			this._MostraErro(id, mensagem);
			$('html,body').animate({scrollTop: $(el['id']).offset().top }, this.tempo_animacao, function(){ VerForm._MostraErro(id, mensagem); });
		}
		else{
			this._MostraErro(id, mensagem);
		}
	},
	// Mostra a mensagem de erro
	_MostraErro: function(id,mensagem){
		var el = this.Init(id);
		if(!el) return;
		$(el['id']).addClass('cerro');
		el['div'].find('.cicon').removeClass('ciconloading ciconok').addClass('ciconerro');
		if(mensagem){
			el['div'].find('.cmsg').html(mensagem);
			el['div'].find('.cicon').bind('mouseenter',function(){ VerForm._MostraMensagem(id); });
			this._MostraMensagem(id);
		}
	},
	// Limpa os erros
	Limpa: function(id){
		var el = this.Init(id);
		if(!el) return;
		$(el['id']).removeClass('cerro');
		el['div'].find('.cicon').removeClass('ciconerro ciconok ciconloading');
		el['div'].find('.cmsg').html("").hide();
		el['div'].find('.cicon').unbind('mouseenter');
	},
	// Mostra um icone de correto
	Correto: function(id){
		var el = this.Init(id);
		if(!el) return;
		this.Limpa(id);
		el['div'].find('.cicon').addClass('ciconok');
	},
	// Mostra o Loading de carregando
	Carregando: function(id){
		var el = this.Init(id);
		if(!el) return;
		el['div'].find('.cicon').addClass('ciconloading');
	},
	// Verifica todos os campos na hora do envio
	Enviar: function(){
		var id, erro = false, temerro = false, anima = 1;
		for(id in this.ver_campos){
			switch(this.ver_campos[id]){
				case "numeros":
					erro = this._Ver_Numeros(id, anima);
					if(erro){
						temerro = 1;
						anima = 0;
					}
					break;
				case "vazio":
					erro = this._Ver_Vazio(id, anima);
					if(erro){
						temerro = 1;
						anima = 0;
					}
					break;
			}
		}
		//
		if(temerro) return false;
		else return true;
	},
	// Verifica se o campo esta preenchido
	_Ver_Vazio: function(id, anima){
		if(!$F(id)){
			VerForm.MostraErro(id,TRAD("Campo Obrigatório"), anima);
			return true;
		}
		else{
			VerForm.Correto(id);
			return false;
		}
	},
	// Mostra a mensagem de erro
	_MostraMensagem: function(id){
		var el = this.Init(id);
		if(!el) return;
		el['div'].find('.cmsg').show();
		setTimeout(function(){ el['div'].find('.cmsg').fadeOut("slow"); },2000);
	},
	// Converte o ID
	_ConvID: function(id){
		var idn = '#'+FS(id);
		if($(idn).parent('div.cinput').length){
			this.campo[id] = {'id': idn, 'div': $(idn).parent('div.cinput')};
			return this.campo[id];
		}
		else return false;
	},
	// Verifica o campo com numeros
	_Ver_Numeros: function(id, anima){
		var erro = false;
		j = $F(id).replace(/[^0-9\.-]/g,'');
		if(!j && $F(id)){
			VerForm.MostraErro(id,TRAD("Esse valor está incorreto"), anima);
			erro = true;
		}
		else if(!j && !$F(id)){
			VerForm.MostraErro(id,TRAD("Campo Obrigatório"), anima);
			erro = true;
		}
		else VerForm.Correto(id);
		var el = VerForm._ConvID(id);
		form = $(el['id']).parentsUntil('form.form').parent('form.form').attr('name');
		document[form][id].value=j;
		return erro;
	}
});


/********************************************************
* Opcoes para o entregador personalizado
********************************************************/
var Entregador = Class({
	Inicia: function(estado, cidade, bairro, tipo){
		this.modo= "estadual";
		// seleciona o estado
		this.MontaEstado(estado,tipo,estado);
		this.MontaCidade(estado,tipo,cidade);
		this.MontaBairro(cidade,tipo,bairro);
	},
	IniciaNacional: function(estado, cidade, bairro, tipo){
		// seleciona o estado
		this.modo = "nacional";
		this.MontaEstado(estado,tipo,estado);
		this.MontaCapital(estado,tipo,cidade);
		$('#end_'+tipo+'_bairro').html("<div class=\"cinput\"><input type=\"text\" name=\"end["+tipo+"][bairro]\" id=\"end["+tipo+"][bairro]\" value\"\" /></div>");
		VerForm.VerificaCampo("end["+tipo+"][bairro]",'change','vazio');
		Cadastro.Completa("end["+tipo+"][bairro]");
	},
	MontaEstado: function(valor, tipo, padrao){
		var linha = "";
		var estados = VESTADOS;
		var js = (this.modo=="nacional") ? "Entregador.MontaCapital(this.value,'"+tipo+"')" : "Entregador.MontaCidade(this.value,'"+tipo+"')";
		linha = this.Select("end["+tipo+"][estado]",estados,padrao, js, 1);
		$('#end_'+tipo+'_estado').html(linha);
		VerForm.VerificaCampo("end["+tipo+"][estado]",'change','vazio');
		if(!padrao) this.MontaCidade('',tipo);
	},
	MontaCapital: function(valor,tipo, padrao){
		var sel, linha = "";
		if(!valor){
			linha = TRAD("Selecione um estado");
		}
		else{
			var cidades = VCIDADES[valor];
			linha = this.Select("end["+tipo+"][capital]",cidades,padrao, "Entregador.MontaCidadeCapitais(this.value,'"+tipo+"')",1);
		}
		$('#end_'+tipo+'_capital').html(linha);
		VerForm.VerificaCampo("end["+tipo+"][capital]",'change','vazio');
		if(valor && !padrao) this.SalvaPadrao(tipo)
	},
	MontaCidadeCapitais: function(valor,tipo, padrao){
		var sel, linha = "", completa = false;
		if(!valor){
			linha = TRAD("Selecione um estado");
		}
		else{
			if(valor=='capital'){
				var estado = $F('end['+tipo+'][estado]');
				var cidades = VCAPITAIS;
				var vals = new Object();
				var ct;
				for(var i in cidades){
					ct = cidades[i];
					if(i==estado) vals[ct] = ct;
				}
				linha = this.Select("end["+tipo+"][cidade]",vals,padrao, "Entregador.MontaBairro(this.value,'"+tipo+"')",0);
			}else{
				linha = "<div class=\"cinput\"><input type=\"text\" name=\"end["+tipo+"][cidade]\" id=\"end["+tipo+"][cidade]\" value\"\" onchange=\"Entregador.SalvaPadrao('"+tipo+"')\"  /></div>";
				completa = true;
			}
		}
		$('#end_'+tipo+'_cidade').html(linha);
		if(completa) Cadastro.Completa("end["+tipo+"][bairro]");
		VerForm.VerificaCampo("end["+tipo+"][cidade]",'change','vazio');
		if(valor && !padrao) this.SalvaPadrao(tipo)
	},
	MontaCidade: function(valor,tipo, padrao){
		var sel, linha = "";
		if(!valor){
			linha = TRAD("Selecione um estado");
		}
		else{
			var cidades = VCIDADES[valor];
			linha = this.Select("end["+tipo+"][cidade]",cidades,padrao, "Entregador.MontaBairro(this.value,'"+tipo+"')",1);
		}
		$('#end_'+tipo+'_cidade').html(linha);
		if(!padrao){
			this.MontaBairro('',tipo);
			if(valor) this.SalvaPadrao(tipo)
		}
		VerForm.VerificaCampo("end["+tipo+"][cidade]",'change','vazio');
	},
	MontaBairro: function(valor,tipo, padrao){
		var sel, linha, completa = false;
		if(!valor){
			linha = TRAD("Selecione uma cidade");
		}
		else{
			var estado = $F('end['+tipo+'][estado]');
			var bairros = VBAIRROS[estado][valor];
			var atual = (padrao) ? padrao : "";
			if(!bairros){
				linha = "<div class=\"cinput\"><input type=\"text\" name=\"end["+tipo+"][bairro]\" id=\"end["+tipo+"][bairro]\" value=\""+atual+"\" onchange=\"Entregador.SalvaPadrao('"+tipo+"')\"  /></div>";
				completa =  true;
			}
			else{
				linha = this.Select("end["+tipo+"][bairro]",bairros,padrao,"Entregador.SalvaPadrao('"+tipo+"')",1);
			}
		}
		$('#end_'+tipo+'_bairro').html(linha);
		if(completa) Cadastro.Completa("end["+tipo+"][bairro]");
		if(valor && !padrao) this.SalvaPadrao(tipo)
		VerForm.VerificaCampo("end["+tipo+"][bairro]",'change','vazio');
	},
	// Monta o Select
	Select: function(name,vals, padrao, js, selecione){
		var linha = "";
		var sel, i;
		js = (js) ? "onchange=\""+js+"\"" : "";
		linha += "<div class=\"cinput\"><select name=\""+name+"\" id=\""+name+"\" "+js+">";
		if(selecione) linha += "<option value=\"\">Selecione</option>";
		for(var i in vals){
			sel = (i==padrao) ? " selected=\"selected\"" : "";
			linha += "<option value=\""+i+"\" "+sel+">"+vals[i]+"</option>";
		}
		linha += "</select></div>";
		return linha;
	},
	// Mostra o campo para salvar como padrao
	SalvaPadrao: function(tipo){
		$('#salvar_end_padrao_'+tipo).show();
	}
});




/********************************************************
* Banner randonico nos destaques
********************************************************/
(function($) {
	var vpublic = {
		intervalo: 3,
		animacao: 2,
	};
	var f = {
	};
	var s = {
		init: function(v){
			el = this;
			f = $.extend($.extend(vpublic, v), f);
			if($(this).length==0) return;
			$(this).find('div:first').show();
			setTimeout(function(){  $(this).Banner("Muda") },(f.intervalo*1000));
		},
		Muda: function(){
			$(el).find('div').each(function() {
				if($(this).is(':visible')){
					var x = ($(this).next().length>0) ? $(this).next() : $(el).find('div:first');
					x.css('zIndex',1).show();
					$(this).css('zIndex',2).fadeOut((f.animacao*1000), function(){ $(this).hide(); 
					setTimeout(function(){  $(el).Banner("Muda") },(f.intervalo*1000));
					  
					});
					return false;
				}
			});
		},
	};
	$.fn.Banner = function(q) {
		if (s[q]) return s[q].apply(this, Array.prototype.slice.call( arguments, 1 ));
		else if(typeof(s)=='object' || !q) return s.init.apply(this, arguments );
	};
})(jQuery);



/********************************************************
* Init
********************************************************/

function Curvas(){
	// lateral
	$('.lat_esq').corner('tl 30px').corner('br 30px');
	$('.lat_esq ul').corner('bottom 30px');
	// caixa central
	$('#conteudo h2.titulo').corner('10px');
	// busca
	$('#topo .busca .text, .produto').corner();
	// sub menu
	$('.lat_esq ul ul ul').uncorner();
	// botao
	$('.cx input, .cx a, .botform, .painel h3').corner();
}

$(document).ready(function () {
	// cantos arredondados
	Load.Script(BASETPL+'/script/lib/corner.min.js', function(){
		Curvas();
	});

	document.oncontextmenu = document.body.oncontextmenu = function() {return false;};
	var moving = false;
	$('.menub ul > li').bind('mouseenter', function(){
		var x = $(this);
		if(!x.find('ol').length) return;
		if(moving) return;
		moving = true;
		x.find('ol').slideDown(function(){ moving = false; });
	}).bind('mouseleave', function(){
		var x = $(this);
		if(!x.find('ol').length) return;
		if(moving) return;
		moving = true;
		x.find('ol').slideUp(function(){ moving = false; });
	}).bind('click', function(){
		var x = $(this);
		if(!x.find('ol').length) return;
		var z = x.find('ol');
		if(moving) return;
		moving = true;
		if(z.is(':visible')) z.slideUp(function(){ moving = false; });
		else z.slideDown(function(){ moving = false; });
	});
	
  
  
	// primeiro menu (arrumado para a essencias)
	$('#menu_site').Menu();
	// menu de motivos
	$('#menu_site2').Menu();
	// destaque carousel
	if($('#carousel').length){
		loadScript(BASETPL+'/script/lib/jquery.featureCarousel.min.js', function(){
			$('#carousel').gira();
		});
	}
	// se tiver o frame da cielo, apaga os banners
	if($('#myframe').length){
		$('.lat_esq').hide();
		$('.meio').addClass('meio_cielo');
	}
	
	
	// destaque full
	if($('#destaque_full').length){
		loadScript(BASETPL+'/script/lib/destaque_full-0.1.min.js', function(){
			$('#destaque_full').BannerDestaque();
		});
	}
	// imagem zoom
	if($('#zoom_thumb').length){
		//loadScript(BASETPL+'/script_src/lib/imageZoom-0.1.js', function(){
		loadScript(BASETPL+'/script/lib/imageZoom-0.1.min.js', function(){
			$('#zoom_thumb').ImageZoom();
		});
	}
	// fotos que giram
	if($('#destaque').length){
		$('#destaque').Banner( );
	}
	// Verifica o formulario
	if($('form.form,comprar.form').length){
		VerForm.VerCampos();
	}
	// data picker
	if($('#data_picker').length){
		loadCss(SUBPASTA+'/template/flora/css/?data_picker.min.css');
		loadScript(BASETPL+'/script/lib/jquery-ui-1.8.17.custom.min.js', function(){
			$('#data_picker').datepicker({ minDate: 0, maxDate: "+6M" });
		});
	}
	// se tem algum sub produto para mostrar
	if($F('MOSTRA_SUB')){
		$('html,body').animate({scrollTop: $('#id_sub_produtos').offset().top }, 1000, function(){ Produtos.MaisInfoSub($F('MOSTRA_SUB')); });
	}
	// animate de cor
	if($('#opcao_personalizado').length){
		//loadScript(BASETPL+'/script_src/lib/imageZoom-0.1.js', function(){
		loadScript(BASETPL+'/script/lib/color-animate.min.js', function(){
		});
	}
	// paginacao nas migalhas
	if($('.migalha').find('span').length){
		Produtos.PaginacaoMigalhas();
	}
	// arruma o tamanho das fotos
	if($('.produto').find('.imgprod').length){
		Produtos.ArrumaTamanhoFotos();
	}
	// autocomplete
	if($('.auto_complete').length){
		loadScript(BASETPL+'/script/lib/jquery-ui-1.8.17.custom.min.js', function(){
			Cadastro.Completa();
		});
	}

	$('#qrcode').bind('click', function(e){
		e.preventDefault();
		var x = $('#qrgrande');
		if(x.is(':visible')) $('#qrgrande').hide();
		else $('#qrgrande').show();
	});
});
