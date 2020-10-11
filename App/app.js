class Despesa{
    constructor(ano,mes,dia,tipo,desc,valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.desc = desc
        this.valor = valor
    }

    validarDados(){
            for (let i in this) {
                if(this[i] === undefined || this[i] === '' || this[i] === null){
                    return false
            }
        }
        return true
    }
}

class BD{

    constructor(){
        let id = localStorage.getItem('id')

        if(id === null){
            localStorage.setItem('id', 0)
        }
    }

    getProximoId(){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }
    gravar(d){
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d))

        localStorage.setItem('id', id)
    }
    recuperarTodosRegistros(){

        let despesas = Array()
        let id = localStorage.getItem('id')

        for(let i = 1; i <= id; i++){
            let despesa = JSON.parse(localStorage.getItem(i))

            if(despesa === null){
                continue
            }

            despesa.id = i
            despesas.push(despesa)
        }

        return despesas
    }

    pesquisar(despesa){

        let despesasFiltradas = Array()

        despesasFiltradas = this.recuperarTodosRegistros()

        if(despesa.ano != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        if(despesa.mes != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        if(despesa.dia != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        if(despesa.tipo != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        if(despesa.desc != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.desc == despesa.desc)
        }
        if(despesa.valor != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas
    }

    remover(id){
        localStorage.removeItem(id)
    }
}

let bd = new BD()

function cadastrarDespesa(){

    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let desc = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, desc, valor)

    if(despesa.validarDados()){
        bd.gravar(despesa)

        document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
        document.getElementById('modal_titulo_div').className = 'modal-header text-success'
        document.getElementById('modal_descricao').innerHTML = 'Despesa cadastrada.'
        document.getElementById('modal_voltar').innerHTML = 'Voltar'
        document.getElementById('modal_voltar').className = 'btn btn-success'

        $('#modalRegistraDespesa').modal('show')
    }else{
        document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
        document.getElementById('modal_descricao').innerHTML = 'Verifique se algum campo ficou vazio'
        document.getElementById('modal_voltar').innerHTML = 'Voltar e corrigir'
        document.getElementById('modal_voltar').className = 'btn btn-danger'
        
        $('#modalRegistraDespesa').modal('show')
    }

    document.getElementById('ano').value = ''
    document.getElementById('mes').value = ''
    document.getElementById('dia').value = ''
    document.getElementById('tipo').value = ''
    document.getElementById('descricao').value = ''
    document.getElementById('valor').value = ''

    }

function carregarListaDespesas(despesas = Array(), filtro = false){

    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuperarTodosRegistros()
    }

    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    despesas.forEach(function(d){   
        
        let linha = listaDespesas.insertRow()

        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        switch(d.tipo){
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
                break
        }

        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.desc
        linha.insertCell(3).innerHTML = d.valor
        
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = 'id_despesa_' + d.id
        btn.onclick = function(){

            let id = this.id.replace('id_despesa_', '')
            bd.remover(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)

    })

    // <tbody id="listaDespesas">
    //           <tr>
    //             <td>15/03/18</td>
    //             <td>Alimentação</td>
    //             <td>Compras do mês</td>
    //             <td>255</td>
    //           </tr>
    //         </tbody>
}

function pesquisarDespesas(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let desc = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano,mes,dia,tipo,desc,valor)

    let despesas = bd.pesquisar(despesa)

    carregarListaDespesas(despesas, true)
}

function limparPesquisa(){

    document.getElementById('ano').value = ''
    document.getElementById('mes').value = ''
    document.getElementById('dia').value = ''
    document.getElementById('tipo').value = ''
    document.getElementById('descricao').value = ''
    document.getElementById('valor').value = ''
}