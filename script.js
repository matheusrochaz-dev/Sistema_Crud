const cep = document.querySelector('#cep')
const rua = document.querySelector('#rua')
const bairro = document.querySelector('#bairro')
const cidade = document.querySelector('#cidade')
const uf = document.querySelector('#uf')
const nome = document.querySelector('#nome')
const sobrenome = document.querySelector('#sobrenome')
const celular = document.querySelector('#celular')
const numeroCasa = document.querySelector("#numero")


cep.addEventListener("change", () => {
    lugar(cep.value)
})



async function lugar(cepp) {
        const endereco = await fetch(`https://viacep.com.br/ws/${cepp}/json/`)
        const dados = await endereco.json()
        if(endereco.status === 200){
            if(!dados.erro){   
                inserir(dados)
                numero.focus()
            }
            else{
                alert('cep inválido')
            }
        } 

        else{
            alert("ocorreu um problema, volte mais tarde")
        } 
}

function limpar(){
    rua.value = ""
    cep.value = ""
    bairro.value = ""
    cidade.value = ""
    uf.value = ""
    nome.value = ""
    sobrenome.value = ""
    celular.value = ""
    numeroCasa.value = ""
}


function inserir(dados){
    rua.value = dados.logradouro
    cep.value = dados.cep
    bairro.value = dados.bairro
    cidade.value = dados.localidade
    uf.value = dados.uf
}

let clientes = JSON.parse(localStorage.getItem('clientes')) || [];

const botao = document.querySelector("#salvar")
let nomeCompleto = ""
const corpoTabela = document.querySelector("#corpoTabela")

botao.addEventListener("click", (event) => {
    adicionar()
    function adicionar(){
        const form = document.querySelector("#formulario")
        if(!form.checkValidity()){
            alert("Preencha todos os campos corretamente")
            if(isNaN(celular.value)){
                alert("Corrija o celular: digite apenas números");
                celular.focus();
            }
        }
        else{
            event.preventDefault()
            nomeCompleto = `${nome.value} ${sobrenome.value}`
            
            let number = celular.value
            number = number.replace(/\D/g,"")
            number = number.slice(0,11)
            number = number.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3" )

            const endereco = `${rua.value} , ${bairro.value} , ${cidade.value} , em ${uf.value}, no número ${numeroCasa.value}`

            const cliente = {
                nomeCompleto: nomeCompleto,
                numero: numeroCasa.value,
                enderecoCompleto: endereco,
                cep: cep.value,
                celular: number,
                rua: rua.value,
                bairro: bairro.value,
                cidade: cidade.value,
                uf: uf.value,
                nome: nome.value,
                sobrenome: sobrenome.value

            }

            let existeExato = clientes.some((c,i) => 
                i != valor_index &&
                c.nome === cliente.nome &&
                c.celular === cliente.celular &&
                c.endere === cliente.endere &&
                c.numero === cliente.numero
            );

            if(!existeExato){
                if(valor_index !== null){
                    clientes[valor_index] = cliente;
                    valor_index = null;
                } 
                else {
                    clientes.push(cliente);
                }
                localStorage.setItem('clientes', JSON.stringify(clientes));
                limpar();
                atualizar();
            }
            else{
                alert('não pode repetir a mesma pessoa e dados')
            }
            
        }
    }
    atualizar();
)

function atualizar(){
    corpoTabela.innerHTML = ""
        clientes.forEach((cliente, index) => {
            
            corpoTabela.innerHTML += `
            <tr>
                <td>${cliente.nome}</td>
                <td>${cliente.celular}</td>
                <td>${cliente.enderecoCompleto}</td>
                <td>
                    <button class="btn_editar" data-index="${index}"   type="button">Editar</button>
                    <button type="button"  data-index="${index}"   class="btn_excluir"">Excluir</button>
                </td>
            </tr>
            `
            
    })
    const btn_excluir = document.querySelectorAll(".btn_excluir")
    btn_excluir.forEach(botao => {
        botao.addEventListener("click", function(){
            const index = this.dataset.index;
            excluir(index);
        });
    })
    const btn_editar = document.querySelectorAll(".btn_editar")
    btn_editar.forEach(botao => {
        botao.addEventListener("click", function(){
            const index = this.dataset.index;
            editar(index);
        });

    });
}

let valor_index = null

function editar(index){

    valor_index = index
    rua.value = clientes[index].rua
    cep.value = clientes[index].cep
    bairro.value = clientes[index].bairro
    cidade.value = clientes[index].cidade
    uf.value = clientes[index].uf
    nome.value = clientes[index].nome
    sobrenome.value = clientes[index].sobrenome
    celular.value = clientes[index].celular.replace(/\D/g,"")
    numeroCasa.value = clientes[index].numero
    nome.focus()
    atualizar()
}

function excluir(index){
    const confirmar = confirm("deseja excluir?")
    if(confirmar){
        clientes.splice(index, 1);
        localStorage.setItem("clientes", JSON.stringify(clientes));
        atualizar();
    }
}

filtro.addEventListener("change", () => {
    filtragem()
})

function filtragem(){
    const filt = document.querySelector('#filtro')
    const filtrados = clientes.filter(cliente => cliente.nome.toLowerCase().includes(filt.value))
    corpoTabela.innerHTML = ""
    filtrados.forEach(cliente => {
        corpoTabela.innerHTML += `
        <tr>
            <td>${cliente.nome}</td>
            <td>${cliente.numeroCasa}</td>
            <td>${cliente.enderecoCompleto}</td>
            <td>
                <button class="btn_editar" type="button">Editar</button>
                <button type="button" class="btn_excluir"">Excluir</button>
            </td>
        </tr>
        `
    })
    
}
