interface IVeiculo {
  nome: string;
  placa: string;
  entrada: Date;
}

(function () {
  const $ = (query: string): HTMLInputElement => document.querySelector(query);

  function calcTempo(mil: number) {
    const min = Math.floor(mil / 60000);
    const sec = Math.floor((mil % 60000) / 1000);

    return `${min}m e ${sec}s`;
  }
  function patio() {
    function ler(): IVeiculo[] {
      return localStorage.patio ? JSON.parse(localStorage.patio) : [];
    }

    function salvar(veiculos: IVeiculo[]) {
      localStorage.setItem("patio", JSON.stringify(veiculos));
    }
    
    function remover(placa: string) {
      const { entrada, nome } = ler().find(
        (veiculo) => veiculo.placa !== placa
      );

      const tempo = calcTempo(new Date().getTime() - entrada.getTime());
          let msg = confirm(`O veículo ${nome} permaneceu por ${tempo}. Deseja encerrar?`)
      if (!msg)return;

      salvar(ler().filter((veiculo) => veiculo.placa !== placa));
    }

    function adicionar(veiculo: IVeiculo, salva?: boolean) {
      const row = document.createElement("tr");

      row.innerHTML = `
      <td>${veiculo.nome}</td>
      <td>${veiculo.placa}</td>
      <td>${veiculo.entrada}</td>
      <td>
        <button class="delete" data-placa="${veiculo.placa}">X</button>
      </td>
      `;
      row.querySelector(".delete").addEventListener("click", function () {
        remover(this.dataset.placa);
      });
      $("#patio").appendChild(row);
      if (salva) {
        salvar([...ler(), veiculo]);
      }
    }

    function render() {
      $("#patio").innerHTML = "";
      const patio = ler();

      if (patio.length) {
        patio.forEach((veiculo) => adicionar(veiculo));
      }
    }

    return { ler, adicionar, remover, salvar, render };
  }
  patio().render();
  $("#cadastrar").addEventListener("click", () => {
    const nome = $("#nome").value;
    const placa = $("#placa").value;
    console.log(`nome: ${nome} e placa: ${placa}`);
    if (!nome || !placa) {
      alert("Os campos são obrigatórios");
      return;
    }

    patio().adicionar({ nome, placa, entrada: new Date() }, true);
  });
})();
