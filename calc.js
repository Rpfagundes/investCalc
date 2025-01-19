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
          trabDia: document.getElementById('trabDia')
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

      this.atualizarResultados(montanteIdeal, montanteApoc, trabDia);
  }

  atualizarResultados(montanteIdeal, montanteApoc, trabDia) {
      this.outputs.montanteIdeal.textContent = this.formatarMoedaReal(montanteIdeal);
      this.outputs.montanteApoc.textContent = this.formatarMoedaReal(montanteApoc);
      this.outputs.trabDia.textContent = this.formatarMoedaDolar(trabDia);
  }
}

new CalculadoraInvestimentos();

document.addEventListener('DOMContentLoaded', () => {
  const calculadora = new CalculadoraInvestimentos();
  calculadora.calcular();
});