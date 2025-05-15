class CalculadoraInvestimentos {
  constructor() {
      this.initializeElements();
      this.addEventListeners();
  }

  initializeElements() {
      this.inputs = {
          percAnual: document.getElementById('percAnual'),
          invIni: document.getElementById('invIni'),
          anosTrab: document.getElementById('anosTrab'),
          invMens: document.getElementById('invMens'),
          valorComido: document.getElementById('valorComido'),
          anosDpsTrab: document.getElementById('anosDpsTrab'),
          claudia: document.getElementById('claudia'),
          diasTrab: document.getElementById('diasTrab')
          
      };

      this.outputs = {
          montanteIdeal: document.getElementById('montanteIdeal'),
          montanteApoc: document.getElementById('montanteApoc'),
          trabDia: document.getElementById('trabDia'),
          influenciaInvMensal: document.getElementById('influenciaInvMensal')
      };
  }

  addEventListeners() {
      Object.values(this.inputs).forEach(input => {
          input.addEventListener('input', () => this.calcular());
      });
  }

  formatarMoedaReal(valor) {
      return valor.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
      });
  }

  formatarMoedaDolar(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'USD'
    });
  }

  calcularPercMens(percAnual) {
      return Math.pow(1 + percAnual/100, 1/12) - 1;
  }

  calcularMontante(investInicial, investMensal, meses, taxa) {
      const montante = investInicial * Math.pow(1 + taxa, meses) +
          investMensal * ((Math.pow(1 + taxa, meses) - 1) / taxa);
      return montante;
  }

  calcularInfluenciaMensal(invInicial, invMens, meses, taxa) {
      const percentuais = [];
      let montanteAnterior = invInicial;
      
      for (let i = 1; i <= meses; i++) {      
          // Calcula a influência dividindo o investimento mensal pelo montante no início do mês
          const influenciaIsolada = (invMens / montanteAnterior) * 100;
          percentuais.push({
              isolada: influenciaIsolada
          });
          
          // Atualiza o montante para o próximo mês
          montanteAnterior = montanteAnterior * (1 + taxa) + invMens;
      }
      return percentuais;
  }

  atualizarPercentuaisMensais(percentuais) {
      const container = document.getElementById('percentuaisList');
      container.innerHTML = '';
      
      const table = document.createElement('table');
      table.innerHTML = `
          <tr>
              <th>Ano</th>
              <th>Mês</th>
              <th>Influência Mensal</th>
          </tr>
      `;
      
      percentuais.forEach((perc, index) => {
          const ano = Math.floor(index / 12) + 1;
          const mes = (index % 12) + 1;
          
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${ano}º</td>
              <td>${mes}º</td>
              <td>${perc.isolada.toFixed(2)}%</td>
          `;
          
          if (mes === 1) {
              row.classList.add('new-year');
          }
          
          table.appendChild(row);
      });
      
      container.appendChild(table);
  }

  calcular() {
      const valores = {
          percAnual: parseFloat(this.inputs.percAnual.value) || 0,
          invIni: parseFloat(this.inputs.invIni.value) || 0,
          anosTrab: parseInt(this.inputs.anosTrab.value) || 0,
          invMens: parseFloat(this.inputs.invMens.value) || 0,
          valorComido: parseFloat(this.inputs.valorComido.value) || 0,
          anosDpsTrab: parseInt(this.inputs.anosDpsTrab.value) || 0,
          diasTrab: parseInt(this.inputs.diasTrab.value) || 0,
          claudia: this.inputs.claudia.checked
      };

      const percMens = this.calcularPercMens(valores.percAnual);
      
      const montanteIdeal = this.calcularMontante(
          valores.invIni,
          valores.invMens,
          valores.anosTrab * 12,
          percMens
      );

      const percMens2 = percMens * (1 - (valores.valorComido / (montanteIdeal * percMens)));

      const montanteApoc = this.calcularMontante(
          montanteIdeal,
          0,
          valores.anosDpsTrab * 12,
          percMens2
      );

      const trabDia = valores.claudia ? 
          ((7000 - 5000 + valores.invMens)/(0.8*6))/valores.diasTrab :
          ((7000 + valores.invMens)/(0.8*6))/valores.diasTrab;

      const percentuaisMensais = this.calcularInfluenciaMensal(
          valores.invIni,
          valores.invMens,
          valores.anosTrab * 12,
          percMens
      );

      this.atualizarPercentuaisMensais(percentuaisMensais);
      this.atualizarResultados(montanteIdeal, montanteApoc, trabDia);
  }

  atualizarResultados(montanteIdeal, montanteApoc, trabDia) {
      this.outputs.montanteIdeal.textContent = this.formatarMoedaReal(montanteIdeal);
      this.outputs.montanteApoc.textContent = this.formatarMoedaReal(montanteApoc);
      this.outputs.trabDia.textContent = this.formatarMoedaDolar(trabDia);
  }
}

class CalculadoraEmprestimo {
    constructor() {
        this.initializeElements();
        this.addEventListeners();
    }

    initializeElements() {
        this.inputs = {
            tipoEmprestimo: document.getElementById('tipoEmprestimo'),
            valorEmprestimo: document.getElementById('valorEmprestimo'),
            // Price inputs
            prazoMeses: document.getElementById('prazoMeses'),
            taxaMensal: document.getElementById('taxaMensal'),
            amortizacaoExtra: document.getElementById('amortizacaoExtra'),
            // Bullet inputs
            prazoAnos: document.getElementById('prazoAnos'),
            taxaAnual: document.getElementById('taxaAnual'),
            frequenciaPagamento: document.getElementById('frequenciaPagamento')
        };

        this.outputs = {
            // Price outputs
            parcelaMensal: document.getElementById('parcelaMensal'),
            totalJuros: document.getElementById('totalJuros'),
            totalJurosAmort: document.getElementById('totalJurosAmort'),
            tempoQuitacao: document.getElementById('tempoQuitacao'),
            evolucaoList: document.getElementById('evolucaoList'),
            // Bullet outputs
            jurosPeriodo: document.getElementById('jurosPeriodo'),
            totalJurosBullet: document.getElementById('totalJurosBullet'),
            principalBullet: document.getElementById('principalBullet'),
            totalGeralBullet: document.getElementById('totalGeralBullet'),
            fluxoPagamentosList: document.getElementById('fluxoPagamentosList')
        };

        // Elements containers
        this.containers = {
            camposPrice: document.getElementById('campos-price'),
            camposBullet: document.getElementById('campos-bullet'),
            resultsPrice: document.getElementById('results-price'),
            resultsBullet: document.getElementById('results-bullet')
        };
    }

    addEventListeners() {
        this.inputs.tipoEmprestimo.addEventListener('change', () => {
            this.alternarTipoEmprestimo();
            this.calcular();
        });

        Object.values(this.inputs).forEach(input => {
            if (input !== this.inputs.tipoEmprestimo) {
                input.addEventListener('input', () => this.calcular());
            }
        });
    }

    alternarTipoEmprestimo() {
        const isBullet = this.inputs.tipoEmprestimo.value === 'bullet';
        
        this.containers.camposPrice.style.display = isBullet ? 'none' : 'block';
        this.containers.camposBullet.style.display = isBullet ? 'block' : 'none';
        this.containers.resultsPrice.style.display = isBullet ? 'none' : 'block';
        this.containers.resultsBullet.style.display = isBullet ? 'block' : 'none';
    }

    calcularParcela(valor, prazo, taxa) {
        const i = taxa / 100;
        return valor * (i * Math.pow(1 + i, prazo)) / (Math.pow(1 + i, prazo) - 1);
    }

    calcularEvolucaoPrice(valor, prazo, taxa, amortExtra) {
        const parcelaPadrao = this.calcularParcela(valor, prazo, taxa);
        const evolucao = [];
        let saldoDevedor = valor;
        let totalJuros = 0;
        let mesesRestantes = prazo;
        let i = 1;

        while (saldoDevedor > 0 && i <= prazo * 2) { // limite de segurança
            const juros = saldoDevedor * (taxa / 100);
            totalJuros += juros;

            let amortizacao = parcelaPadrao - juros;
            const amortizacaoTotal = amortizacao + (amortExtra || 0);

            if (amortizacaoTotal >= saldoDevedor) {
                amortizacao = saldoDevedor;
                saldoDevedor = 0;
            } else {
                saldoDevedor -= amortizacaoTotal;
            }

            evolucao.push({
                mes: i,
                saldoDevedor,
                juros,
                amortizacao: amortizacaoTotal,
                parcela: juros + amortizacao
            });

            if (saldoDevedor <= 0) {
                mesesRestantes = i;
                break;
            }

            i++;
        }

        return {
            evolucao,
            totalJuros,
            mesesRestantes,
            parcelaPadrao
        };
    }

    calcularBullet() {
        const valores = {
            valorEmprestimo: parseFloat(this.inputs.valorEmprestimo.value) || 0,
            prazoAnos: parseInt(this.inputs.prazoAnos.value) || 0,
            taxaAnual: parseFloat(this.inputs.taxaAnual.value) || 0,
            frequenciaPagamento: this.inputs.frequenciaPagamento.value
        };

        const taxaPeriodo = valores.taxaAnual / 100;
        const jurosPeriodo = valores.valorEmprestimo * taxaPeriodo;
        const periodosPorAno = valores.frequenciaPagamento === 'mensal' ? 12 : 1;
        const totalPeriodos = valores.prazoAnos * periodosPorAno;
        const jurosPorPeriodo = jurosPeriodo / periodosPorAno;
        const totalJuros = jurosPeriodo * valores.prazoAnos;

        this.outputs.jurosPeriodo.textContent = this.formatarMoeda(jurosPorPeriodo);
        this.outputs.totalJurosBullet.textContent = this.formatarMoeda(totalJuros);
        this.outputs.principalBullet.textContent = this.formatarMoeda(valores.valorEmprestimo);
        this.outputs.totalGeralBullet.textContent = this.formatarMoeda(valores.valorEmprestimo + totalJuros);

        this.atualizarTabelaFluxoPagamentos(valores, jurosPorPeriodo, totalPeriodos);
    }

    atualizarTabelaFluxoPagamentos(valores, jurosPorPeriodo, totalPeriodos) {
        const table = document.createElement('table');
        table.innerHTML = `
            <tr>
                <th>Período</th>
                <th>Juros</th>
                <th>Principal</th>
                <th>Total</th>
            </tr>
        `;

        for (let i = 1; i <= totalPeriodos; i++) {
            const row = document.createElement('tr');
            const isPeriodoFinal = i === totalPeriodos;
            
            row.innerHTML = `
                <td>${i}º</td>
                <td>${this.formatarMoeda(jurosPorPeriodo)}</td>
                <td>${this.formatarMoeda(isPeriodoFinal ? valores.valorEmprestimo : 0)}</td>
                <td>${this.formatarMoeda(isPeriodoFinal ? valores.valorEmprestimo + jurosPorPeriodo : jurosPorPeriodo)}</td>
            `;
            table.appendChild(row);
        }

        this.outputs.fluxoPagamentosList.innerHTML = '';
        this.outputs.fluxoPagamentosList.appendChild(table);
    }

    calcular() {
        if (this.inputs.tipoEmprestimo.value === 'bullet') {
            this.calcularBullet();
        } else {
            const valores = {
                valorEmprestimo: parseFloat(this.inputs.valorEmprestimo.value) || 0,
                prazoMeses: parseInt(this.inputs.prazoMeses.value) || 0,
                taxaMensal: parseFloat(this.inputs.taxaMensal.value) || 0,
                amortizacaoExtra: parseFloat(this.inputs.amortizacaoExtra.value) || 0
            };

            const resultadoSemAmort = this.calcularEvolucaoPrice(
                valores.valorEmprestimo,
                valores.prazoMeses,
                valores.taxaMensal,
                0
            );

            const resultadoComAmort = this.calcularEvolucaoPrice(
                valores.valorEmprestimo,
                valores.prazoMeses,
                valores.taxaMensal,
                valores.amortizacaoExtra
            );

            this.outputs.parcelaMensal.textContent = this.formatarMoeda(resultadoSemAmort.parcelaPadrao);
            this.outputs.totalJuros.textContent = this.formatarMoeda(resultadoSemAmort.totalJuros);
            this.outputs.totalJurosAmort.textContent = this.formatarMoeda(resultadoComAmort.totalJuros);
            this.outputs.tempoQuitacao.textContent = `${resultadoComAmort.mesesRestantes} meses`;

            this.atualizarTabelaEvolucao(resultadoComAmort.evolucao);
        }
    }

    formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    atualizarTabelaEvolucao(evolucao) {
        const table = document.createElement('table');
        table.innerHTML = `
            <tr>
                <th>Mês</th>
                <th>Parcela</th>
                <th>Juros</th>
                <th>Amortização</th>
                <th>Saldo Devedor</th>
            </tr>
        `;

        evolucao.forEach(mes => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${mes.mes}º</td>
                <td>${this.formatarMoeda(mes.parcela)}</td>
                <td>${this.formatarMoeda(mes.juros)}</td>
                <td>${this.formatarMoeda(mes.amortizacao)}</td>
                <td>${this.formatarMoeda(mes.saldoDevedor)}</td>
            `;
            table.appendChild(row);
        });

        this.outputs.evolucaoList.innerHTML = '';
        this.outputs.evolucaoList.appendChild(table);
    }
}

// Inicialização das calculadoras e controle das abas
document.addEventListener('DOMContentLoaded', () => {
    const calculadoraInv = new CalculadoraInvestimentos();
    const calculadoraEmp = new CalculadoraEmprestimo();
    
    // Configuração das abas
    const tabs = document.querySelectorAll('.tab-button');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.tab;
            
            // Atualiza classes ativas
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Mostra/esconde conteúdo
            contents.forEach(content => {
                content.style.display = content.id === targetId ? 'block' : 'none';
            });
        });
    });

    // Calcula valores iniciais
    calculadoraInv.calcular();
    calculadoraEmp.calcular();
});